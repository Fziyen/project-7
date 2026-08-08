import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { FileImage, FileText, Image } from 'lucide-react';
import { QRCodeConfig, ExportFormat } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface QRCodePreviewProps {
  config: Partial<QRCodeConfig>;
  showExport?: boolean;
}

export function QRCodePreview({ config, showExport = true }: QRCodePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const exportToSVG = async () => {
    if (!containerRef.current) return;
    try {
      const svgElement = containerRef.current.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      downloadFile(url, `qrcode-${Date.now()}.svg`);
    } catch (err) {
      console.error('SVG export failed:', err);
    }
  };

  const exportToPNG = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await toPng(containerRef.current, {
        backgroundColor: config.bgColor || '#ffffff',
        pixelRatio: 2,
      });
      downloadFile(dataUrl, `qrcode-${Date.now()}.png`);
    } catch (err) {
      console.error('PNG export failed:', err);
    }
  };

  const exportToPDF = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await toPng(containerRef.current, {
        backgroundColor: config.bgColor || '#ffffff',
        pixelRatio: 3,
      });

      const img = new window.Image();
      img.src = dataUrl;
      await new Promise(resolve => { img.onload = resolve; });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgSize = config.size ? config.size * 0.264583 : 67.73;
      const x = (pageWidth - imgSize) / 2;
      const y = (pageHeight - imgSize) / 2;

      pdf.setFillColor(config.bgColor || '#ffffff');
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.addImage(dataUrl, 'PNG', x, y, imgSize, imgSize);

      pdf.save(`qrcode-${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const handleExport = (format: ExportFormat) => {
    switch (format) {
      case 'svg':
        exportToSVG();
        break;
      case 'png':
        exportToPNG();
        break;
      case 'pdf':
        exportToPDF();
        break;
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative inline-block p-4 rounded-xl ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}
      >
        <div
          ref={containerRef}
          className="inline-block p-4 rounded-lg relative"
          style={{ backgroundColor: config.bgColor || '#ffffff' }}
        >
          <QRCodeSVG
            value={config.data || 'https://example.com'}
            size={config.size || 256}
            fgColor={config.fgColor || '#000000'}
            bgColor={config.bgColor || '#ffffff'}
            level={config.errorLevel || 'M'}
          />
          {config.logoUrl && (
            <img
              src={config.logoUrl}
              alt="Logo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded"
              style={{
                width: (config.size || 256) * (config.logoSize || 0.25),
                height: (config.size || 256) * (config.logoSize || 0.25),
                objectFit: 'contain',
              }}
            />
          )}
        </div>
      </div>

      {showExport && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleExport('svg')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all text-sm font-medium"
          >
            <FileText size={16} />
            SVG
          </button>
          <button
            onClick={() => handleExport('png')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all text-sm font-medium"
          >
            <Image size={16} />
            PNG
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all text-sm font-medium"
          >
            <FileImage size={16} />
            PDF
          </button>
        </div>
      )}
    </div>
  );
}
