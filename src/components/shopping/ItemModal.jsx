// src/components/shopping/ItemModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useTranslation } from '../../hooks/useTranslation';

const UNITS = [
  { value: 'pieces', label: 'pieces' },
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'l', label: 'l' },
  { value: 'ml', label: 'ml' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
  { value: 'medium', label: 'Medium', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'high', label: 'High', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
];

const ItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'pieces',
    priority: 'low',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        quantity: 1,
        unit: 'pieces',
        priority: 'low',
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.name = t('validation.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        // Error is handled by context
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {initialData ? t('shopping.editItem') : t('shopping.addItem')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            disabled={isLoading || isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('itemForm.itemName')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${errors.name
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-light`}
              placeholder={t('itemForm.itemName')}
              disabled={isLoading || isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Quantity and Unit */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('itemForm.quantity')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || '' })}
                className={`w-24 px-3 py-2 rounded-lg border ${errors.quantity
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-light`}
                disabled={isLoading || isSubmitting}
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-light"
                disabled={isLoading || isSubmitting}
              >
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {t(`itemForm.units.${unit.label}`)}
                  </option>
                ))}
              </select>
            </div>
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.quantity}</p>
            )}
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('itemForm.priority')}
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value })}
                  className={`flex-1 px-3 py-2 rounded-lg border border-transparent
                           ${priority.class} ${formData.priority === priority.value
                      ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800'
                      : ''
                    }`}
                  disabled={isLoading || isSubmitting}
                >
                  {t(`itemForm.priorities.${priority.value}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('itemForm.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-primary-light"
              rows="2"
              placeholder={t('itemForm.notes')}
              disabled={isLoading || isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50
                       dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isLoading || isSubmitting}
            >
              {t('itemForm.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white
                       rounded-lg transition-colors disabled:opacity-50
                       flex items-center justify-center gap-2"
              disabled={isLoading || isSubmitting}
            >
              {(isLoading || isSubmitting) && <LoadingSpinner size="small" className="text-white" />}
              {(isLoading || isSubmitting)
                ? t('messages.saving')
                : initialData ? t('itemForm.save') : t('itemForm.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;