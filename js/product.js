// references to HTML elements
const productDetailContainer = document.getElementById(
  "product-detail-container",
);
const productDetailElement = document.getElementById("product-detail");
const breadcrumbName = document.getElementById("breadcrumb-name");

// variable to store the quantity selected by the user
let quantity = 1;

// variable to store the current product being viewed
let currentProduct = null;

// function to get the product id from the query string in the URL
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// function to fetch all products from the API and find the product by id
async function fetchProductById(productId) {
  try {
    const response = await fetch("https://v2.api.noroff.dev/online-shop");
    const result = await response.json();
    const products = result.data || [];
    return products.find((product) => String(product.id) === String(productId));
  } catch (error) {
    console.error("Error loading product details:", error);
    return null;
  }
}

// function to render the product details page from the product data
function renderProductDetails(product) {
  if (!productDetailElement || !product) return;

  const title = product.title || "Product";
  const description =
    product.description || "No product description available.";
  const price = Number(product.price) || 0;
  const discountedPrice = Number(product.discountedPrice) || price;
  const imageUrl = product.image?.url || "";
  const imageAlt = product.image?.alt || title;
  const hasDiscount = discountedPrice < price;
  const tags =
    product.tags && product.tags.length > 0
      ? product.tags
          .map((tag) => `<span class="product-tag">${tag}</span>`)
          .join(", ")
      : `<span class="product-tag">No tag</span>`;
  const rating = product.rating || 0;

  breadcrumbName.textContent = title;

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  productDetailElement.innerHTML = `
    <div class="product-deteail-layout">
      <div class="product-image-wrapper">
        <img src="${imageUrl}" alt="${imageAlt}" class="product-detail-img" id="product-detail-img" />
      </div>
      <div class="product-info">
        <div class="product-title-row">
          <h1 class="product-detail-title" id="product-title">${title}</h1>
          <p class="product-description" id="product-description">${description}</p>
        </div>
        <div class="product-info-bottom-layout">
          <div>
            <p class="rating">rating: ${rating}/5 Reviews</p>
          </div>
          <div class="tags-sale">
            tag: <span class="product-tag">${tags}</span>
          </div>
          <div class="product-pricing">
            <div>
              <p class="original-price" id="product-original-price">
                ${hasDiscount ? `<span class="original-price">$${price.toFixed(2)}</span>` : ""}
              </p>
            </div>
            <div>
              <p class="sale-price" id="product-sale-price">$${discountedPrice.toFixed(2)}</p>
            </div>
          </div>
          <div class="product-actions">
            <div class="quantity-selector">
              <button class="qty-btn" type="button" id="qty-decrease">-</button>
              <span id="qty-display">1</span>
              <button class="qty-btn" type="button" id="qty-increase">+</button>
            </div>
            ${loggedInUser ? '<button class="product-add-btn" type="button" id="product-add-btn">Add to Cart</button>' : ""}
          </div>
        </div>
      </div>
    </div>
  `;

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewCount = reviews.length;
  const reviewListHtml = reviewCount
    ? reviews
        .map(
          (review) => `
            <div class="review-card">
              <div class="content-review">
                <h2>${review.username || "Anonymous"}</h2>
                <p>${review.description || "No review text provided."}</p>
              </div>
              <div class="score">${review.rating || 0}/5</div>
            </div>
          `,
        )
        .join("")
    : `<div class="no-reviews"><p>No reviews available.</p></div>`;

  const reviewContentElement = document.getElementById("review-content");
  if (reviewContentElement) {
    reviewContentElement.innerHTML = `
      <h1 class="reviews-section-title">REVIEW (${reviewCount})</h1>
      ${reviewListHtml}
    `;
  }

  // add Event listeners for quantity controls and Add to Cart button
  setupQuantityControls(product);
}

// function to increase the quantity (button +)
function increaseQuantity() {
  quantity++;
  updateQuantityDisplay();
}

// function to decrease the quantity (button -) - do not allow less than 1
function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    updateQuantityDisplay();
  }
}

// function to update the quantity display
function updateQuantityDisplay() {
  const qtyDisplay = document.getElementById("qty-display");
  if (qtyDisplay) {
    qtyDisplay.textContent = quantity;
  }
}

// function to add product to cart with the selected quantity
function addProductToCart() {
  if (!currentProduct) return;

  // read cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // check if the product is already in the cart
  const existing = cart.find((item) => item.id === currentProduct.id);

  if (existing) {
    // if it exists, increase the quantity
    existing.quantity = (existing.quantity || 1) + quantity;
  } else {
    // if it doesn't exist, add a new product with the quantity
    const productToAdd = {
      ...currentProduct,
      quantity: quantity,
    };
    cart.push(productToAdd);
  }

  // save cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`);

  // reset quantity to 1 after adding to cart
  quantity = 1;
  updateQuantityDisplay();
}

// function to set up event listeners for quantity buttons and Add to Cart
function setupQuantityControls(product) {
  // store the product data for use in the addProductToCart function
  currentProduct = product;

  // reference buttons
  const btnDecrease = document.getElementById("qty-decrease");
  const btnIncrease = document.getElementById("qty-increase");
  const btnAddToCart = document.getElementById("product-add-btn");

  // add event listeners
  if (btnDecrease) {
    btnDecrease.addEventListener("click", decreaseQuantity);
  }
  if (btnIncrease) {
    btnIncrease.addEventListener("click", increaseQuantity);
  }
  if (btnAddToCart) {
    btnAddToCart.addEventListener("click", addProductToCart);
  }
}

// function to display a message when the product with the given id is not found
function renderNotFound(productId) {
  if (!productDetailElement) return;

  productDetailElement.innerHTML = `
    <div class="product-detail-notfound">
      <h1>Product not found</h1>
      <p>Product with ID: ${productId} not found.</p>
      <a href="../index.html">Back to Home</a>
    </div>
  `;
}

// function to initialize the product details page
// 1) read id from URL
// 2) call API to fetch product
// 3) render product details or not found message
async function initProductDetailsPage() {
  if (!productDetailElement) return;

  const productId = getProductIdFromUrl();
  if (!productId) {
    renderNotFound("Not specified");
    return;
  }

  const product = await fetchProductById(productId);
  if (!product) {
    renderNotFound(productId);
    return;
  }

  renderProductDetails(product);
}

initProductDetailsPage();
