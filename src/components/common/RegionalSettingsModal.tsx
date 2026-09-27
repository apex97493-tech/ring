'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Globe, Check } from 'lucide-react';
import {
  useCurrency,
  SUPPORTED_REGIONS,
  SUPPORTED_LANGUAGES,
  SUPPORTED_CURRENCIES,
} from '@/context/CurrencyContext';

export default function RegionalSettingsModal() {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    selectedRegion,
    selectedLanguage,
    selectedCurrency,
    updateSettings,
  } = useCurrency();

  const [tempRegionId, setTempRegionId] = useState(selectedRegion.id);
  const [tempLanguage, setTempLanguage] = useState(selectedLanguage);
  const [tempCurrencyCode, setTempCurrencyCode] = useState(selectedCurrency.code);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isSettingsModalOpen) {
      setTempRegionId(selectedRegion.id);
      setTempLanguage(selectedLanguage);
      setTempCurrencyCode(selectedCurrency.code);
    }
  }, [isSettingsModalOpen, selectedRegion, selectedLanguage, selectedCurrency]);

  // When region changes, optionally update the default currency
  const handleRegionChange = (newRegionId: string) => {
    setTempRegionId(newRegionId);
    const matchedRegion = SUPPORTED_REGIONS.find((r) => r.id === newRegionId);
    if (matchedRegion?.defaultCurrency && SUPPORTED_CURRENCIES[matchedRegion.defaultCurrency]) {
      setTempCurrencyCode(matchedRegion.defaultCurrency);
    }
  };

  const handleSave = () => {
    updateSettings(tempRegionId, tempLanguage, tempCurrencyCode);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      setIsSettingsModalOpen(false);
    }, 600);
  };

  const handleCancel = () => {
    setIsSettingsModalOpen(false);
  };

  if (!isSettingsModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={handleCancel} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200 text-[#18181B]"
        >
          {/* Close button */}
          <button
            onClick={handleCancel}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading (matches Etsy design) */}
          <div className="mb-6 pr-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#18181B] mb-2">
              Update your settings
            </h2>
            <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
              Set where you live, the language you use, and the currency you pay in.
            </p>
          </div>

          <div className="space-y-5">
            {/* 1. Region / Country */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 font-sans">
                Region / Country
              </label>
              <div className="relative">
                <select
                  value={tempRegionId}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 hover:border-gray-500 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-3.5 py-3 text-sm text-[#18181B] font-sans appearance-none cursor-pointer transition-colors shadow-2xs pr-10"
                >
                  {SUPPORTED_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.flag} {r.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* 2. Language */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 font-sans">
                Language
              </label>
              <div className="relative">
                <select
                  value={tempLanguage}
                  onChange={(e) => setTempLanguage(e.target.value)}
                  className="w-full bg-white border border-gray-300 hover:border-gray-500 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-3.5 py-3 text-sm text-[#18181B] font-sans appearance-none cursor-pointer transition-colors shadow-2xs pr-10"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.name}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* 3. Currency */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 font-sans">
                Currency
              </label>
              <div className="relative">
                <select
                  value={tempCurrencyCode}
                  onChange={(e) => setTempCurrencyCode(e.target.value)}
                  className="w-full bg-white border border-gray-300 hover:border-gray-500 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-3.5 py-3 text-sm text-[#18181B] font-sans appearance-none cursor-pointer transition-colors shadow-2xs pr-10"
                >
                  {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons (matches Etsy layout: Cancel on left, Save on right) */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-2.5 rounded-full bg-[#18181B] hover:bg-[#D4AF37] hover:text-[#022C22] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {isSavedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Saved
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
