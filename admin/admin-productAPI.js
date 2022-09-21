// hàm request API get product
function apiGetProduct(searchValue) {
  return axios({
    url: `https://62f50939535c0c50e76847c3.mockapi.io/productss`,
    method: "GET",
    params: {
      // Những giá trị được định nghĩa trong object
      //param sẽ đc thêm vào url: ?key=value
      type: searchValue,
    },
  });
}

// hàm request API post product
function apiPostProduct(product) {
  return axios({
    url: `https://62f50939535c0c50e76847c3.mockapi.io/productss`,
    method: "POST",
    data: product,
  });
}

// hàm request API get produc by id
function apiDeleteProduct(productId) {
  return axios({
    url: `https://62f50939535c0c50e76847c3.mockapi.io/productss/${productId}`,
    method: "DELETE",
  });
}

// hàm request API lấy thông tin duy nhất 1 sp thông qua ID
function apiGetProductById(productId) {
  return axios({
    url: `https://62f50939535c0c50e76847c3.mockapi.io/productss/${productId}`,
    method: "GET",
  });
}

// hàm request API PUT chỉnh sửa item trên sever
function apiUpdateProductById(productId, product) {
  return axios({
    url: `https://62f50939535c0c50e76847c3.mockapi.io/productss/${productId}`,
    method: "PUT",
    // truyền vào data : value
    data: product,
  });
}
