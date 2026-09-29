'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getTranslations,
  detectBrowserLanguage,
  isRTL,
  LANGUAGE_NAME_TO_CODE,
  TRANSLATIONS,
  type Translations,
} from '@/lib/translations';

export type Region = {
  id: string;
  name: string;
  flag: string;
  defaultCurrency: string;
};

export type Currency = {
  code: string;
  symbol: string;
  rate: number;
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

// Full list of supported languages with native names
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ar', name: 'عربي (Arabic)' },
];

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, name: '₹ Indian Rupee (INR)', decimals: 0 },
  USD: { code: 'USD', symbol: '$', rate: 0.0116, name: '$ United States Dollar (USD)', decimals: 0 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0091, name: '£ British Pound (GBP)', decimals: 0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.0107, name: '€ Euro (EUR)', decimals: 0 },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 0.0158, name: 'CA$ Canadian Dollar (CAD)', decimals: 0 },
  AUD: { code: 'AUD', symbol: 'AU$', rate: 0.0177, name: 'AU$ Australian Dollar (AUD)', decimals: 0 },
  AED: { code: 'AED', symbol: 'AED', rate: 0.0425, name: 'AED UAE Dirham (AED)', decimals: 0 },
  SGD: { code: 'SGD', symbol: 'S$', rate: 0.0155, name: 'S$ Singapore Dollar (SGD)', decimals: 0 },
  JPY: { code: 'JPY', symbol: '¥', rate: 1.76, name: '¥ Japanese Yen (JPY)', decimals: 0 },
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
  t: Translations;
  isRTLMode: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedRegion, setSelectedRegion] = useState<Region>(SUPPORTED_REGIONS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English (US)');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(SUPPORTED_CURRENCIES['INR']);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [t, setT] = useState<Translations>(TRANSLATIONS['en']);
  const [isRTLMode, setIsRTLMode] = useState(false);

  // Load preferences from localStorage on mount; auto-detect browser language on first visit
  useEffect(() => {
    try {
      const savedRegionId = localStorage.getItem('fjw_region');
      const savedLang = localStorage.getItem('fjw_language');
      const savedCurr = localStorage.getItem('fjw_currency');
      const hasVisited = localStorage.getItem('fjw_visited');

      let resolvedLang = 'English (US)';

      if (savedLang) {
        resolvedLang = savedLang;
      } else if (!hasVisited) {
        // Auto-detect browser language on first visit
        const detectedCode = detectBrowserLanguage();
        const matched = SUPPORTED_LANGUAGES.find(
          (l) => LANGUAGE_NAME_TO_CODE[l.name] === detectedCode
        );
        if (matched) {
          resolvedLang = matched.name;
          const code = LANGUAGE_NAME_TO_CODE[resolvedLang] || 'en';
          if (code !== 'en') {
            document.cookie = `googtrans=/en/${code}; path=/;`;
          }
        }
        localStorage.setItem('fjw_visited', '1');
      }

      setSelectedLanguage(resolvedLang);
      setT(getTranslations(resolvedLang));
      setIsRTLMode(isRTL(resolvedLang));

      // Apply dir to <html>
      document.documentElement.dir = isRTL(resolvedLang) ? 'rtl' : 'ltr';

      if (savedRegionId) {
        const found = SUPPORTED_REGIONS.find((r) => r.id === savedRegionId);
        if (found) setSelectedRegion(found);
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
    const translations = getTranslations(language);
    const rtl = isRTL(language);
    
    const isLanguageChanged = selectedLanguage !== language;

    setSelectedRegion(region);
    setSelectedLanguage(language);
    setSelectedCurrency(currency);
    setT(translations);
    setIsRTLMode(rtl);

    // Apply direction to <html> element for RTL support
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    const langCode = LANGUAGE_NAME_TO_CODE[language] ?? 'en';
    document.documentElement.lang = langCode;

    try {
      localStorage.setItem('fjw_region', region.id);
      localStorage.setItem('fjw_language', language);
      localStorage.setItem('fjw_currency', currency.code);
      
      // Update Google Translate Cookie
      if (langCode === 'en' || (langCode as string) === 'en-GB') {
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/;`;
      }
    } catch {
      // ignore
    }

    if (isLanguageChanged) {
      setTimeout(() => window.location.reload(), 150);
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
        t,
        isRTLMode,
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

/** Convenience hook for translations only */
export function useTranslation() {
  const { t, isRTLMode, selectedLanguage } = useCurrency();
  return { t, isRTLMode, selectedLanguage };
}
