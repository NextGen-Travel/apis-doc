import fsx from 'fs-extra'
import path from 'path'
import { pick } from 'power-helper'
import { parse } from 'yaml'
import { compile } from 'json-schema-to-typescript'
import { OpenAPIV3_1 } from "openapi-types"
import { JSONSchema4 } from 'json-schema'

// multipart/form-data#json : 要使用formdata格式 但header帶的是json
type OutputObject = {
    path: string
    summary: string
    description: string
    method: 'get' | 'post' | 'put' | 'delete'
    body: null | Record<string, any>
    query: null | Record<string, any>
    response: null | Record<string, any>
    contentType: null | 'json' | 'form' | 'x-www-form-urlencoded' | 'multipart/form-data' | 'multipart/form-data#json'
}

export class OpenApiReader {
    file: string
    document: OpenAPIV3_1.Document

    constructor(file: string, document: OpenAPIV3_1.Document) {
        this.file = file
        this.document = document
    }

    static read(filePath: string) {
        let content = fsx.readFileSync(filePath).toString('utf-8')
        let json: OpenAPIV3_1.Document = parse(content)
        return new OpenApiReader(path.basename(filePath), json)
    }

    private schemaToJsonSchema(data: OpenAPIV3_1.SchemaObject): JSONSchema4 {
        if (data['$ref']) {
            data = pick.peel(this.document, (data['$ref'] as any).replace(/\//g, '.').slice(2)) as any
        }
        if (data.type === 'object') {
            return this.schemaObjectToJsonSchema(data)
        } else if (data.type === 'array') {
            return this.schemaArrayToJsonSchema(data)
        } else {
            let output: JSONSchema4 = {
                type: data.type,
                description: data.description || 'no description',
                examples: data.example ? [data.example] : [],
            }
            if (data.enum) {
                output.enum = data.enum
            }
            return output
        }
    }

    private schemaObjectToJsonSchema(data: OpenAPIV3_1.SchemaObject): JSONSchema4 {
        let output: JSONSchema4 = {
            type: 'object',
            required: [],
            additionalProperties: false,
            properties: {}
        }
        for (let key in data.properties) {
            let property = data.properties[key] as OpenAPIV3_1.SchemaObject
            if ((property.required as any) !== false && Array.isArray(output.required)) {
                output.required.push(key)
            }
            if (output.properties) {
                output.properties[key] = this.schemaToJsonSchema(property)
            }
        }
        return output
    }

    private schemaArrayToJsonSchema(data: OpenAPIV3_1.ArraySchemaObject): JSONSchema4 {
        let output: JSONSchema4 = {
            type: 'array',
            additionalProperties: false
        }
        if (data.items) {
            output.items = this.schemaToJsonSchema(data.items as OpenAPIV3_1.SchemaObject)
        }
        return output
    }

    private getContentType(data: { content: any }): OutputObject['contentType'] {
        if (data && data.content['application/json']) {
            return 'json'
        }
        return 'json'
    }

    private pickParametersInQuery(parameters: OpenAPIV3_1.ParameterObject[]) {
        let queries = parameters.filter(e => e.in === 'query')
        let queryProperties = {}
        for (let query of queries) {
            queryProperties[query.name] = {
                type: (query.schema as any).type,
                required: query.required
            }
        }
        return queries.length === 0 ? null : this.schemaObjectToJsonSchema({
            properties: queryProperties
        })
    }

    private pickJsonSchema(data: { content: any }) {
        if (data) {
            let schema = data?.content?.['application/json']?.schema
            if (schema) {
                return this.schemaToJsonSchema(schema)
            }
        }
        return null
    }

    private getLink() {
        return `https://nextgen-travel.github.io/apis-doc/?target=${this.file}`
    }

    export() {
        let paths: OpenAPIV3_1.PathsObject = this.document.paths || ({} as unknown as OpenAPIV3_1.PathsObject)
        let outputs: OutputObject[] = []
        for (let path in paths) {
            let methods = ['get', 'post', 'put', 'delete']
            for (let method of methods) {
                let api = paths[path]
                if (api) {
                    let data = api[method]
                    if (data) {
                        let contentType = this.getContentType(data.requestBody)
                        let body = this.pickJsonSchema(data.requestBody)
                        let response = this.pickJsonSchema(data.responses['200'])
                        outputs.push({
                            summary: data.summary || 'no summary',
                            description: data.description || 'no description',
                            path: `${method}@${path.replace(/\{/g, ':').replace(/\}/g, '').slice(1)}`,
                            method: method as any,
                            body,
                            contentType: contentType === 'json' ? null : contentType,
                            query: this.pickParametersInQuery(data.parameters || []),
                            response
                        })
                    }
                }
            }
        }
        return {
            title: this.document.info.title,
            outputs
        }
    }

    async exportNextgenRequest() {
        let result = this.export()
        let tsData: JSONSchema4 = {
            type: 'object',
            required: [],
            description: `${result.title}\n@see {${this.getLink()}}`,
            additionalProperties: false,
            properties: {}
        }
        for (let item of result.outputs) {
            if (tsData.required && Array.isArray(tsData.required)) {
                tsData.required.push(item.path)
            }
            if (tsData.properties) {
                tsData.properties[item.path] = {
                    type: 'object',
                    description: `[${item.summary}] - ${item.description}`,
                    required: ['body', 'query', 'response', 'contentType'],
                    additionalProperties: false,
                    properties: {
                        body: item.body == null ? { type: 'null' } : item.body,
                        query: item.query == null ? { type: 'null' } : item.query,
                        response: item.response == null ? { type: 'null' } : item.response,
                        contentType: item.contentType == null ? { type: 'null' } : { type: 'string', enum: [item.contentType] }
                    }
                }
            }
        }
        const defined = await compile(tsData, '__')
        return `
            import { ApisDefinition } from 'nextgen-front-lib/modules/request'
            export type Definitions = ApisDefinition<${defined.replace('export interface __', '')}>
        `
    }
}
