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
  {
    "id": "IN",
    "name": "India",
    "flag": "🇮🇳",
    "defaultCurrency": "INR"
  },
  {
    "id": "US",
    "name": "United States",
    "flag": "🇺🇸",
    "defaultCurrency": "USD"
  },
  {
    "id": "GB",
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "defaultCurrency": "GBP"
  },
  {
    "id": "EU",
    "name": "European Union",
    "flag": "🇪🇺",
    "defaultCurrency": "EUR"
  },
  {
    "id": "CA",
    "name": "Canada",
    "flag": "🇨🇦",
    "defaultCurrency": "CAD"
  },
  {
    "id": "AU",
    "name": "Australia",
    "flag": "🇦🇺",
    "defaultCurrency": "AUD"
  },
  {
    "id": "AE",
    "name": "United Arab Emirates",
    "flag": "🇦🇪",
    "defaultCurrency": "AED"
  },
  {
    "id": "SG",
    "name": "Singapore",
    "flag": "🇸🇬",
    "defaultCurrency": "SGD"
  },
  {
    "id": "JP",
    "name": "Japan",
    "flag": "🇯🇵",
    "defaultCurrency": "JPY"
  },
  {
    "id": "CN",
    "name": "China",
    "flag": "🇨🇳",
    "defaultCurrency": "CNY"
  },
  {
    "id": "CH",
    "name": "Switzerland",
    "flag": "🇨🇭",
    "defaultCurrency": "CHF"
  },
  {
    "id": "HK",
    "name": "Hong Kong",
    "flag": "🇭🇰",
    "defaultCurrency": "HKD"
  },
  {
    "id": "NZ",
    "name": "New Zealand",
    "flag": "🇳🇿",
    "defaultCurrency": "NZD"
  },
  {
    "id": "SE",
    "name": "Sweden",
    "flag": "🇸🇪",
    "defaultCurrency": "SEK"
  },
  {
    "id": "KR",
    "name": "South Korea",
    "flag": "🇰🇷",
    "defaultCurrency": "KRW"
  },
  {
    "id": "MX",
    "name": "Mexico",
    "flag": "🇲🇽",
    "defaultCurrency": "MXN"
  },
  {
    "id": "BR",
    "name": "Brazil",
    "flag": "🇧🇷",
    "defaultCurrency": "BRL"
  },
  {
    "id": "ZA",
    "name": "South Africa",
    "flag": "🇿🇦",
    "defaultCurrency": "ZAR"
  },
  {
    "id": "RU",
    "name": "Russia",
    "flag": "🇷🇺",
    "defaultCurrency": "RUB"
  },
  {
    "id": "SA",
    "name": "Saudi Arabia",
    "flag": "🇸🇦",
    "defaultCurrency": "SAR"
  },
  {
    "id": "TR",
    "name": "Turkey",
    "flag": "🇹🇷",
    "defaultCurrency": "TRY"
  },
  {
    "id": "TH",
    "name": "Thailand",
    "flag": "🇹🇭",
    "defaultCurrency": "THB"
  },
  {
    "id": "ID",
    "name": "Indonesia",
    "flag": "🇮🇩",
    "defaultCurrency": "IDR"
  },
  {
    "id": "MY",
    "name": "Malaysia",
    "flag": "🇲🇾",
    "defaultCurrency": "MYR"
  },
  {
    "id": "PH",
    "name": "Philippines",
    "flag": "🇵🇭",
    "defaultCurrency": "PHP"
  },
  {
    "id": "VN",
    "name": "Vietnam",
    "flag": "🇻🇳",
    "defaultCurrency": "VND"
  },
  {
    "id": "EG",
    "name": "Egypt",
    "flag": "🇪🇬",
    "defaultCurrency": "EGP"
  },
  {
    "id": "NG",
    "name": "Nigeria",
    "flag": "🇳🇬",
    "defaultCurrency": "NGN"
  },
  {
    "id": "PK",
    "name": "Pakistan",
    "flag": "🇵🇰",
    "defaultCurrency": "PKR"
  },
  {
    "id": "BD",
    "name": "Bangladesh",
    "flag": "🇧🇩",
    "defaultCurrency": "BDT"
  }
];

// Full list of supported languages with native names
export const SUPPORTED_LANGUAGES = [
  {
    "code": "en",
    "name": "English (US)"
  },
  {
    "code": "en-GB",
    "name": "English (UK)"
  },
  {
    "code": "hi",
    "name": "हिंदी (Hindi)"
  },
  {
    "code": "ja",
    "name": "日本語 (Japanese)"
  },
  {
    "code": "es",
    "name": "Español (Spanish)"
  },
  {
    "code": "fr",
    "name": "Français (French)"
  },
  {
    "code": "de",
    "name": "Deutsch (German)"
  },
  {
    "code": "ar",
    "name": "عربي (Arabic)"
  },
  {
    "code": "zh-CN",
    "name": "中文 (Simplified Chinese)"
  },
  {
    "code": "zh-TW",
    "name": "繁體中文 (Traditional Chinese)"
  },
  {
    "code": "ko",
    "name": "한국어 (Korean)"
  },
  {
    "code": "it",
    "name": "Italiano (Italian)"
  },
  {
    "code": "pt",
    "name": "Português (Portuguese)"
  },
  {
    "code": "ru",
    "name": "Русский (Russian)"
  },
  {
    "code": "bn",
    "name": "বাংলা (Bengali)"
  },
  {
    "code": "ur",
    "name": "اردو (Urdu)"
  },
  {
    "code": "id",
    "name": "Bahasa Indonesia (Indonesian)"
  },
  {
    "code": "vi",
    "name": "Tiếng Việt (Vietnamese)"
  },
  {
    "code": "tr",
    "name": "Türkçe (Turkish)"
  },
  {
    "code": "th",
    "name": "ไทย (Thai)"
  },
  {
    "code": "nl",
    "name": "Nederlands (Dutch)"
  },
  {
    "code": "pl",
    "name": "Polski (Polish)"
  },
  {
    "code": "sv",
    "name": "Svenska (Swedish)"
  },
  {
    "code": "fi",
    "name": "Suomi (Finnish)"
  },
  {
    "code": "da",
    "name": "Dansk (Danish)"
  },
  {
    "code": "no",
    "name": "Norsk (Norwegian)"
  },
  {
    "code": "el",
    "name": "Ελληνικά (Greek)"
  },
  {
    "code": "he",
    "name": "עברית (Hebrew)"
  },
  {
    "code": "ms",
    "name": "Bahasa Melayu (Malay)"
  },
  {
    "code": "tl",
    "name": "Tagalog (Filipino)"
  }
];

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  INR: {
    code: "INR",
    symbol: "₹",
    rate: 1,
    name: "₹ Indian Rupee (INR)",
    decimals: 0
  },
  USD: {
    code: "USD",
    symbol: "$",
    rate: 0.012,
    name: "$ US Dollar (USD)",
    decimals: 2
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    rate: 0.0094,
    name: "£ British Pound (GBP)",
    decimals: 2
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    rate: 0.011,
    name: "€ Euro (EUR)",
    decimals: 2
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    rate: 0.016,
    name: "CA$ Canadian Dollar (CAD)",
    decimals: 2
  },
  AUD: {
    code: "AUD",
    symbol: "AU$",
    rate: 0.018,
    name: "AU$ Australian Dollar (AUD)",
    decimals: 2
  },
  AED: {
    code: "AED",
    symbol: "AED",
    rate: 0.044,
    name: "AED UAE Dirham (AED)",
    decimals: 2
  },
  SGD: {
    code: "SGD",
    symbol: "S$",
    rate: 0.016,
    name: "S$ Singapore Dollar (SGD)",
    decimals: 2
  },
  JPY: {
    code: "JPY",
    symbol: "¥",
    rate: 1.8,
    name: "¥ Japanese Yen (JPY)",
    decimals: 0
  },
  CNY: {
    code: "CNY",
    symbol: "¥",
    rate: 0.086,
    name: "¥ Chinese Yuan (CNY)",
    decimals: 2
  },
  CHF: {
    code: "CHF",
    symbol: "CHF",
    rate: 0.01,
    name: "CHF Swiss Franc (CHF)",
    decimals: 2
  },
  HKD: {
    code: "HKD",
    symbol: "HK$",
    rate: 0.094,
    name: "HK$ Hong Kong Dollar (HKD)",
    decimals: 2
  },
  NZD: {
    code: "NZD",
    symbol: "NZ$",
    rate: 0.02,
    name: "NZ$ New Zealand Dollar (NZD)",
    decimals: 2
  },
  SEK: {
    code: "SEK",
    symbol: "kr",
    rate: 0.12,
    name: "kr Swedish Krona (SEK)",
    decimals: 2
  },
  KRW: {
    code: "KRW",
    symbol: "₩",
    rate: 16,
    name: "₩ South Korean Won (KRW)",
    decimals: 0
  },
  MXN: {
    code: "MXN",
    symbol: "$",
    rate: 0.2,
    name: "$ Mexican Peso (MXN)",
    decimals: 2
  },
  BRL: {
    code: "BRL",
    symbol: "R$",
    rate: 0.06,
    name: "R$ Brazilian Real (BRL)",
    decimals: 2
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    rate: 0.23,
    name: "R South African Rand (ZAR)",
    decimals: 2
  },
  RUB: {
    code: "RUB",
    symbol: "₽",
    rate: 1.1,
    name: "₽ Russian Ruble (RUB)",
    decimals: 2
  },
  SAR: {
    code: "SAR",
    symbol: "SR",
    rate: 0.045,
    name: "SR Saudi Riyal (SAR)",
    decimals: 2
  },
  TRY: {
    code: "TRY",
    symbol: "₺",
    rate: 0.38,
    name: "₺ Turkish Lira (TRY)",
    decimals: 2
  },
  THB: {
    code: "THB",
    symbol: "฿",
    rate: 0.43,
    name: "฿ Thai Baht (THB)",
    decimals: 2
  },
  IDR: {
    code: "IDR",
    symbol: "Rp",
    rate: 188,
    name: "Rp Indonesian Rupiah (IDR)",
    decimals: 0
  },
  MYR: {
    code: "MYR",
    symbol: "RM",
    rate: 0.057,
    name: "RM Malaysian Ringgit (MYR)",
    decimals: 2
  },
  PHP: {
    code: "PHP",
    symbol: "₱",
    rate: 0.67,
    name: "₱ Philippine Peso (PHP)",
    decimals: 2
  },
  VND: {
    code: "VND",
    symbol: "₫",
    rate: 300,
    name: "₫ Vietnamese Dong (VND)",
    decimals: 0
  },
  EGP: {
    code: "EGP",
    symbol: "E£",
    rate: 0.57,
    name: "E£ Egyptian Pound (EGP)",
    decimals: 2
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    rate: 14.5,
    name: "₦ Nigerian Naira (NGN)",
    decimals: 2
  },
  PKR: {
    code: "PKR",
    symbol: "₨",
    rate: 3.3,
    name: "₨ Pakistani Rupee (PKR)",
    decimals: 2
  },
  BDT: {
    code: "BDT",
    symbol: "৳",
    rate: 1.3,
    name: "৳ Bangladeshi Taka (BDT)",
    decimals: 2
  }
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
