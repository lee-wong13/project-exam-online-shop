// products information from API
let allProducts = [];

// reference elements in the HTML
const categoriesContainer = document.querySelector(".feature-products-grid");
const categoriesFilter = document.querySelector(".categories-filter");
const saleWrapper = document.querySelector(
  ".feature-sale-content .swiper-wrapper",
);

// variable for controlling Swiper
let featureSaleSwiper = null;

// define tag groups for filtering products in the category page
const categoryMapping = {
  tech: [
    "toy",
    "headphones",
    "storage",
    "electronics",
    "audio",
    "computers",
    "wearables",
    "watch",
  ],
  clothes: ["fashion", "bag", "shoes", "accessories", "watches", "jewely"],
  beauty: ["beauty", "skin care", "perfume", "shampoo"],
};

// main function: fetch products from API and display on the homepage
async function fetchProducts() {
  // update cart count before displaying the page
  updateCartCount();

  const url = "https://v2.api.noroff.dev/online-shop";

  try {
    const response = await fetch(url);
    const result = await response.json();
    allProducts = result.data || [];

    // render products by category and display sale items
    renderFeatureCategories(allProducts);
    renderFeatureSale(allProducts);
    setupCategoryFilters();
  } catch (error) {
    console.error("Error fetching products:", error);

    if (categoriesContainer) {
      categoriesContainer.innerHTML =
        "<p>Could not load products right now.</p>";
    }
  }
}

/*=============== FEATURE SALE ===============*/
//swiper for sale section
function initFeatureSaleSwiper() {
  if (!saleWrapper || featureSaleSwiper) return;

  featureSaleSwiper = new Swiper(".feature-sale-content", {
    slidesPerView: "auto",
    centeredSlides: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        centeredSlides: false,
      },
    },
  });
}

// render products in the SALE category
function renderFeatureSale(products) {
  if (!saleWrapper) return;

  const saleProducts = products.filter((product) => {
    const price = Number(product.price);
    const discountedPrice = Number(product.discountedPrice);
    return (
      !Number.isNaN(price) &&
      !Number.isNaN(discountedPrice) &&
      price !== discountedPrice
    );
  });

  if (!saleProducts.length) {
    saleWrapper.innerHTML = `<div class="swiper-slide"><div class="product-card swiper-slide"><div class="product-card-info"><p>No sale items right now.</p></div></div></div>`;
    initFeatureSaleSwiper();
    return;
  }

  const saleSlides = saleProducts;

  saleWrapper.innerHTML = saleSlides
    .map((product) => {
      const title = product.title || "Product";
      const price = Number(product.price) || 0;
      const discountedPrice = Number(product.discountedPrice) || 0;
      const imageUrl = product.image?.url || "";
      const imageAlt = product.image?.alt || title;
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      return `
          <div class="product-card swiper-slide" data-product-id="${product.id}">
            <div
              class="product-image-placeholder"
              role="img"
              aria-label="${imageAlt}"
              style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"
            ></div>
            <div class="product-card-info">
              <h2>${title}</h2>
              <div>
                <p>
                  $${discountedPrice.toFixed(2)}
                </p>
                <p>
                  <span style="text-decoration: line-through;">$${price.toFixed(2)}</span>
                </p>
              </div>
              ${loggedInUser ? '<button class="add-to-cart-btn">Add to Cart</button>' : ""}
            </div>
          </div>
        `;
    })
    .join("");

  const addButtons = saleWrapper.querySelectorAll(".add-to-cart-btn");
  addButtons.forEach((button, index) => {
    // prevent navigating to the product detail page when clicking the add to cart button
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(saleSlides[index]);
    });
  });

  const productCards = saleWrapper.querySelectorAll(".product-card");
  productCards.forEach((card, index) => {
    // navigate to the product detail page when clicking the card
    card.addEventListener("click", () => {
      window.location.href = `product/index.html?id=${saleSlides[index].id}`;
    });
  });

  initFeatureSaleSwiper();
  if (featureSaleSwiper) featureSaleSwiper.update();
}

// render products in the categories page (first 12 items)
function renderFeatureCategories(products) {
  if (!categoriesContainer) return;

  if (!products.length) {
    categoriesContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  const featuredProducts = products.slice(0, 12);

  categoriesContainer.innerHTML = featuredProducts
    .map((product) => {
      const title = product.title || "Product";
      const price = Number(product.price) || 0;
      const discountedPrice = Number(product.discountedPrice) || price;
      const hasDiscount = discountedPrice < price;
      const imageUrl = product.image.url;
      const imageAlt = product.image.alt;
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      return `
        <article class="category-card" data-product-id="${product.id}">
          <div
            class="category-image-placeholder"
            role="img"
            aria-label="${imageAlt}"
            style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"
          ></div>
          <div class="category-card-info">
            <h2>${title}</h2>
            <div>
              <p>
                $${discountedPrice.toFixed(2)}
              </p>
              <p>
                ${hasDiscount ? `<span style="text-decoration: line-through;">$${price.toFixed(2)}</span>` : ""}
              </p>
            </div>
            ${loggedInUser ? '<button class="add-to-cart-btn">Add to Cart</button>' : ""}
          </div>
        </article>
      `;
    })
    .join("");

  const addButtons = categoriesContainer.querySelectorAll(".add-to-cart-btn");

  addButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(featuredProducts[index]);
    });
  });

  const categoryCards = categoriesContainer.querySelectorAll(".category-card");
  categoryCards.forEach((card, index) => {
    // when clicking the card, navigate to the product detail page with the product id in the query string
    card.addEventListener("click", () => {
      window.location.href = `product/index.html?id=${featuredProducts[index].id}`;
    });
  });
}

// filter products by selected category
function filterProducts(category) {
  const normalizedCategory = category.toLowerCase();
  const filteredProducts =
    normalizedCategory === "all"
      ? allProducts
      : allProducts.filter(
          (product) =>
            Array.isArray(product.tags) &&
            product.tags.some((tag) =>
              categoryMapping[normalizedCategory]?.includes(tag.toLowerCase()),
            ),
        );

  renderFeatureCategories(filteredProducts);
}

// setup category filters click event
function setupCategoryFilters() {
  if (!categoriesFilter) return;

  categoriesFilter.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    event.preventDefault();
    const selectedCategory =
      link.dataset.category || link.id || link.textContent.trim().toLowerCase();
    if (!selectedCategory) return;

    categoriesFilter.querySelectorAll("a").forEach((navLink) => {
      navLink.classList.toggle(
        "active",
        (navLink.dataset.category ||
          navLink.id ||
          navLink.textContent.trim().toLowerCase()) === selectedCategory,
      );
    });

    filterProducts(selectedCategory);
  });
}

// add product to cart in localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);
  if (!existing) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
    updateCartCount();
  } else {
    alert("Item is already in cart");
  }
}

// update cart count displayed on the cart button
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countElement = document.getElementById("cart-count");
  if (countElement) countElement.innerText = cart.length;
}

if (categoriesContainer) {
  fetchProducts();
}
