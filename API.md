FORMAT: 1A
HOST: https://www.koronacloud.com/web/api/v2

# KORONA.pos Cloud API v2

# Group Products

## Delete a product by its number [GET /{token}/products/delete/{num}]

+ Parameters

    + token: (Token)
    + num: (number)

+ Request (application/json)

+ Response 200 (application/json;charset=utf-8)


## Insert products [POST /{token}/products/insert]

+ Parameters

    + token: (Token)

+ Request (application/json)

+ Response 200 (application/json;charset=utf-8)


## Get products by page [GET /{token}/products/get/page/{num}]

+ Parameters

    + token: (Token)
    + num: (number) - Page number

+ Response 200 (application/json;charset=utf-8)

        {
          "hello": 1
        }

---

# Data Structures

## Token (string)

## Response Base (object)
+ elements: (number)
+ elementstotal: (number)
+ error: (object)
    Default: `null`
+ pagemaxrevision: (number)
+ pagenum: (number)
+ pagetotal: (number)
+ result: (array)
