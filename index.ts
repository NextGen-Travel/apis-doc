import fsx from 'fs-extra'

import { OpenAPIV3 } from "openapi-types"
import { OpenApiReader } from './process/types'

const mode = process.argv[2]
const main = async() => {
    if (mode === 'serve') {
        const express = require('express')
        const app = express()
        app.use(express.static('.'))
        app.listen('9999', () => {
            console.log('running: http://localhost:9999')
        })
    }
    if (mode === 'types') {
        if (fsx.existsSync('.output')) {
            fsx.rmSync('.output', { recursive: true })
        }
        fsx.mkdirSync('.output')
        const files = fsx.readdirSync('./docs')
        for (let file of files) {
            const reader = OpenApiReader.read(`./docs/${file}`)
            const content = await reader.exportNextgenRequest()
            fsx.writeFileSync(`./.output/${file.slice(0, -5)}.ts`, content)
        }
    }
}

main()