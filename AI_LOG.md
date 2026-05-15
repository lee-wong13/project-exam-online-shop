AI LOG

24.04.2026 20.35

- Promt: WHy is there a white gap on the top and bottom of footer when I already set the background as the same color that I set on global.css?
  - Changed: Because margin was defined, so it created gap for top and botton of footer

    24.04.2026 21.00

- Trouble shooting: had problem with responsive menu, the background didn't cover the whole screen when opened. They were opened separately.
  - Fixing: I had to set header.menu.open woth background-color: var(--primary-color) not just for nav ul.

    15.05.2026 21:00

- Promt: Why isn't Product detail show after I logged out? It should be shown normally but the Add to Cart Button shouldn't be visible.
  - Changed: The product is visible like how it should be, but I need to add function for loggedInUser for the add to cart button to be visible.
    ![loggedInUser](assets/img/stored-logged-in-user.png)
    ![loggedInUser](assets/img/stored-logged-in-user-2.png)
