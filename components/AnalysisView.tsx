import React, { useState, useMemo } from 'react';
import { useApp, formatCaloriesText } from '../context/AppContext';
import { FoodLogEntry } from '../types';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  Calendar,
  Sparkles,
  Award,
  Heart,
  Info,
  Clock,
  ChevronLeft
} from 'lucide-react';

type PeriodType = '7_hari' | '30_hari';

export const AnalysisView: React.FC = () => {
  const { foodLogs, setActiveTab } = useApp();
  const [period, setPeriod] = useState<PeriodType>('7_hari');

  // Days list for the selected period
  const daysCount = period === '7_hari' ? 7 : 30;

  // Compute daily series for chart
  const dailySeries = useMemo(() => {
    const list: {
      dateStr: string;
      label: string;
      caloriesAvg: number;
      caloriesMin: number;
      caloriesMax: number;
      carbs: number;
      protein: number;
      fat: number;
      fiber: number;
      count: number;
    }[] = [];

    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = d.toLocaleDateString('id-ID', {
        weekday: daysCount <= 7 ? 'short' : undefined,
        day: 'numeric',
        month: daysCount > 7 ? 'short' : undefined,
      });

      // Filter logs for this specific date
      const matched = foodLogs.filter((l) => l.date === dateStr);
      let minC = 0;
      let maxC = 0;
      let carbs = 0;
      let protein = 0;
      let fat = 0;
      let fiber = 0;

      matched.forEach((m) => {
        minC += m.caloriesMin;
        maxC += m.caloriesMax;
        carbs += m.carbs;
        protein += m.protein;
        fat += m.fat;
        fiber += m.fiber;
      });

      const avgC = Math.round((minC + maxC) / 2);

      list.push({
        dateStr,
        label: dayLabel,
        caloriesAvg: avgC,
        caloriesMin: minC,
        caloriesMax: maxC,
        carbs: Math.round(carbs),
        protein: Math.round(protein),
        fat: Math.round(fat),
        fiber: Math.round(fiber),
        count: matched.length,
      });
    }

    return list;
  }, [foodLogs, daysCount]);

  // Overall totals and averages
  const periodTotals = useMemo(() => {
    let totalC = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let daysWithLogs = 0;

    dailySeries.forEach((day) => {
      if (day.count > 0) {
        daysWithLogs++;
        totalC += day.caloriesAvg;
        totalCarbs += day.carbs;
        totalProtein += day.protein;
        totalFat += day.fat;
        totalFiber += day.fiber;
      }
    });

    const activeDays = Math.max(1, daysWithLogs);

    return {
      avgDailyCalories: Math.round(totalC / activeDays),
      avgDailyCarbs: Math.round((totalCarbs / activeDays) * 10) / 10,
      avgDailyProtein: Math.round((totalProtein / activeDays) * 10) / 10,
      avgDailyFat: Math.round((totalFat / activeDays) * 10) / 10,
      avgDailyFiber: Math.round((totalFiber / activeDays) * 10) / 10,
      totalEntries: foodLogs.length,
      activeDays,
    };
  }, [dailySeries, foodLogs]);

  // Top Most Frequent Foods Logged (Real user database data!)
  const topFrequentFoods = useMemo(() => {
    const frequencyMap: Record<string, { name: string; count: number; emoji?: string; totalCalories: number }> = {};

    foodLogs.forEach((log) => {
      if (!frequencyMap[log.foodName]) {
        frequencyMap[log.foodName] = {
          name: log.foodName,
          count: 0,
          emoji: log.emoji || '🍽️',
          totalCalories: 0,
        };
      }
      frequencyMap[log.foodName].count += 1;
      frequencyMap[log.foodName].totalCalories += Math.round((log.caloriesMin + log.caloriesMax) / 2);
    });

    return Object.values(frequencyMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [foodLogs]);

  // Max value for chart scaling
  const maxCalorieValue = useMemo(() => {
    const highest = Math.max(...dailySeries.map((d) => d.caloriesAvg), 2000);
    return Math.ceil(highest / 500) * 500;
  }, [dailySeries]);

  return (
    <div className="space-y-6 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <button
            onClick={() => setActiveTab('riwayat')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#E94F86] mb-1.5 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Riwayat</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analisis Pola Makan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grafik dan tren asupan energi harian, sebaran zat gizi, dan kebiasaan makananmu.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl self-start sm:self-auto text-xs font-semibold border border-slate-200/50">
          <button
            onClick={() => setPeriod('7_hari')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
              period === '7_hari'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => setPeriod('30_hari')}
            className={`py-2 px-4 rounded-xl transition-all cursor-pointer ${
              period === '30_hari'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            30 Hari Terakhir
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Rata-rata Kalori Harian
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#E94F86] tabular-nums">
            {periodTotals.avgDailyCalories.toLocaleString('id-ID')}
            <span className="text-xs font-bold text-slate-400 ml-1">kkal</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            dari {periodTotals.activeDays} hari aktif dicatat
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Rata-rata Protein
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#4D8B45] tabular-nums">
            {periodTotals.avgDailyProtein}
            <span className="text-xs font-bold text-slate-400 ml-1">g/hari</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Pembangun massa otot & sel
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Rata-rata Karbohidrat
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 tabular-nums">
            {periodTotals.avgDailyCarbs}
            <span className="text-xs font-bold text-slate-400 ml-1">g/hari</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Bahan bakar energi tubuh
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Rata-rata Serat
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 tabular-nums">
            {periodTotals.avgDailyFiber}
            <span className="text-xs font-bold text-slate-400 ml-1">g/hari</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Kelancaran sistem pencernaan
          </span>
        </div>
      </div>

      {/* ========================================================
          GRAFIK BATANG ASUPAN KALORI HARIAN (REAL DARI DATABASE)
          ======================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#E94F86]" />
              <span>Grafik Asupan Energi Kalori ({period === '7_hari' ? '7 Hari' : '30 Hari'})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Menunjukkan fluktuasi asupan harian berdasarkan makanan yang dicatat
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#E94F86]" />
              <span>Asupan Harian</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-slate-300" />
              <span>Garis Acuan 2.000 kkal</span>
            </span>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="relative pt-6 pb-2">
          {/* Reference Line for 2000 kcal */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-slate-300 z-10 pointer-events-none flex items-center justify-end"
            style={{
              bottom: `${Math.min(95, (2000 / maxCalorieValue) * 100 * 0.75 + 15)}%`,
            }}
          >
            <span className="text-[10px] text-slate-400 bg-white px-1 font-semibold tabular-nums">
              2.000 kkal
            </span>
          </div>

          {/* Bar Chart Flex */}
          <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 px-1 border-b border-slate-100">
            {dailySeries.map((day, idx) => {
              const heightPercent =
                day.caloriesAvg > 0
                  ? Math.max(8, Math.min(100, (day.caloriesAvg / maxCalorieValue) * 100))
                  : 4;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none shadow-md whitespace-nowrap">
                    <span className="font-bold">{day.caloriesAvg} kkal</span>
                    <span className="text-slate-300">{day.count} menu</span>
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                      day.caloriesAvg > 0
                        ? 'bg-gradient-to-t from-[#E94F86] to-[#ff7fa9] group-hover:brightness-110 shadow-xs'
                        : 'bg-slate-100'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Day label */}
                  <span className="text-[10px] text-slate-400 mt-2 font-medium truncate max-w-full">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          PROPORSI ZAT GIZI & TOP MAKANAN SERING DICATAT
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proporsi Makronutrien */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#4D8B45]" />
              <span>Komposisi Rata-rata Makronutrien</span>
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Perbandingan persentase energi dari karbohidrat, protein, dan lemak.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span>🍚</span>
                  <span>Karbohidrat</span>
                </span>
                <span className="tabular-nums text-slate-800">
                  {periodTotals.avgDailyCarbs} g/hari
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (periodTotals.avgDailyCarbs /
                        (periodTotals.avgDailyCarbs +
                          periodTotals.avgDailyProtein +
                          periodTotals.avgDailyFat || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span>🍗</span>
                  <span>Protein</span>
                </span>
                <span className="tabular-nums text-slate-800">
                  {periodTotals.avgDailyProtein} g/hari
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#4D8B45] h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (periodTotals.avgDailyProtein /
                        (periodTotals.avgDailyCarbs +
                          periodTotals.avgDailyProtein +
                          periodTotals.avgDailyFat || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span>🥑</span>
                  <span>Lemak</span>
                </span>
                <span className="tabular-nums text-slate-800">
                  {periodTotals.avgDailyFat} g/hari
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (periodTotals.avgDailyFat /
                        (periodTotals.avgDailyCarbs +
                          periodTotals.avgDailyProtein +
                          periodTotals.avgDailyFat || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Jenis Makanan Paling Sering Dicatat */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E94F86]" />
              <span>Makanan Teratas yang Sering Dikonsumsi</span>
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Menu favorit yang paling sering kamu nikmati dan catat di aplikasi.
          </p>

          {topFrequentFoods.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Belum ada riwayat makanan yang cukup untuk dianalisis.
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {topFrequentFoods.map((item, index) => (
                <div
                  key={item.name}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-white text-xs font-bold text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-bold text-xs text-slate-800 truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-[#E94F86]">
                      {item.count} kali
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ~{item.totalCalories} kkal total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Positive Educational Insights (Bagian 12: Edukatif dan Positif) */}
      <div className="p-5 rounded-3xl bg-pink-50/70 border border-pink-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#E94F86] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Heart className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">
            Refleksi & Apresiasi Diri
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mencatat apa yang kamu makan adalah langkah pertama membangun kesadaran gizi yang berkelanjutan. Ingatlah bahwa tidak ada makanan yang &ldquo;sempurna&rdquo; atau &ldquo;terlarang&rdquo;; yang terpenting adalah keseimbangan, keragaman lauk, dan kesadaran menikmati makanan dengan tenang.
          </p>
        </div>
      </div>
    </div>
  );
};
