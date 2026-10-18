document.addEventListener("DOMContentLoaded", function () {
  const themeButton = document.getElementById("theme-toggle");
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");
  const continueShoppingButton = document.getElementById("continue-shopping");

  let cart = [];
  continueShoppingButton.addEventListener("click", function () {
  document.querySelector(".product-grid").scrollIntoView({
    behavior: "smooth"
  });
});

  // DARK AND LIGHT MODE
  const savedTheme = localStorage.getItem("knock-theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  themeButton.textContent =
    document.body.classList.contains("dark") ? "☀" : "☾";

  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    themeButton.textContent = isDark ? "☀" : "☾";

    localStorage.setItem("knock-theme", isDark ? "dark" : "light");
  });

  // FORMAT PRICES
  function formatPrice(amount) {
    return "₦" + amount.toLocaleString("en-NG");
  }

  // UPDATE SHOPPING BAG
  
function updateCart() {
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );

  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Your bag is currently empty.</p>';
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    const itemQuantity = document.createElement("span");

    name.textContent =
      item.name + " (" + item.size + ", " + item.colour + ") ";
    itemQuantity.textContent = "× " + item.quantity;

    details.appendChild(name);
    details.appendChild(itemQuantity);

    const rightSide = document.createElement("div");
    const price = document.createElement("strong");
    const quantityControls = document.createElement("div");
    const decreaseButton = document.createElement("button");
    const quantityText = document.createElement("span");
    const increaseButton = document.createElement("button");
    const removeButton = document.createElement("button");

    price.textContent = formatPrice(item.price * item.quantity);

    quantityControls.className = "quantity-controls";

    decreaseButton.textContent = "−";
    decreaseButton.type = "button";
    decreaseButton.className = "quantity-button";

    quantityText.textContent = item.quantity;
    quantityText.className = "quantity-number";

    increaseButton.textContent = "+";
    increaseButton.type = "button";
    increaseButton.className = "quantity-button";

    decreaseButton.addEventListener("click", function () {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter(function (product) {
          return product.id !== item.id;
        });
      }
      updateCart();
    });

    increaseButton.addEventListener("click", function () {
      item.quantity += 1;
      updateCart();
    });

    removeButton.textContent = "Remove";
    removeButton.className = "remove-item";
    removeButton.type = "button";

    removeButton.addEventListener("click", function () {
      cart = cart.filter(function (product) {
        return product.id !== item.id;
      });
      updateCart();
    });

    quantityControls.appendChild(decreaseButton);
    quantityControls.appendChild(quantityText);
    quantityControls.appendChild(increaseButton);

    rightSide.appendChild(price);
    rightSide.appendChild(quantityControls);
    rightSide.appendChild(removeButton);

    row.appendChild(details);
    row.appendChild(rightSide);
    cartItems.appendChild(row);
  });
}


  // ADD PRODUCTS TO BAG
  document.querySelectorAll(".add-to-cart").forEach(function (button) {
    button.addEventListener("click", function () {
      const name = button.dataset.name;
      const card = button.closest(".product-card");
      const size = card.querySelector(".product-size")?.value || "M";
      const colour = card.querySelector(".product-colour")?.value || "Black";
      const price = Number(button.dataset.price);

      const existingItem = cart.find(function (item) {
      return item.name === name &&
      item.size === size &&
      item.colour === colour;
   });

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
  id: Date.now() + Math.random(),
  name: name,
  price: price,
  size: size,
  colour: colour,
  quantity: 1
});
      }

      updateCart();

      const originalText = button.textContent;
      button.textContent = "ADDED TO BAG ✓";

      setTimeout(function () {
        button.textContent = originalText;
      }, 1200);
    });
  });

  // WHATSAPP CHECKOUT
  checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Your bag is empty. Add a product first!");
      return;
    }

    const phoneNumber = "23484625497";

    let message = "Hello KNOCK! I want to place an order:\n\n";

    cart.forEach(function (item) {
  message += item.name +
    " | Size: " + item.size +
    " | Colour: " + item.colour +
    " | Quantity: " + item.quantity +
    " | Price: " + formatPrice(item.price * item.quantity) + "\n";
});

    message += "\nTotal: " + cartTotal.textContent;
    message += "\n\nPlease let me know the next steps.";

    const whatsappURL =
      "https://wa.me/" + phoneNumber +
      "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
  });

  // INITIALISE THE BAG
  updateCart();
});

