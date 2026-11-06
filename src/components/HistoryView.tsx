import React, { useState, useMemo } from 'react';
import { useApp, formatCaloriesText, getTodayDateString } from '../context/AppContext';
import { MEAL_TYPE_CONFIG } from '../data/foodsData';
import { FoodLogEntry, MealType } from '../types';
import {
  Calendar,
  Filter,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  ChevronDown,
  X,
  Check,
  Flame,
  Search,
  Plus
} from 'lucide-react';

type DateFilterType = 'hari_ini' | 'kemarin' | 'minggu_ini' | '7_hari' | '30_hari' | 'custom';

export const HistoryView: React.FC = () => {
  const { foodLogs, deleteFoodLog, updateFoodLog, setActiveTab, foodsDatabase } = useApp();

  const [dateFilter, setDateFilter] = useState<DateFilterType>('7_hari');
  const [customDate, setCustomDate] = useState<string>(getTodayDateString());
  const [mealFilter, setMealFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Editing state
  const [editingLog, setEditingLog] = useState<FoodLogEntry | null>(null);
  const [editPortion, setEditPortion] = useState<number>(1);
  const [editMealType, setEditMealType] = useState<MealType>('sarapan');
  const [editNotes, setEditNotes] = useState<string>('');

  // Calculate filtered logs
  const filteredLogs = useMemo(() => {
    const todayStr = getTodayDateString();
    const today = new Date();

    return foodLogs.filter((log) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!log.foodName.toLowerCase().includes(q) && !(log.notes && log.notes.toLowerCase().includes(q))) {
          return false;
        }
      }

      // 2. Meal Filter
      if (mealFilter !== 'all' && log.mealType !== mealFilter) {
        return false;
      }

      // 3. Date Filter
      const [year, month, day] = log.date.split('-').map(Number);
      const logDate = new Date(year, month - 1, day);
      const diffTime = today.getTime() - logDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === 'hari_ini') {
        return log.date === todayStr;
      }
      if (dateFilter === 'kemarin') {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        return log.date === yStr;
      }
      if (dateFilter === 'minggu_ini') {
        const dayOfWeek = today.getDay(); // 0 is Sunday
        return diffDays >= 0 && diffDays <= (dayOfWeek === 0 ? 6 : dayOfWeek);
      }
      if (dateFilter === '7_hari') {
        return diffDays >= 0 && diffDays < 7;
      }
      if (dateFilter === '30_hari') {
        return diffDays >= 0 && diffDays < 30;
      }
      if (dateFilter === 'custom') {
        return log.date === customDate;
      }

      return true;
    });
  }, [foodLogs, dateFilter, customDate, mealFilter, searchQuery]);

  // Aggregate stats for the filtered period
  const periodSummary = useMemo(() => {
    let minCal = 0;
    let maxCal = 0;
    let hasRange = false;
    let carbs = 0;
    let protein = 0;
    let fat = 0;
    let fiber = 0;

    filteredLogs.forEach((l) => {
      minCal += l.caloriesMin;
      maxCal += l.caloriesMax;
      if (l.isRange) hasRange = true;
      carbs += l.carbs;
      protein += l.protein;
      fat += l.fat;
      fiber += l.fiber;
    });

    return {
      minCal: Math.round(minCal),
      maxCal: Math.round(maxCal),
      hasRange: hasRange && minCal !== maxCal,
      carbs: Math.round(carbs * 10) / 10,
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      count: filteredLogs.length,
    };
  }, [filteredLogs]);

  // Open edit modal
  const handleOpenEdit = (log: FoodLogEntry) => {
    setEditingLog(log);
    setEditPortion(log.portionQuantity);
    setEditMealType(log.mealType);
    setEditNotes(log.notes || '');
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingLog) return;

    const baseFood = foodsDatabase.find((f) => f.id === editingLog.foodId);
    let newMin: number;
    let newMax: number;
    let newCarbs: number;
    let newProtein: number;
    let newFat: number;
    let newFiber: number;

    if (baseFood) {
      newMin = Math.round(baseFood.caloriesMin * editPortion);
      newMax = Math.round(baseFood.caloriesMax * editPortion);
      newCarbs = Math.round(baseFood.carbs * editPortion * 10) / 10;
      newProtein = Math.round(baseFood.protein * editPortion * 10) / 10;
      newFat = Math.round(baseFood.fat * editPortion * 10) / 10;
      newFiber = Math.round(baseFood.fiber * editPortion * 10) / 10;
    } else {
      const ratio = editPortion / (editingLog.portionQuantity || 1);
      newMin = Math.round(editingLog.caloriesMin * ratio);
      newMax = Math.round(editingLog.caloriesMax * ratio);
      newCarbs = Math.round(editingLog.carbs * ratio * 10) / 10;
      newProtein = Math.round(editingLog.protein * ratio * 10) / 10;
      newFat = Math.round(editingLog.fat * ratio * 10) / 10;
      newFiber = Math.round(editingLog.fiber * ratio * 10) / 10;
    }

    await updateFoodLog(editingLog.id, {
      portionQuantity: editPortion,
      mealType: editMealType,
      notes: editNotes.trim() || undefined,
      caloriesMin: newMin,
      caloriesMax: newMax,
      isRange: newMin !== newMax,
      carbs: newCarbs,
      protein: newProtein,
      fat: newFat,
      fiber: newFiber,
    });

    setEditingLog(null);
  };

  // Group logs by date
  const groupedByDate = useMemo(() => {
    const map: Record<string, FoodLogEntry[]> = {};
    filteredLogs.forEach((log) => {
      if (!map[log.date]) map[log.date] = [];
      map[log.date].push(log);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredLogs]);

  const formatDateDisplay = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 pb-28 md:pb-12">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#4D8B45] uppercase tracking-wider">
            Rekam Jejak Makanan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Asupan Makanan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tinjau seluruh riwayat makanan, sesuaikan porsi, dan evaluasi pola makanmu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('analisis')}
            className="py-2.5 px-3.5 rounded-2xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E94F86]" />
            <span>Grafik Analisis</span>
          </button>
          <button
            onClick={() => setActiveTab('tambah')}
            className="self-start sm:self-auto py-2.5 px-4 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-95 transition-all text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Makanan</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-3xl bg-white border border-slate-100 p-4 space-y-3.5 shadow-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dalam riwayat (nama makanan atau catatan)..."
            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
          />
        </div>

        {/* Date Filters as required by Bagian 11 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { id: 'hari_ini', label: 'Hari Ini' },
            { id: 'kemarin', label: 'Kemarin' },
            { id: 'minggu_ini', label: 'Minggu Ini' },
            { id: '7_hari', label: '7 Hari Terakhir' },
            { id: '30_hari', label: '30 Hari Terakhir' },
            { id: 'custom', label: 'Pilih Tanggal' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setDateFilter(f.id as DateFilterType)}
              className={`py-1.5 px-3 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                dateFilter === f.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Custom Date Picker if selected */}
        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Pilih Tanggal Spesifik:</span>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
            />
          </div>
        )}

        {/* Meal Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-400 text-[11px] mr-1">Waktu:</span>
          {['all', 'sarapan', 'makan_siang', 'makan_malam', 'camilan'].map((m) => (
            <button
              key={m}
              onClick={() => setMealFilter(m)}
              className={`py-1 px-2.5 rounded-lg transition-all capitalize cursor-pointer ${
                mealFilter === m
                  ? 'bg-pink-100 text-[#E94F86] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {m === 'all' ? 'Semua' : m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Box for Filtered Period */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Asupan Pada Periode Ini
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums mt-0.5">
            {formatCaloriesText(periodSummary.minCal, periodSummary.maxCal, periodSummary.hasRange)}
          </div>
          <span className="text-xs text-slate-400">
            {periodSummary.count} makanan dicatat
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block">Karbo</span>
            <span className="font-bold tabular-nums">{periodSummary.carbs}g</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block">Protein</span>
            <span className="font-bold tabular-nums">{periodSummary.protein}g</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block">Lemak</span>
            <span className="font-bold tabular-nums">{periodSummary.fat}g</span>
          </div>
          <div className="p-2 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block">Serat</span>
            <span className="font-bold tabular-nums">{periodSummary.fiber}g</span>
          </div>
        </div>
      </div>

      {/* Grouped Logs List */}
      {groupedByDate.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl mb-3">
            📅
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">
            Tidak ada catatan makanan pada periode ini.
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Coba pilih filter rentang waktu lain atau mulai catat makanan harianmu.
          </p>
          <button
            onClick={() => setActiveTab('tambah')}
            className="py-2.5 px-5 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Makanan Baru</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByDate.map(([dateStr, logs]) => {
            const dayMin = logs.reduce((s, l) => s + l.caloriesMin, 0);
            const dayMax = logs.reduce((s, l) => s + l.caloriesMax, 0);
            const isRange = dayMin !== dayMax;

            return (
              <div key={dateStr} className="space-y-2.5">
                {/* Date Section Header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#4D8B45]" />
                    <h3 className="font-bold text-sm text-slate-900">
                      {formatDateDisplay(dateStr)}
                    </h3>
                  </div>
                  <div className="text-xs font-bold text-[#E94F86] tabular-nums">
                    Total: {formatCaloriesText(dayMin, dayMax, isRange)}
                  </div>
                </div>

                {/* Day Logs */}
                <div className="space-y-2">
                  {logs.map((log) => {
                    const mealConfig = MEAL_TYPE_CONFIG[log.mealType];
                    return (
                      <div
                        key={log.id}
                        className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-center justify-center text-xl shrink-0">
                            {log.emoji || '🍽️'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-bold text-slate-900 text-sm truncate">
                                {log.foodName}
                              </h4>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${mealConfig.color}`}>
                                {mealConfig.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{log.portionQuantity}x {log.servingSize}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{log.time}</span>
                              {log.notes && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="italic truncate max-w-[120px] text-slate-400">
                                    &ldquo;{log.notes}&rdquo;
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="text-left sm:text-right">
                            <div className="font-extrabold text-sm text-slate-900 tabular-nums">
                              {formatCaloriesText(log.caloriesMin, log.caloriesMax, log.isRange)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              K: {log.carbs}g · P: {log.protein}g · L: {log.fat}g
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(log)}
                              title="Edit Catatan"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteFoodLog(log.id)}
                              title="Hapus Catatan"
                              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          EDIT LOG MODAL (Ubah Jumlah Porsi, Waktu Makan, Catatan)
          ======================================================== */}
      {editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6">
            <button
              onClick={() => setEditingLog(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Edit Catatan Makanan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ubah jumlah porsi, waktu makan, atau catatan untuk {editingLog.foodName}.
            </p>

            <div className="space-y-4">
              {/* Portion adjustment */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Jumlah Porsi</label>
                  <span className="text-xs font-bold text-[#E94F86]">{editPortion}x Porsi</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {[0.5, 1, 1.5, 2, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEditPortion(val)}
                      className={`py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        editPortion === val
                          ? 'bg-[#E94F86] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {val}x
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="5"
                  step="0.25"
                  value={editPortion}
                  onChange={(e) => setEditPortion(parseFloat(e.target.value))}
                  className="w-full accent-[#E94F86]"
                />
              </div>

              {/* Meal type */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Waktu Makan</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['sarapan', 'makan_siang', 'makan_malam', 'camilan'] as MealType[]).map((mt) => {
                    const c = MEAL_TYPE_CONFIG[mt];
                    return (
                      <button
                        key={mt}
                        type="button"
                        onClick={() => setEditMealType(mt)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                          editMealType === mt
                            ? 'border-[#E94F86] bg-pink-50 text-[#E94F86]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{c.emoji}</span>
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Catatan</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Tambahkan catatan khusus..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] text-xs shadow-md shadow-pink-200 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
