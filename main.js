// tạo danh sách sản phẩm để hứng data lấy về từ api
let products = [];

// tạo danh sách item được thêm vào giỏ hàng
let shoppingItem = [];

// ==== helper ===============================================
// hàm dom
function dom(selector) {
  return document.querySelector(selector);
}

// hàm dispplay
function display(product) {
  let html = product.reduce((html1, item) => {
    let formatPrice = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
    }).format(item.price);
    return (
      html1 +
      `
      <div class="item-cart">
                        <div class="inner-cart">
                            <div class="pic">
                                <img class="img-fluid" src="${item.image}" alt="">
                            </div>
                            <div><h4>${item.name}</h4></div>
                            <div class="compare">                               
                                <span>${item.fontCamera}</span>
                                <span>${item.backCamera}</span>
                                <span>${item.screen}</span>
                               
                            </div>
                            <div class="price">
                            <h6>${formatPrice}</h6>
                            
                            </div>
                            <div class="desc">
                            <p>${item.desc}</p>
                            </div>
                            <div class="footer">
                                <button class="btn btn-success" data-id="${item.id}" data-type="addCart">Add</button>
                            </div>
                        </div>
                    </div>
        
        `
    );
  }, "");

  dom(".cart-content").innerHTML = html;
}

// hàm mở giỏ hàng
dom("#cart").addEventListener("click", () => {
  //dom tới thẻ cover làm mờ màn hình chính
  dom(".cover-cart").style.display="block"
  // khi nhấn vào giỏ hàng thì kéo list giỏ hàng đã ẩn ra
  dom(".cart-product").style.right = "0";

  dom(".banner").classList.add("reBanner")
});

// hàm đóng giỏ hàng
dom("#closed-cart").addEventListener("click", () => {
  //dom tới thẻ cover tắt làm mờ màn hình chính
  dom(".cover-cart").style.display="none"

  // khi nhấn vào giỏ hàng thì kéo list giỏ hàng đã ẩn ra
  dom(".cart-product").style.right = "-100%";

  dom(".banner").classList.remove("reBanner")
});

// hàm init khởi tạo khi reload lại trang lấy dữ liệu localStorage hiển thị lại ngoài màn mình
init()
function init(){
 let localItem = localStorage.getItem("shoppingCart")
 shoppingItem = JSON.parse(localItem) || []
 shoppingItem = shoppingItem.map((item)=>{
  return new CartItem(item.product,item.quanlity)
 })

 // sau khi lấy từ localStorage lên thì hiển thị lại ở phần giỏ hàng
shoppingCartDisplay(shoppingItem)

 // đồng thời cũng hiển lại quanlity ở icon giỏ hàng ở màn hình chính
 quanlityCart(shoppingItem);
  
}


//======================================================================

// hàm getProduct tự khởi chạy khi load trình duyệt
getProduct();
function getProduct() {
  apiGetProduct().then((reponse) => {
    let product = reponse.data.map((item) => {
      return new Product(
        item.id,
        item.name,
        item.price,
        item.screen,
        item.backCamera,
        item.frontCamera,
        item.image,
        item.desc,
        item.type
      );
    });
    products = [...product];
    display(products);
    console.log(products);
  });
}

// hàm thêm vào mảng shoppingItem có quanlity
function addShoppingCart(productID) {
  // lấy ra object khách hàng chọn từ trong kho dữ liệu
  const chooseItem = products.find((item) => item.id === productID);
  // console.log(chooseItem);

  // sau khi đã lấy đc object thì new object CartItem để thêm số lượng sp
  const addChooseItem = new CartItem(chooseItem, 1);

  //kiểm tra trước khi push thêm sp mới xem item đang thêm có bị trùng trong mảng ko , nếu có thì tăng số lượng lên
  let index = shoppingItem.findIndex((items) => {
    return productID === items.product.id;
  });
  if (index !== -1) {
    shoppingItem[index].quanlity += 1;
  }
  // khi cập nhật lại số lượng quanlity thì cũng cập nhật ở localstorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingItem));

  //tạo 1 loop duyệt mảng shoppingItem nếu có sp trùng thì sau khi tăng số lượng rồi thì ko cần push thêm sp đó vào mảng nữa
  for (i = 0; i < shoppingItem.length; i++) {
    if (productID === shoppingItem[i].product.id) {
      // console.log(shoppingItem);
      return; // nếu tìm đc thì return ngừng chạy những lệnh bên dưới
    }
  }

  // push object mới có số lượng sp vào mảng shoppingItem
  shoppingItem.push(addChooseItem);
  // sau khi push object mới vào mảng shoppingItem , thì ta cũng push thêm vào ở dưới localstorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingItem));
}

// hàm hiển thị số lượng item trên icon giỏ hàng
function quanlityCart(shoppingItem) {
  let quanlity = shoppingItem.reduce((total, item) => {
    return total + item.quanlity;
  }, 0);

  dom("#num").innerHTML = quanlity;
}

// hàm hiển thị sản phẩm trong giỏ hàng
function shoppingCartDisplay(shoppingItem) {
  let html = shoppingItem.reduce((html1, item) => {
    let totalPrice = item.product.price * item.quanlity;
    let formatPrice = new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
    }).format(totalPrice);
    return (
      html1 +
      `
    <tr>
    <td><img class="items-image" src="${item.product.image}" /></td>
    <td><h6 >${item.product.name}</h6></td>
    <td><button class="minus" onclick="minus('${item.product.id}')">
    <i class="fa-solid fa-arrow-left"></i></button>
     <span>${item.quanlity}</span>
     <button class="plus" onclick="plus('${item.product.id}')"><i class="fa-solid fa-arrow-right"></i></button></td>
    <td><h6 id="prices">${formatPrice}</h6></td>
    <td><button id="items-deleted" onclick="deleteItem('${item.product.id}')">
         <i class="fa-solid fa-trash"></i>
      </button></td>
    
    </tr>
    `
    );
  }, "");

  // hom hiểm thị trong giỏ hàng
  dom(".cart-items").innerHTML = html;

  //===== hiển thị phần total giá tiền
  let totalPrice = shoppingItem.reduce((total, items) => {
    let price = total + items.product.price * items.quanlity;
    return price;
  }, 0);

  // dom tới thẻ tính tiền tổng
  dom(".footer-text").innerHTML = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "VND",
  }).format(totalPrice);
}

// hàm tăng số lượng sản phẩm trong giỏ hàng
function plus(productID) {
  // khi mảng shoppingItem đã có object thì ta chỉ cần tìm ra object đã chọn và tăng quanlity dùng hàm findIndex để tìm ---- cách 1
  //  let index = shoppingItem.findIndex((items)=>{
  //   return productID === items.product.id
  //  })
  //  shoppingItem[index].quanlity += 1

  // cách 2 ta dùng hàm map
  shoppingItem = shoppingItem.map((item) => {
    if (productID === item.product.id) {
      return new CartItem(item.product, item.quanlity + 1);
    }
    return item;
  });

  //sau khi tăng thì ta cũng cập nhật lại ở localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingItem));

  // sau khi tăng thì ta lấy mảng mới đã đc cập nhật quanlity hiển thị lại ở giỏ hàng
  shoppingCartDisplay(shoppingItem);

  // đồng thời cũng cập nhật lại quanlity ở icon giỏ hàng ở màn hình chính
  quanlityCart(shoppingItem);
}

// hàm giảm quanlity
function minus(productId) {
  // lấy ra index của object ng dùng chọn
  let index = shoppingItem.findIndex((item) => {
    return productId === item.product.id;
  });

  // nếu object có quanlity === 0 thì <=> với detele object
  if (shoppingItem[index].quanlity === 0) {
    deleteItem(productId);

    //sau khi giảm thì ta cũng cập nhật lại ở localStorage
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingItem));
    return;
  }

  // nếu object có quanlity > 0 thì thực hiện -1
  shoppingItem[index].quanlity -= 1;

  //sau khi giảm thì ta cũng cập nhật lại ở localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingItem));

  // sau khi tăng thì ta lấy mảng mới đã đc cập nhật quanlity hiển thị lại ở giỏ hàng
  shoppingCartDisplay(shoppingItem);

  // đồng thời cũng cập nhật lại quanlity ở icon giỏ hàng ở màn hình chính
  quanlityCart(shoppingItem);
}

// hàm delete item trong giỏ hàng
function deleteItem(productId) {
  // dùng hàm filter để loại bỏ item mà ng dùng chọn
  shoppingItem = shoppingItem.filter((items) => {
    return items.product.id !== productId;
  });

   //sau khi xóa thì ta cũng cập nhật lại ở localStorage
   localStorage.setItem("shoppingCart",JSON.stringify(shoppingItem))

  // sau khi loại bỏ product và cập nhật lại trong mảng thì ta cập nhật lại display với mảng đã loại bỏ product
  console.log(shoppingItem);

  // sau khi xóa thì ta lấy mảng mới đã đc cập nhật quanlity hiển thị lại ở giỏ hàng
  shoppingCartDisplay(shoppingItem);

  // đồng thời cũng cập nhật lại quanlity ở icon giỏ hàng ở màn hình chính
  quanlityCart(shoppingItem);
}

// hàm thanh toán , khi bấm vào sẽ reset giỏ hàng về rỗng
function purchase() {
  // khi bấm nút thanh toán sẽ sét mảng về rỗng
  shoppingItem = [];

   //sau khi thanh toán về mảng rỗng thì ta cũng cập nhật lại ở localStorage
   localStorage.setItem("shoppingCart",JSON.stringify(shoppingItem))

  // đồng thời cũng cập nhật lại quanlity ở icon giỏ hàng ở màn hình chính
  quanlityCart(shoppingItem);

  // cập nhật mảng rỗng ở giỏ hàng
  shoppingCartDisplay(shoppingItem);

  // dom tới thẻ tbody hiện ra thông báo cảm ơn
  dom(".cart-items").innerHTML = `
  <h1>Cảm ơn quí khách hàng đã ủng hộ shop</h1>
  `;
}

// hàm clear giỏ hàng
function DeleteAll() {
  // khi bấm nút thanh toán sẽ sét mảng về rỗng
  shoppingItem = [];

  //sau khi clearAll về mảng rỗng thì ta cũng cập nhật lại ở localStorage
  localStorage.setItem("shoppingCart",JSON.stringify(shoppingItem))

  // đồng thời cũng cập nhật lại quanlity ở icon giỏ hàng ở màn hình chính
  quanlityCart(shoppingItem);

  // cập nhật mảng rỗng ở giỏ hàng
  shoppingCartDisplay(shoppingItem);

  // dom tới thẻ tbody hiện ra thông báo cảm ơn
  dom(".cart-items").innerHTML = `
  <h1>Emty Cart</h1>
  `;
  console.log(123);
}

///=========================================================================

// lắng nghe sự kiện chọn thương hiệu đt
dom("#phone").addEventListener("change", (evt) => {
  // const value = evt.target.value /// cách ghi 1
  let { value } = evt.target; // dùng kĩ thuật bóc tách
  value.toLowerCase();
  if (value === "all") {
    display(products);
    return;
  }

  let chooseProduct = products.filter((item) => {
    let typeProduct = item.type.toLowerCase();
    return value === typeProduct;
  });

  display(chooseProduct);
});

// lắng nghe sự kiện click ở thẻ cha inner để bắt lấy nút add giỏ hàng
dom(".inner").addEventListener("click", (evt) => {
  const addCart = evt.target.getAttribute("data-type");
  const productID = evt.target.getAttribute("data-id");
  if (addCart === "addCart") {
    addShoppingCart(productID); // hàm chạy thêm sp vào mảng có thêm quanlity
    quanlityCart(shoppingItem); // hàm hiển thị số lượng item trên icon giỏ hàng
    shoppingCartDisplay(shoppingItem); // hàm hiển thị sản phẩm trong giỏ hàng
  }
});
