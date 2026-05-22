/**
 * PetroScientific Landing Page - Main JavaScript
 *
 * Provides form validation, form submission (Formspree),
 * smooth scrolling, and mobile menu functionality.
 */

// ===== Form Validation =====

/**
 * Constraints for each form field.
 * Used by validateField() to determine validation rules.
 */
const FORM_CONSTRAINTS = {
  name: { maxLength: 100, required: true },
  email: { maxLength: 254, required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { maxLength: 20, required: false },
  company: { maxLength: 100, required: false },
  message: { maxLength: 2000, required: true }
};

/**
 * Field labels used in error messages.
 */
const FIELD_LABELS = {
  name: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  company: 'Company',
  message: 'Message'
};

/**
 * Validates a single form field against its constraints.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field element to validate
 * @returns {string|null} Error message string if invalid, or null if valid
 */
function validateField(field) {
  const fieldName = field.getAttribute('name');
  const constraints = FORM_CONSTRAINTS[fieldName];

  if (!constraints) {
    return null;
  }

  const value = field.value;
  const label = FIELD_LABELS[fieldName] || fieldName;

  // Check required: must have at least 1 non-whitespace character
  if (constraints.required && value.trim() === '') {
    return label + ' is required';
  }

  // Check pattern (only if field has a value)
  if (constraints.pattern && value.trim() !== '' && !constraints.pattern.test(value)) {
    return 'Please enter a valid email address';
  }

  return null;
}

/**
 * Validates all form fields and displays error messages.
 * Returns true if the entire form is valid.
 *
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateForm(form) {
  var isValid = true;

  Object.keys(FORM_CONSTRAINTS).forEach(function(fieldName) {
    var field = form.elements[fieldName];
    if (field) {
      var error = validateField(field);
      showFieldError(field, error);
      if (error !== null) {
        isValid = false;
      }
    }
  });

  return isValid;
}

/**
 * Displays or clears an inline error message for a form field.
 * Sets aria-invalid and manages the error span's text content.
 *
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field element
 * @param {string|null} message - Error message to display, or null to clear
 */
function showFieldError(field, message) {
  var errorSpan = document.getElementById(field.id + '-error');

  if (message) {
    field.setAttribute('aria-invalid', 'true');
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  } else {
    field.removeAttribute('aria-invalid');
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  }
}

// ===== Form Submission =====

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgvbvkb";
const SUBMISSION_TIMEOUT_MS = 30000;

/**
 * Submits form data to Formspree via fetch POST.
 * Handles timeout via AbortController (30s).
 * @param {Object} formData - { name, email, phone, company, message }
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
async function submitToFormspree(formData) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SUBMISSION_TIMEOUT_MS);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { ok: false, error: "Something went wrong. Please try again later." };
    }
    return { ok: true };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return { ok: false, error: "The request timed out. Please try again." };
    }
    return { ok: false, error: "Unable to submit your inquiry. Please check your connection and try again." };
  }
}

/**
 * Displays a success or error message in the form area.
 * Creates a styled div that appears above or below the form.
 *
 * @param {'success'|'error'} type - The type of message to display
 * @param {string} message - The message text to show
 */
function showFormMessage(type, message) {
  const form = document.getElementById('inquiry-form-element');
  if (!form) return;

  // Remove any existing form message
  var existing = document.getElementById('form-message');
  if (existing) {
    existing.remove();
  }

  var messageDiv = document.createElement('div');
  messageDiv.id = 'form-message';
  messageDiv.setAttribute('role', 'alert');
  messageDiv.setAttribute('aria-live', 'polite');
  messageDiv.textContent = message;

  if (type === 'success') {
    messageDiv.className = 'p-4 mb-4 rounded-lg bg-green-50 border border-green-200 text-green-800';
  } else {
    messageDiv.className = 'p-4 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800';
  }

  form.parentNode.insertBefore(messageDiv, form);
}

// ===== Mobile Menu =====

/**
 * Toggles the mobile navigation menu open/closed.
 * Updates aria-expanded attribute on the hamburger button
 * and shows/hides the mobile menu panel.
 */
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const button = document.getElementById('mobile-menu-button');

  if (!menu || !button) return;

  const isExpanded = button.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    // Close menu
    menu.classList.add('hidden');
    button.setAttribute('aria-expanded', 'false');
  } else {
    // Open menu
    menu.classList.remove('hidden');
    button.setAttribute('aria-expanded', 'true');
  }
}

// ===== Scroll Animations =====

/**
 * Initializes scroll-triggered animations using IntersectionObserver.
 * Sections with [data-animate] attribute will fade in when 10% visible.
 * Respects prefers-reduced-motion and gracefully degrades without IO support.
 */
function initScrollAnimations() {
  var elements = document.querySelectorAll('[data-animate]');

  if (elements.length === 0) {
    return;
  }

  // If prefers-reduced-motion: reduce is active, skip all animations
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  // If IntersectionObserver is not supported, leave sections in final visible state
  if (typeof IntersectionObserver === 'undefined') {
    return;
  }

  // Add .animate-hidden to all [data-animate] elements
  elements.forEach(function(el) {
    el.classList.add('animate-hidden');
  });

  // Create IntersectionObserver with threshold: 0.1
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('animate-hidden');
        entry.target.classList.add('animate-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe all [data-animate] elements
  elements.forEach(function(el) {
    observer.observe(el);
  });
}

// ===== Dark Mode Toggle =====

/**
 * Resolves the initial theme based on priority:
 * 1. localStorage saved preference ('ps-theme')
 * 2. prefers-color-scheme media query
 * 3. Default: "light"
 * @returns {"light" | "dark"}
 */
function resolveTheme() {
  try {
    var saved = localStorage.getItem('ps-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch (e) {
    // localStorage unavailable, fall through to system preference
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Applies the given theme by toggling the "dark" class on <html>.
 * Updates the toggle button icon and aria-label.
 * @param {"light" | "dark"} theme
 */
function applyTheme(theme) {
  var html = document.documentElement;

  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  var toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    if (theme === 'dark') {
      toggleButton.setAttribute('aria-label', 'Switch to light mode');
    } else {
      toggleButton.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

/**
 * Persists the theme preference to localStorage.
 * Silently fails if localStorage is unavailable.
 * @param {"light" | "dark"} theme
 */
function saveThemePreference(theme) {
  try {
    localStorage.setItem('ps-theme', theme);
  } catch (e) {
    // localStorage unavailable, silently fail
  }
}

/**
 * Initializes the dark mode toggle button.
 * Resolves the current theme, applies it, and registers the click handler.
 */
function initDarkModeToggle() {
  var theme = resolveTheme();
  applyTheme(theme);

  var toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      var currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      saveThemePreference(newTheme);
    });
  }
}

// ===== Event Listener Setup =====
document.addEventListener('DOMContentLoaded', function () {
  // Initialize scroll animations
  initScrollAnimations();

  // Initialize dark mode toggle
  initDarkModeToggle();

  // Mobile menu button click listener
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on Escape key press
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      const button = document.getElementById('mobile-menu-button');
      if (button && button.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu();
        button.focus();
      }
    }
  });

  // Form event listeners
  const form = document.getElementById('inquiry-form-element');
  if (form) {
    // Real-time validation on blur and input for required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function(field) {
      field.addEventListener('blur', function() {
        const error = validateField(field);
        showFieldError(field, error);
      });
      field.addEventListener('input', function() {
        // Only clear error on input if field was previously invalid
        if (field.getAttribute('aria-invalid') === 'true') {
          const error = validateField(field);
          showFieldError(field, error);
        }
      });
    });

    // Form submit handler
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Remove any existing form message
      var existing = document.getElementById('form-message');
      if (existing) {
        existing.remove();
      }

      // Validate form before submission
      if (!validateForm(form)) {
        return;
      }

      // Gather form data
      var formData = {
        name: form.elements['name'].value,
        email: form.elements['email'].value,
        phone: form.elements['phone'].value,
        company: form.elements['company'].value,
        message: form.elements['message'].value
      };

      // Disable submit button and show loading indicator
      var submitButton = form.querySelector('button[type="submit"]');
      var originalButtonText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      // Submit to Formspree
      var result = await submitToFormspree(formData);

      if (result.ok) {
        // Success: show confirmation and reset form
        showFormMessage('success', 'Thank you for your inquiry! We will get back to you shortly.');
        form.reset();
      } else {
        // Error: show error message, retain form data, re-enable button
        showFormMessage('error', result.error);
      }

      // Re-enable submit button and restore text
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // Smooth scroll navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });

          // Close mobile menu if open
          const menuButton = document.getElementById('mobile-menu-button');
          if (menuButton && menuButton.getAttribute('aria-expanded') === 'true') {
            toggleMobileMenu();
          }
        }
      }
    });
  });
});

// Export for testing
if (typeof module !== 'undefined') {
  module.exports = {
    FORM_CONSTRAINTS,
    FIELD_LABELS,
    FORMSPREE_ENDPOINT,
    SUBMISSION_TIMEOUT_MS,
    validateField,
    validateForm,
    showFieldError,
    submitToFormspree,
    showFormMessage,
    toggleMobileMenu,
    initScrollAnimations,
    resolveTheme,
    applyTheme,
    saveThemePreference,
    initDarkModeToggle
  };
}
