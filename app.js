import {
  productsData
} from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const clearCartBtn = document.querySelector(".clear-cart");
let cart = [];
let btnsDom = [];


// get products

class products {
  getProducts() {
    return productsData;
  }
}



// display products

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(item => {
      result += `<div class="product">
  <div class="img-container">
    <img src=${item.imageUrl} class="product-img" />
  </div>
  <div class="product-desc">
    <p class="product-price">${item.title}</p>
    <p class="product-title">${item.price}</p>
  </div>
  <button class="btn add-to-cart " data-id=${item.id}>
    <i class="fas fa-shopping-cart"></i>
    افزودن به سبد
  </button>
</div>`;
      productsDOM.innerHTML = result;
    });
  };
  getBtnproducts() {
    const addToCart = [...document.querySelectorAll(".add-to-cart")];
    btnsDom = addToCart;

    addToCart.forEach((btn) => {
      const id = btn.dataset.id;
      // check product in cart
      const inCart = cart.find((p) => p.id === id);
      if (inCart) {
        btn.innerText = "اضافه شد"
        btn.disable = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "اضافه شد";
        e.target.disable = true;
        btn.style.color = "red";
        const addedProduct = {
          ...storage.getProduct(id),quantity: 1};
        cart = [...cart, addedProduct];
        storage.saveCart(cart);
        // cart valu uptdae
        this.cartValu(cart);
        // product item add too cart
        this.addItemCart(addedProduct);
      });
    });
  };

  cartValu(cart) {
    // total price
    let tempCartItem = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItem += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `مبلغ کل : ${totalPrice.toFixed(2)}`;
    cartItems.innerText = tempCartItem;
    // console.log(tempCartItem);
  }

  addItemCart(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img class="cart-item-img" src=${cartItem.imageUrl} />
 <div class="cart-item-desc">
   <h4>${cartItem.title}</h4>
   <h5>${cartItem.price}</h5>
 </div>
 <div class="cart-item-conteoller">
   <i class="fas fa-chevron-up"  data-id=${cartItem.id}></i>
   <p class="item-quantity">${cartItem.quantity}</p>
   <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
 </div>
 <p class="del-product" data-id=${cartItem.id}>حذف</p>`

    cartContent.appendChild(div);
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearCart());

    cartContent.addEventListener("click", (event) => {
  
    if (event.target.classList.contains("fa-chevron-up")) {
        const addQuantity = event.target;
        const id = addQuantity.dataset.id;
        const addedItem = cart.find((c) => c.id == id);
        addedItem.quantity++;
        this.cartValu(cart);
        storage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if(event.target.classList.contains("del-product")) {
        const removeItem = event.target;
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        this.cartValu(cart);
        storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
    }else if(event.target.classList.contains("fa-chevron-down")) {
      const subQuantity = event.target;
      const subItem = cart.find((c) => c.id == subQuantity.dataset.id);
      if (subItem.quantity === 1) {
        this.removeItem(subItem.id);
        cartContent.removeChild(subQuantity.parentElement.parentElement);
        return
      }
      subItem.quantity--;
      this.cartValu(cart);
      storage.saveCart(cart);
      subQuantity.previousElementSibling.innerText = subItem.quantity;
  }
  });
  }
  

  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    // remove childeren
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
 
 
  }

  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);
    this.cartValu(cart);
    storage.saveCart(cart);
    const buttons = btnsDom.find((btn) => parseInt(btn.dataset.id ) === parseInt(id));
    buttons.innerText = "افزودن به سبد" ;
    buttons.disable = false;
    buttons.style.color = "#023047" ;
  }

  // setup save refresh
  setUpApp() {
    cart = storage.getCart() || [];
    cart.forEach(cartItems => this.addItemCart(cartItems));
    this.cartValu(cart);
  }

}


// storage

class storage {
  static saveProducts(products) {
    localStorage.setItem("prodoucts", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("prodoucts"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart") ?
      JSON.parse(localStorage.getItem("cart")) : [];
  }
}

// cart modal

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}



// dom loaded

document.addEventListener("DOMContentLoaded", () => {
  const product = new products();
  const ProductsData = product.getProducts();
  const displayUI = new UI();
  displayUI.setUpApp();
  displayUI.displayProducts(ProductsData);
  storage.saveProducts(productsData);
  displayUI.getBtnproducts(productsData);
  displayUI.cartLogic();

})








cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);