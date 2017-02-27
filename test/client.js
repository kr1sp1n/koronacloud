process.env.DEBUG = 'koronacloud' // switch on debug mode

const client = require('./../src/index')()
//
// client.getProducts({ num: 1 })
// .then(console.log)

// client.getCashiers({ limit: 5 })
// .then((body) => {
//   console.log(body)
// })

client.getCustomer({ num: 1 })
.then(() => client.getCustomerGroups({ limit: 999 }))
// .then((body) => client.getCustomerGroupById({ id: body.result.customerGroup }))
.then((body) => body.resultList.filter((cg) => cg.name === 'Website')[0])
.then((customerGroup) => {
  const customerGroupId = customerGroup.uuid
  client.saveCustomer({
    customerGroup: customerGroupId,
    lastName: 'LOL'
  })
})

// client.saveCustomer({
// })

// client.deleteProduct({ num: '123abc' })
