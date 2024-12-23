// src/components/family/QRCode.jsx
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

const QRCode = ({ value, size = 256 }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const canvas = document.querySelector('canvas');
      const link = document.createElement('a');
      link.download = 'family-invite-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="p-4 bg-white rounded-lg">
        <QRCodeCanvas
          value={value}
          size={size}
          level="H"
          includeMargin
          imageSettings={{
            src: "/logo.png",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                   bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{t('family.downloadQR')}</span>
        </button>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                   bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                   hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>{t('family.copyLink')}</span>
        </button>
      </div>
    </div>
  );
};

export default QRCode;