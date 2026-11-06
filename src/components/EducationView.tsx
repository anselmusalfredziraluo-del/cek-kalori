import React, { useState, useMemo } from 'react';
import { EDUCATIONAL_ARTICLES } from '../data/educationData';
import { EducationalArticle } from '../types';
import {
  BookOpen,
  Search,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  Share2,
  CheckCircle2,
  Info,
  Flame,
  Wheat,
  Dumbbell,
  Droplet,
  PieChart,
  Apple,
  GlassWater,
  Activity,
  HeartHandshake,
  Hand,
  ScanLine
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-5 h-5 text-orange-500" />,
  Wheat: <Wheat className="w-5 h-5 text-amber-600" />,
  Dumbbell: <Dumbbell className="w-5 h-5 text-emerald-600" />,
  Droplet: <Droplet className="w-5 h-5 text-blue-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-purple-500" />,
  PieChart: <PieChart className="w-5 h-5 text-pink-500" />,
  Apple: <Apple className="w-5 h-5 text-red-500" />,
  GlassWater: <GlassWater className="w-5 h-5 text-cyan-500" />,
  Activity: <Activity className="w-5 h-5 text-[#4D8B45]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-rose-500" />,
  Hand: <Hand className="w-5 h-5 text-amber-500" />,
  ScanLine: <ScanLine className="w-5 h-5 text-indigo-500" />,
};

export const EducationView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    EDUCATIONAL_ARTICLES.forEach((a) => set.add(a.category));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return EDUCATIONAL_ARTICLES.filter((article) => {
      if (selectedCategory !== 'all' && article.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          article.title.toLowerCase().includes(q) ||
          article.summary.toLowerCase().includes(q) ||
          article.content.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#4D8B45] uppercase tracking-wider">
            Pusat Edukasi Gizi Seimbang
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Edukasi & Panduan Sehat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pahami zat gizi makro & mikro, cara membaca label pangan, dan bangun kebiasaan makan yang sadar.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi gizi (misal: kalori, protein, serat, isi piringku)..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-hidden focus:border-[#E94F86] shadow-xs"
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3.5 rounded-xl font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E94F86] text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'Semua Topik (12)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner: Konsep Isi Piringku Kemenkes */}
      <div
        onClick={() => {
          const piringku = EDUCATIONAL_ARTICLES.find((a) => a.id === 'edu-06');
          if (piringku) setActiveArticle(piringku);
        }}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-[#4D8B45] to-teal-700 text-white cursor-pointer hover:shadow-lg transition-all shadow-emerald-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-white/20 px-2 py-0.5 rounded-md">
            Panduan Resmi Kemenkes RI
          </span>
          <h2 className="text-xl font-black">
            Konsep Gizi Seimbang &ldquo;Isi Piringku&rdquo;
          </h2>
          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            Ketahui panduan porsi seimbang 1/3 makanan pokok, 1/3 sayuran, 1/6 lauk pauk, dan 1/6 buah-buahan segar untuk setiap kali makan.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto py-2 px-4 rounded-xl bg-white text-[#4D8B45] font-bold text-xs shadow-sm hover:scale-105 transition-transform">
          <span>Baca Panduan</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* 12 Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((article) => {
          const icon = ICON_MAP[article.iconName] || <BookOpen className="w-5 h-5 text-slate-600" />;

          return (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {icon}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#E94F86] uppercase tracking-wider">
                  {article.category}
                </span>

                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#E94F86] transition-colors leading-snug mt-1 mb-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] truncate max-w-[200px]">
                  {article.source.split('&')[0]}
                </span>
                <span className="text-xs font-bold text-[#E94F86] flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  <span>Baca</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Detail Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-8 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#E94F86] bg-pink-50 px-2.5 py-0.5 rounded-md">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeArticle.readTime}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {activeArticle.title}
              </h2>
            </div>

            {/* Article Summary Lead */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
              {activeArticle.summary}
            </div>

            {/* Full Body Paragraphs */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed mb-6">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Takeaways Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 mb-6 space-y-2">
              <h4 className="text-xs font-bold text-[#4D8B45] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Poin Inti Penting</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeArticle.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#4D8B45] font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Source Reference */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Sumber: {activeArticle.source}</span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="py-2 px-5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer self-end sm:self-auto"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
