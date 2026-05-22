# Implementation Plan: Landing Page Enhancements

## Overview

Implement four enhancements to the PetroScientific static landing page: replace the text-based logo with a microscope icon SVG, add a matching favicon, implement scroll-triggered animations using IntersectionObserver, and add a dark mode toggle with localStorage persistence. All changes target the existing vanilla HTML/CSS/JS files in `landing-page/` using Tailwind CSS via CDN.

## Tasks

- [x] 1. Replace logo SVG and add favicon
  - [x] 1.1 Create new microscope icon logo SVG
    - Replace `landing-page/assets/logo.svg` with a new SVG containing a microscope icon (eyepiece, body tube, stage, base) within the first 42px of horizontal space
    - Retain viewBox of `200x50`, brand colors (#1e3a5f, #4a6fa5, #ffffff), "PetroScientific" text at x:52, and "Quality Control Services" tagline
    - Ensure the microscope icon does not overlap adjacent text elements
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 Create favicon SVG file
    - Create `landing-page/assets/favicon.svg` with a simplified microscope icon optimized for 16x16 and 32x32 display
    - Use a square viewBox (e.g., `0 0 32 32`), brand primary color (#1e3a5f), file size ≤ 10KB
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 1.3 Add favicon link to HTML head
    - Add `<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">` to the `<head>` section of `landing-page/index.html`
    - _Requirements: 2.2_

- [x] 2. Implement scroll-triggered animations
  - [x] 2.1 Add scroll animation CSS classes to styles.css
    - Add `.animate-hidden` class: `opacity: 0; transform: translateY(20px);`
    - Add `.animate-visible` class: `opacity: 1; transform: translateY(0); transition: opacity 0.6s ease-out, transform 0.6s ease-out;`
    - Add `@media (prefers-reduced-motion: reduce)` rule that sets `.animate-hidden` to `opacity: 1; transform: none;` and disables transitions
    - _Requirements: 3.1, 3.6, 3.8, 3.9_

  - [x] 2.2 Add data-animate attributes to HTML sections
    - Add `data-animate` attribute to the `#services`, `#why-choose-us`, and `#inquiry-form` sections in `landing-page/index.html`
    - Do NOT add `data-animate` to `#hero` or `nav` (above-the-fold elements must render immediately)
    - _Requirements: 3.1, 3.5_

  - [x] 2.3 Implement initScrollAnimations() in main.js
    - Create `initScrollAnimations()` function that uses IntersectionObserver with `threshold: 0.1`
    - On DOMContentLoaded, add `.animate-hidden` class to all `[data-animate]` elements
    - When an element intersects (≥10% visible), replace `.animate-hidden` with `.animate-visible` and unobserve the element (animate once)
    - If `IntersectionObserver` is not supported, leave all sections in their final visible state (do not add `.animate-hidden`)
    - If `prefers-reduced-motion: reduce` is active, skip adding `.animate-hidden` and do not create the observer
    - Call `initScrollAnimations()` from the existing DOMContentLoaded handler
    - Export `initScrollAnimations` for testing
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [ ]* 2.4 Write unit tests for scroll animation controller
    - Test that `initScrollAnimations()` creates IntersectionObserver with `threshold: 0.1`
    - Test that `.animate-hidden` is applied to `[data-animate]` elements on init
    - Test that `.animate-visible` replaces `.animate-hidden` when observer fires
    - Test graceful degradation when IntersectionObserver is undefined
    - Test that animations are skipped when `prefers-reduced-motion: reduce` is active
    - Create test file: `tests/scroll-animations.test.js`
    - _Requirements: 3.2, 3.4, 3.7, 3.8_

- [x] 3. Checkpoint - Verify logo, favicon, and scroll animations
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement dark mode toggle
  - [x] 4.1 Configure Tailwind dark mode class strategy
    - Add Tailwind config script in `landing-page/index.html` (before the CDN script or via `tailwind.config`) to set `darkMode: 'class'`
    - _Requirements: 4.9_

  - [x] 4.2 Add inline theme initialization script in HTML head
    - Add an inline `<script>` block in the `<head>` of `landing-page/index.html` (after Tailwind CDN, before body)
    - The script reads `localStorage.getItem('ps-theme')`, falls back to `prefers-color-scheme`, defaults to "light"
    - If theme is "dark", adds `class="dark"` to `<html>` element synchronously before body renders
    - Wrap localStorage access in try/catch for graceful degradation
    - _Requirements: 4.5, 4.6, 4.7, 4.10, 4.11_

  - [x] 4.3 Add dark mode toggle button to navigation bar
    - Add a toggle button in the nav bar (visible on both desktop and mobile layouts) in `landing-page/index.html`
    - Button displays a moon icon (in light mode) or sun icon (in dark mode) using inline SVG
    - Include `aria-label` describing the current action (e.g., "Switch to dark mode" / "Switch to light mode")
    - Ensure keyboard operability (Enter and Space keys activate)
    - _Requirements: 4.1, 4.3, 4.8_

  - [x] 4.4 Implement dark mode toggle logic in main.js
    - Implement `initDarkModeToggle()`, `resolveTheme()`, `applyTheme(theme)`, and `saveThemePreference(theme)` functions
    - `resolveTheme()`: priority is localStorage("ps-theme") → prefers-color-scheme → "light"
    - `applyTheme(theme)`: toggles "dark" class on `<html>`, updates button icon (sun/moon), updates aria-label
    - `saveThemePreference(theme)`: writes to localStorage with try/catch for graceful failure
    - Toggle click handler: determine current theme, switch to opposite, apply, and save
    - Call `initDarkModeToggle()` from the existing DOMContentLoaded handler
    - Export all dark mode functions for testing
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.11_

  - [x] 4.5 Add dark mode color styles
    - Add `dark:` variant classes to all sections in `landing-page/index.html` (nav, hero, services, why-choose-us, inquiry-form, footer)
    - Apply dark backgrounds (e.g., `dark:bg-gray-900`), light text (e.g., `dark:text-gray-100`), adjusted borders/shadows
    - Ensure WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text) in dark mode
    - Add theme transition CSS in `styles.css`: `body { transition: background-color 0.3s ease, color 0.3s ease; }`
    - _Requirements: 4.2, 4.9_

  - [ ]* 4.6 Write unit tests for dark mode toggle
    - Test `resolveTheme()` returns correct theme for: saved preference, system preference, no preference (default light)
    - Test `saveThemePreference()` writes correct value to localStorage
    - Test `applyTheme()` adds/removes "dark" class on `<html>` and updates aria-label
    - Test toggle click switches theme from light to dark and vice versa
    - Test graceful degradation when localStorage throws
    - Create test file: `tests/dark-mode.test.js`
    - _Requirements: 4.2, 4.4, 4.5, 4.6, 4.7, 4.11_

  - [ ]* 4.7 Write property test for theme toggle idempotence
    - **Property 1: Theme toggle idempotence**
    - For any initial theme state (light or dark), toggling twice returns to the original state
    - Use fast-check to generate random initial states, toggle twice, verify return to original
    - Tag: `Feature: landing-page-enhancements, Property 1: Theme toggle idempotence`
    - Create test file: `tests/dark-mode.property.test.js`
    - **Validates: Requirements 4.2**

  - [ ]* 4.8 Write property test for theme persistence round-trip
    - **Property 2: Theme persistence round-trip**
    - For any theme value ("light" or "dark"), saving via `saveThemePreference()` and then calling `resolveTheme()` returns the same value
    - Use fast-check to generate random theme values, save, resolve, verify match
    - Tag: `Feature: landing-page-enhancements, Property 2: Theme persistence round-trip`
    - Add to test file: `tests/dark-mode.property.test.js`
    - **Validates: Requirements 4.4, 4.5**

- [x] 5. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses Vitest with jsdom environment and fast-check for property-based tests
- All implementation is vanilla HTML/CSS/JS with Tailwind CSS via CDN (no build step)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "2.1", "4.1"] },
    { "id": 1, "tasks": ["1.3", "2.2", "4.2"] },
    { "id": 2, "tasks": ["2.3", "4.3"] },
    { "id": 3, "tasks": ["2.4", "4.4"] },
    { "id": 4, "tasks": ["4.5", "4.6"] },
    { "id": 5, "tasks": ["4.7", "4.8"] }
  ]
}
```
