// mapping between functions and their HTTP requests
module.exports = () => {
  return {
    getToken: {
      method: 'GET',
      path: '/auth/{{appId}}/{{secret}}'
    },
    deleteProduct: {
      method: 'GET',
      path: '/{{token}}/products/delete/{{num}}'
    },
    getProductsByPage: {
      method: 'GET',
      path: '/{{token}}/products/get/page/{{num}}'
    }
  }
}
