// src/components/shopping/ShoppingItem.jsx
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const priorityColors = {
  low: 'bg-gray-100 dark:bg-gray-800',
  medium: 'bg-yellow-100 dark:bg-yellow-900',
  high: 'bg-red-100 dark:bg-red-900'
};

const ShoppingItem = ({
  item,
  onToggleCheck,
  onEdit,
  onDelete
}) => {
  const {
    id,
    name,
    quantity,
    unit,
    priority = 'low',
    notes,
    checked = false
  } = item;

  return (
    <div className={`
      group relative flex items-center gap-4 p-4 mb-2 rounded-lg border
      border-gray-200 dark:border-gray-700 transition-all
      hover:shadow-md ${checked ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
    `}>
      {/* Priority Indicator */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 rounded-l-lg
        ${priorityColors[priority]}
      `} />

      {/* Checkbox */}
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggleCheck(id)}
          className="w-5 h-5 rounded border-gray-300 text-primary
                   focus:ring-primary cursor-pointer"
        />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <h3 className={`font-medium ${checked ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
          {name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full
                         bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {quantity} {unit}
          </span>
          {notes && (
            <span className="italic truncate">
              {notes}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-gray-500 hover:text-primary rounded-full
                   hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Edit item"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-gray-500 hover:text-red-500 rounded-full
                   hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Delete item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ShoppingItem;