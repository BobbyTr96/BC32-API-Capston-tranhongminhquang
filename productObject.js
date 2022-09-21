
  // object product
  class Product {
    constructor(
      id,
      name,
      price,
      screen,
      backCamera,
      fontCamera,
      image,
      desc,
      type
    ) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.screen = screen;
      this.backCamera = backCamera;
      this.fontCamera = fontCamera;
      this.image = image;
      this.desc = desc;
      this.type = type;
    }
  }

  
  //tạo object cart item để thêm số lượng sản phẩm
class CartItem {
    constructor(product, quanlity) {
      this.product = product;
      this.quanlity = quanlity;
    }
  }