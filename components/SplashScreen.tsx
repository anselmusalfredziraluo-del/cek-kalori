import React from 'react';
import { AppleLogo } from './AppleLogo';
import { motion } from 'motion/react';
import { Sparkles, Utensils, Heart, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white px-6 py-10 md:py-16 text-center select-none overflow-hidden">
      {/* Decorative subtle ambient circles */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-pink-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

      {/* Top spacing */}
      <div className="w-full pt-4">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#4D8B45] bg-[#4D8B45]/10 px-3 py-1 rounded-full">
          Aplikasi Kesehatan Digital
        </span>
      </div>

      {/* Center Branding Hero */}
      <div className="max-w-md w-full my-auto flex flex-col items-center">
        {/* Animated Apple Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100/60 flex items-center justify-center shadow-lg shadow-pink-100 border border-pink-200/50">
            <AppleLogo size={72} />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-[#4D8B45] text-white p-1.5 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
        </motion.div>

        {/* Title & Tagline */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2"
        >
          CEK KALORI
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl font-medium text-[#E94F86] mb-6"
        >
          &ldquo;Makan dengan Sadar, Hidup Lebih Sehat&rdquo;
        </motion.p>

        {/* Food Illustration Showcase */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-4 gap-3 w-full max-w-xs mb-8"
        >
          {[
            { emoji: '🍚', label: 'Pokok' },
            { emoji: '🥗', label: 'Sayur' },
            { emoji: '🍗', label: 'Protein' },
            { emoji: '🍎', label: 'Buah' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs"
            >
              <span className="text-2xl mb-1">{item.emoji}</span>
              <span className="text-[11px] font-medium text-slate-500">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
          Kenali asupan harianmu, pahami nutrisi seimbang, dan bangun kebiasaan makan yang sadar tanpa rasa bersalah.
        </p>
      </div>

      {/* Bottom Action */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-sm pb-4"
      >
        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-[0.98] transition-all shadow-md shadow-pink-300/40 flex items-center justify-center gap-2 text-base cursor-pointer"
        >
          <span>Mulai Catat Makananmu</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
          <Heart className="w-3.5 h-3.5 text-[#E94F86]" />
          <span>Estimasi kalori & zat gizi berdasarkan standar Kemenkes RI</span>
        </div>
      </motion.div>
    </div>
  );
};
