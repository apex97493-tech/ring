'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Save,
  Eye,
  Check,
  ArrowLeft,
  Image as ImageIcon,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Gem,
  ExternalLink,
  UploadCloud,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  FileText,
  Sliders,
  DollarSign,
  FolderOpen,
  Download,
  Globe,
  Wand2,
  Tag,
  Package,
  ShieldCheck,
  Ruler,
  Hash,
  BarChart3,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product, ProductVariant, SHAPES, METALS } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/products/ProductCard';
import ProductImageGallery from '@/components/products/ProductImageGallery';

const PASSCODE = 'aura2026';

const EMPTY_PRODUCT: Product = {
  id: '',
  name: '',
  slug: '',
  category: 'rings',
  shape: 'Oval',
  price: 3999,
  originalPrice: 7999,
  carat: '2.00 CT',
  clarity: 'VVS1',
  colorGrade: 'D Color (Colorless)',
  cut: 'Oval Brilliant Cut',
  certification: 'GRA Certified with Authenticity Card',
  badge: 'NEW ARRIVAL',
  rating: 5.0,
  reviewsCount: 12,
  metal: '925 Sterling Silver',
  readyToShip: true,
  primaryGemstone: 'Natural Rose Quartz',
  secondaryGemstone: 'CZ Diamond Accents',
  ringStyle: 'Art Deco / Royal Solitaire',
  occasion: 'Engagement & Wedding',
  deliveryTime: '4-7 Days Free Express Delivery',
  sku: 'AUR-ROSE-001',
  stockStatus: 'in_stock',
  stockQuantity: 10,
  metaTitle: '',
  metaDescription: '',
  isFeatured: false,
  variants: [
    { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: '' },
    { metal: '14k Yellow Gold', colorCode: '#CA8A04', image: '' },
    { metal: '14k Rose Gold', colorCode: '#FB7185', image: '' },
  ],
  images: [],
  description: 'Handcrafted with passion by master artisans in India. Features an exquisite center stone held in a secure designer claw setting with brilliant light refraction and lifetime durability.\n\nDesigned for everyday luxury and milestone celebrations, each piece is cast in certified premium metal with a comfort-fit interior shank.',
  features: [
    'Handmade in India by Master Artisans',
    'Passes Standard Thermal Testers',
    'Laser-Inscribed Authenticity Serial Code',
    'Solid Comfort-Fit Shank',
    'Arrives in Luxury Velvet Gift Box'
  ],
};

export default function AdminBurgerPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults } = useProducts();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Selected Product State
  const [formData, setFormData] = useState<Product>(EMPTY_PRODUCT);
  const [isNewListing, setIsNewListing] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'media' | 'specs' | 'pricing' | 'variants' | 'story' | 'seo'>('media');
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');
  const [isPreviewingDescription, setIsPreviewingDescription] = useState<boolean>(false);

  // Search & Pagination state for catalog
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState<boolean>(false);

  // Uploading state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Temporary inputs
  const [singleUrlInput, setSingleUrlInput] = useState<string>('');
  const [bulkUrlsInput, setBulkUrlsInput] = useState<string>('');
  const [showUrlInputs, setShowUrlInputs] = useState<boolean>(false);
  const [newFeatureText, setNewFeatureText] = useState<string>('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('aura_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === PASSCODE) {
      setIsAuthenticated(true);
      sessionStorage.setItem('aura_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect Master PIN. Please try again.');
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aura_admin_auth');
    setEnteredPin('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Select a product from sidebar
  const handleSelectProduct = (p: Product) => {
    setFormData({
      ...p,
      sku: p.sku || `AUR-${(p.shape || 'RNG').toUpperCase()}-${p.id.replace(/[^0-9]/g, '').slice(-4) || '001'}`,
      stockStatus: p.stockStatus || (p.readyToShip ? 'in_stock' : 'made_to_order'),
      stockQuantity: p.stockQuantity ?? 10,
      metaTitle: p.metaTitle || `${p.name} | AURA Fine Jewelry`,
      metaDescription: p.metaDescription || (p.description ? p.description.slice(0, 155) : ''),
      isFeatured: p.isFeatured ?? (p.badge === 'BESTSELLER'),
      variants: p.variants ? [...p.variants] : [],
      images: p.images ? [...p.images] : [],
      features: p.features ? [...p.features] : [],
    });
    setIsNewListing(false);
    showToast(`Loaded details for "${p.name}"`);
  };

  // Create brand new product
  const handleCreateNew = () => {
    const newId = `moi-${Date.now().toString().slice(-4)}`;
    setFormData({
      ...EMPTY_PRODUCT,
      id: newId,
      sku: `AUR-NEW-${newId.slice(-4)}`,
      name: '',
      slug: '',
      images: [],
    });
    setIsNewListing(true);
    showToast('Ready to add a new product');
  };

  // Duplicate current product
  const handleDuplicate = () => {
    const newId = `moi-${Date.now().toString().slice(-4)}`;
    const newSlug = `${formData.slug}-copy-${Date.now().toString().slice(-3)}`;
    setFormData((prev) => ({
      ...prev,
      id: newId,
      sku: `AUR-${(prev.shape || 'RNG').toUpperCase()}-${newId.slice(-4)}`,
      slug: newSlug,
      name: `${prev.name} (Copy)`,
    }));
    setIsNewListing(true);
    showToast('Duplicated as new product draft');
  };

  // Auto-generate SKU Code
  const handleGenerateSku = () => {
    const shapeCode = (formData.shape || 'RNG').toUpperCase().slice(0, 4);
    const metalCode = formData.metal?.includes('Gold') ? '14K' : '925';
    const num = formData.id.replace(/[^0-9]/g, '').slice(-3) || Math.floor(100 + Math.random() * 900).toString();
    const newSku = `AUR-${shapeCode}-${metalCode}-${num}`;
    setFormData((prev) => ({ ...prev, sku: newSku }));
    showToast(`Generated SKU: ${newSku}`);
  };

  // Export full store catalog backup as JSON
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura_store_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 Downloaded complete store catalog JSON backup!');
  };

  // Clean raw congested text into luxury formatted paragraphs
  const handleAutoCleanDescription = () => {
    if (!formData.description) return;
    let text = formData.description;

    text = text
      .replace(/thanks for visiting foreverjewellstudio/gi, 'Thank you for choosing AURA Fine Jewelry')
      .replace(/foreverjewellstudio/gi, 'AURA Fine Jewelry')
      .replace(/important\*:-?/gi, '')
      .replace(/\*{1,5}/g, '');

    const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const narrative: string[] = [];
    const extractedFeatures: string[] = [];

    for (const line of lines) {
      const isRawSpec = /^(Primary Gemstone|Secondary Gemstone|Cut\/Shape|Color|Clarity|Jewelry Type|Metal|Method|Personalization|Occasion|Style|Ring Size|Country of Manufacture|Standard Delivery|Speed Delivery):/i.test(line);
      if (!isRawSpec) {
        narrative.push(line);
      } else if (line.toLowerCase().includes('handmade') || line.toLowerCase().includes('comfort') || line.toLowerCase().includes('box')) {
        extractedFeatures.push(line.replace(/^[•\*\-\s]+/, ''));
      }
    }

    const cleanedNarrative = narrative.join('\n\n');
    setFormData((prev) => ({
      ...prev,
      description: cleanedNarrative || prev.description,
      features: extractedFeatures.length > 0 ? Array.from(new Set([...prev.features, ...extractedFeatures])) : prev.features,
    }));
    showToast('✨ Cleaned description into formatted luxury paragraphs!');
  };

  // Apply rich luxury story presets
  const applyDescriptionTemplate = (templateKey: 'solitaire' | 'artdeco' | 'rosequartz') => {
    if (templateKey === 'solitaire') {
      setFormData((prev) => ({
        ...prev,
        description: `Handcrafted with passion by master artisans in India, this timeless solitaire engagement ring captures pure romance. Features a brilliant center gemstone secured in a high-polish designer claw setting that maximizes fire, brilliance, and light dispersion.\n\nCrafted with a comfort-fit interior band for effortless everyday wear, each ring is cast in certified premium metal with exceptional luster and durability. Arrives ready to gift inside our illuminated signature velvet luxury box with a laboratory authenticity card.`,
      }));
      showToast('Applied Solitaire Romance Story');
    } else if (templateKey === 'artdeco') {
      setFormData((prev) => ({
        ...prev,
        description: `Inspired by royal Art Deco grandeur, this vintage-inspired heirloom ring showcases an exquisite center stone flanked by delicate handcrafted filigree and sparkling brilliant accents.\n\nEvery facet is cut to exacting symmetry, producing unparalleled scintillation and optical fire. Hand-finished with a solid luxury shank, this ring is an enduring symbol of love and artisanal heritage.`,
      }));
      showToast('Applied Art Deco Vintage Story');
    } else if (templateKey === 'rosequartz') {
      setFormData((prev) => ({
        ...prev,
        description: `Handcrafted with passion by master artisans in India, this vintage-inspired Oval Cut Rose Quartz ring captures timeless romantic allure. An ethereal blush-pink oval center gemstone is held securely in an artisan prong setting, flanked by shimmering round brilliant accent stones on a comfort-fit solid band.\n\nDesigned for everyday elegance and milestone moments, each ring is cast in certified premium metal with exceptional luster and durability. Arrives ready to gift inside our illuminated signature luxury box.`,
      }));
      showToast('Applied Rose Quartz Heritage Story');
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${formData.name}" from your store?`)) {
      await deleteProduct(formData.id);
      showToast(`Deleted "${formData.name}"`);
      handleCreateNew();
    }
  };

  // Update Name & auto-generate slug
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: isNewListing ? slug : prev.slug,
    }));
  };

  // =========================================================================
  // DEVICE FILE UPLOAD HANDLER (Real computer / phone files)
  // =========================================================================
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    showToast(`Uploading ${files.length} photo${files.length > 1 ? 's' : ''} from your device...`);

    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        setFormData((prev) => {
          const currentImages = prev.images || [];
          return {
            ...prev,
            images: [...currentImages, ...data.urls],
            variants: prev.variants.map((v, i) => i === 0 && !v.image ? { ...v, image: data.urls[0] } : v),
          };
        });
        showToast(`✓ Added ${data.urls.length} photo${data.urls.length > 1 ? 's' : ''} from your device!`);
      } else {
        // Fallback: local FileReader Base64
        const dataUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          const p = new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(files[i]);
          });
          dataUrls.push(await p);
        }
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...dataUrls],
        }));
        showToast(`✓ Loaded ${dataUrls.length} photo${dataUrls.length > 1 ? 's' : ''} from your device!`);
      }
    } catch (err) {
      console.error('Upload error, using local FileReader fallback:', err);
      const dataUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        const p = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(files[i]);
        });
        dataUrls.push(await p);
      }
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...dataUrls],
      }));
      showToast(`✓ Loaded ${dataUrls.length} photo${dataUrls.length > 1 ? 's' : ''} from your device!`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeviceFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Add single URL
  const handleAddSingleUrl = (url: string) => {
    if (!url.trim()) return;
    if (formData.images.includes(url.trim())) {
      showToast('Image already in gallery');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url.trim()],
    }));
    setSingleUrlInput('');
    showToast('Photo URL added');
  };

  // Add bulk URLs
  const handleAddBulkUrls = () => {
    if (!bulkUrlsInput.trim()) return;
    const urls = bulkUrlsInput
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 5);

    if (urls.length === 0) return;

    setFormData((prev) => {
      const existing = new Set(prev.images);
      const toAdd = urls.filter((u) => !existing.has(u));
      return {
        ...prev,
        images: [...prev.images, ...toAdd],
      };
    });
    setBulkUrlsInput('');
    showToast(`Added ${urls.length} photo links`);
  };

  // Move photo position (Up/Down)
  const handleMoveImage = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= formData.images.length) return;

    setFormData((prev) => {
      const copy = [...prev.images];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return { ...prev, images: copy };
    });
  };

  // Remove photo
  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Set as primary cover photo
  const handleSetPrimaryImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [imageUrl, ...prev.images.filter((img) => img !== imageUrl)],
      variants: prev.variants.map((v, i) => i === 0 ? { ...v, image: imageUrl } : v),
    }));
    showToast('Primary cover photo set');
  };

  // Add feature bullet
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()],
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  // Save / Publish product
  const handleSaveProduct = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a product name before saving.');
      return;
    }

    const finalId = formData.id || `moi-${Date.now().toString().slice(-4)}`;
    const finalSlug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const coverPhoto = formData.images.length > 0 ? formData.images[0] : '/images/ai_ring1_front.jpg';

    // Synchronize variant images with uploaded photos so stale placeholders never show
    const cleanVariants = (formData.variants && formData.variants.length > 0)
      ? formData.variants.map((v, i) => {
          const isStale = !v.image || v.image.includes('ai_ring1');
          return {
            ...v,
            image: isStale ? (formData.images[i] || coverPhoto) : v.image,
          };
        })
      : [
          { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: coverPhoto },
          { metal: '14k Yellow Gold', colorCode: '#CA8A04', image: formData.images[1] || coverPhoto },
          { metal: '14k Rose Gold', colorCode: '#FB7185', image: formData.images[2] || coverPhoto },
        ];

    const finalSku = formData.sku?.trim() || `AUR-${(formData.shape || 'RNG').toUpperCase()}-${finalId.replace(/[^0-9]/g, '').slice(-4) || '001'}`;
    const productToSave: Product = {
      ...formData,
      id: finalId,
      slug: finalSlug,
      sku: finalSku,
      stockStatus: formData.stockStatus || (formData.readyToShip ? 'in_stock' : 'made_to_order'),
      stockQuantity: Number(formData.stockQuantity) || 10,
      metaTitle: formData.metaTitle || `${formData.name} | AURA Fine Jewelry`,
      metaDescription: formData.metaDescription || (formData.description ? formData.description.slice(0, 155) : ''),
      isFeatured: formData.isFeatured ?? (formData.badge === 'BESTSELLER'),
      price: Number(formData.price) || 2999,
      originalPrice: Number(formData.originalPrice) || 5999,
      rating: Number(formData.rating) || 5.0,
      reviewsCount: Number(formData.reviewsCount) || 10,
      images: formData.images.length > 0 ? formData.images : ['/images/ai_ring1_front.jpg'],
      variants: cleanVariants,
    };

    if (isNewListing) {
      await addProduct(productToSave);
      showToast(`🎉 "${productToSave.name}" published live to store!`);
      setIsNewListing(false);
    } else {
      await updateProduct(productToSave);
      showToast(`✓ "${productToSave.name}" updated successfully!`);
    }
  };

  // Filter products for sidebar
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategoryFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const startIndex = filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  // =========================================================================
  // LOCK SCREEN (Protected Access)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#021A14] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#042820] border border-[#D4AF37]/30 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-[#021A14] border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-5 text-[#D4AF37] shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
            Official Store Portal
          </span>
          <h1 className="font-serif text-2xl font-bold text-white mb-2">
            AURA Atelier Vault
          </h1>
          <p className="text-xs text-gray-300 mb-6">
            Enter your administrative master passcode to manage products and store catalog.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Master PIN..."
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                className="w-full bg-[#021A14] border border-[#D4AF37]/40 rounded-xl py-3.5 px-4 text-center text-white placeholder-gray-500 font-mono tracking-widest text-lg focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-[#D4AF37] absolute right-4 top-1/2 -translate-y-1/2 opacity-70" />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-sans flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{pinError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#022C22] font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
            <span className="font-mono text-[10px] text-[#D4AF37]/70">Default PIN: aura2026</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN INTERFACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#05130F] text-gray-100 flex flex-col font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-[#022C22] text-[#D4AF37] border border-[#D4AF37]/50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 font-sans text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER BAR */}
      <header className="bg-[#021A14] border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#022C22] flex items-center justify-center font-serif font-bold text-sm shadow">
              A
            </div>
            <div>
              <h1 className="font-serif text-sm font-bold text-white tracking-wide">
                AURA Atelier • Product Manager
              </h1>
              <p className="text-[10px] text-[#D4AF37] font-mono">
                Admin Control Room • {products.length} Products Live
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-medium border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleCreateNew}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>

          <button
            onClick={handleSaveProduct}
            className="px-4 py-1.5 bg-[#D4AF37] hover:bg-white text-[#022C22] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish</span>
          </button>

          <button
            onClick={handleLock}
            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Lock Admin Portal"
          >
            <Unlock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
        {/* =================================================================== */}
        {/* LEFT COLUMN: PRODUCT CATALOG BROWSER (4 COLS)                       */}
        {/* =================================================================== */}
        <aside className="lg:col-span-4 bg-[#031E18] border-r border-white/10 flex flex-col h-auto lg:h-[calc(100vh-57px)]">
          {/* Mobile Drawer Bar (Prevents scrolling through 100 items on phone) */}
          <div className="lg:hidden p-3 bg-[#021A14] border-b border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMobileCatalogOpen(!isMobileCatalogOpen)}
              className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Catalog ({filteredProducts.length} Rings)</span>
              <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-full font-semibold">
                {isMobileCatalogOpen ? '▲ Collapse' : '▼ Browse Products'}
              </span>
            </button>
            <span className="text-[11px] text-gray-400 font-mono">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Catalog Body (Always visible on desktop, toggleable on mobile) */}
          <div className={`${isMobileCatalogOpen ? 'flex' : 'hidden lg:flex'} flex-col flex-1 min-h-0`}>
            {/* Search & Category Filter */}
            <div className="p-3.5 border-b border-white/10 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-0.5 text-xs">
                {['all', 'rings', 'earrings', 'necklaces'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap cursor-pointer transition-colors text-[10px] font-medium ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#D4AF37] text-[#022C22] font-bold'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Items Counter & Per-Page Selector */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>
                  Showing {filteredProducts.length > 0 ? `${startIndex}–${endIndex}` : 0} of {filteredProducts.length} items
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-black/50 border border-white/20 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none cursor-pointer"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Paginated Products List (5 items per page) */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5 min-h-[300px] lg:min-h-0">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isSelected = formData.id === p.id && !isNewListing;
                  const primaryImg = p.images?.[0] || p.variants?.[0]?.image || '/images/ai_ring1_front.jpg';

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        handleSelectProduct(p);
                        setIsMobileCatalogOpen(false); // Auto-close on mobile so editor is immediately in view!
                      }}
                      className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#06382C] border-l-4 border-[#D4AF37]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <img
                        src={primaryImg}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover bg-black/40 border border-white/10 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = '/images/ai_ring1_front.jpg';
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-serif text-xs font-bold text-white truncate block">
                            {p.name}
                          </span>
                          {p.badge && (
                            <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.2 rounded font-mono flex-shrink-0">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-sans text-xs font-bold text-emerald-400">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <span className="font-sans text-[10px] text-gray-400">
                            • {p.images?.length || 0} photos • {p.shape}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs">
                  No products found matching your search.
                </div>
              )}
            </div>

            {/* Bottom Pagination Bar */}
            {totalPages > 1 && (
              <div className="p-3 bg-[#021711] border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/15 disabled:opacity-25 disabled:hover:bg-white/5 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed text-[11px] font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <div className="flex items-center gap-1">
                  {totalPages <= 5 ? (
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#D4AF37] text-[#022C22] shadow'
                            : 'bg-black/30 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg text-xs font-mono">
                      <span className="text-[#D4AF37] font-bold">{currentPage}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-gray-400">{totalPages}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/15 disabled:opacity-25 disabled:hover:bg-white/5 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed text-[11px] font-semibold"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: MAIN PRODUCT EDITOR WORKSPACE (8 COLS)                */}
        {/* =================================================================== */}
        <main className="lg:col-span-8 flex flex-col h-auto lg:h-[calc(100vh-57px)] overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#041611]">
          {/* Top Product Banner */}
          <div className="bg-[#02241D] border border-[#D4AF37]/30 p-5 rounded-2xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  {isNewListing ? '✨ Adding New Product' : `✏️ Editing: ${formData.id}`}
                </span>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-700">
                  {formData.readyToShip ? 'Ready to Ship' : 'Made to Order'}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                {formData.name || 'Untitled Ring Creation'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {!isNewListing && (
                <>
                  <button
                    type="button"
                    onClick={() => window.open(`/products/${formData.slug}`, '_blank')}
                    className="px-3 py-2 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold rounded-xl transition-colors border border-emerald-700/60 flex items-center gap-1.5 cursor-pointer"
                    title="View this product live on store"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View on Store</span>
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-xl transition-colors border border-rose-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3 py-2 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-semibold rounded-xl border border-white/15 flex items-center gap-1.5 cursor-pointer"
                title="Download JSON store catalog backup"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Backup</span>
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-white text-[#022C22] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save to Store</span>
              </button>
            </div>
          </div>

          {/* Clean High-Visibility Navigation Pills (Never cut off!) */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#021A14] p-2 rounded-2xl border border-white/10">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('media')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'media'
                    ? 'bg-[#D4AF37] text-[#022C22] shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>1. Photos ({formData.images.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('specs')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'specs'
                    ? 'bg-[#D4AF37] text-[#022C22] shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Gem className="w-3.5 h-3.5" />
                <span>2. Gemstones & Specs</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'bg-[#D4AF37] text-[#022C22] shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>3. Pricing, Stock & SKU</span>
              </button>

              <button
                onClick={() => setActiveTab('variants')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'variants'
                    ? 'bg-[#D4AF37] text-[#022C22] shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>4. Metal Swatches</span>
              </button>

              <button
                onClick={() => setActiveTab('story')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'story'
                    ? 'bg-[#D4AF37] text-[#022C22] shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>5. Description & Story</span>
              </button>

              <button
                onClick={() => setActiveTab('seo')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'seo'
                    ? 'bg-[#D4AF37] text-[#022C22] shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>6. SEO & Badges</span>
              </button>
            </div>

            <button
              onClick={() => setViewMode(viewMode === 'tabs' ? 'all' : 'tabs')}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-[11px] font-semibold rounded-lg border border-white/10 transition-colors ml-auto cursor-pointer"
            >
              {viewMode === 'tabs' ? '📜 View All Sections' : '📑 Tabbed View'}
            </button>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: REAL DEVICE PHOTO UPLOADER (The core feature requested)    */}
          {/* ================================================================= */}
          {(activeTab === 'media' || viewMode === 'all') && (
            <div className="bg-[#032019] p-5 sm:p-7 rounded-2xl border border-white/15 space-y-6 mb-6 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    Product Photos & Gallery
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Upload photos directly from your computer or phone. Support all angles (front, side claw, on-hand, box, certificate).
                  </p>
                </div>
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/40">
                  {formData.images.length} Photos in Gallery
                </span>
              </div>

              {/* REAL DEVICE FILE DROPZONE */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-101'
                    : 'border-white/25 hover:border-[#D4AF37]/80 bg-black/30 hover:bg-black/40'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleDeviceFileInput}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-full bg-[#022C22] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-md">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  Click to Choose Photos from your Device (Computer / Phone)
                </h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-3">
                  Or drag and drop multiple image files here. Supports JPG, PNG, WEBP.
                </p>

                <button
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#022C22] font-bold text-xs rounded-xl shadow cursor-pointer inline-flex items-center gap-1.5"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse Device Files</span>
                </button>

                {isUploading && (
                  <p className="text-xs text-emerald-400 font-semibold mt-3 animate-pulse">
                    Processing and adding photos...
                  </p>
                )}
              </div>

              {/* Active Photos Management Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-200">
                    Current Photos ({formData.images.length}) — Click &lsquo;Set as Cover&rsquo; or delete anytime:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowUrlInputs(!showUrlInputs)}
                    className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    {showUrlInputs ? 'Hide URL inputs' : '+ Or paste external image URLs'}
                  </button>
                </div>

                {formData.images.length === 0 ? (
                  <div className="p-8 text-center bg-black/20 rounded-xl border border-white/10 text-gray-400 text-xs">
                    No photos added yet. Click &lsquo;Browse Device Files&rsquo; above to upload your ring photos!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative group aspect-square rounded-xl overflow-hidden bg-black/60 border transition-all ${
                          idx === 0
                            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-lg'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Product view ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/ai_ring1_front.jpg';
                          }}
                        />

                        {/* Cover Badge */}
                        <span
                          className={`absolute top-2 left-2 text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow z-10 ${
                            idx === 0
                              ? 'bg-[#D4AF37] text-[#022C22]'
                              : 'bg-black/80 text-gray-300'
                          }`}
                        >
                          {idx === 0 ? '★ Primary Cover' : `#${idx + 1}`}
                        </span>

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 z-20">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(img)}
                              className="w-full py-1 bg-[#D4AF37] hover:bg-white text-[#022C22] text-[10px] font-bold rounded cursor-pointer transition-colors"
                            >
                              Set as Cover
                            </button>
                          )}
                          <div className="flex gap-1 w-full justify-center">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'up')}
                                className="p-1 bg-white/20 hover:bg-white/40 text-white rounded text-[10px] cursor-pointer"
                                title="Move Earlier"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {idx < formData.images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'down')}
                                className="p-1 bg-white/20 hover:bg-white/40 text-white rounded text-[10px] cursor-pointer"
                                title="Move Later"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] ml-auto cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional URL input fallback (clean and non-intrusive) */}
              {showUrlInputs && (
                <div className="pt-4 border-t border-white/10 space-y-3 bg-black/20 p-4 rounded-xl">
                  <span className="text-xs font-semibold text-gray-300 block">
                    Optional URL Add (If you already have hosted links):
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste single image URL (https://...)"
                      value={singleUrlInput}
                      onChange={(e) => setSingleUrlInput(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSingleUrl(singleUrlInput)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Or paste multiple URLs (separated by lines or commas)"
                      value={bulkUrlsInput}
                      onChange={(e) => setBulkUrlsInput(e.target.value)}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] font-mono"
                    />
                    <div className="flex justify-end mt-1">
                      <button
                        type="button"
                        onClick={handleAddBulkUrls}
                        className="px-3 py-1.5 bg-[#D4AF37] hover:bg-white text-[#022C22] text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Add Bulk URLs
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: ITEM DETAILS & GEMSTONE SPECIFICATIONS                      */}
          {/* ================================================================= */}
          {(activeTab === 'specs' || viewMode === 'all') && (
            <div className="bg-[#032019] p-5 sm:p-7 rounded-2xl border border-white/15 space-y-6 mb-6 shadow-md">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <Gem className="w-4 h-4 text-[#D4AF37]" />
                Product Title & Gemstone Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oval Cut Rose Quartz Engagement Ring, 14k Solid Gold"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="rings">Rings</option>
                      <option value="earrings">Earrings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="bracelets">Bracelets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Gemstone Shape
                    </label>
                    <select
                      value={formData.shape}
                      onChange={(e: any) => setFormData({ ...formData, shape: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {SHAPES.filter((s) => s.value !== 'all').map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Badge / Tag (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RARE FIND, BESTSELLER"
                      value={formData.badge || ''}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Specific Gemstone Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Primary Gemstone *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Natural Rose Quartz or GRA Moissanite"
                      value={formData.primaryGemstone || ''}
                      onChange={(e) => setFormData({ ...formData, primaryGemstone: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Secondary Gemstone(s)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Round CZ Diamonds / Lab Diamonds"
                      value={formData.secondaryGemstone || ''}
                      onChange={(e) => setFormData({ ...formData, secondaryGemstone: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Carat Weight
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2.00 CT"
                      value={formData.carat}
                      onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Color Grade
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Blush Pink / D-Color"
                      value={formData.colorGrade}
                      onChange={(e) => setFormData({ ...formData, colorGrade: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Clarity Grade
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VVS1 / Eye Clean"
                      value={formData.clarity}
                      onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Cut Symmetry
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oval Brilliant Cut"
                      value={formData.cut}
                      onChange={(e) => setFormData({ ...formData, cut: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Jewelry Style
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Art Deco / Vintage Solitaire"
                      value={formData.ringStyle || ''}
                      onChange={(e) => setFormData({ ...formData, ringStyle: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Occasion
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engagement, Anniversary, Valentine Gift"
                      value={formData.occasion || ''}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: PRICING, INVENTORY & SKU MANAGEMENT                        */}
          {/* ================================================================= */}
          {(activeTab === 'pricing' || viewMode === 'all') && (
            <div className="bg-[#032019] p-5 sm:p-7 rounded-2xl border border-white/15 space-y-6 mb-6 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  Pricing, Stock Inventory & Vault SKU
                </h3>
                {formData.originalPrice > formData.price && (
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full text-[11px] border border-emerald-500/40">
                    {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF (Saves ₹{(formData.originalPrice - formData.price).toLocaleString('en-IN')})
                  </span>
                )}
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm text-emerald-400 font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Actual checkout price charged to the customer.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Original MRP (₹) (Strike-through price)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm text-gray-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Used to showcase exclusive discount savings.
                  </span>
                </div>
              </div>

              {/* SKU & Inventory Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-300">
                      Vault SKU (Stock Code)
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSku}
                      className="text-[10px] text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      ⚡ Auto-Gen
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. AUR-OVAL-925-016"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus || (formData.readyToShip ? 'in_stock' : 'made_to_order')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockStatus: e.target.value,
                        readyToShip: e.target.value === 'in_stock',
                      })
                    }
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="in_stock" className="bg-[#032019]">🟢 In Stock (Ready to Ship)</option>
                    <option value="made_to_order" className="bg-[#032019]">🔵 Made to Order (3-5 Days)</option>
                    <option value="low_stock" className="bg-[#032019]">🟠 Low Stock Warning</option>
                    <option value="out_of_stock" className="bg-[#032019]">🔴 Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Units in Vault / Inventory
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity ?? 10}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Delivery & Certificate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Delivery Estimate Guarantee
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4-7 Days Free Express Delivery"
                    value={formData.deliveryTime || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Laboratory Certificate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GRA Lab Authenticity Report"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.readyToShip}
                    onChange={(e) => setFormData({ ...formData, readyToShip: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span>Mark as Ready to Ship in 24–48 Hours</span>
                </label>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: PRECIOUS METAL VARIANTS                                    */}
          {/* ================================================================= */}
          {(activeTab === 'variants' || viewMode === 'all') && (
            <div className="bg-[#032019] p-5 sm:p-7 rounded-2xl border border-white/15 space-y-6 mb-6 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#D4AF37]" />
                  Precious Metal Swatches
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      variants: [
                        ...formData.variants,
                        {
                          metal: '14k Solid White Gold',
                          colorCode: '#F1F5F9',
                          image: formData.images[0] || '/images/ai_ring1_front.jpg',
                        },
                      ],
                    });
                  }}
                  className="px-3 py-1.5 bg-[#D4AF37] hover:bg-white text-[#022C22] text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Add Metal Option
                </button>
              </div>

              <div className="space-y-3">
                {formData.variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span
                        className="w-5 h-5 rounded-full border border-white/30 flex-shrink-0"
                        style={{ backgroundColor: v.colorCode }}
                      />
                      <input
                        type="text"
                        value={v.metal}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].metal = e.target.value;
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="bg-transparent border-b border-white/20 p-1 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:flex-1">
                      <input
                        type="text"
                        placeholder="Hex Color (#E2E8F0)"
                        value={v.colorCode}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].colorCode = e.target.value;
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="w-24 bg-transparent border-b border-white/20 p-1 text-xs font-mono text-gray-300 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <input
                        type="text"
                        placeholder="Image URL for this metal"
                        value={v.image}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].image = e.target.value;
                          setFormData({ ...formData, variants: updated });
                        }}
                        className="flex-1 bg-transparent border-b border-white/20 p-1 text-xs text-gray-300 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          variants: formData.variants.filter((_, i) => i !== idx),
                        });
                      }}
                      className="p-1.5 text-gray-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: STORY, CRAFTSMANSHIP & BULLETS                             */}
          {/* ================================================================= */}
          {(activeTab === 'story' || viewMode === 'all') && (
            <div className="bg-[#032019] p-5 sm:p-7 rounded-2xl border border-white/15 space-y-6 mb-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
                <div>
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    Design Story & Description Polish
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Format comfortable, luxury paragraphs without congested text or foreign store tags.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoCleanDescription}
                    className="px-3 py-1.5 bg-[#D4AF37] hover:bg-white text-[#022C22] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Automatically clean raw Etsy copy-paste, asterisks, and format into luxury paragraphs"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>✨ Auto-Clean & De-Congest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewingDescription(!isPreviewingDescription)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isPreviewingDescription ? 'Hide Preview' : '👁️ Live Customer View'}</span>
                  </button>
                </div>
              </div>

              {/* Story Preset Templates */}
              <div className="p-3 bg-black/25 rounded-xl border border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-gray-300 block">
                  ⚡ 1-Click Luxury Story Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyDescriptionTemplate('solitaire')}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-xs rounded-lg border border-white/10 cursor-pointer"
                  >
                    Solitaire Romance
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDescriptionTemplate('artdeco')}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-xs rounded-lg border border-white/10 cursor-pointer"
                  >
                    Art Deco Heirloom
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDescriptionTemplate('rosequartz')}
                    className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-xs rounded-lg border border-white/10 cursor-pointer"
                  >
                    Rose Quartz Heritage
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Detailed Item Description *
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter a captivating story about this piece. Supports line breaks and multiple paragraphs."
                  className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] leading-relaxed font-sans"
                />
              </div>

              {/* Live Preview of formatted description */}
              {isPreviewingDescription && (
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E5DF] text-gray-900 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="font-serif text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Customer Reading Experience (Live Preview):
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      ✓ Zero Congestion
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-sans text-gray-700 leading-relaxed">
                    {formData.description
                      .split(/\n+/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-200">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-[10px] text-gray-700 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#064E3B] flex-shrink-0" />
                      <span>Velvet Gift Box</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-[10px] text-gray-700 flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#064E3B] flex-shrink-0" />
                      <span>Custom Sizing</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-[10px] text-gray-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#064E3B] flex-shrink-0" />
                      <span>Authenticity Report</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-[10px] text-gray-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                      <span>Lifetime Polish</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Craftsmanship Bullets */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Craftsmanship Bullet Highlights
                </label>

                <div className="space-y-2 mb-3">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-black/30 rounded-lg border border-white/10">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...formData.features];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, features: updated });
                        }}
                        className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-gray-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 100% Conflict-Free Lab Grown Gemstone"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 bg-white/10 hover:bg-[#D4AF37] hover:text-[#022C22] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Add Highlight
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: SEO & MARKETING BADGES                                     */}
          {/* ================================================================= */}
          {(activeTab === 'seo' || viewMode === 'all') && (
            <div className="bg-[#032019] p-5 sm:p-7 rounded-2xl border border-white/15 space-y-6 mb-6 shadow-md">
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                Marketing Badges & Search Engine Optimization (SEO)
              </h3>

              {/* Marketing Badges Section */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-300">
                  Store Merchandising Badge
                </label>
                <div className="flex flex-wrap gap-2">
                  {['NEW ARRIVAL', 'BESTSELLER', 'LIMITED EDITION', 'BRIDAL FAVORITE', '50% OFF', 'VVS1 D-COLOR'].map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setFormData({ ...formData, badge })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formData.badge === badge
                          ? 'bg-[#D4AF37] text-[#022C22]'
                          : 'bg-black/40 text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, badge: '' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      !formData.badge
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                        : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
                    }`}
                  >
                    No Badge
                  </button>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured ?? false}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span>🌟 Feature on Homepage Spotlight Carousel</span>
                  </label>
                </div>
              </div>

              {/* SEO Google Snippet Preview */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-300">
                      Google Search Title
                    </label>
                    <span className="text-[10px] text-gray-400">
                      {(formData.metaTitle || `${formData.name || 'Ring'} | AURA Fine Jewelry`).length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Oval Rose Quartz Engagement Ring | AURA Fine Jewelry"
                    value={formData.metaTitle || ''}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-300">
                      Google Meta Description
                    </label>
                    <span className="text-[10px] text-gray-400">
                      {(formData.metaDescription || (formData.description ? formData.description.slice(0, 155) : '')).length} / 160 characters
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Brief description that entices shoppers clicking from Google Search..."
                    value={formData.metaDescription || ''}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Google Search Card Preview */}
                <div className="bg-[#202124] p-4 rounded-xl border border-white/10 text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[#D4AF37] font-bold">
                      A
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-300 font-medium block leading-none">AURA Fine Jewelry</span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        https://aurafinejewelry.com &gt; products &gt; {formData.slug || 'product-url'}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-[#8ab4f8] text-sm font-medium hover:underline cursor-pointer pt-1">
                    {formData.metaTitle || `${formData.name || 'Handcrafted Solitaire Ring'} | AURA Fine Jewelry`}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {formData.metaDescription || (formData.description ? formData.description.slice(0, 150) + '...' : 'Shop certified handcrafted engagement rings in 14k Solid Gold and 925 Sterling Silver with free express delivery.')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* BOTTOM LIVE PREVIEW (Interactive customer experience)             */}
          {/* ================================================================= */}
          <div className="mt-6 pt-6 border-t border-white/15 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-[#D4AF37] flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Live Customer Preview (How your uploaded photos appear on store)
              </span>
              <span className="text-[11px] text-gray-400">
                Interactive real-time preview
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-black/30 p-5 rounded-2xl border border-white/10">
              <div className="lg:col-span-4">
                <span className="text-xs font-semibold text-gray-400 block mb-2">1. Catalog Card Preview:</span>
                <ProductCard product={formData} />
              </div>

              <div className="lg:col-span-8 bg-[#FDFBF7] p-4 rounded-2xl border border-gray-300">
                <span className="text-xs font-bold text-gray-800 block mb-2 font-sans">
                  2. Product Detail Page Multi-Photo Gallery Preview ({formData.images.length} photos):
                </span>
                <ProductImageGallery
                  images={formData.images}
                  productName={formData.name || 'Sample Product'}
                  productId={formData.id || 'preview'}
                  badge={formData.badge}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
