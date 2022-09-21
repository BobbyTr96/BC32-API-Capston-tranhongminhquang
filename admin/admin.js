// tạo mảng global chứa object lấy về từ api
let products = [];
// tạo object product
class Product {
  constructor(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    type,
    desc
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.screen = screen;
    this.backCamera = backCamera;
    this.frontCamera = frontCamera;
    this.image = image;
    this.type = type;
    this.desc = desc;
  }
}

// ======= Hàm helper ==============================
function dom(selector) {
  return document.querySelector(selector);
}

// hàm hiển thị ra html
function display(product) {
  let html = product.reduce((html1, item, index) => {
    let formatPrice = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
    }).format(item.price);
    return (
      html1 +
      `
        <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${formatPrice}</td>
        <td>
        <img <img src="${item.image}" width="50px" height="50px"/>
        </td>
        <td>${item.desc}</td>
        <td>
        <button class="btn btn-primary" data-id="${
          item.id
        }" data-type="Edit" data-toggle="modal" data-target="#myModal">Edit</button>
        <button class="btn btn-danger" data-id="${
          item.id
        }" data-type="Delete">Delete</button>
        </td>
        </tr>
        `
    );
  }, "");

  dom("#tblDanhSachSP").innerHTML = html;
}
// khi nhấn nút thêm mới thì set ô input lại ""
dom("#btnThemSP").addEventListener("click", () => {
  dom("#TenSP").value = "";
  dom("#GiaSP").value = "";
  dom("#screen").value = "";
  dom("#backCamera").value = "";
  dom("#frontCamera").value = "";
  dom("#HinhSP").value = "";
  dom("#type").value = "";
  dom("#MoTa").value = "";
});

// ====================================================

// hàm request API get product từ kho dữ liệu
getProduct(); // hàm này sẽ tự chạy khi load lại trang web
function getProduct(searchValue) {
  apiGetProduct(searchValue)
    .then((response) => {
      // response.data trả về ở dạng object thường, nếu muốn sử dụng lại những method thì phải new về đối đượng Product đã tạo lúc ban đầu
      // dùng hàm map để duyệt mảng response.data
      let product = response.data.map((item) => {
        return new Product(
          item.id,
          item.name,
          item.price,
          item.screen,
          item.backCamera,
          item.frontCamera,
          item.image,
          item.type,
          item.desc
        );
      });

      // sau khi có mảng object product thì ta dùng spead operator để gán lại cho array products ở global để sử dụng sau
      products = [...product];

      console.log(products);

      // chạy hàm display với dữ liệu là products để hiển thị ra trình duyệt
      display(product);
    })
    .catch((error) => {
      console.log(error);
    });
}

// hàm thêm product
function add() {
  // check validation trước khi lấy dữ liệu từ ng dùng
  let checkValid = formValidation();
  if (!checkValid) return;

  // dom lấy dữ liệu từ input
  let name = dom("#TenSP").value;
  let price = dom("#GiaSP").value;
  let screen = dom("#screen").value;
  let backCamera = dom("#backCamera").value;
  let frontCamera = dom("#frontCamera").value;
  let image = dom("#HinhSP").value;
  let type = dom("#type").value;
  let MoTa = dom("#MoTa").value;

  // new ra object mới từ class object Product
  let product = new Product(
    null,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    type,
    MoTa
  );
  //   request API post
  apiPostProduct(product).then((response) => {
    getProduct();
  });
}

// hàm updated
function upDated(productId) {
  // dom lấy lại dữ liệu đã sửa
  let name = dom("#TenSP").value;
  let price = dom("#GiaSP").value;
  let screen = dom("#screen").value;
  let backCamera = dom("#backCamera").value;
  let frontCamera = dom("#frontCamera").value;
  let image = dom("#HinhSP").value;
  let type = dom("#type").value;
  let MoTa = dom("#MoTa").value;

  // new thành object Product
  let product = new Product(
    null,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    image,
    type,
    MoTa
  );

  // request API PUT product đã chỉnh sửa dựa vào id và truyền vào product mới vừa chỉnh sừa
  apiUpdateProductById(productId, product)
    .then((response) => {
      // sau khi cập nhật thì cần chạy lại hàm getProduct() để hiển thị lại ra html
      getProduct();
    })
    .catch((error) => {
      console.log(error);
    });
}

// hàm delete ==========
function deleteProduct(productID) {
  apiDeleteProduct(productID)
    .then((response) => {
      getProduct();
    })
    .catch((error) => {
      console.log(error);
    });
}

// =============== lắng nghe sự kiện click ở thẻ cha tbody id="tblDanhSachSP"
dom("#tblDanhSachSP").addEventListener("click", (evt) => {
  let type = evt.target.getAttribute("data-type");
  let productId = evt.target.getAttribute("data-id");

  if (type === "Delete") {
    deleteProduct(productId);
  }

  if (type === "Edit") {
    dom(".modal-footer").innerHTML = `     
    <div class="btn btn-primary" onclick="upDated('${productId}')">Cập nhật</div>   
                <div class="btn btn-danger" data-dismiss="modal">Đóng</div>
    
    `;

    // request API lấy dữ liệu từ sever cập nhật lại trên ô input
    apiGetProductById(productId)
      .then((response) => {
        // trả response.data về biến product cho gọn
        let product = response.data;
        // tiến hành dom và điền ngược thông tin lên ô input
        dom("#TenSP").value = product.name;
        dom("#GiaSP").value = product.price;
        dom("#screen").value = product.screen;
        dom("#backCamera").value = product.backCamera;
        dom("#frontCamera").value = product.frontCamera;
        dom("#HinhSP").value = product.image;
        dom("#type").value = product.type;
        dom("#MoTa").value = product.desc;
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

//============================
dom("#btnThemSP").addEventListener("click", () => {
  dom(".modal-footer").innerHTML = `
    <div class="btn btn-success" onclick="add()">Thêm</div>
    <div class="btn btn-danger" data-dismiss="modal">Đóng</div>
    `;
});

dom("#inputTK").addEventListener("keydown", (evt) => {
  // console.log(evt.key);

  if (evt.key === "Enter") {
    getProduct(evt.target.value);
  }
});

//========================================= Validation
// hàm check tên sp
function validProductName() {
  let valName = dom("#TenSP").value;
  let valSpan = dom("#checkName");

  // check input rỗng
  if (valName === "") {
    valSpan.innerHTML = "Vui lòng nhập tên sản phẩm";
    return false;
  }

  // check validation number and letters and space
  let reGex = /^[A-Za-z\s.\(\)0-9]{1,}$/;
  if (!reGex.test(valName)) {
    valSpan.innerHTML = "tên sản phẩm chỉ chứa số và ký tự";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm check  price
function validProductPrice() {
  let valName = dom("#GiaSP").value;
  let valSpan = dom("#checkPrice");

  // check input rỗng
  if (valName === "") {
    valSpan.innerHTML = "Vui lòng nhập giá sản phẩm";
    return false;
  }

  // check validation only number
  let reGex = /^[0-9]*$/;
  if (!reGex.test(valName)) {
    valSpan.innerHTML = "Giá sản phẩm chỉ được điền số";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm check  screen
function validProductScreen() {
  let valName = dom("#screen").value;
  let valSpan = dom("#checkScreen");

  // check input rỗng
  if (valName === "") {
    valSpan.innerHTML = "Vui lòng nhập thông tin màn hình";
    return false;
  }

  // check validation number and letters and space
  let reGex = /^[A-Za-z\s.,\(\)0-9]{1,}$/;
  if (!reGex.test(valName)) {
    valSpan.innerHTML = "Thông số màn hình chỉ chứa số và ký tự";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm check  backCamera
function validProductBackCamera() {
  let valName = dom("#backCamera").value;
  let valSpan = dom("#checkBackCamera");

  // check input rỗng
  if (valName === "") {
    valSpan.innerHTML = "Vui lòng nhập thông tin cam chính";
    return false;
  }

  // check validation number and letters and space
  let reGex = /^[A-Za-z\s.\(\)0-9]{1,}$/;
  if (!reGex.test(valName)) {
    valSpan.innerHTML = "Thông số camera chỉ chứa số và ký tự";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm check  frontCamera
function validProductFrontCamera() {
  let valName = dom("#frontCamera").value;
  let valSpan = dom("#checkFrontCamera");

  // check input rỗng
  if (valName === "") {
    valSpan.innerHTML = "Vui lòng nhập thông tin cam phụ";
    return false;
  }

  // check validation number and letters and space
  let reGex = /^[A-Za-z\s.\(\)0-9]{1,}$/;
  if (!reGex.test(valName)) {
    valSpan.innerHTML = "Thông số camera chỉ chứa số và ký tự";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm check image
function validProductImage() {
  let valName = dom("#HinhSP").value;
  let valSpan = dom("#checkImage");

  // check input rỗng
  if (valName === "") {
    valSpan.innerHTML = "Hình ảnh không đc để trống";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm check type
function validProductType() {
  let valName = dom("#type").value;
  let valSpan = dom("#checkType");

  // check input rỗng
  if (valName === "") {
    valSpan.innerHTML = "Vui lòng nhập thương hiệu sản phẩm";
    return false;
  }

  // check validation chỉ chứa chữ cái - ko chứa số và kí tự đặc biệt
  let reGex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  if (!reGex.test(valName)) {
    valSpan.innerHTML = "Chỉ được điền ký tự";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm check desc
function validProductDesc() {
  let valName = dom("#MoTa").value;
  let valSpan = dom("#checkDesc");

  // check input tối 60 ký tự
  if (valName.length > 60) {
    valSpan.innerHTML = "Mô tả không vượt quá 60 ký tự";
    return false;
  }

  // thỏa mãn mọi yêu cầu
  valSpan.innerHTML = "";
  return true;
}

// hàm validation
function formValidation() {
  let valid =
    validProductName() &
    validProductPrice() &
    validProductScreen() &
    validProductBackCamera() &
    validProductFrontCamera() &
    validProductImage() &
    validProductDesc() &
    validProductType();

  if (!valid) {
    return false;
  }

  return true;
}
