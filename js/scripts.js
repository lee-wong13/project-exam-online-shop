// JavaScript for responsive navigation menu
document.addEventListener("DOMContentLoaded", function () {
  const siteHeader = document.querySelector("header");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navList = document.getElementById("nav-list");
  const navRight = document.querySelector(".nav-right");

  if (!siteHeader || !hamburgerMenu || !navList || !navRight) {
    return;
  }

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
});
