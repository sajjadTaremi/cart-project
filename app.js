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
    const addToCart = document.querySelectorAll(".add-to-cart");
    const btns = [...addToCart];

    btns.forEach((btn) => {
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
       const addedProduct = storage.getProduct(id);
       cart = [...cart,{...addedProduct, quantity: 1 }];
       storage.saveCart(cart);
      });
    });
  };

}


// storage

class storage {
  static saveProducts(products) {
    localStorage.setItem("prodoucts", JSON.stringify(products));
  }
  static getProduct(id){
   const _products = JSON.parse(localStorage.getItem("prodoucts"));
   return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
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
  displayUI.displayProducts(ProductsData);
  storage.saveProducts(productsData);
  displayUI.getBtnproducts(productsData);
})



cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);