/**
 * Custom hook for form state that persists across sessions
 */
import { useState, useEffect, useCallback } from 'react';
import { useSession, useRecoveryPoint } from '../SessionContext';
import { debounce } from '../utils';

interface UseSessionFormOptions<T> {
  formId: string;
  initialValues: T;
  onSubmit?: (values: T) => Promise<void> | void;
  autoSave?: boolean;
  autoSaveInterval?: number;
  createRecoveryPointOnChange?: boolean;
}

/**
 * Hook for managing form state that persists across sessions
 */
export function useSessionForm<T extends Record<string, any>>({
  formId,
  initialValues,
  onSubmit,
  autoSave = true,
  autoSaveInterval = 2000,
  createRecoveryPointOnChange = false
}: UseSessionFormOptions<T>) {
  // State for form values
  const [values, setValues] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPristine, setIsPristine] = useState(true);
  
  const { saveSessionState, getSessionState } = useSession();
  const { createDebouncedRecoveryPoint } = useRecoveryPoint();
  
  // Key for saving form state
  const formStateKey = `form:${formId}`;
  
  // Load initial state from session
  useEffect(() => {
    const loadFormState = async () => {
      const savedState = await getSessionState<T | null>(formStateKey, null);
      
      if (savedState) {
        setValues(savedState);
        setIsPristine(false);
      }
    };
    
    loadFormState();
  }, [formId, getSessionState, formStateKey]);
  
  // Save form state when it changes
  useEffect(() => {
    if (autoSave && !isPristine) {
      const saveState = debounce(async () => {
        await saveSessionState(formStateKey, values);
      }, autoSaveInterval);
      
      saveState();
    }
  }, [values, isPristine, autoSave, autoSaveInterval, saveSessionState, formStateKey]);
  
  // Create recovery point when form changes significantly
  useEffect(() => {
    if (createRecoveryPointOnChange && !isPristine) {
      createDebouncedRecoveryPoint(`Form state: ${formId}`, { formId, formState: values });
    }
  }, [values, isPristine, createRecoveryPointOnChange, createDebouncedRecoveryPoint, formId]);
  
  // Handle input change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    setIsPristine(false);
  }, []);
  
  // Handle checkbox change
  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    
    setValues(prev => ({
      ...prev,
      [name]: checked
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    setIsPristine(false);
  }, []);
  
  // Handle direct value change
  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    setIsPristine(false);
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      
      // Clear form state after successful submission
      await saveSessionState(formStateKey, null);
      
      setIsPristine(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error instanceof Error) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: 'An unknown error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, saveSessionState, formStateKey]);
  
  // Reset form to initial values
  const resetForm = useCallback(async () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsPristine(true);
    
    await saveSessionState(formStateKey, null);
  }, [initialValues, saveSessionState, formStateKey]);
  
  // Handle blur event
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = event.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);
  
  return {
    values,
    setValues,
    setValue,
    handleChange,
    handleCheckboxChange,
    handleBlur,
    handleSubmit,
    resetForm,
    errors,
    setErrors,
    touched,
    isSubmitting,
    isPristine,
  };
}
