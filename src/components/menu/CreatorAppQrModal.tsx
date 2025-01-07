import React from 'react';
import { X, Smartphone, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CreatorAppQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
}

export default function CreatorAppQrModal({ isOpen, onClose, storeId }: CreatorAppQrModalProps) {
  if (!isOpen) return null;

  // Generate deep link URL for the Creator App
  const qrData = `venu://store/${storeId}/menu`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Open in Creator App</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <QRCodeSVG 
                value={qrData}
                size={200}
                level="H"
                includeMargin
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium text-gray-900">
              Scan with Venu Creator App
            </h3>
            <p className="text-sm text-gray-500">
              Create and manage your menu directly from your mobile device
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <Download className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">
                  Don't have the app?
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Download Venu Creator from your device's app store to get started.
                </p>
                <div className="flex space-x-4 mt-4">
                  <a
                    href="#"
                    className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    App Store
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Play Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}