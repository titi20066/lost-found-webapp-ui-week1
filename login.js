document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const rememberCheckbox = document.getElementById("remember");

  // Load saved email if "Remember me" was used
  if (localStorage.getItem("savedEmail")) {
    emailInput.value = localStorage.getItem("savedEmail");
    rememberCheckbox.checked = true;
  }

  // Utility function for showing error messages
  function showError(input, message) {
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains("error-message")) {
      errorEl = document.createElement("div");
      errorEl.className = "error-message";
      errorEl.style.color = "red";
      errorEl.style.fontSize = "0.85rem";
      errorEl.style.marginTop = "4px";
      input.insertAdjacentElement("afterend", errorEl);
    }
    errorEl.textContent = message;
  }

  // Remove error message
  function clearError(input) {
    let errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains("error-message")) {
      errorEl.remove();
    }
  }

  // Email validation
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    // Clear all previous errors
    clearError(emailInput);
    clearError(passwordInput);

    // Validate Email
    if (emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    // Validate Password
    if (passwordInput.value.trim() === "") {
      showError(passwordInput, "Password is required");
      isValid = false;
    }

    if (isValid) {
      // Save email if Remember me is checked
      if (rememberCheckbox.checked) {
        localStorage.setItem("savedEmail", emailInput.value.trim());
      } else {
        localStorage.removeItem("savedEmail");
      }

      // Simulated successful login
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "dashboard.html"; // Change to your actual dashboard page
    }
  });
});
