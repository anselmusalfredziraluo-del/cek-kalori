import React, { useState, useRef, useMemo } from 'react';
import { useApp, formatCaloriesText } from '../context/AppContext';
import { FoodItem, MealType } from '../types';
import { CATEGORY_LABELS, MEAL_TYPE_CONFIG } from '../data/foodsData';
import {
  Search,
  Camera,
  Upload,
  Sparkles,
  Plus,
  X,
  Check,
  Grid,
  List,
  AlertCircle,
  HelpCircle,
  Info,
  Clock,
  ChevronRight,
  Flame,
  RotateCcw
} from 'lucide-react';

export const AddFoodView: React.FC = () => {
  const { foodsDatabase, addFoodLog, addCustomFood, setActiveTab } = useApp();

  // Mode: 'catalog' | 'scanner'
  const [activeMode, setActiveMode] = useState<'catalog' | 'scanner'>('catalog');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewStyle, setViewStyle] = useState<'cards' | 'list'>('cards');

  // Detail Modal / Selection
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portionCount, setPortionCount] = useState<number>(1);
  const [selectedMealType, setSelectedMealType] = useState<MealType>(() => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 11) return 'sarapan';
    if (hr >= 11 && hr < 16) return 'makan_siang';
    if (hr >= 16 && hr < 21) return 'makan_malam';
    return 'camilan';
  });
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Custom Food Modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('1 porsi');
  const [customCalMin, setCustomCalMin] = useState('');
  const [customCalMax, setCustomCalMax] = useState('');
  const [customCarbs, setCustomCarbs] = useState('20');
  const [customProtein, setCustomProtein] = useState('8');
  const [customFat, setCustomFat] = useState('6');
  const [customFiber, setCustomFiber] = useState('2');

  // AI Scanner States
  const [scanImageBase64, setScanImageBase64] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered Foods
  const filteredFoods = useMemo(() => {
    let result = foodsDatabase;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [foodsDatabase, selectedCategory, searchQuery]);

  // Open detail for a food
  const handleOpenDetail = (food: FoodItem) => {
    setSelectedFood(food);
    setPortionCount(1);
    setNotes('');
  };

  // Calculate scaled calories and macros
  const calculatedStats = useMemo(() => {
    if (!selectedFood) return null;
    const count = Math.max(0.1, portionCount);
    const min = Math.round(selectedFood.caloriesMin * count);
    const max = Math.round(selectedFood.caloriesMax * count);
    const isRange = selectedFood.isRange && min !== max;

    return {
      min,
      max,
      isRange,
      carbs: Math.round(selectedFood.carbs * count * 10) / 10,
      protein: Math.round(selectedFood.protein * count * 10) / 10,
      fat: Math.round(selectedFood.fat * count * 10) / 10,
      fiber: Math.round(selectedFood.fiber * count * 10) / 10,
    };
  }, [selectedFood, portionCount]);

  // Save food log
  const handleSaveToLog = async () => {
    if (isSaving || !selectedFood || !calculatedStats) return;
    setIsSaving(true);

    try {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const success = await addFoodLog({
        foodId: selectedFood.id,
        foodName: selectedFood.name,
        category: selectedFood.category,
        portionQuantity: portionCount,
        servingSize: selectedFood.servingSize,
        caloriesMin: calculatedStats.min,
        caloriesMax: calculatedStats.max,
        isRange: calculatedStats.isRange,
        carbs: calculatedStats.carbs,
        protein: calculatedStats.protein,
        fat: calculatedStats.fat,
        fiber: calculatedStats.fiber,
        mealType: selectedMealType,
        date: today,
        time,
        notes: notes.trim() || undefined,
        emoji: selectedFood.emoji,
      });

      if (success) {
        setSelectedFood(null);
        setActiveTab('beranda');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Save manual custom food
  const handleSaveCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const min = parseFloat(customCalMin) || 150;
    const max = parseFloat(customCalMax) || min;

    const newFood = await addCustomFood({
      name: customName.trim(),
      category: 'kustom',
      servingSize: customServing.trim() || '1 porsi',
      caloriesMin: min,
      caloriesMax: max,
      carbs: parseFloat(customCarbs) || 20,
      protein: parseFloat(customProtein) || 8,
      fat: parseFloat(customFat) || 5,
      fiber: parseFloat(customFiber) || 2,
      source: 'Input Manual Pengguna',
      emoji: '🍽️',
      description: 'Makanan kustom yang ditambahkan sendiri oleh pengguna.',
    });

    setIsCustomModalOpen(false);
    handleOpenDetail(newFood);
  };

  // AI Scanner: Image selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setScanImageBase64(b64);
      analyzeFoodWithAI(b64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  // Camera start/stop
  const startCamera = async () => {
    setIsCameraActive(true);
    setScanError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setIsCameraActive(false);
      setScanError('Tidak dapat mengakses kamera. Silakan pilih opsi Unggah Foto.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const b64 = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      setScanImageBase64(b64);
      analyzeFoodWithAI(b64, 'image/jpeg');
    }
  };

  // Call server-side Gemini API
  const analyzeFoodWithAI = async (base64Img: string, mime: string) => {
    setIsScanning(true);
    setScanResult(null);
    setScanError(null);

    try {
      const response = await fetch('/api/gemini/scan-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          mimeType: mime,
        }),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.message || 'Gagal memproses gambar makanan.');
      }

      if (!resJson.data || !resJson.data.recognized) {
        setScanError('Maaf, makanan belum dapat dikenali. Silakan cari makanan secara manual.');
        return;
      }

      setScanResult(resJson.data);
    } catch (err: any) {
      console.error('Scan error:', err);
      setScanError(
        err.message || 'Maaf, makanan belum dapat dikenali. Silakan cari makanan secara manual.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 pb-28 md:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#E94F86] uppercase tracking-wider">
            Jurnal Makanan Harian
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tambah Catatan Makanan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cari dari database 56 kuliner Indonesia atau gunakan Scan Foto dengan AI.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl self-start sm:self-auto text-xs font-semibold border border-slate-200/50">
          <button
            onClick={() => setActiveMode('catalog')}
            className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'catalog'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Katalog Makanan</span>
          </button>

          <button
            onClick={() => setActiveMode('scanner')}
            className={`py-2 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === 'scanner'
                ? 'bg-white text-[#E94F86] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scan AI Foto</span>
            <span className="text-[10px] bg-pink-100 text-[#E94F86] px-1.5 py-0.2 rounded-sm font-bold">
              AI
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: KATALOG 56 MAKANAN DAN PENCARIAN
          ======================================================== */}
      {activeMode === 'catalog' && (
        <div className="space-y-4">
          {/* Search Bar & View Toggle */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari makanan (misal: Nasi Goreng, Ayam Geprek, Boba, Bakso)..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:border-[#E94F86] focus:ring-2 focus:ring-pink-100 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Category Dropdown on Small Screens */}
              <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <button
                  onClick={() => setViewStyle('cards')}
                  title="Tampilan Kartu"
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewStyle === 'cards'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewStyle('list')}
                  title="Tampilan Daftar"
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    viewStyle === 'list'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Add Custom Button */}
              <button
                onClick={() => setIsCustomModalOpen(true)}
                className="py-2.5 px-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Makanan Manual</span>
                <span className="sm:hidden">Manual</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'Semua (56+)' },
              { id: 'umum', label: 'Umum (16)' },
              { id: 'cepat_saji', label: 'Cepat Saji & Minuman (20)' },
              { id: 'rumahan', label: 'Rumahan (20)' },
              { id: 'kustom', label: 'Kustom Saya' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1.5 px-3.5 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#E94F86] text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-800">{filteredFoods.length}</span> pilihan makanan
          </div>

          {/* Food Grid / List */}
          {filteredFoods.length === 0 ? (
            /* Not Found State as per Section 7 */
            <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl mb-3">
                🔍
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">
                Makanan belum tersedia dalam database.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-5">
                Jangan khawatir! Anda dapat memasukkan nama makanan dan perkiraan kalori secara manual.
              </p>
              <button
                onClick={() => {
                  setCustomName(searchQuery);
                  setIsCustomModalOpen(true);
                }}
                className="py-2.5 px-5 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambahkan &ldquo;{searchQuery || 'Makanan Baru'}&rdquo; Secara Manual</span>
              </button>
            </div>
          ) : viewStyle === 'cards' ? (
            /* Cards View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleOpenDetail(food)}
                  className="p-4 rounded-3xl bg-white border border-slate-100 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                        {food.emoji}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {food.category === 'umum'
                          ? 'Umum'
                          : food.category === 'cepat_saji'
                          ? 'Cepat Saji'
                          : food.category === 'rumahan'
                          ? 'Rumahan'
                          : 'Kustom'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#E94F86] transition-colors leading-snug">
                      {food.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      Porsi: {food.servingSize}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-[#E94F86] tabular-nums">
                        {formatCaloriesText(food.caloriesMin, food.caloriesMax, food.isRange)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        K: {food.carbs}g · P: {food.protein}g · L: {food.fat}g
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-pink-50 text-[#E94F86] flex items-center justify-center group-hover:bg-[#E94F86] group-hover:text-white transition-colors">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden divide-y divide-slate-100 shadow-xs">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleOpenDetail(food)}
                  className="p-3.5 sm:p-4 hover:bg-pink-50/40 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                      {food.emoji}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#E94F86] transition-colors truncate">
                        {food.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        Porsi: {food.servingSize}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-extrabold text-sm text-[#E94F86] tabular-nums">
                        {formatCaloriesText(food.caloriesMin, food.caloriesMax, food.isRange)}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        K: {food.carbs}g · P: {food.protein}g
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 2: SCAN MAKANAN DENGAN AI (GEMINI)
          ======================================================== */}
      {activeMode === 'scanner' && (
        <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-50 to-pink-100 flex items-center justify-center mx-auto mb-3 text-[#E94F86]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Scan Makanan dengan AI
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ambil foto atau unggah gambar makananmu. Gemini AI akan menganalisis kemungkinan menu dan porsi secara otomatis.
            </p>
          </div>

          {/* Camera Viewport or Image Preview */}
          <div className="relative rounded-3xl bg-slate-900 text-white overflow-hidden min-h-[260px] flex items-center justify-center border border-slate-800">
            {isCameraActive ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-[360px] object-cover"
                />
                <div className="absolute bottom-4 flex items-center gap-3">
                  <button
                    onClick={captureCameraPhoto}
                    className="py-2.5 px-6 rounded-full font-bold bg-[#E94F86] text-white shadow-lg active:scale-95 transition-all flex items-center gap-2 text-xs cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="py-2.5 px-4 rounded-full font-semibold bg-white/20 text-white backdrop-blur-md text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : scanImageBase64 ? (
              <div className="relative w-full h-full flex flex-col items-center p-4">
                <img
                  src={scanImageBase64}
                  alt="Foto makanan dianalisis"
                  referrerPolicy="no-referrer"
                  className="max-h-[300px] w-auto rounded-2xl object-contain shadow-lg"
                />
                <button
                  onClick={() => {
                    setScanImageBase64(null);
                    setScanResult(null);
                    setScanError(null);
                  }}
                  className="absolute top-6 right-6 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-slate-300">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">
                    Arahkan kamera ke makanan Anda
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Pastikan pencahayaan cukup terang agar AI mengenali jenis hidangan dengan tepat.
                  </p>
                </div>
              </div>
            )}

            {/* Scanning Overlay Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 z-20">
                <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4" />
                <h4 className="font-bold text-white text-sm mb-1">
                  Sedang Menganalisis Makanan dengan Gemini AI...
                </h4>
                <p className="text-xs text-pink-200 max-w-xs">
                  Mencocokkan citra makanan dengan database gizi Indonesia.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons: Camera or Upload */}
          {!isCameraActive && !isScanning && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startCamera}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-95 transition-all text-xs flex items-center justify-center gap-2 shadow-sm shadow-pink-200 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Buka Kamera Ponsel</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Unggah Foto dari Galeri</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>
          )}

          {/* Error Notice */}
          {scanError && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-0.5">{scanError}</p>
                <p className="text-[11px] text-amber-700">
                  Anda tetap bisa mencari makanan melalui tab &ldquo;Katalog Makanan&rdquo; di atas atau memasukkannya secara manual.
                </p>
              </div>
            </div>
          )}

          {/* AI Detection Result Confirmation Box */}
          {scanResult && scanResult.recognized && (
            <div className="p-5 rounded-3xl bg-pink-50/60 border border-pink-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E94F86] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hasil Analisis AI</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-pink-100">
                  Akurasi AI: {Math.round((scanResult.confidence || 0.85) * 100)}%
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {scanResult.foodName}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Porsi terdeteksi: <span className="font-semibold">{scanResult.detectedPortion}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5 italic">
                  {scanResult.analysisNotes}
                </p>
              </div>

              {/* Nutrients Box */}
              <div className="grid grid-cols-4 gap-2 text-center bg-white p-3 rounded-2xl border border-pink-100">
                <div>
                  <span className="text-[10px] text-slate-400">Kalori</span>
                  <div className="text-xs font-bold text-[#E94F86] tabular-nums">
                    {formatCaloriesText(
                      scanResult.caloriesMin,
                      scanResult.caloriesMax,
                      scanResult.caloriesMin !== scanResult.caloriesMax
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Karbo</span>
                  <div className="text-xs font-bold text-slate-800 tabular-nums">
                    {scanResult.carbs || 30}g
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Protein</span>
                  <div className="text-xs font-bold text-slate-800 tabular-nums">
                    {scanResult.protein || 10}g
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Lemak</span>
                  <div className="text-xs font-bold text-slate-800 tabular-nums">
                    {scanResult.fat || 8}g
                  </div>
                </div>
              </div>

              {/* Alternative Recommendations if any */}
              {Array.isArray(scanResult.alternativeSuggestions) &&
                scanResult.alternativeSuggestions.length > 0 && (
                  <div className="text-xs text-slate-600">
                    <span className="text-slate-400 block mb-1">Kemungkinan menu lain:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.alternativeSuggestions.map((alt: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery(alt);
                            setActiveMode('catalog');
                          }}
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-pink-300 text-slate-700 text-[11px] cursor-pointer"
                        >
                          Cari &ldquo;{alt}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Confirm and Add button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    // Check if matches an existing food in the 56 database
                    const matched = foodsDatabase.find(
                      (f) =>
                        f.name.toLowerCase() === scanResult.foodName?.toLowerCase() ||
                        (scanResult.matchedNameFromList &&
                          f.name.toLowerCase() === scanResult.matchedNameFromList.toLowerCase())
                    );

                    if (matched) {
                      handleOpenDetail(matched);
                    } else {
                      const item: FoodItem = {
                        id: 'ai_' + Date.now(),
                        name: scanResult.foodName,
                        category: 'umum',
                        categoryName: 'Hasil Scan AI',
                        servingSize: scanResult.detectedPortion || '1 porsi',
                        caloriesMin: scanResult.caloriesMin || 250,
                        caloriesMax: scanResult.caloriesMax || 350,
                        carbs: scanResult.carbs || 30,
                        protein: scanResult.protein || 10,
                        fat: scanResult.fat || 8,
                        fiber: scanResult.fiber || 2,
                        isRange: scanResult.caloriesMin !== scanResult.caloriesMax,
                        source: 'Estimasi Analisis Citra Gemini AI',
                        emoji: '📸',
                      };
                      handleOpenDetail(item);
                    }
                  }}
                  className="w-full py-3 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-98 transition-all text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-200 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Konfirmasi & Atur Jumlah Porsi</span>
                </button>
              </div>
            </div>
          )}

          {/* Medical & Accuracy Disclaimer (Mandatory as per Bagian 10 & 16) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold text-slate-700 mb-0.5">Catatan Penting:</p>
              <p>
                Nilai kalori yang diberikan merupakan estimasi awal. AI membantu mengenali kemungkinan nama makanan, bukan mengukur kalori secara akurat hanya berdasarkan foto. Nilai sesungguhnya dapat berbeda tergantung pada resep, minyak, dan cara memasak.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DETAIL MODAL / DRAWER (BAGIAN 7 & 8)
          Portion adjustment, meal time selection, auto recalculation!
          ======================================================== */}
      {selectedFood && calculatedStats && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto p-6 animate-in slide-in-from-bottom duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedFood(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-3xl shrink-0 border border-pink-100">
                {selectedFood.emoji}
              </div>
              <div className="min-w-0 pr-6">
                <span className="text-[10px] font-bold text-[#E94F86] uppercase tracking-wider">
                  {selectedFood.categoryName}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {selectedFood.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standar porsi: <span className="font-semibold text-slate-700">{selectedFood.servingSize}</span>
                </p>
              </div>
            </div>

            {/* Recalculated Energy Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-600">
                  Estimasi Total ({portionCount}x porsi)
                </span>
                <div className="text-2xl font-black text-[#E94F86] tabular-nums mt-0.5">
                  {formatCaloriesText(calculatedStats.min, calculatedStats.max, calculatedStats.isRange)}
                </div>
              </div>

              {/* Source/Reference badge */}
              <div className="text-right max-w-[170px]">
                <span className="text-[10px] text-slate-400 block">Rujukan Data:</span>
                <span className="text-[10px] font-medium text-slate-600 line-clamp-2">
                  {selectedFood.source}
                </span>
              </div>
            </div>

            {/* Recalculated Nutrients Bar */}
            <div className="grid grid-cols-4 gap-2 mb-5 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Karbohidrat</span>
                <span className="text-xs font-bold text-slate-800 tabular-nums">{calculatedStats.carbs}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Protein</span>
                <span className="text-xs font-bold text-slate-800 tabular-nums">{calculatedStats.protein}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Lemak</span>
                <span className="text-xs font-bold text-slate-800 tabular-nums">{calculatedStats.fat}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Serat</span>
                <span className="text-xs font-bold text-slate-800 tabular-nums">{calculatedStats.fiber}g</span>
              </div>
            </div>

            {/* Portion Quantity Selector */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Jumlah Porsi
                </label>
                <span className="text-xs font-bold text-[#E94F86] tabular-nums">
                  {portionCount} Porsi
                </span>
              </div>

              {/* Quick preset chips */}
              <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
                {[0.5, 1, 1.5, 2, 3].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPortionCount(val)}
                    className={`py-2 rounded-xl transition-all cursor-pointer ${
                      portionCount === val
                        ? 'bg-[#E94F86] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>

              {/* Slider for fine adjustment */}
              <input
                type="range"
                min="0.25"
                max="5"
                step="0.25"
                value={portionCount}
                onChange={(e) => setPortionCount(parseFloat(e.target.value))}
                className="w-full accent-[#E94F86] cursor-pointer"
              />
            </div>

            {/* Meal Time Selector (Sarapan, Siang, Malam, Camilan) */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-slate-800 block">
                Waktu Makan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['sarapan', 'makan_siang', 'makan_malam', 'camilan'] as MealType[]).map((mType) => {
                  const conf = MEAL_TYPE_CONFIG[mType];
                  const isSelected = selectedMealType === mType;
                  return (
                    <button
                      key={mType}
                      type="button"
                      onClick={() => setSelectedMealType(mType)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#E94F86] bg-pink-50/60 shadow-xs ring-1 ring-[#E94F86]'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-base mb-1">{conf.emoji}</div>
                      <div className="text-xs font-bold text-slate-900">{conf.label}</div>
                      <div className="text-[10px] text-slate-400">{conf.time}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: porsi sambal sedikit, tanpa kuah santan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveToLog}
                disabled={isSaving}
                className="flex-2 py-3.5 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-98 transition-all text-xs flex items-center justify-center gap-2 shadow-md shadow-pink-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isSaving ? 'Menyimpan...' : 'TAMBAH KE CATATAN'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CUSTOM FOOD MODAL (Input Manual Pengguna)
          ======================================================== */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6">
            <button
              onClick={() => setIsCustomModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Tambah Makanan Manual
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Masukkan nama makanan dan estimasi kandungan gizinya.
            </p>

            <form onSubmit={handleSaveCustomFood} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Makanan *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Contoh: Soto Ayam Lamongan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Takaran Porsi Standar
                </label>
                <input
                  type="text"
                  value={customServing}
                  onChange={(e) => setCustomServing(e.target.value)}
                  placeholder="Contoh: 1 mangkuk, 1 piring, 1 potong"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kalori Min (kkal) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={customCalMin}
                    onChange={(e) => setCustomCalMin(e.target.value)}
                    placeholder="Contoh: 250"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kalori Max (opsional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={customCalMax}
                    onChange={(e) => setCustomCalMax(e.target.value)}
                    placeholder="Contoh: 350"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Karbo (g)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Lemak (g)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Serat (g)</label>
                  <input
                    type="number"
                    value={customFiber}
                    onChange={(e) => setCustomFiber(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] text-xs shadow-md shadow-pink-200 cursor-pointer"
              >
                Simpan & Lanjutkan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
