process.env.DEBUG = 'koronacloud'

const client = require('./../src/index')()

client.getCustomerGroups({ limit: 999 })
.then(console.log)
.catch(console.error)
