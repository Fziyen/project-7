import { useState, useEffect, useCallback } from 'react';
import { QRCodeConfig, DEFAULT_CONFIG } from '../types';

const STORAGE_KEY = 'qrcode-manager-codes';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useQRCodes() {
  const [codes, setCodes] = useState<QRCodeConfig[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCodes(JSON.parse(saved));
      } catch {
        setCodes([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  }, [codes]);

  const saveCode = useCallback((config: Partial<QRCodeConfig> & { name: string; data: string }) => {
    const now = Date.now();
    setCodes(prev => {
      const existing = prev.find(c => c.id === config.id);
      if (existing) {
        return prev.map(c =>
          c.id === config.id
            ? { ...c, ...config, updatedAt: now }
            : c
        );
      }
      const newCode: QRCodeConfig = {
        ...DEFAULT_CONFIG,
        ...config,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      return [newCode, ...prev];
    });
  }, []);

  const deleteCode = useCallback((id: string) => {
    setCodes(prev => prev.filter(c => c.id !== id));
  }, []);

  const duplicateCode = useCallback((id: string) => {
    setCodes(prev => {
      const original = prev.find(c => c.id === id);
      if (!original) return prev;
      const now = Date.now();
      const duplicate: QRCodeConfig = {
        ...original,
        id: generateId(),
        name: `${original.name} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      return [duplicate, ...prev];
    });
  }, []);

  const getCode = useCallback((id: string) => {
    return codes.find(c => c.id === id);
  }, [codes]);

  return {
    codes,
    saveCode,
    deleteCode,
    duplicateCode,
    getCode,
  };
}
