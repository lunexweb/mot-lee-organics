export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export class ValidationService {
  static validateField(value: any, rules: ValidationRule, fieldName: string): string | null {
    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${fieldName} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String length validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${fieldName} must be no more than ${rules.maxLength} characters`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `${fieldName} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `${fieldName} must be no more than ${rules.max}`;
      }
    }

    // Email validation
    if (rules.email && typeof value === 'string') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Phone validation (South African format)
    if (rules.phone && typeof value === 'string') {
      const phonePattern = /^(\+27|0)[0-9]{9}$/;
      if (!phonePattern.test(value.replace(/\s/g, ''))) {
        return 'Please enter a valid South African phone number';
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string') {
      if (!rules.pattern.test(value)) {
        return `${fieldName} format is invalid`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }

  static validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationErrors {
    const errors: ValidationErrors = {};

    for (const [fieldName, fieldRules] of Object.entries(rules)) {
      const error = this.validateField(data[fieldName], fieldRules, fieldName);
      if (error) {
        errors[fieldName] = error;
      }
    }

    return errors;
  }

  static sanitizeInput(value: any): any {
    if (typeof value === 'string') {
      return value
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
    }
    return value;
  }

  static sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = this.sanitizeInput(value);
    }
    
    return sanitized;
  }
}

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    email: true,
    maxLength: 255
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/
  },
  phone: {
    required: true,
    phone: true
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/
  },
  postalCode: {
    required: true,
    pattern: /^[0-9]{4}$/
  },
  price: {
    required: true,
    min: 0.01,
    max: 10000
  },
  stock: {
    required: true,
    min: 0,
    max: 10000
  },
  rating: {
    min: 1,
    max: 5
  },
  reviewTitle: {
    required: true,
    minLength: 5,
    maxLength: 100
  },
  reviewComment: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  couponCode: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[A-Z0-9]+$/
  }
};
