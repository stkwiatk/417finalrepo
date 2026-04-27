"use strict";

(function () {
  var featuredProducts = [
    {
      name: "Music",
      image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
      alt: "Blue-toned close-up of a jazz record collection and stereo equipment",
      description: "Our music wall is dedicated entirely to CDs, with CCM essentials, pop staples, soundtracks, landmarks, and fresh arrivals organized for easy crate-style browsing. If you want a dependable starting point, our staff usually guides shoppers toward timeless discs like MercyMe and Johnny Hates Jazz."
    },
    {
      name: "Movies",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80",
      alt: "A cinematic home theater space with a glowing screen and rows of seats",
      description: "Our movie department spans VHS, DVD, Laserdisc, and Blu-ray, making room for collector editions, cult classics, family favorites, and prestige cinema in one well-labeled run. Shoppers can jump between nostalgic tape finds and premium Blu-ray releases without leaving the same aisle."
    },
    {
      name: "Video Games",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=80",
      alt: "A vintage arcade cabinet glowing in a dark game room",
      description: "Our game shelves cover current systems and retro hardware all the way back to the Atari 2600, with cleaned cartridges, tested discs, and clearly marked platform sections. Whether you are collecting NES staples or grabbing an Xbox 360 favorite, the lineup is built for both nostalgia and replay value."
    }
  ];

  var taxRate = 0.0825;
  var shippingCharge = 7;
  var cartItems = [];

  var themeToggle = document.getElementById("theme-toggle");
  var productControls = document.querySelectorAll("[data-product-control]");
  var featuredName = document.getElementById("featured-name");
  var featuredImage = document.getElementById("featured-image");
  var featuredDescription = document.getElementById("featured-description");
  var guessInput = document.getElementById("guess-input");
  var guessButton = document.getElementById("guess-button");
  var guessResult = document.getElementById("guess-result");
  var addToCartButtons = document.querySelectorAll(".add-to-cart");
  var cartList = document.getElementById("cart-list");
  var subtotalAmount = document.getElementById("subtotal-amount");
  var taxAmount = document.getElementById("tax-amount");
  var shippingAmount = document.getElementById("shipping-amount");
  var totalAmount = document.getElementById("total-amount");
  var checkoutButton = document.getElementById("checkout-button");
  var checkoutMessage = document.getElementById("checkout-message");
  var contactForm = document.getElementById("contact-form");
  var submissionPanel = document.getElementById("submission-panel");
  var submissionMessage = document.getElementById("submission-message");
  var fullNameField = document.getElementById("full-name");
  var phoneField = document.getElementById("phone-number");
  var emailField = document.getElementById("email-address");
  var commentsField = document.getElementById("comments");
  var contactPhoneField = document.getElementById("contact-phone");
  var contactEmailField = document.getElementById("contact-email");

  function formatCurrency(amountValue) {
    return "$" + amountValue.toFixed(2);
  }

  function setTheme(nextThemeValue) {
    var themeButtonLabel = nextThemeValue === "dark" ? "Switch to light mode" : "Switch to dark mode";

    document.body.setAttribute("data-theme", nextThemeValue);
    themeToggle.setAttribute("aria-label", themeButtonLabel);
    themeToggle.setAttribute("title", themeButtonLabel);
    themeToggle.setAttribute("aria-pressed", String(nextThemeValue === "dark"));
    window.localStorage.setItem("replayHarborTheme", nextThemeValue);
  }

  function initializeTheme() {
    var savedThemeValue = window.localStorage.getItem("replayHarborTheme");

    if (savedThemeValue === "dark" || savedThemeValue === "light") {
      setTheme(savedThemeValue);
      return;
    }

    setTheme("light");
  }

  function renderFeaturedProduct(productIndexValue) {
    var selectedProduct = featuredProducts[productIndexValue];

    featuredName.textContent = selectedProduct.name;
    featuredImage.src = selectedProduct.image;
    featuredImage.alt = selectedProduct.alt;
    featuredDescription.textContent = selectedProduct.description;

    productControls.forEach(function (controlButton, controlIndexValue) {
      var isSelectedValue = controlIndexValue === productIndexValue;

      controlButton.classList.toggle("active", isSelectedValue);
      controlButton.setAttribute("aria-pressed", String(isSelectedValue));
    });
  }

  function updateCartDisplay() {
    var subtotalValue = 0;
    var taxValue = 0;
    var totalValue = 0;

    cartList.innerHTML = "";

    if (cartItems.length === 0) {
      cartList.innerHTML = "<li>No items added yet.</li>";
      subtotalAmount.textContent = "$0.00";
      taxAmount.textContent = "$0.00";
      shippingAmount.textContent = "$0.00";
      totalAmount.textContent = "$0.00";
      return;
    }

    cartItems.forEach(function (cartItemValue) {
      var listItem = document.createElement("li");

      subtotalValue += cartItemValue.price;
      listItem.textContent = cartItemValue.name + " - " + formatCurrency(cartItemValue.price);
      cartList.appendChild(listItem);
    });

    taxValue = subtotalValue * taxRate;
    totalValue = subtotalValue + taxValue + shippingCharge;

    subtotalAmount.textContent = formatCurrency(subtotalValue);
    taxAmount.textContent = formatCurrency(taxValue);
    shippingAmount.textContent = formatCurrency(shippingCharge);
    totalAmount.textContent = formatCurrency(totalValue);
  }

  function clearFormErrors() {
    [
      "name-error",
      "method-error",
      "phone-error",
      "email-error",
      "comments-error"
    ].forEach(function (errorIdValue) {
      var errorNode = document.getElementById(errorIdValue);
      if (errorNode) {
        errorNode.textContent = "";
      }
    });

    [fullNameField, phoneField, emailField, commentsField].forEach(function (fieldNode) {
      fieldNode.classList.remove("input-error");
    });
  }

  function setFieldError(fieldNode, errorNodeIdValue, messageValue) {
    var errorNode = document.getElementById(errorNodeIdValue);

    fieldNode.classList.add("input-error");
    errorNode.textContent = messageValue;
  }

  function validateContactForm() {
    var isValidValue = true;
    var fullNameValue = fullNameField.value.trim();
    var phoneValue = phoneField.value.trim();
    var emailValue = emailField.value.trim();
    var commentsValue = commentsField.value.trim();
    var preferredMethodValue = contactPhoneField.checked ? "phone" : (contactEmailField.checked ? "email" : "");
    var fullNamePattern = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;
    var phonePattern = /^(?:\d{10}|\(\d{3}\)\s?\d{3}-\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})$/;
    var emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    clearFormErrors();

    if (!fullNamePattern.test(fullNameValue)) {
      setFieldError(fullNameField, "name-error", "Enter your full name using letters, spaces, apostrophes, periods, or hyphens.");
      isValidValue = false;
    }

    if (preferredMethodValue === "") {
      document.getElementById("method-error").textContent = "Choose whether you want us to contact you by phone or email.";
      isValidValue = false;
    }

    if (preferredMethodValue === "phone") {
      if (!phonePattern.test(phoneValue)) {
        setFieldError(phoneField, "phone-error", "Enter a valid phone number such as 6025550188 or (602) 555-0188.");
        isValidValue = false;
      }
    } else if (phoneValue.length > 0 && !phonePattern.test(phoneValue)) {
      setFieldError(phoneField, "phone-error", "If you include a phone number, use a format such as 6025550188 or (602) 555-0188.");
      isValidValue = false;
    }

    if (preferredMethodValue === "email") {
      if (!emailPattern.test(emailValue)) {
        setFieldError(emailField, "email-error", "Enter a valid email address such as name@example.com.");
        isValidValue = false;
      }
    } else if (emailValue.length > 0 && !emailPattern.test(emailValue)) {
      setFieldError(emailField, "email-error", "If you include an email address, use a format such as name@example.com.");
      isValidValue = false;
    }

    if (commentsValue.length < 10) {
      setFieldError(commentsField, "comments-error", "Please enter a comment with at least 10 characters so we can help you properly.");
      isValidValue = false;
    }

    if (!isValidValue) {
      return null;
    }

    return {
      fullName: fullNameValue,
      preferredMethod: preferredMethodValue,
      phoneNumber: phoneValue,
      emailAddress: emailValue,
      comments: commentsValue
    };
  }

  themeToggle.addEventListener("click", function () {
    var nextThemeValue = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextThemeValue);
  });

  productControls.forEach(function (controlButton) {
    controlButton.addEventListener("click", function () {
      var productIndexValue = Number(controlButton.getAttribute("data-product-control"));
      renderFeaturedProduct(productIndexValue);
    });
  });

  guessButton.addEventListener("click", function () {
    var guessValue = Number(guessInput.value);
    var randomValue;

    if (!Number.isInteger(guessValue) || guessValue < 1 || guessValue > 10) {
      guessResult.innerHTML = "<h3>Contest result</h3><p>Please enter a whole number from 1 to 10 before drawing.</p>";
      return;
    }

    randomValue = Math.floor(Math.random() * 10) + 1;

    if (guessValue === randomValue) {
      guessResult.innerHTML = "<h3>Contest result</h3><p>You guessed " + guessValue + " and the store drew " + randomValue + ". You win today&rsquo;s draw!</p>";
      return;
    }

    guessResult.innerHTML = "<h3>Contest result</h3><p>You guessed " + guessValue + " and the store drew " + randomValue + ". Not a match this time, so try again.</p>";
  });

  addToCartButtons.forEach(function (buttonNode) {
    buttonNode.addEventListener("click", function () {
      var productNameValue = buttonNode.getAttribute("data-name");
      var productPriceValue = Number(buttonNode.getAttribute("data-price"));

      cartItems.push({
        name: productNameValue,
        price: productPriceValue
      });

      checkoutMessage.textContent = "";
      updateCartDisplay();
    });
  });

  checkoutButton.addEventListener("click", function () {
    var subtotalValue = 0;
    var finalTotalValue = 0;

    if (cartItems.length === 0) {
      checkoutMessage.textContent = "Add at least one item to your cart before checking out.";
      return;
    }

    cartItems.forEach(function (cartItemValue) {
      subtotalValue += cartItemValue.price;
    });

    finalTotalValue = subtotalValue + (subtotalValue * taxRate) + shippingCharge;
    checkoutMessage.textContent = "Thank you for your order. Your completed total was " + formatCurrency(finalTotalValue) + ".";
    cartItems = [];
    updateCartDisplay();
  });

  contactForm.addEventListener("submit", function (submitEvent) {
    var customerRequest;
    var responseParts = [];

    submitEvent.preventDefault();
    customerRequest = validateContactForm();

    if (!customerRequest) {
      return;
    }

    responseParts.push(customerRequest.fullName + ", thank you for contacting Replay Harbor.");
    responseParts.push("Preferred contact method: " + customerRequest.preferredMethod + ".");

    if (customerRequest.preferredMethod === "phone") {
      responseParts.push("We will follow up at " + customerRequest.phoneNumber + ".");
    } else {
      responseParts.push("We will follow up at " + customerRequest.emailAddress + ".");
    }

    responseParts.push("Your message was: \"" + customerRequest.comments + "\"");

    submissionMessage.textContent = responseParts.join(" ");
    submissionPanel.hidden = false;
    contactForm.reset();
    contactPhoneField.checked = true;
    clearFormErrors();
  });

  initializeTheme();
  renderFeaturedProduct(0);
  updateCartDisplay();
}());