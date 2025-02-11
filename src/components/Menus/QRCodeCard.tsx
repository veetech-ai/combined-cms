import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { toast } from 'react-hot-toast';
import { Download } from 'lucide-react';

interface QRCodeCardProps {
  viewMenuLink: string;
  displayName: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ viewMenuLink, displayName }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [viewMenuLink]);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      const url = await QRCode.toDataURL(viewMenuLink, {
        width: 400,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    try {
      const link = document.createElement('a');
      link.download = `${displayName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
      link.href = qrCodeUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <div className="w-[120px] h-[120px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
      ) : qrCodeUrl ? (
        <div className="group relative">
          <div className="p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
            <img
              src={qrCodeUrl}
              alt="Menu QR Code"
              className="w-[120px] h-[120px]"
              // style={{
              //   imageRendering: '-webkit-optimize-contrast',
              //   imageRendering: 'crisp-edges'
              // }}
            />
          </div>
        </div>
      ) : (
        <div className="w-[120px] h-[120px] bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500">Error</span>
        </div>
      )}
    </div>
  );
}; 