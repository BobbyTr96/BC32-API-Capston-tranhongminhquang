// func request API lấy data product
function apiGetProduct() {
  return axios({
    url: "https://62f50939535c0c50e76847c3.mockapi.io/productss",
    method: "GET", 
  });
}
