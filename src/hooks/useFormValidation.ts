import { useState, useCallback } from 'react';
import { ValidationService, ValidationRule, ValidationErrors } from '@/utils/validation';

export interface UseFormValidationOptions {
  rules: Record<string, ValidationRule>;
  onSubmit?: (data: Record<string, any>) => void;
  sanitize?: boolean;
}

export const useFormValidation = (options: UseFormValidationOptions) => {
  const { rules, onSubmit, sanitize = true } = options;
  const [data, setData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((fieldName: string, value: any) => {
    const fieldRules = rules[fieldName];
    if (!fieldRules) return null;

    const error = ValidationService.validateField(value, fieldRules, fieldName);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }));
    return error;
  }, [rules]);

  const validateForm = useCallback(() => {
    const formErrors = ValidationService.validateForm(data, rules);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [data, rules]);

  const setFieldValue = useCallback((fieldName: string, value: any) => {
    const sanitizedValue = sanitize ? ValidationService.sanitizeInput(value) : value;
    setData(prev => ({
      ...prev,
      [fieldName]: sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  }, [errors, sanitize]);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setData({});
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);
    
    try {
      const isValid = validateForm();
      
      if (isValid && onSubmit) {
        const formData = sanitize ? ValidationService.sanitizeFormData(data) : data;
        await onSubmit(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validateForm, onSubmit, sanitize]);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName] || '';
  }, [errors]);

  const hasErrors = Object.values(errors).some(error => error !== '');

  return {
    data,
    errors,
    isSubmitting,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm,
    clearErrors,
    resetForm,
    handleSubmit,
    getFieldError,
    hasErrors
  };
};
