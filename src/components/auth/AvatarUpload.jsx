// src/components/auth/AvatarUpload.jsx
import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const AvatarUpload = ({ onChange, value }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className={`
          w-24 h-24 rounded-full overflow-hidden
          ${!preview ? 'bg-gray-100 dark:bg-gray-800' : ''}
          flex items-center justify-center
        `}>
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full
                     hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <label className="cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <span className="text-sm text-primary hover:text-primary-dark transition-colors">
          {preview ? t('auth.changeAvatar') : t('auth.addAvatar')}
        </span>
      </label>
    </div>
  );
};

export default AvatarUpload;