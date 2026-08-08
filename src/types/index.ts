export interface QRCodeConfig {
  id: string;
  name: string;
  data: string;
  fgColor: string;
  bgColor: string;
  size: number;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  logoUrl?: string;
  logoSize: number;
  createdAt: number;
  updatedAt: number;
}

export type ExportFormat = 'svg' | 'png' | 'pdf';

export const DEFAULT_CONFIG: Omit<QRCodeConfig, 'id' | 'name' | 'createdAt' | 'updatedAt'> = {
  data: 'https://example.com',
  fgColor: '#000000',
  bgColor: '#ffffff',
  size: 256,
  errorLevel: 'M',
  logoSize: 0.25,
};

export const PRESET_COLORS = {
  fg: [
    '#000000', '#1f2937', '#374151', '#1e3a8a', '#1e40af',
    '#15803d', '#166534', '#b91c1c', '#991b1b', '#7c2d12',
    '#581c87', '#6b21a8', '#0f766e', '#0d9488',
  '#ea580c', '#c2410c', '#0369a1', '#075985',
  '#a21caf', '#86198f', '#4338ca', '#4f46e5',
  '#2563eb',
  '#dc2626', '#ea580c'
  ],
  bg: [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#fef3c7', '#fef9c3',
    '#ecfdf5', '#f0fdf4', '#f0f9ff', '#eff6ff', '#faf5ff',
    '#fdf4ff', '#fdf2f8', '#fff1f2', '#fef2f2', '#fff7ed',
    '#fffbeb', '#ecfeff', '#f0fdff', '#f5f3ff', '#e0e7ff',
    '#dbeafe', '#ffe4e6', '#fed7aa'
  ],
};
