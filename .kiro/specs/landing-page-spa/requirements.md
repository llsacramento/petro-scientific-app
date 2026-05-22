# Requirements Document

## Introduction

This specification defines the complete rebuild of the PetroScientific Angular application from a multi-feature business application into a single-page landing page for a petroleum/scientific services company. All existing backend functionality, authentication, routing, and domain features (customers, instruments, service-requests, work-orders, scheduling, dashboard) will be removed. The resulting application will be a static landing page SPA with a Formspree-powered inquiry form as the sole interactive element.

## Glossary

- **Landing_Page**: The single-page application serving as the public-facing website for PetroScientific Quality Control Services
- **Inquiry_Form**: A contact form that collects visitor information and submits it to Formspree for processing
- **Formspree**: A third-party form submission service that receives form data via HTTP POST and delivers it as email notifications
- **SPA**: Single-Page Application — a web application that loads a single HTML page and dynamically updates content without full page reloads
- **Hero_Section**: The prominent top section of the landing page containing the primary headline, value proposition, and call-to-action
- **Services_Section**: The section displaying the company's core service offerings (repair, calibration, spare parts, training)
- **Footer**: The bottom section containing company contact information, quick links, and legal notices

## Requirements

### Requirement 1: Remove All Backend and Authentication Features

**User Story:** As a developer, I want all backend functionality, authentication, and domain features removed, so that the application becomes a clean single-page landing page with no unused code.

#### Acceptance Criteria

1. THE Landing_Page SHALL operate without any authentication guards, login components, user role management, or role-based directives (authGuard, roleGuard, has-role directive)
2. THE Landing_Page SHALL contain only a single root path route (`''`) and a wildcard route (`'**'`) that redirects to the root path, with no other route definitions
3. THE Landing_Page SHALL not import or reference any removed feature modules (customers, instruments, service-requests, work-orders, scheduling, dashboard, auth) and their corresponding directories SHALL not exist in the source tree
4. THE Landing_Page SHALL not depend on any backend API services, state management services, or data models from the removed features, including shared models (customer, instrument, service-request, work-order, invoice, parts, user, template), shared pipes (status-label, currency-format, date-format), and core services (core/api, core/auth, core/state) that exclusively served removed features
5. THE Landing_Page SHALL remove unused dependencies from package.json that were only required by removed features (chart.js, ng2-charts, date-fns)
6. WHEN the removal is complete, THE Landing_Page SHALL compile successfully with `ng build` producing zero errors and zero TypeScript compilation warnings related to missing imports or references

### Requirement 2: Single-Page Application Structure

**User Story:** As a developer, I want the application structured as a single-page app with no routing, so that the codebase is minimal and easy to maintain.

#### Acceptance Criteria

1. THE SPA SHALL render the Landing_Page component directly within the root AppComponent template without using Angular Router, without importing `@angular/router`, and without an `app.routes.ts` file
2. THE SPA SHALL use Angular 19 standalone component architecture with no NgModules (no `@NgModule` decorators in the codebase)
3. THE SPA SHALL compile and build successfully with zero errors and zero warnings under TypeScript strict mode (including `strictTemplates`, `strictInjectionParameters`, and `strictInputAccessModifiers`)
4. THE SPA SHALL maintain component-scoped SCSS files, a global `styles.scss` entry point, and Tailwind CSS utility classes via the existing PostCSS and Tailwind configuration
5. THE SPA SHALL meet Angular CLI production build budgets: initial bundle under 500kB warning threshold and each component style under 4kB warning threshold

### Requirement 3: Landing Page Content Sections

**User Story:** As a visitor, I want to see a professional landing page with clear information about PetroScientific's services, so that I can understand what the company offers.

#### Acceptance Criteria

1. THE Landing_Page SHALL display a navigation bar with the company logo and anchor links to the following sections: Hero_Section, Services_Section, Why Choose Us section, Inquiry_Form, and Footer
2. THE Landing_Page SHALL display a Hero_Section with the company value proposition headline, trust indicators (years of experience, number of instruments serviced, and ISO certification badge), and a call-to-action button directing visitors to the Inquiry_Form
3. THE Landing_Page SHALL display a Services_Section presenting the core service offerings (repair and troubleshooting, calibration and validation, genuine spare parts), each with a title and brief description
4. THE Landing_Page SHALL display a "Why Choose Us" section highlighting company differentiators (ISO 17025 certification, rapid response, genuine parts)
5. THE Landing_Page SHALL display a Footer with company contact information (phone number, email address, and physical address), quick links to page sections, and legal notices (copyright statement and privacy policy link)
6. WHEN a visitor clicks a navigation anchor link, THE Landing_Page SHALL smooth-scroll to the corresponding section
7. THE Landing_Page SHALL render sections in the following order from top to bottom: navigation bar, Hero_Section, Services_Section, Why Choose Us section, Inquiry_Form, and Footer

### Requirement 4: Inquiry Form with Formspree Integration

**User Story:** As a visitor, I want to submit an inquiry through a contact form, so that I can request services or ask questions without needing to create an account.

#### Acceptance Criteria

1. THE Inquiry_Form SHALL collect the visitor's full name (maximum 100 characters), email address (maximum 254 characters), phone number (optional, maximum 20 characters), company name (optional, maximum 100 characters), and message (maximum 2000 characters)
2. THE Inquiry_Form SHALL validate that full name, email address, and message fields each contain at least 1 non-whitespace character before allowing submission
3. THE Inquiry_Form SHALL validate that the email address field contains a value matching the pattern of local-part@domain.tld (at minimum: one or more characters, followed by @, followed by a domain with at least one dot separator)
4. IF a required field fails validation, THEN THE Inquiry_Form SHALL display an inline error message adjacent to the invalid field indicating the specific validation failure
5. WHEN the visitor submits a valid form, THE Inquiry_Form SHALL send the data via HTTP POST to the configured Formspree endpoint with a request timeout of 30 seconds
6. WHEN Formspree returns a successful response, THE Inquiry_Form SHALL display a confirmation message to the visitor and reset the form fields
7. IF Formspree returns an error response or the request times out, THEN THE Inquiry_Form SHALL display an error message indicating that submission failed, retain all entered form data, and allow the visitor to retry submission
8. WHILE the form submission is in progress, THE Inquiry_Form SHALL disable the submit button and display a loading indicator to prevent duplicate submissions

### Requirement 5: Responsive Design

**User Story:** As a visitor, I want the landing page to display correctly on mobile, tablet, and desktop devices, so that I can access the site from any device.

#### Acceptance Criteria

1. THE Landing_Page SHALL adapt its layout for mobile viewports (below 768px width) using a single-column layout where all content sections stack vertically
2. THE Landing_Page SHALL adapt its layout for tablet viewports (768px to 1024px width) using a two-column grid for the Services_Section and a single-column layout for the Hero_Section, Inquiry_Form, and Footer
3. THE Landing_Page SHALL adapt its layout for desktop viewports (above 1024px width) using up to a three-column grid for the Services_Section and constraining page content to a maximum width of 1280px centered horizontally
4. WHEN a visitor taps the hamburger menu icon on viewports below 768px width, THE Landing_Page SHALL toggle the navigation menu open or closed, displaying the anchor links in a vertical list
5. THE Inquiry_Form SHALL render input fields at a minimum height of 44px and a minimum width of 280px on all viewport sizes, and the submit button shall have a minimum touch target size of 44×44px
6. THE Landing_Page SHALL render without horizontal overflow or a horizontal scrollbar at any viewport width of 320px or greater

### Requirement 6: Accessibility

**User Story:** As a visitor using assistive technology, I want the landing page to be accessible, so that I can navigate and use the inquiry form regardless of ability.

#### Acceptance Criteria

1. THE Landing_Page SHALL use semantic HTML elements (nav, main, section, footer, h1-h6) to convey document structure
2. THE Inquiry_Form SHALL associate each input field with a visible label element using the for/id attribute pairing
3. IF a form field fails validation, THEN THE Inquiry_Form SHALL set aria-invalid="true" on the invalid field and associate a visible error message with that field using aria-describedby
4. THE Landing_Page SHALL maintain a minimum color contrast ratio of 4.5:1 for normal text (below 24px or below 18.67px bold) and 3:1 for large text (24px and above, or 18.67px bold and above) against background colors
5. THE Landing_Page SHALL allow all interactive elements (links, buttons, form inputs) to be reached and operated using keyboard-only interaction (Tab, Shift+Tab, Enter, Escape) in a top-to-bottom document order matching the visual layout
6. THE Landing_Page SHALL display a visible focus indicator on the currently focused interactive element when navigating via keyboard
7. THE Landing_Page SHALL provide descriptive alt text on all non-decorative images (including the company logo) and mark purely decorative images with an empty alt attribute
