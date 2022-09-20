import {
    ApisDefinition
} from 'nextgen-front-lib/modules/request'
export type Definitions = ApisDefinition <
    /* tslint:disable */
    /**
     * This file was automatically generated by json-schema-to-typescript.
     * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
     * and run json-schema-to-typescript to regenerate this file.
     */

    /**
     * Main
     * @see https://nextgen-travel.github.io/apis-doc/?target=ulitmate-pos.yaml
     */
    {
        /**
         * [這裡放簡易說明] - 這裡放複雜說明
         */
        "get@users": {
            body: null;
            query: null;
            response: {
                /**
                 * 使用者名稱
                 * @example 小明
                 */
                name: string;
            };
            contentType: null;
        };
        /**
         * [no summary] - no description
         */
        "post@users": {
            body: {
                /**
                 * 標題
                 * @example hi...
                 */
                title: string;
            };
            query: null;
            response: null;
            contentType: null;
        };
        /**
         * [Business Location 詳細資訊] - 會列出 Location 的詳細資訊
         */
        "get@info": {
            body: null;
            query: null;
            response: {
                data: {
                    /**
                     * no description
                     */
                    name: string;
                    /**
                     * no description
                     */
                    mobile: string;
                    /**
                     * no description
                     */
                    country: string;
                    /**
                     * no description
                     */
                    state: string;
                    /**
                     * no description
                     */
                    city: string;
                    /**
                     * no description
                     */
                    zip_code: string;
                };
            };
            contentType: null;
        };
        /**
         * [值班人員] - 取得值班店員與值班藥師資訊
         */
        "get@on-duty": {
            body: null;
            query: null;
            response: {
                data: {
                    /**
                     * no description
                     */
                    user_id: number;
                    /**
                     * no description
                     */
                    user_name: string;
                    /**
                     * no description
                     */
                    pharmacist_id: number;
                    /**
                     * no description
                     */
                    pharmacist_name: string;
                };
            };
            contentType: null;
        };
        /**
         * [交易清單] - 取得交易清單
         */
        "get@transactions": {
            body: null;
            query: null;
            response: {
                data: {
                    /**
                     * no description
                     */
                    id: number;
                    /**
                     * no description
                     */
                    pharmacist_name: string;
                    /**
                     * no description
                     */
                    prescription_sign_message: string;
                    /**
                     * no description
                     */
                    username: string;
                    /**
                     * no description
                     */
                    contact_name: string;
                    /**
                     * no description
                     */
                    created_at: string;
                };
            };
            contentType: null;
        };
        /**
         * [單一交易] - 取得單一交易資訊
         */
        "get@transactions/:id": {
            body: null;
            query: null;
            response: {
                data: {
                    /**
                     * no description
                     */
                    id: number;
                    /**
                     * no description
                     */
                    created_at: string;
                    /**
                     * no description
                     */
                    contact_id: number;
                    /**
                     * no description
                     */
                    contact_dob: string;
                    /**
                     * no description
                     */
                    contact_name: string;
                    /**
                     * no description
                     */
                    total_amount: string;
                };
            };
            contentType: null;
        };
        /**
         * [交易表裡的產品清單] - 取得交易表裡的產品清單
         */
        "get@transactions/:id/products": {
            body: null;
            query: null;
            response: {
                data: {
                    /**
                     * no description
                     */
                    sell_id: number;
                    /**
                     * no description
                     */
                    quantity: number;
                    /**
                     * no description
                     */
                    price: string;
                    /**
                     * no description
                     */
                    usage_id: number;
                    /**
                     * no description
                     */
                    product_id: number;
                    /**
                     * no description
                     */
                    days: number;
                    /**
                     * no description
                     */
                    total: number;
                    /**
                     * no description
                     */
                    dosage: number;
                    /**
                     * no description
                     */
                    frequency: number;
                };
            };
            contentType: null;
        };
        /**
         * [產品清單] - 取得產品清單
         */
        "get@products": {
            body: null;
            query: null;
            response: {
                data: {
                    /**
                     * no description
                     */
                    id: number;
                    /**
                     * no description
                     */
                    sku: string;
                    /**
                     * no description
                     */
                    name: string;
                    /**
                     * no description
                     */
                    qty_available: number;
                    /**
                     * no description
                     */
                    alert_quantity: number;
                    /**
                     * no description
                     */
                    default_sell_price: string;
                    /**
                     * no description
                     */
                    product_custom_field1: string;
                    /**
                     * no description
                     */
                    product_custom_field2: string;
                    /**
                     * no description
                     */
                    product_custom_field3: string;
                    /**
                     * no description
                     */
                    product_custom_field4: string;
                };
            };
            contentType: null;
        };
        /**
         * [取得單一產品] - 取得單一產品詳細資訊
         */
        "get@products/:id": {
            body: null;
            query: null;
            response: {
                data: {
                    /**
                     * no description
                     */
                    id: number;
                    /**
                     * no description
                     */
                    sku: string;
                    /**
                     * no description
                     */
                    name: string;
                    /**
                     * no description
                     */
                    unit_id: number;
                    /**
                     * no description
                     */
                    qty_available: number;
                    /**
                     * no description
                     */
                    alert_quantity: number;
                    /**
                     * no description
                     */
                    unit_short_name: string;
                    /**
                     * no description
                     */
                    default_sell_price: string;
                    /**
                     * no description
                     */
                    product_custom_field1: string;
                    /**
                     * no description
                     */
                    product_custom_field2: string;
                    /**
                     * no description
                     */
                    product_custom_field3: string;
                    /**
                     * no description
                     */
                    product_custom_field4: string;
                };
            };
            contentType: null;
        };
    }

    >