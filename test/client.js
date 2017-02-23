process.env.DEBUG = 'koronacloud' // switch on debug mode

const client = require('./../src/index')()

// console.log(client)

client.getProductsByPage({ num: 1 })
.then((body) => {
  console.log(body)
})

// client.deleteProduct({ num: '123abc' })
