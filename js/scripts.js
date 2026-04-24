document.addEventListener("DOMContentLoaded", function () {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navList = document.getElementById("nav-list");
  const navRight = document.querySelector(".nav-right");

  if (!hamburgerMenu || !navList || !navRight) {
    return;
  }

  hamburgerMenu.addEventListener("click", function () {
    const isOpen = hamburgerMenu.classList.toggle("open");

    navList.classList.toggle("show", isOpen);
    navRight.classList.toggle("show", isOpen);

    if (isOpen) {
      hamburgerMenu.src = "assets/icons/icons8-cross-50.png";
      hamburgerMenu.alt = "Close menu";
    } else {
      hamburgerMenu.src = "assets/icons/icons8-hamburger-menu-50.png";
      hamburgerMenu.alt = "Open menu";
    }
  });
});
