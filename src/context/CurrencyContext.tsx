'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Region = {
  id: string;
  name: string;
  flag: string;
  defaultCurrency: string;
};

export type Currency = {
  code: string;
  symbol: string;
  rate: number; // multiplier relative to 1 INR (e.g. 0.0116 for USD)
  name: string;
  decimals: number;
};

export const SUPPORTED_REGIONS: Region[] = [
  { id: 'IN', name: 'India', flag: '🇮🇳', defaultCurrency: 'INR' },
  { id: 'US', name: 'United States', flag: '🇺🇸', defaultCurrency: 'USD' },
  { id: 'GB', name: 'United Kingdom', flag: '🇬🇧', defaultCurrency: 'GBP' },
  { id: 'EU', name: 'European Union', flag: '🇪🇺', defaultCurrency: 'EUR' },
  { id: 'CA', name: 'Canada', flag: '🇨🇦', defaultCurrency: 'CAD' },
  { id: 'AU', name: 'Australia', flag: '🇦🇺', defaultCurrency: 'AUD' },
  { id: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', defaultCurrency: 'AED' },
  { id: 'SG', name: 'Singapore', flag: '🇸🇬', defaultCurrency: 'SGD' },
  { id: 'JP', name: 'Japan', flag: '🇯🇵', defaultCurrency: 'JPY' },
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
];

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    rate: 1.0,
    name: '₹ Indian Rupee (INR)',
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 0.0116,
    name: '$ United States Dollar (USD)',
    decimals: 0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.0091,
    name: '£ British Pound (GBP)',
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.0107,
    name: '€ Euro (EUR)',
    decimals: 0,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    rate: 0.0158,
    name: 'CA$ Canadian Dollar (CAD)',
    decimals: 0,
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    rate: 0.0177,
    name: 'AU$ Australian Dollar (AUD)',
    decimals: 0,
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    rate: 0.0425,
    name: 'AED UAE Dirham (AED)',
    decimals: 0,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    rate: 0.0155,
    name: 'S$ Singapore Dollar (SGD)',
    decimals: 0,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    rate: 1.76,
    name: '¥ Japanese Yen (JPY)',
    decimals: 0,
  },
};

type CurrencyContextType = {
  selectedRegion: Region;
  selectedLanguage: string;
  selectedCurrency: Currency;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  updateSettings: (regionId: string, language: string, currencyCode: string) => void;
  formatPrice: (amountInINR: number) => string;
  convertPrice: (amountInINR: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedRegion, setSelectedRegion] = useState<Region>(SUPPORTED_REGIONS[0]); // Default India
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English (US)');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES['INR']);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedRegionId = localStorage.getItem('fjw_region');
      const savedLang = localStorage.getItem('fjw_language');
      const savedCurr = localStorage.getItem('fjw_currency');

      if (savedRegionId) {
        const found = SUPPORTED_REGIONS.find((r) => r.id === savedRegionId);
        if (found) setSelectedRegion(found);
      }
      if (savedLang) {
        setSelectedLanguage(savedLang);
      }
      if (savedCurr && SUPPORTED_CURRENCIES[savedCurr]) {
        setSelectedCurrency(SUPPORTED_CURRENCIES[savedCurr]);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const updateSettings = (regionId: string, language: string, currencyCode: string) => {
    const region = SUPPORTED_REGIONS.find((r) => r.id === regionId) || SUPPORTED_REGIONS[0];
    const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES['INR'];

    setSelectedRegion(region);
    setSelectedLanguage(language);
    setSelectedCurrency(currency);

    try {
      localStorage.setItem('fjw_region', region.id);
      localStorage.setItem('fjw_language', language);
      localStorage.setItem('fjw_currency', currency.code);
    } catch {
      // ignore
    }
  };

  const convertPrice = (amountInINR: number): number => {
    if (!amountInINR || isNaN(amountInINR)) return 0;
    if (selectedCurrency.code === 'INR') return amountInINR;
    return Math.round(amountInINR * selectedCurrency.rate);
  };

  const formatPrice = (amountInINR: number): string => {
    if (!amountInINR || isNaN(amountInINR)) return `${selectedCurrency.symbol}0`;

    if (selectedCurrency.code === 'INR') {
      return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
    }

    const converted = Math.round(amountInINR * selectedCurrency.rate);

    // Formatted with proper symbol placement
    if (selectedCurrency.code === 'AED') {
      return `${converted.toLocaleString('en-US')} AED`;
    }

    return `${selectedCurrency.symbol}${converted.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedRegion,
        selectedLanguage,
        selectedCurrency,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        updateSettings,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
