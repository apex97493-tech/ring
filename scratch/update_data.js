const fs = require('fs');

const ALL_LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ar', name: 'عربي (Arabic)' },
  { code: 'zh-CN', name: '中文 (Simplified Chinese)' },
  { code: 'zh-TW', name: '繁體中文 (Traditional Chinese)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'id', name: 'Bahasa Indonesia (Indonesian)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'tr', name: 'Türkçe (Turkish)' },
  { code: 'th', name: 'ไทย (Thai)' },
  { code: 'nl', name: 'Nederlands (Dutch)' },
  { code: 'pl', name: 'Polski (Polish)' },
  { code: 'sv', name: 'Svenska (Swedish)' },
  { code: 'fi', name: 'Suomi (Finnish)' },
  { code: 'da', name: 'Dansk (Danish)' },
  { code: 'no', name: 'Norsk (Norwegian)' },
  { code: 'el', name: 'Ελληνικά (Greek)' },
  { code: 'he', name: 'עברית (Hebrew)' },
  { code: 'ms', name: 'Bahasa Melayu (Malay)' },
  { code: 'tl', name: 'Tagalog (Filipino)' },
];

const ALL_CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1.0, name: '₹ Indian Rupee (INR)', decimals: 0 },
  USD: { code: 'USD', symbol: '$', rate: 0.012, name: '$ US Dollar (USD)', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0094, name: '£ British Pound (GBP)', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011, name: '€ Euro (EUR)', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 0.016, name: 'CA$ Canadian Dollar (CAD)', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'AU$', rate: 0.018, name: 'AU$ Australian Dollar (AUD)', decimals: 2 },
  AED: { code: 'AED', symbol: 'AED', rate: 0.044, name: 'AED UAE Dirham (AED)', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', rate: 0.016, name: 'S$ Singapore Dollar (SGD)', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', rate: 1.8, name: '¥ Japanese Yen (JPY)', decimals: 0 },
  CNY: { code: 'CNY', symbol: '¥', rate: 0.086, name: '¥ Chinese Yuan (CNY)', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', rate: 0.010, name: 'CHF Swiss Franc (CHF)', decimals: 2 },
  HKD: { code: 'HKD', symbol: 'HK$', rate: 0.094, name: 'HK$ Hong Kong Dollar (HKD)', decimals: 2 },
  NZD: { code: 'NZD', symbol: 'NZ$', rate: 0.020, name: 'NZ$ New Zealand Dollar (NZD)', decimals: 2 },
  SEK: { code: 'SEK', symbol: 'kr', rate: 0.12, name: 'kr Swedish Krona (SEK)', decimals: 2 },
  KRW: { code: 'KRW', symbol: '₩', rate: 16.0, name: '₩ South Korean Won (KRW)', decimals: 0 },
  MXN: { code: 'MXN', symbol: '$', rate: 0.20, name: '$ Mexican Peso (MXN)', decimals: 2 },
  BRL: { code: 'BRL', symbol: 'R$', rate: 0.060, name: 'R$ Brazilian Real (BRL)', decimals: 2 },
  ZAR: { code: 'ZAR', symbol: 'R', rate: 0.23, name: 'R South African Rand (ZAR)', decimals: 2 },
  RUB: { code: 'RUB', symbol: '₽', rate: 1.10, name: '₽ Russian Ruble (RUB)', decimals: 2 },
  SAR: { code: 'SAR', symbol: 'SR', rate: 0.045, name: 'SR Saudi Riyal (SAR)', decimals: 2 },
  TRY: { code: 'TRY', symbol: '₺', rate: 0.38, name: '₺ Turkish Lira (TRY)', decimals: 2 },
  THB: { code: 'THB', symbol: '฿', rate: 0.43, name: '฿ Thai Baht (THB)', decimals: 2 },
  IDR: { code: 'IDR', symbol: 'Rp', rate: 188.0, name: 'Rp Indonesian Rupiah (IDR)', decimals: 0 },
  MYR: { code: 'MYR', symbol: 'RM', rate: 0.057, name: 'RM Malaysian Ringgit (MYR)', decimals: 2 },
  PHP: { code: 'PHP', symbol: '₱', rate: 0.67, name: '₱ Philippine Peso (PHP)', decimals: 2 },
  VND: { code: 'VND', symbol: '₫', rate: 300.0, name: '₫ Vietnamese Dong (VND)', decimals: 0 },
  EGP: { code: 'EGP', symbol: 'E£', rate: 0.57, name: 'E£ Egyptian Pound (EGP)', decimals: 2 },
  NGN: { code: 'NGN', symbol: '₦', rate: 14.5, name: '₦ Nigerian Naira (NGN)', decimals: 2 },
  PKR: { code: 'PKR', symbol: '₨', rate: 3.3, name: '₨ Pakistani Rupee (PKR)', decimals: 2 },
  BDT: { code: 'BDT', symbol: '৳', rate: 1.3, name: '৳ Bangladeshi Taka (BDT)', decimals: 2 },
};

const ALL_REGIONS = [
  { id: 'IN', name: 'India', flag: '🇮🇳', defaultCurrency: 'INR' },
  { id: 'US', name: 'United States', flag: '🇺🇸', defaultCurrency: 'USD' },
  { id: 'GB', name: 'United Kingdom', flag: '🇬🇧', defaultCurrency: 'GBP' },
  { id: 'EU', name: 'European Union', flag: '🇪🇺', defaultCurrency: 'EUR' },
  { id: 'CA', name: 'Canada', flag: '🇨🇦', defaultCurrency: 'CAD' },
  { id: 'AU', name: 'Australia', flag: '🇦🇺', defaultCurrency: 'AUD' },
  { id: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', defaultCurrency: 'AED' },
  { id: 'SG', name: 'Singapore', flag: '🇸🇬', defaultCurrency: 'SGD' },
  { id: 'JP', name: 'Japan', flag: '🇯🇵', defaultCurrency: 'JPY' },
  { id: 'CN', name: 'China', flag: '🇨🇳', defaultCurrency: 'CNY' },
  { id: 'CH', name: 'Switzerland', flag: '🇨🇭', defaultCurrency: 'CHF' },
  { id: 'HK', name: 'Hong Kong', flag: '🇭🇰', defaultCurrency: 'HKD' },
  { id: 'NZ', name: 'New Zealand', flag: '🇳🇿', defaultCurrency: 'NZD' },
  { id: 'SE', name: 'Sweden', flag: '🇸🇪', defaultCurrency: 'SEK' },
  { id: 'KR', name: 'South Korea', flag: '🇰🇷', defaultCurrency: 'KRW' },
  { id: 'MX', name: 'Mexico', flag: '🇲🇽', defaultCurrency: 'MXN' },
  { id: 'BR', name: 'Brazil', flag: '🇧🇷', defaultCurrency: 'BRL' },
  { id: 'ZA', name: 'South Africa', flag: '🇿🇦', defaultCurrency: 'ZAR' },
  { id: 'RU', name: 'Russia', flag: '🇷🇺', defaultCurrency: 'RUB' },
  { id: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', defaultCurrency: 'SAR' },
  { id: 'TR', name: 'Turkey', flag: '🇹🇷', defaultCurrency: 'TRY' },
  { id: 'TH', name: 'Thailand', flag: '🇹🇭', defaultCurrency: 'THB' },
  { id: 'ID', name: 'Indonesia', flag: '🇮🇩', defaultCurrency: 'IDR' },
  { id: 'MY', name: 'Malaysia', flag: '🇲🇾', defaultCurrency: 'MYR' },
  { id: 'PH', name: 'Philippines', flag: '🇵🇭', defaultCurrency: 'PHP' },
  { id: 'VN', name: 'Vietnam', flag: '🇻🇳', defaultCurrency: 'VND' },
  { id: 'EG', name: 'Egypt', flag: '🇪🇬', defaultCurrency: 'EGP' },
  { id: 'NG', name: 'Nigeria', flag: '🇳🇬', defaultCurrency: 'NGN' },
  { id: 'PK', name: 'Pakistan', flag: '🇵🇰', defaultCurrency: 'PKR' },
  { id: 'BD', name: 'Bangladesh', flag: '🇧🇩', defaultCurrency: 'BDT' },
];

function updateContext() {
  const file = 'src/context/CurrencyContext.tsx';
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    /export const SUPPORTED_REGIONS: Region\[\] = \[[\s\S]*?\];/,
    `export const SUPPORTED_REGIONS: Region[] = ${JSON.stringify(ALL_REGIONS, null, 2)};`
  );
  
  content = content.replace(
    /export const SUPPORTED_LANGUAGES = \[[\s\S]*?\];/,
    `export const SUPPORTED_LANGUAGES = ${JSON.stringify(ALL_LANGUAGES, null, 2)};`
  );
  
  content = content.replace(
    /export const SUPPORTED_CURRENCIES: Record<string, Currency> = \{[\s\S]*?\};/,
    `export const SUPPORTED_CURRENCIES: Record<string, Currency> = ${JSON.stringify(ALL_CURRENCIES, null, 2).replace(/"([^"]+)":/g, '$1:')};`
  );

  fs.writeFileSync(file, content);
  console.log('CurrencyContext updated');
}

function updateTranslations() {
  const file = 'src/lib/translations.ts';
  let content = fs.readFileSync(file, 'utf8');
  
  const mapping = {};
  ALL_LANGUAGES.forEach(lang => {
    mapping[lang.name] = lang.code;
  });
  
  content = content.replace(
    /export const LANGUAGE_NAME_TO_CODE: Record<string, LanguageCode> = \{[\s\S]*?\};/,
    `export const LANGUAGE_NAME_TO_CODE: Record<string, string> = ${JSON.stringify(mapping, null, 2)};`
  );
  
  content = content.replace(
    /export function getTranslations\(languageName: string\): Translations \{[\s\S]*?\}/,
    `export function getTranslations(languageName: string): Translations {\n  const code = LANGUAGE_NAME_TO_CODE[languageName] ?? 'en';\n  return TRANSLATIONS[code as LanguageCode] ?? TRANSLATIONS.en;\n}`
  );
  
  content = content.replace(
    /export const RTL_LANGUAGES: LanguageCode\[\] = \['ar'\];/,
    `export const RTL_LANGUAGES: string[] = ['ar', 'he', 'ur'];`
  );

  fs.writeFileSync(file, content);
  console.log('translations updated');
}

updateContext();
updateTranslations();
