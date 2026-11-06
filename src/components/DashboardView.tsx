import React from 'react';
import { useApp, formatCaloriesText, getTodayDateString } from '../context/AppContext';
import { MEAL_TYPE_CONFIG } from '../data/foodsData';
import { MealType, FoodLogEntry } from '../types';
import {
  Flame,
  Plus,
  ArrowRight,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Info,
  Apple,
  Clock,
  Trash2,
  CalendarDays
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    dailySummary,
    todayLogs,
    deleteFoodLog,
  } = useApp();

  // Greeting by hour
  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? 'Selamat Pagi'
      : hour < 15
      ? 'Selamat Siang'
      : hour < 18
      ? 'Selamat Sore'
      : 'Selamat Malam';

  // Format date readable in Indonesian
  const formatIndonesianDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const shiftDate = (days: number) => {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const current = new Date(year, month - 1, day);
      current.setDate(current.getDate() + days);
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, '0');
      const d = String(current.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${d}`);
    } catch {}
  };

  const isToday = selectedDate === getTodayDateString();

  // Target calorie benchmark (e.g. 2000 kcal standard AKG Indonesia)
  const targetCalories = 2000;
  const averageCalories = Math.round((dailySummary.totalCaloriesMin + dailySummary.totalCaloriesMax) / 2);
  const percentageOfTarget = Math.min(100, Math.round((averageCalories / targetCalories) * 100));

  // Daily positive motivational messages
  const healthTips = [
    'Makan dengan perlahan dan sadar membantu tubuh mencerna makanan secara optimal.',
    'Variasikan warna sayur dan buah di piringmu untuk melengkapi vitamin harian.',
    'Tubuh sering kali salah mengira rasa haus sebagai lapar. Jangan lupa cukupi air putih!',
    'Keseimbangan dan variasi gizi jauh lebih berharga daripada membatasi makanan secara ekstrem.',
    'Setiap pilihan makanan bergizi adalah wujud kepedulian terhadap kesehatan tubuhmu.',
  ];
  const tipOfTheDay = healthTips[new Date().getDay() % healthTips.length];

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* ==========================================
          TOP WELCOME & DATE BAR
          ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#4D8B45] uppercase tracking-wider">
            {greeting},
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {user ? user.name : 'Sobat Sehat'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mari makan dengan sadar dan nikmati setiap suapan hari ini.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <button
            onClick={() => shiftDate(-1)}
            aria-label="Hari sebelumnya"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(getTodayDateString())}
            className="px-3 py-1 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#E94F86]" />
            <span>{isToday ? 'Hari Ini' : formatIndonesianDate(selectedDate)}</span>
          </button>

          <button
            onClick={() => shiftDate(1)}
            aria-label="Hari berikutnya"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ==========================================
          PRIMARY HERO CARD: ESTIMASI KALORI HARI INI
          Crucial: Display Range accurately if range exists!
          ========================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E94F86] via-[#d63d73] to-[#b32759] text-white p-6 sm:p-8 shadow-xl shadow-pink-200/50">
        {/* Soft background glow circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-yellow-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                <Flame className="w-4 h-4 text-yellow-300" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-100">
                Total Estimasi Asupan Hari Ini
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight tabular-nums">
                {dailySummary.itemsCount > 0 ? (
                  dailySummary.isRange ? (
                    `${dailySummary.totalCaloriesMin.toLocaleString('id-ID')} – ${dailySummary.totalCaloriesMax.toLocaleString('id-ID')}`
                  ) : (
                    dailySummary.totalCaloriesMin.toLocaleString('id-ID')
                  )
                ) : (
                  '0'
                )}
              </span>
              <span className="text-lg md:text-xl font-bold text-pink-100">kkal</span>
            </div>

            <p className="text-xs text-pink-100/90 max-w-md leading-relaxed">
              {dailySummary.itemsCount > 0
                ? dailySummary.isRange
                  ? '*Perhitungan menggunakan rentang estimasi berdasarkan porsi dan bahan makanan kuliner Indonesia.'
                  : '*Estimasi total asupan berdasarkan catatan makanan aktif hari ini.'
                : 'Belum ada makanan yang dicatat hari ini.'}
            </p>
          </div>

          {/* Quick Circular / Progress Bar Indicator */}
          <div className="flex flex-col items-start md:items-end justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[190px]">
            <div className="flex items-center justify-between w-full mb-1 text-xs">
              <span className="text-pink-100">Rujukan AKG Harian</span>
              <span className="font-bold tabular-nums">~{targetCalories} kkal</span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-yellow-300 to-emerald-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentageOfTarget}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full text-[11px] text-pink-100">
              <span>{dailySummary.itemsCount} sajian dicatat</span>
              <span className="font-semibold">{percentageOfTarget}% tercapai</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          RINGKASAN MAKRONUTRIEN (4 Pilar Gizi)
          Karbohidrat, Protein, Lemak, Serat
          ========================================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>Ringkasan Zat Gizi Harian</span>
          </h2>
          <span className="text-xs text-slate-400">Porsi Terkumpul</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Karbohidrat */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Karbohidrat</span>
              <span className="text-base">🍚</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {dailySummary.totalCarbs} <span className="text-xs font-bold text-slate-400">g</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Sumber energi utama otak</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (dailySummary.totalCarbs / 300) * 100)}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Protein</span>
              <span className="text-base">🍗</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {dailySummary.totalProtein} <span className="text-xs font-bold text-slate-400">g</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pemulih & pembangun sel</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#4D8B45] h-full rounded-full"
                style={{ width: `${Math.min(100, (dailySummary.totalProtein / 65) * 100)}%` }}
              />
            </div>
          </div>

          {/* Lemak */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Lemak</span>
              <span className="text-base">🥑</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {dailySummary.totalFat} <span className="text-xs font-bold text-slate-400">g</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Pelindung organ tubuh</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-orange-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (dailySummary.totalFat / 67) * 100)}%` }}
              />
            </div>
          </div>

          {/* Serat */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Serat Pangan</span>
              <span className="text-base">🥗</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {dailySummary.totalFiber} <span className="text-xs font-bold text-slate-400">g</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Kesehatan saluran cerna</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (dailySummary.totalFiber / 30) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          SHORTCUT TO ANALISIS POLA MAKAN
          ========================================== */}
      <div
        onClick={() => setActiveTab('analisis')}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border border-purple-100/80 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-xs"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#E94F86] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#E94F86] transition-colors">
              Grafik & Analisis Pola Makan
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi tren energi harian, sebaran kalori 7–30 hari, dan makanan yang paling sering dikonsumsi.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white text-[#E94F86] font-bold text-xs shadow-xs group-hover:bg-[#E94F86] group-hover:text-white transition-colors">
          <span className="hidden sm:inline">Lihat Grafik</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* ==========================================
          DISTRIBUSI WAKTU MAKAN (Sarapan, Siang, Malam, Camilan)
          ========================================== */}
      <div className="rounded-3xl bg-white border border-slate-100 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Distribusi Berdasarkan Waktu Makan
            </h3>
            <p className="text-xs text-slate-500">
              Pola pembagian asupan makanan sepanjang hari
            </p>
          </div>
          <button
            onClick={() => setActiveTab('tambah')}
            className="text-xs font-bold text-[#E94F86] hover:text-[#d83d74] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['sarapan', 'makan_siang', 'makan_malam', 'camilan'] as MealType[]).map((mType) => {
            const conf = MEAL_TYPE_CONFIG[mType];
            const logs = dailySummary.byMeal[mType] || [];
            const mealCaloriesMin = logs.reduce((sum, item) => sum + item.caloriesMin, 0);
            const mealCaloriesMax = logs.reduce((sum, item) => sum + item.caloriesMax, 0);
            const hasRange = mealCaloriesMin !== mealCaloriesMax;

            return (
              <div
                key={mType}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-pink-200 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{conf.emoji}</span>
                    <span className="font-bold text-xs text-slate-800">{conf.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {logs.length} menu
                  </span>
                </div>

                <div className="my-1">
                  <div className="text-base font-extrabold text-slate-900 tabular-nums">
                    {logs.length > 0 ? (
                      formatCaloriesText(mealCaloriesMin, mealCaloriesMax, hasRange)
                    ) : (
                      <span className="text-xs font-normal text-slate-400">Belum dicatat</span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 mt-2 truncate">
                  {logs.length > 0
                    ? logs.map((l) => l.foodName).join(', ')
                    : conf.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          DAFTAR MAKANAN TERAKHIR / LOGS HARI INI
          ========================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Catatan Makanan Hari Ini
            </h3>
            <p className="text-xs text-slate-500">
              {todayLogs.length} makanan & minuman tercatat
            </p>
          </div>

          {todayLogs.length > 0 && (
            <button
              onClick={() => setActiveTab('riwayat')}
              className="text-xs font-semibold text-[#E94F86] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua Riwayat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {todayLogs.length === 0 ? (
          /* Empty state required by prompt */
          <div className="rounded-3xl bg-white border border-dashed border-slate-200 p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-pink-50 flex items-center justify-center text-3xl mb-4">
              🍽️
            </div>
            <h4 className="font-bold text-slate-800 text-base mb-1">
              Belum ada makanan yang dicatat hari ini.
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mb-6">
              Yuk, mulai catat makananmu! Kenali kalorinya dan bangun pola makan yang lebih sehat dan sadar.
            </p>
            <button
              onClick={() => setActiveTab('tambah')}
              className="py-3 px-6 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-95 transition-all shadow-md shadow-pink-200 text-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Makanan Pertama</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((log) => {
              const mealConfig = MEAL_TYPE_CONFIG[log.mealType];
              return (
                <div
                  key={log.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shrink-0 border border-slate-100">
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
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-slate-900 tabular-nums">
                        {formatCaloriesText(log.caloriesMin, log.caloriesMax, log.isRange)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        K: {log.carbs}g · P: {log.protein}g · L: {log.fat}g
                      </div>
                    </div>

                    <button
                      onClick={() => deleteFoodLog(log.id)}
                      title="Hapus catatan"
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==========================================
          PESAN EDUKASI KESEHATAN HARIAN
          ========================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-100 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-[#4D8B45] text-white shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D8B45] mb-1">
            Inspirasi Makan Sadar Hari Ini
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            &ldquo;{tipOfTheDay}&rdquo;
          </p>
          <button
            onClick={() => setActiveTab('edukasi')}
            className="text-[11px] font-bold text-[#4D8B45] hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Pelajari lebih banyak tentang gizi seimbang</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
