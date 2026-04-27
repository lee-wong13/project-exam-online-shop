// --------------- JavaScript for responsive navigation menu
document.addEventListener("DOMContentLoaded", function () {
  const siteHeader = document.querySelector("header");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navList = document.getElementById("nav-list");
  const navRight = document.querySelector(".nav-right");

  if (!siteHeader || !hamburgerMenu || !navList || !navRight) {
    return;
  }

  //Active header
  function updateActiveNav() {
    const normalizePath = (path) => {
      if (!path) return "/";

      let normalizedPath = path.replace(/\/index\.html$/i, "/");

      if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
        normalizedPath = normalizedPath.slice(0, -1);
      }

      return normalizedPath;
    };

    const currentPath = normalizePath(window.location.pathname);
    const navLinks = navList.querySelectorAll("a[href]");

    navLinks.forEach((link) => {
      const url = new URL(link.href, window.location.origin);
      const linkPath = normalizePath(url.pathname);

      // Ignore section jump links when marking current page in nav.
      if (url.hash && linkPath === currentPath) {
        link.classList.remove("active");
        return;
      }

      link.classList.toggle("active", linkPath === currentPath);
    });
  }

  updateActiveNav();

  function setMenuState(isOpen) {
    siteHeader.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    hamburgerMenu.classList.toggle("open", isOpen);
    navList.classList.toggle("show", isOpen);
    navRight.classList.toggle("show", isOpen);

    if (isOpen) {
      hamburgerMenu.src = "assets/icons/icons8-cross-50.png";
      hamburgerMenu.alt = "Close menu";
    } else {
      hamburgerMenu.src = "assets/icons/icons8-hamburger-menu-50.png";
      hamburgerMenu.alt = "Open menu";
    }
  }

  hamburgerMenu.addEventListener("click", function () {
    const isOpen = !siteHeader.classList.contains("menu-open");
    setMenuState(isOpen);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && siteHeader.classList.contains("menu-open")) {
      setMenuState(false);
    }
  });

  // Update header based on login state
  function updateAuthHeader() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      navRight.innerHTML = `
        <span class="user-greeting">Hi, ${loggedInUser.fullname}</span>
        <span id="cart" class="nav-icon" title="Cart">Cart(0)</span>
        <span id="logout" class="nav-icon" title="Logout">Logout</span>
      `;

      const logoutBtn = document.getElementById("logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
          localStorage.removeItem("loggedInUser");
          window.location.href = "index.html";
          updateAuthHeader();
        });
      }
    }
  }

  updateAuthHeader();
});

// ---------------- Javascript for log in and signup forms

function handleSignup(event) {
  event.preventDefault();

  // Extract form data
  const formData = new FormData(event.target);

  const fullname = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const normalizedEmail = email ? email.trim().toLowerCase() : "";

  const fullnameInput = document.querySelector("input[name='name']");
  const emailInput = document.querySelector("input[name='email']");
  const passwordInput = document.querySelector("input[name='password']");

  const fullnameError = document.querySelector("#fullnameError");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  // Clear previous errors
  fullnameError.classList.remove("show");
  emailError.classList.remove("show");
  passwordError.classList.remove("show");
  fullnameInput.classList.remove("error");
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");

  let hasError = false;

  if (!fullname || fullname.trim() === "") {
    fullnameError.classList.add("show");
    fullnameInput.classList.add("error");
    hasError = true;
  }

  if (!email || email.trim() === "") {
    emailError.classList.add("show");
    emailInput.classList.add("error");
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    emailError.classList.add("show");
    emailInput.classList.add("error");
    hasError = true;
  }

  if (!password || password.trim() === "") {
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    hasError = true;
  } else if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    hasError = true;
  }

  if (hasError) {
    return;
  }

  //Check if user already exists
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userExists = users.some(
    (user) => user.email?.toLowerCase() === normalizedEmail,
  );

  if (userExists) {
    const emailErrorP = emailError.querySelector("p");
    if (emailErrorP)
      emailErrorP.textContent = "! An account with this email already exists.";
    emailError.classList.add("show");
    emailInput.classList.add("error");
    return;
  }

  // Save new user to localStorage
  const newUser = { fullname, email: normalizedEmail, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  window.location.href = "login.html";
}

// --------------- Login form handling
function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.querySelector("input[name='email']");
  const passwordInput = document.querySelector("input[name='password']");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  // Clear previous errors
  emailError.classList.remove("show");
  passwordError.classList.remove("show");
  emailInput.classList.remove("error");
  passwordInput.classList.remove("error");

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  let hasError = false;

  if (!email) {
    emailError.classList.add("show");
    emailInput.classList.add("error");
    hasError = true;
  }

  if (!password) {
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    hasError = true;
  }

  if (hasError) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const matchedUser = users.find(
    (user) => user.email?.toLowerCase() === email && user.password === password,
  );

  if (!matchedUser) {
    emailError.classList.add("show");
    emailInput.classList.add("error");
    passwordError.classList.add("show");
    passwordInput.classList.add("error");
    return;
  }

  // Handle remember me
  const rememberMe = document.querySelector("input[name='remember']");
  if (rememberMe && rememberMe.checked) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
  window.location.href = "index.html";
}

// Pre-fill email if remember me was checked previously
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.querySelector("input[name='email']");
  const rememberMe = document.querySelector("input[name='remember']");
  const rememberedEmail = localStorage.getItem("rememberedEmail");

  if (emailInput && rememberedEmail) {
    emailInput.value = rememberedEmail;
    if (rememberMe) rememberMe.checked = true;
  }
});
