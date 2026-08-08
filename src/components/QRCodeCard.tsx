import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MoreVertical, Edit2, Copy, Trash2, Download } from 'lucide-react';
import { QRCodeConfig } from '../types';
import { QRCodePreview } from './QRCodePreview';

interface QRCodeCardProps {
  code: QRCodeConfig;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QRCodeCard({ code, onEdit, onDuplicate, onDelete }: QRCodeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{code.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(code.updatedAt)}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[120px]">
                <button
                  onClick={() => { setShowMenu(false); setShowExport(true); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download size={14} /> Export
                </button>
                <button
                  onClick={() => { setShowMenu(false); onEdit(code.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDuplicate(code.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Copy size={14} /> Duplicate
                </button>
                <button
                  onClick={() => { setShowMenu(false); onDelete(code.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-center p-3 rounded-lg mb-3 transition-transform group-hover:scale-[1.02] relative"
        style={{ backgroundColor: code.bgColor }}
      >
        <QRCodeSVG
          value={code.data}
          size={120}
          fgColor={code.fgColor}
          bgColor={code.bgColor}
          level={code.errorLevel}
        />
        {code.logoUrl && (
          <img
            src={code.logoUrl}
            alt="Logo"
            className="absolute w-6 h-6 rounded"
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={code.data}>
        {code.data}
      </p>

      <div className="flex gap-1.5 mt-2">
        <div
          className="w-4 h-4 rounded border border-gray-200"
          style={{ backgroundColor: code.fgColor }}
          title={`Foreground: ${code.fgColor}`}
        />
        <div
          className="w-4 h-4 rounded border border-gray-200"
          style={{ backgroundColor: code.bgColor }}
          title={`Background: ${code.bgColor}`}
        />
        <span className="text-xs text-gray-400 ml-auto">{code.errorLevel}</span>
      </div>

      {showExport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Export: {code.name}
              </h3>
              <button
                onClick={() => setShowExport(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
              >
                &times;
              </button>
            </div>
            <QRCodePreview config={code} showExport={true} />
          </div>
        </div>
      )}
    </div>
  );
}
