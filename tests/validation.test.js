/**
 * Unit tests for form validation functions in main.js
 */
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const mod = require('../landing-page/main.js');

describe('FORM_CONSTRAINTS', () => {
  it('defines constraints for all expected fields', () => {
    expect(mod.FORM_CONSTRAINTS).toHaveProperty('name');
    expect(mod.FORM_CONSTRAINTS).toHaveProperty('email');
    expect(mod.FORM_CONSTRAINTS).toHaveProperty('phone');
    expect(mod.FORM_CONSTRAINTS).toHaveProperty('company');
    expect(mod.FORM_CONSTRAINTS).toHaveProperty('message');
  });

  it('marks name, email, message as required', () => {
    expect(mod.FORM_CONSTRAINTS.name.required).toBe(true);
    expect(mod.FORM_CONSTRAINTS.email.required).toBe(true);
    expect(mod.FORM_CONSTRAINTS.message.required).toBe(true);
  });

  it('marks phone and company as optional', () => {
    expect(mod.FORM_CONSTRAINTS.phone.required).toBe(false);
    expect(mod.FORM_CONSTRAINTS.company.required).toBe(false);
  });

  it('defines email pattern as a RegExp', () => {
    expect(mod.FORM_CONSTRAINTS.email.pattern).toBeInstanceOf(RegExp);
    expect(mod.FORM_CONSTRAINTS.email.pattern.test('user@example.com')).toBe(true);
  });
});

describe('validateField', () => {
  function createField(name, value) {
    const field = document.createElement('input');
    field.setAttribute('name', name);
    field.value = value;
    return field;
  }

  it('returns error for empty required field (name)', () => {
    const field = createField('name', '');
    expect(mod.validateField(field)).toBe('Full Name is required');
  });

  it('returns error for whitespace-only required field (name)', () => {
    const field = createField('name', '   ');
    expect(mod.validateField(field)).toBe('Full Name is required');
  });

  it('returns null for valid required field (name)', () => {
    const field = createField('name', 'John Doe');
    expect(mod.validateField(field)).toBeNull();
  });

  it('returns error for empty required field (message)', () => {
    const field = document.createElement('textarea');
    field.setAttribute('name', 'message');
    field.value = '';
    expect(mod.validateField(field)).toBe('Message is required');
  });

  it('returns null for valid message', () => {
    const field = document.createElement('textarea');
    field.setAttribute('name', 'message');
    field.value = 'I need a quote for calibration.';
    expect(mod.validateField(field)).toBeNull();
  });

  it('returns error for invalid email pattern', () => {
    const field = createField('email', 'notanemail');
    expect(mod.validateField(field)).toBe('Please enter a valid email address');
  });

  it('returns error for email missing domain dot', () => {
    const field = createField('email', 'user@domain');
    expect(mod.validateField(field)).toBe('Please enter a valid email address');
  });

  it('returns null for valid email', () => {
    const field = createField('email', 'user@example.com');
    expect(mod.validateField(field)).toBeNull();
  });

  it('returns error for empty email (required check first)', () => {
    const field = createField('email', '');
    expect(mod.validateField(field)).toBe('Email is required');
  });

  it('returns null for optional field left empty', () => {
    const field = createField('phone', '');
    expect(mod.validateField(field)).toBeNull();
  });

  it('returns null for optional field with value', () => {
    const field = createField('company', 'Acme Corp');
    expect(mod.validateField(field)).toBeNull();
  });

  it('returns null for unknown field name', () => {
    const field = createField('unknown', 'anything');
    expect(mod.validateField(field)).toBeNull();
  });
});

describe('validateForm', () => {
  function createForm() {
    const form = document.createElement('form');
    form.innerHTML = `
      <input id="name" name="name" value="">
      <span id="name-error"></span>
      <input id="email" name="email" value="">
      <span id="email-error"></span>
      <input id="phone" name="phone" value="">
      <span id="phone-error"></span>
      <input id="company" name="company" value="">
      <span id="company-error"></span>
      <textarea id="message" name="message"></textarea>
      <span id="message-error"></span>
    `;
    document.body.appendChild(form);
    return form;
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns false when required fields are empty', () => {
    const form = createForm();
    expect(mod.validateForm(form)).toBe(false);
  });

  it('returns true when all required fields are valid', () => {
    const form = createForm();
    form.elements['name'].value = 'John Doe';
    form.elements['email'].value = 'john@example.com';
    form.elements['message'].value = 'Hello there';
    expect(mod.validateForm(form)).toBe(true);
  });

  it('returns false when email is invalid', () => {
    const form = createForm();
    form.elements['name'].value = 'John Doe';
    form.elements['email'].value = 'invalid-email';
    form.elements['message'].value = 'Hello there';
    expect(mod.validateForm(form)).toBe(false);
  });

  it('sets error messages on invalid fields', () => {
    const form = createForm();
    mod.validateForm(form);
    const nameError = document.getElementById('name-error');
    expect(nameError.textContent).toBe('Full Name is required');
  });

  it('clears error messages on valid fields', () => {
    const form = createForm();
    form.elements['name'].value = 'John';
    form.elements['email'].value = 'john@example.com';
    form.elements['message'].value = 'Hi';
    mod.validateForm(form);
    const nameError = document.getElementById('name-error');
    expect(nameError.textContent).toBe('');
  });
});

describe('showFieldError', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function createFieldWithError(id) {
    const container = document.createElement('div');
    container.innerHTML = `
      <input id="${id}" name="${id}">
      <span id="${id}-error"></span>
    `;
    document.body.appendChild(container);
    return document.getElementById(id);
  }

  it('sets aria-invalid and error text when message is provided', () => {
    const field = createFieldWithError('name');
    mod.showFieldError(field, 'Full Name is required');

    expect(field.getAttribute('aria-invalid')).toBe('true');
    const errorSpan = document.getElementById('name-error');
    expect(errorSpan.textContent).toBe('Full Name is required');
  });

  it('removes aria-invalid and clears error text when message is null', () => {
    const field = createFieldWithError('email');
    // First set an error
    mod.showFieldError(field, 'Email is required');
    // Then clear it
    mod.showFieldError(field, null);

    expect(field.hasAttribute('aria-invalid')).toBe(false);
    const errorSpan = document.getElementById('email-error');
    expect(errorSpan.textContent).toBe('');
  });

  it('handles missing error span gracefully', () => {
    const field = document.createElement('input');
    field.id = 'nonexistent';
    field.setAttribute('name', 'nonexistent');
    document.body.appendChild(field);

    // Should not throw
    expect(() => mod.showFieldError(field, 'Some error')).not.toThrow();
    expect(field.getAttribute('aria-invalid')).toBe('true');
  });
});
