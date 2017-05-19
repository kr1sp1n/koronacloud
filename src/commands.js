// mapping between functions and their HTTP requests
module.exports = () => {
  return {
    deleteProduct: {
      method: 'GET',
      path: '/v2/{{token}}/products/delete/{{num}}'
    },
    getProductsByPage: {
      method: 'GET',
      path: '/v2/{{token}}/products/get/page/{{num}}'
    },
    getProducts: {
      method: 'GET',
      path: '/v1/{{token}}/products/page/{{limit}}'
    },
    getCommodityGroups: {
      method: 'GET',
      path: '/v1/{{token}}/commodityGroups/page/{{limit}}'
    },
    getProduct: {
      method: 'GET',
      path: '/v2/{{token}}/products/get/{{num}}'
    },
    getCashiers: {
      method: 'GET',
      path: '/v1/{{token}}/cashiers/page/{{limit}}'
    },
    getCashierById: {
      method: 'GET',
      path: '/v1/{{token}}/cashiers/id/{{id}}'
    },
    getCashierByNum: {
      method: 'GET',
      path: '/v1/{{token}}/cashiers/number/{{num}}'
    },
    getCustomerById: {
      method: 'GET',
      path: '/v1/{{token}}/customers/id/{{id}}'
    },
    getCustomerByNum: {
      method: 'GET',
      path: '/v1/{{token}}/customers/number/{{num}}'
    },
    getCustomersByName: {
      method: 'GET',
      path: '/v1/{{token}}/customers/byName/{{firstName}}/{{surName}}'
    },
    saveCustomer: {
      method: 'POST',
      path: '/v1/{{token}}/customers/save'
    },
    getCustomerGroupById: {
      method: 'GET',
      path: '/v1/{{token}}/customerGroups/id/{{id}}'
    },
    getCustomerGroupByName: {
      method: 'GET',
      path: '/v1/{{token}}/customerGroups/name/{{name}}'
    },
    getCustomerGroupByNum: {
      method: 'GET',
      path: '/v1/{{token}}/customerGroups/number/{{num}}'
    },
    getCustomerGroups: {
      method: 'GET',
      path: '/v1/{{token}}/customerGroups/page/{{limit}}'
    }
  }
}
