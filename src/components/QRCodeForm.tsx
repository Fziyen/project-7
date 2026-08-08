import { useState, useEffect } from 'react';
import { Link2, Palette, Type, Image, Settings2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { QRCodeConfig, DEFAULT_CONFIG, PRESET_COLORS } from '../types';
import { QRCodePreview } from './QRCodePreview';

interface QRCodeFormProps {
  initialConfig?: QRCodeConfig;
  onSave: (config: Partial<QRCodeConfig> & { name: string; data: string }) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function QRCodeForm({ initialConfig, onSave, onCancel, isEditing = false }: QRCodeFormProps) {
  const [name, setName] = useState(initialConfig?.name || '');
  const [data, setData] = useState(initialConfig?.data || DEFAULT_CONFIG.data);
  const [fgColor, setFgColor] = useState(initialConfig?.fgColor || DEFAULT_CONFIG.fgColor);
  const [bgColor, setBgColor] = useState(initialConfig?.bgColor || DEFAULT_CONFIG.bgColor);
  const [size, setSize] = useState(initialConfig?.size || DEFAULT_CONFIG.size);
  const [errorLevel, setErrorLevel] = useState(initialConfig?.errorLevel || DEFAULT_CONFIG.errorLevel);
  const [logoUrl, setLogoUrl] = useState(initialConfig?.logoUrl || '');
  const [logoSize, setLogoSize] = useState(initialConfig?.logoSize || DEFAULT_CONFIG.logoSize);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState<'fg' | 'bg' | null>(null);

  const config: Partial<QRCodeConfig> = {
    data,
    fgColor,
    bgColor,
    size,
    errorLevel,
    logoUrl: logoUrl || undefined,
    logoSize,
  };

  useEffect(() => {
    if (initialConfig) {
      setName(initialConfig.name);
      setData(initialConfig.data);
      setFgColor(initialConfig.fgColor);
      setBgColor(initialConfig.bgColor);
      setSize(initialConfig.size);
      setErrorLevel(initialConfig.errorLevel);
      setLogoUrl(initialConfig.logoUrl || '');
      setLogoSize(initialConfig.logoSize);
    }
  }, [initialConfig]);

  const handleSave = () => {
    if (!name.trim() || !data.trim()) return;
    onSave({
      id: initialConfig?.id,
      name: name.trim(),
      data: data.trim(),
      fgColor,
      bgColor,
      size,
      errorLevel,
      logoUrl: logoUrl || undefined,
      logoSize,
    });
    setName('');
    setData(DEFAULT_CONFIG.data);
    setFgColor(DEFAULT_CONFIG.fgColor);
    setBgColor(DEFAULT_CONFIG.bgColor);
    setSize(DEFAULT_CONFIG.size);
    setErrorLevel(DEFAULT_CONFIG.errorLevel);
    setLogoUrl('');
    setLogoSize(DEFAULT_CONFIG.logoSize);
  };

  const isValid = name.trim().length > 0 && data.trim().length > 0;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Type size={16} className="inline mr-2" />
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My QR Code"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Link2 size={16} className="inline mr-2" />
            Content
          </label>
          <textarea
            value={data}
            onChange={e => setData(e.target.value)}
            placeholder="https://example.com or any text"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Palette size={16} className="inline mr-2" />
              Foreground
            </label>
            <div className="relative">
              <div
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => setActiveColorPicker(activeColorPicker === 'fg' ? null : 'fg')}
              >
                <div
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ backgroundColor: fgColor }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{fgColor}</span>
              </div>
              {activeColorPicker === 'fg' && (
                <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value)}
                    className="w-full h-10 cursor-pointer mb-2"
                  />
                  <div className="grid grid-cols-6 gap-1.5">
                    {PRESET_COLORS.fg.map(color => (
                      <button
                        key={color}
                        onClick={() => { setFgColor(color); setActiveColorPicker(null); }}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform relative"
                        style={{ backgroundColor: color }}
                      >
                        {fgColor === color && <Check size={12} className="absolute inset-0 m-auto text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Palette size={16} className="inline mr-2" />
              Background
            </label>
            <div className="relative">
              <div
                className="flex items-center gap-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => setActiveColorPicker(activeColorPicker === 'bg' ? null : 'bg')}
              >
                <div
                  className="w-8 h-8 rounded border border-gray-200"
                  style={{ backgroundColor: bgColor }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{bgColor}</span>
              </div>
              {activeColorPicker === 'bg' && (
                <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-full h-10 cursor-pointer mb-2"
                  />
                  <div className="grid grid-cols-6 gap-1.5">
                    {PRESET_COLORS.bg.map(color => (
                      <button
                        key={color}
                        onClick={() => { setBgColor(color); setActiveColorPicker(null); }}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform relative"
                        style={{ backgroundColor: color }}
                      >
                        {bgColor === color && <Check size={12} className="absolute inset-0 m-auto text-gray-800 drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <Settings2 size={16} />
          Advanced Options
        </button>

        {showAdvanced && (
          <div className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['L', 'M', 'Q', 'H'].map(level => (
                  <button
                    key={level}
                    onClick={() => setErrorLevel(level as 'L' | 'M' | 'Q' | 'H')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      errorLevel === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level} ({level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'})
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Higher levels allow more damage tolerance but increase density
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Image size={16} className="inline mr-2" />
                Logo URL (optional)
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {logoUrl && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Logo Size: {Math.round(logoSize * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.35"
                    step="0.05"
                    value={logoSize}
                    onChange={e => setLogoSize(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preview</h3>
          <QRCodePreview config={config} showExport={false} />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center truncate max-w-full">
            {data}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {onCancel && (
            <button onClick={onCancel} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-4 py-2 rounded-lg transition-all flex-1">
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Update' : 'Save'} QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
