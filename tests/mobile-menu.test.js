import { describe, it, expect, beforeEach } from 'vitest';

// Import the function under test
const { toggleMobileMenu } = require('../landing-page/main.js');

describe('toggleMobileMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button
        id="mobile-menu-button"
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
      >
        Menu
      </button>
      <div id="mobile-menu" class="hidden">
        <a href="#hero">Home</a>
        <a href="#services">Services</a>
      </div>
    `;
  });

  it('should open the menu when it is closed', () => {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    toggleMobileMenu();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.classList.contains('hidden')).toBe(false);
  });

  it('should close the menu when it is open', () => {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    // Open first
    toggleMobileMenu();
    // Then close
    toggleMobileMenu();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.classList.contains('hidden')).toBe(true);
  });

  it('should do nothing if menu element is missing', () => {
    document.body.innerHTML = `
      <button id="mobile-menu-button" aria-expanded="false">Menu</button>
    `;

    // Should not throw
    expect(() => toggleMobileMenu()).not.toThrow();
  });

  it('should do nothing if button element is missing', () => {
    document.body.innerHTML = `
      <div id="mobile-menu" class="hidden">Links</div>
    `;

    // Should not throw
    expect(() => toggleMobileMenu()).not.toThrow();
  });

  it('should close menu on Escape key press when menu is open', () => {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    // Simulate DOMContentLoaded to wire up event listeners
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Open the menu
    toggleMobileMenu();
    expect(button.getAttribute('aria-expanded')).toBe('true');

    // Press Escape
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.classList.contains('hidden')).toBe(true);
  });

  it('should not close menu on Escape key press when menu is already closed', () => {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    // Simulate DOMContentLoaded to wire up event listeners
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Menu is closed by default
    expect(button.getAttribute('aria-expanded')).toBe('false');

    // Press Escape - should not change anything
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.classList.contains('hidden')).toBe(true);
  });

  it('should toggle via click event on hamburger button', () => {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    // Simulate DOMContentLoaded to wire up event listeners
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Click the button
    button.click();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(menu.classList.contains('hidden')).toBe(false);

    // Click again to close
    button.click();

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menu.classList.contains('hidden')).toBe(true);
  });
});
