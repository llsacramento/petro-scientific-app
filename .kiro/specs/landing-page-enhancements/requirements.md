# Requirements Document

## Introduction

This document specifies the requirements for four enhancements to the existing PetroScientific static landing page SPA: replacing the text-based logo with a microscope icon SVG, adding a favicon, implementing scroll-triggered animations, and adding a dark mode toggle with preference persistence. The landing page is built with vanilla HTML/CSS/JS and Tailwind CSS via CDN — no framework or build step is involved.

## Glossary

- **Landing_Page**: The single-page static website located in the `landing-page/` directory, consisting of `index.html`, `styles.css`, `main.js`, and assets
- **Logo_SVG**: The SVG file at `landing-page/assets/logo.svg` used as the brand identity in the navigation bar
- **Favicon**: A small icon displayed in the browser tab, bookmarks, and other browser UI surfaces to identify the site
- **Scroll_Animation_Controller**: The JavaScript module responsible for observing element visibility and triggering CSS animations as sections enter the viewport
- **Dark_Mode_Toggle**: A UI control (button) that switches the site between light and dark color themes
- **Theme_Preference_Store**: The mechanism (localStorage) used to persist the user's selected color theme across page loads
- **Viewport**: The visible area of the browser window in which the landing page content is rendered
- **IntersectionObserver**: A browser API that asynchronously observes changes in the intersection of a target element with the viewport
- **prefers-color-scheme**: A CSS media query that detects the user's operating system color scheme preference (light or dark)

## Requirements

### Requirement 1: Microscope Logo SVG

**User Story:** As a site visitor, I want to see a microscope icon in the PetroScientific logo, so that the brand identity clearly communicates the scientific instrument focus of the company.

#### Acceptance Criteria

1. THE Logo_SVG SHALL display a microscope icon composed of identifiable parts (eyepiece, body tube, stage, and base) within the left icon area, alongside the "PetroScientific" text and "Quality Control Services" tagline
2. THE Logo_SVG SHALL maintain a viewBox of 200x50 and render clearly at the navigation bar height of 40px (h-10 class)
3. THE Logo_SVG SHALL use the existing brand color palette (primary: #1e3a5f, accent: #4a6fa5, white: #ffffff)
4. THE Logo_SVG SHALL preserve its aspect ratio using a width of "auto" so that no element is stretched or cropped at viewport widths from 320px to 1920px
5. THE Logo_SVG SHALL remain accessible by retaining the alt text value "PetroScientific Quality Control Services logo" on the `<img>` element that references it
6. WHEN the Logo_SVG is rendered, THE Logo_SVG SHALL position the microscope icon within the first 42px of horizontal space (the existing icon area) so that it does not overlap the adjacent text elements

### Requirement 2: Favicon

**User Story:** As a site visitor, I want to see a PetroScientific icon in my browser tab, so that I can easily identify the site among multiple open tabs.

#### Acceptance Criteria

1. THE Landing_Page SHALL include a favicon that displays a microscope icon visually consistent with the Logo_SVG
2. THE Landing_Page SHALL reference the favicon via a `<link rel="icon" type="image/svg+xml">` element in the HTML `<head>` with an `href` attribute pointing to a valid file path
3. THE favicon SHALL use SVG format with a viewBox that renders without distortion at 16x16 and 32x32 pixel display sizes
4. THE favicon SVG file SHALL have a total file size of no more than 10KB

### Requirement 3: Scroll-Triggered Animations

**User Story:** As a site visitor, I want page sections to animate into view as I scroll down, so that the browsing experience feels polished and engaging.

#### Acceptance Criteria

1. WHEN a content section (services, why-choose-us, inquiry-form) enters the Viewport, THE Scroll_Animation_Controller SHALL trigger a fade-in and upward-slide animation on that section with a duration of 600 milliseconds and a vertical translation distance of 20px
2. THE Scroll_Animation_Controller SHALL use the IntersectionObserver API to detect when sections become visible
3. THE Scroll_Animation_Controller SHALL trigger animations when at least 10% of a section is visible in the Viewport
4. THE Scroll_Animation_Controller SHALL animate each section only once (the animation does not replay when scrolling back up and down again)
5. WHILE the page initially loads, THE Landing_Page SHALL display sections above the fold (hero, navbar) in their final visible state immediately without any animation applied
6. THE Scroll_Animation_Controller SHALL apply animations using CSS classes to enable GPU-accelerated transitions
7. IF the browser does not support IntersectionObserver, THEN THE Landing_Page SHALL display all sections in their final visible state without animation
8. WHILE the user has enabled reduced motion preferences (prefers-reduced-motion: reduce), THE Scroll_Animation_Controller SHALL skip all animations and display sections in their final visible state immediately
9. WHILE a content section (services, why-choose-us, inquiry-form) has not yet entered the Viewport, THE Scroll_Animation_Controller SHALL render that section with opacity 0 and translated 20px below its final position, while preserving the section's occupied layout space

### Requirement 4: Dark Mode Toggle

**User Story:** As a site visitor, I want to switch between light and dark color themes, so that I can browse the site comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a Dark_Mode_Toggle button in the navigation bar, visible on both desktop and mobile layouts
2. WHEN the user clicks the Dark_Mode_Toggle, THE Landing_Page SHALL switch all page colors from the current theme to the opposite theme (light to dark, or dark to light) within 300 milliseconds
3. THE Dark_Mode_Toggle SHALL display a sun icon when dark mode is active (indicating the action to switch to light) and a moon icon when light mode is active (indicating the action to switch to dark)
4. WHEN the user selects a theme via the Dark_Mode_Toggle, THE Landing_Page SHALL save the selection to localStorage under a dedicated theme preference key
5. WHEN the Landing_Page loads, THE Landing_Page SHALL check localStorage for a previously saved theme preference and apply it before page content renders visibly
6. IF no saved preference exists in localStorage, THEN THE Landing_Page SHALL check the prefers-color-scheme media query and apply the matching theme
7. IF neither a saved preference nor a system preference is available, THEN THE Landing_Page SHALL default to light mode
8. THE Dark_Mode_Toggle SHALL be operable via keyboard (Enter and Space keys to activate) and include an aria-label describing its current action (e.g., "Switch to dark mode" or "Switch to light mode")
9. WHILE dark mode is active, THE Landing_Page SHALL apply dark background colors, light text colors, and adjusted border/shadow colors that maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
10. THE Landing_Page SHALL apply the saved theme before the page content renders visibly to prevent a flash of the wrong theme
11. IF localStorage is unavailable or a read/write operation fails, THEN THE Landing_Page SHALL fall back to the prefers-color-scheme media query for theme selection and allow theme toggling for the current session without persisting the preference
