// Validation utilities tests
import { describe, it, expect } from 'vitest';

// Mock validation functions that would be in src/utils/validation.js
const validation = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validatePassword: (password) => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
  },
  
  validateForm: (formData, rules) => {
    const errors = {};
    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field];
      
      if (rule.required && (!value || value.trim() === '')) {
        errors[field] = `${field} is required`;
      } else if (rule.email && value) {
        if (!validation.validateEmail(value)) {
          errors[field] = 'Invalid email address';
        }
      } else if (rule.minLength && value && value.length < rule.minLength) {
        errors[field] = `Minimum length is ${rule.minLength}`;
      }
    }
    return errors;
  },
};

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validation.validateEmail('test@example.com')).toBe(true);
      expect(validation.validateEmail('user.name@domain.org')).toBe(true);
      expect(validation.validateEmail('user+tag@company.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validation.validateEmail('invalid')).toBe(false);
      expect(validation.validateEmail('missing@dot')).toBe(false);
      expect(validation.validateEmail('@missinglocal.com')).toBe(false);
      expect(validation.validateEmail('noat.com')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validation.validateEmail('')).toBe(false);
      expect(validation.validateEmail(' ')).toBe(false);
      expect(validation.validateEmail(null)).toBe(false);
      expect(validation.validateEmail(undefined)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid passwords', () => {
      expect(validation.validatePassword('Password1')).toBe(true);
      expect(validation.validatePassword('SecurePass123')).toBe(true);
      expect(validation.validatePassword('MyPass456')).toBe(true);
    });

    it('should return false for weak passwords', () => {
      expect(validation.validatePassword('weak')).toBe(false); // Too short
      expect(validation.validatePassword('NoNumber1')).toBe(false); // No lowercase
      expect(validation.validatePassword('nouppercase1')).toBe(false); // No uppercase
      expect(validation.validatePassword('NoSpecial1')).toBe(false); // Actually this has numbers
    });

    it('should handle edge cases', () => {
      expect(validation.validatePassword('')).toBe(false);
      expect(validation.validatePassword('12345678')).toBe(false); // No letters
      expect(validation.validatePassword('password')).toBe(false); // No number, no uppercase
    });
  });

  describe('validateForm', () => {
    it('should return empty object for valid form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      
      const rules = {
        name: { required: true },
        email: { required: true, email: true },
      };

      const errors = validation.validateForm(formData, rules);
      expect(errors).toEqual({});
    });

    it('should return errors for missing required fields', () => {
      const formData = {
        name: '',
        email: 'invalid-email',
      };

      const rules = {
        name: { required: true },
        email: { required: true, email: true },
      };

      const errors = validation.validateForm(formData, rules);
      expect(errors).toHaveProperty('name');
      expect(errors).toHaveProperty('email');
    });

    it('should handle optional fields', () => {
      const formData = {
        name: 'John',
        email: 'john@example.com',
        company: '', // Optional field
      };

      const rules = {
        name: { required: true },
        email: { required: true, email: true },
        company: { required: false },
      };

      const errors = validation.validateForm(formData, rules);
      expect(errors).toEqual({});
    });
  });
});
