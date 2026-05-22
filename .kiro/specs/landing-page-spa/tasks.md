# Implementation Plan: Landing Page SPA

## Overview

Transform the PetroScientific Angular application into a static landing page SPA using vanilla HTML, CSS, and JavaScript. The implementation removes all Angular infrastructure and replaces it with a flat set of static files: `index.html`, `styles.css`, `main.js`, and `assets/logo.svg`. Tailwind CSS is loaded via CDN, and the sole interactive element is a Formspree-powered inquiry form.

## Tasks

- [x] 1. Remove Angular infrastructure and set up static file structure
  - [x] 1.1 Remove Angular source files and configuration
    - Delete the `src/` directory (app components, main.ts, index.html, styles.scss)
    - Delete Angular configuration files: `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`
    - Delete `public/` directory
    - Delete `.angular/` cache directory
    - Remove Angular-specific entries from `.editorconfig` if present
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.2 Create new static project structure and package.json
    - Create `landing-page/` directory at project root with subdirectory `assets/`
    - Create a new minimal `package.json` at project root with only dev dependencies: `vitest`, `jsdom`, `fast-check`, `@vitest/coverage-v8`
    - Create `vitest.config.js` with jsdom environment and globals enabled
    - Create `tests/` directory for automated tests
    - _Requirements: 2.1, 2.2_

  - [x] 1.3 Create the base `index.html` with document structure and CDN links
    - Create `landing-page/index.html` with HTML5 doctype, charset, viewport meta
    - Include Tailwind CSS CDN script (`<script src="https://cdn.tailwindcss.com"></script>`)
    - Link `styles.css` stylesheet
    - Include `main.js` script with `defer` attribute
    - Add semantic structure: `<nav>`, `<main>`, `<footer>`
    - Set page title to "PetroScientific Quality Control Services"
    - _Requirements: 2.1, 3.1, 3.7, 6.1_

- [x] 2. Implement landing page content sections
  - [x] 2.1 Implement the navigation bar
    - Create `<nav id="navbar">` with company logo (`assets/logo.svg`) and anchor links to: `#hero`, `#services`, `#why-choose-us`, `#inquiry-form`, and footer
    - Add hamburger menu button (hidden on desktop, visible below 768px) with `aria-expanded` and `aria-controls` attributes
    - Add mobile menu panel (hidden by default) with vertical link list
    - Ensure all links have visible focus indicators
    - _Requirements: 3.1, 5.4, 6.5, 6.6_

  - [x] 2.2 Implement the Hero section
    - Create `<section id="hero">` with company value proposition headline (`<h1>`)
    - Add trust indicators: years of experience, instruments serviced count, ISO certification badge
    - Add CTA button linking to `#inquiry-form` with minimum 44×44px touch target
    - Use Tailwind responsive classes for layout adaptation
    - _Requirements: 3.2, 5.1, 5.3, 6.1_

  - [x] 2.3 Implement the Services section
    - Create `<section id="services">` with heading (`<h2>`)
    - Add service cards: Repair & Troubleshooting, Calibration & Validation, Genuine Spare Parts — each with title and description
    - Use Tailwind grid: single-column on mobile, two-column on tablet (md:), three-column on desktop (lg:)
    - _Requirements: 3.3, 5.1, 5.2, 5.3_

  - [x] 2.4 Implement the Why Choose Us section
    - Create `<section id="why-choose-us">` with heading (`<h2>`)
    - Add differentiator items: ISO 17025 certification, rapid response, genuine parts
    - Use responsive layout with Tailwind utilities
    - _Requirements: 3.4, 5.1, 5.3_

  - [x] 2.5 Implement the Footer
    - Create `<footer id="footer">` with company contact info (phone, email, physical address)
    - Add quick links to page sections
    - Add legal notices: copyright statement and privacy policy link
    - Use semantic markup and ensure keyboard accessibility
    - _Requirements: 3.5, 6.1, 6.5_

  - [x] 2.6 Create `styles.css` with custom animations and overrides
    - Add smooth scroll behavior (`html { scroll-behavior: smooth }`)
    - Add fade-in animation keyframes for section reveals
    - Add mobile menu transition styles (slide/fade)
    - Add focus-visible outline styles for keyboard navigation
    - Ensure no horizontal overflow at 320px minimum width
    - _Requirements: 3.6, 5.6, 6.6_

  - [x] 2.7 Create `assets/logo.svg` placeholder
    - Create a simple SVG logo placeholder for PetroScientific
    - Ensure the `<img>` tag in the navbar has descriptive `alt` text ("PetroScientific Quality Control Services logo")
    - _Requirements: 6.7_

- [x] 3. Checkpoint - Verify static page structure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement form validation and submission logic in `main.js`
  - [x] 4.1 Implement form validation functions
    - Create `FORM_CONSTRAINTS` object with field rules (maxLength, required, pattern)
    - Implement `validateField(field)` — returns error message string or null
    - Implement `validateForm(form)` — validates all fields, returns boolean
    - Implement `showFieldError(field, message)` — sets `aria-invalid`, `aria-describedby`, shows/hides inline error element
    - Required fields: name, email, message must have at least 1 non-whitespace character
    - Email pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
    - _Requirements: 4.2, 4.3, 4.4, 6.3_

  - [x] 4.2 Implement form submission with Formspree
    - Implement `submitToFormspree(formData)` using `fetch()` with JSON body
    - Add `AbortController` with 30-second timeout
    - Handle success: show confirmation message, call `form.reset()`
    - Handle errors: show error message, retain form data, re-enable submit button
    - Handle timeout (AbortError): show timeout-specific message
    - Disable submit button and show loading indicator during submission
    - _Requirements: 4.5, 4.6, 4.7, 4.8_

  - [x] 4.3 Wire form event listeners
    - Add `blur` and `input` event listeners on required fields for real-time validation
    - Add `submit` event listener on the form element with `preventDefault()`
    - Call `validateForm()` on submit; if valid, call `submitToFormspree()`
    - _Requirements: 4.2, 4.4, 4.8_

  - [ ]* 4.4 Write property tests for form validation (Property 1: Whitespace rejection)
    - **Property 1: Whitespace-only strings are rejected for required fields**
    - Use fast-check to generate arbitrary whitespace strings (spaces, tabs, newlines)
    - Verify `validateField` returns an error for each required field (name, email, message)
    - Minimum 100 iterations
    - **Validates: Requirements 4.2**

  - [ ]* 4.5 Write property tests for email validation (Property 2: Email pattern)
    - **Property 2: Email validation accepts valid patterns and rejects invalid ones**
    - Use fast-check to generate strings matching `local@domain.tld` pattern → verify accepted
    - Use fast-check to generate strings missing `@` or missing dot in domain → verify rejected
    - Minimum 100 iterations
    - **Validates: Requirements 4.3**

  - [ ]* 4.6 Write property tests for accessible error feedback (Property 3: ARIA attributes)
    - **Property 3: Invalid required fields produce accessible error feedback**
    - Use fast-check to generate invalid values for required fields
    - Call `showFieldError`, verify `aria-invalid="true"` is set on the field
    - Verify a visible error message element exists and is linked via `aria-describedby`
    - Minimum 100 iterations
    - **Validates: Requirements 4.4, 6.3**

- [x] 5. Implement smooth scrolling and mobile menu in `main.js`
  - [x] 5.1 Implement smooth scroll navigation
    - Implement `scrollToSection(selector)` using `element.scrollIntoView({ behavior: 'smooth' })`
    - Add click event listeners on all nav anchor links to call `scrollToSection`
    - Prevent default anchor behavior and use JS-driven smooth scroll
    - Close mobile menu after navigation link click
    - _Requirements: 3.6, 6.5_

  - [x] 5.2 Implement mobile menu toggle
    - Implement `toggleMobileMenu()` to show/hide the mobile nav panel
    - Toggle `aria-expanded` attribute on hamburger button
    - Add click event listener on hamburger button
    - Close menu on Escape key press
    - Ensure focus management: trap focus within menu when open (optional enhancement)
    - _Requirements: 5.4, 6.5, 6.6_

- [x] 6. Implement accessibility compliance
  - [x] 6.1 Implement the inquiry form HTML with accessible markup
    - Add `<section id="inquiry-form">` with heading (`<h2>`)
    - Create `<form>` with fields: Full Name, Email, Phone (optional), Company (optional), Message
    - Each `<input>`/`<textarea>` must have a unique `id` and a `<label for="...">` element
    - Add `maxlength` attributes matching constraints (100, 254, 20, 100, 2000)
    - Add `required` attribute on name, email, message fields
    - Add empty `<span>` elements for inline error messages with unique IDs for `aria-describedby`
    - Set minimum input height 44px and minimum width 280px via Tailwind/CSS
    - Submit button with minimum 44×44px touch target
    - _Requirements: 4.1, 5.5, 6.2, 6.3_

  - [ ]* 6.2 Write property tests for label association (Property 4: Form labels)
    - **Property 4: All form inputs have associated visible labels**
    - Parse the rendered inquiry form HTML in jsdom
    - For each `<input>` and `<textarea>`, verify a `<label>` exists with matching `for` attribute
    - **Validates: Requirements 6.2**

  - [ ]* 6.3 Write property tests for image alt text (Property 5: Alt attributes)
    - **Property 5: All images have appropriate alt text**
    - Parse the full page HTML in jsdom
    - For each `<img>` element, verify `alt` attribute exists and is non-empty for content images
    - **Validates: Requirements 6.7**

- [x] 7. Checkpoint - Verify all functionality and accessibility
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Final integration and cleanup
  - [x] 8.1 Verify responsive design across breakpoints
    - Confirm single-column layout below 768px
    - Confirm two-column services grid at 768px–1024px
    - Confirm three-column services grid and max-width 1280px above 1024px
    - Confirm no horizontal scrollbar at 320px viewport width
    - Confirm form inputs meet minimum size requirements (44px height, 280px width)
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6_

  - [x] 8.2 Verify color contrast and visual accessibility
    - Ensure text colors meet WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
    - Ensure focus indicators are visible on all interactive elements
    - Verify keyboard tab order matches visual layout (top-to-bottom)
    - _Requirements: 6.4, 6.5, 6.6_

  - [x] 8.3 Remove remaining Angular artifacts from project root
    - Remove `.angular/` directory if still present
    - Remove `karma.conf.js`, `tsconfig.spec.json` if still present
    - Update `.gitignore` to remove Angular-specific entries and add `node_modules/`, `coverage/`
    - Ensure final file structure matches: `landing-page/index.html`, `landing-page/styles.css`, `landing-page/main.js`, `landing-page/assets/logo.svg`, `package.json`, `vitest.config.js`, `tests/`
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The Formspree endpoint URL (`https://formspree.io/f/{FORM_ID}`) must be replaced with an actual form ID during implementation
- All JavaScript is vanilla ES6+ with no build step required
- Testing uses Vitest + jsdom + fast-check, run via `npx vitest --run`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7"] },
    { "id": 3, "tasks": ["6.1"] },
    { "id": 4, "tasks": ["4.1", "5.1", "5.2"] },
    { "id": 5, "tasks": ["4.2", "4.3"] },
    { "id": 6, "tasks": ["4.4", "4.5", "4.6", "6.2", "6.3"] },
    { "id": 7, "tasks": ["8.1", "8.2", "8.3"] }
  ]
}
```
