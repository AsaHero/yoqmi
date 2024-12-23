// src/components/shopping/ShoppingList.jsx
import React, { useState } from 'react';
import { Plus, AlertCircle, RefreshCcw } from 'lucide-react';
import { useShoppingList } from '../../contexts/ShoppingContext';
import ShoppingItem from './ShoppingItem';
import ItemModal from './ItemModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useTranslation } from '../../hooks/useTranslation';

const ShoppingList = () => {
  const { state, actions } = useShoppingList();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddItem = async (itemData) => {
    try {
      await actions.addItem(itemData);
      setIsModalOpen(false);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleEditItem = async (itemData) => {
    try {
      await actions.updateItem({ ...itemData, id: editingItem.id });
      setEditingItem(null);
      setIsModalOpen(false);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await actions.deleteItem(id);
      } catch (error) {
        // Error is handled by context
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Sort items by priority and checked status
  const sortedItems = [...state.items].sort((a, b) => {
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (state.isLoading && !state.items.length) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="large" />
          <p className="text-gray-500 dark:text-gray-400">Loading your shopping list...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 flex flex-col items-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            {state.error}
          </h3>
          <button
            onClick={actions.retry}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900
                     text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200
                     dark:hover:bg-red-800 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t('shopping.title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('shopping.itemCount', { count: state.items.length })}
            {' • '}
            {t('shopping.itemsCompleted', {
              count: state.items.filter(i => i.checked).length
            })}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-primary hover:bg-primary-dark text-white transition-colors"
          disabled={state.isLoading}
        >
          {state.isLoading ? (
            <LoadingSpinner size="small" className="text-white" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          <span>{t('shopping.addItem')}</span>
        </button>
      </div>

      <div className="space-y-2">
        {sortedItems.map(item => (
          <div
            key={item.id}
            className="transform transition-all duration-200 animate-fadeIn"
          >
            <ShoppingItem
              item={item}
              onToggleCheck={() => actions.toggleItem(item.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              disabled={state.isLoading}
            />
          </div>
        ))}
        {sortedItems.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">{t('shopping.noItems')}</p>
            <p className="text-sm">{t('shopping.addFirstItem')}</p>
            </div>
          </div>
        )}
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        initialData={editingItem}
        isLoading={state.isLoading}
      />
    </div>
  );
};

export default ShoppingList;