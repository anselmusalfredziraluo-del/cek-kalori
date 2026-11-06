import React from 'react';
import { useApp } from '../context/AppContext';
import { AppleLogo } from './AppleLogo';
import {
  Home,
  History,
  Plus,
  BookOpen,
  User,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, user, openAuthModal } = useApp();

  return (
    <>
      {/* =========================================================
          DESKTOP & TABLET TOP HEADER BAR
          Strict 3-zone top bar contract: Brand - Links - Action
          ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => setActiveTab('beranda')}
            className="flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0 group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center transition-transform group-hover:scale-105">
              <AppleLogo size={26} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                CEK KALORI
                <span className="text-[10px] font-bold text-[#4D8B45] bg-[#4D8B45]/10 px-1.5 py-0.5 rounded-sm">
                  GIZI
                </span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-medium text-slate-400">
                Makan dengan Sadar, Hidup Lebih Sehat
              </span>
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links (4-5 single-line links) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === 'beranda'
                  ? 'bg-pink-50 text-[#E94F86] font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('riwayat')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === 'riwayat'
                  ? 'bg-pink-50 text-[#E94F86] font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </button>

            <button
              onClick={() => setActiveTab('analisis')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === 'analisis'
                  ? 'bg-pink-50 text-[#E94F86] font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analisis</span>
            </button>

            <button
              onClick={() => setActiveTab('edukasi')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === 'edukasi'
                  ? 'bg-pink-50 text-[#E94F86] font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Edukasi</span>
            </button>

            <button
              onClick={() => setActiveTab('profil')}
              className={`px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === 'profil'
                  ? 'bg-pink-50 text-[#E94F86] font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profil</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Profile Info */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('tambah')}
              className="py-2 px-4 rounded-xl font-bold text-xs md:text-sm text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-95 transition-all shadow-sm shadow-pink-200 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Tambah Makanan</span>
              <span className="sm:hidden">Catat</span>
            </button>

            {!user ? (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-[#E94F86] text-[#E94F86] hover:bg-pink-50 transition-colors text-xs font-bold cursor-pointer"
              >
                <span>Masuk / Daftar</span>
              </button>
            ) : user.isGuest ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  Uji Coba
                </span>
                <button
                  onClick={() => setActiveTab('profil')}
                  className="flex items-center gap-1.5 p-1 pl-2.5 rounded-full border border-slate-200 hover:border-pink-300 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
                  title="Profil Pengguna Uji Coba"
                >
                  <span className="max-w-[90px] truncate">{user.name}</span>
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs uppercase">
                    T
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('profil')}
                className="hidden sm:flex items-center gap-2 p-1 pl-2.5 rounded-full border border-slate-200 hover:border-pink-300 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
                title={`Profil ${user.name}`}
              >
                <span className="max-w-[100px] truncate">{user.name}</span>
                <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E94F86] flex items-center justify-center font-bold text-xs uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION (5 Menus, Prominent Add Button)
          ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1 shadow-lg shadow-slate-200/50">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* 1. Beranda */}
          <button
            onClick={() => setActiveTab('beranda')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'beranda' ? 'text-[#E94F86]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className={`text-[10px] ${activeTab === 'beranda' ? 'font-bold' : 'font-medium'}`}>
              Beranda
            </span>
          </button>

          {/* 2. Riwayat */}
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'riwayat' ? 'text-[#E94F86]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <History className="w-5 h-5 mb-0.5" />
            <span className={`text-[10px] ${activeTab === 'riwayat' ? 'font-bold' : 'font-medium'}`}>
              Riwayat
            </span>
          </button>

          {/* 3. Tambah Makanan (Elevated Prominent Center Button) */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              onClick={() => setActiveTab('tambah')}
              aria-label="Tambah Makanan"
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E94F86] to-[#ff669c] text-white flex items-center justify-center shadow-lg shadow-pink-400/40 hover:scale-105 active:scale-95 transition-all border-4 border-white cursor-pointer"
            >
              <Plus className="w-7 h-7 stroke-[2.8]" />
            </button>
            <span className="text-[10px] font-bold text-[#E94F86] mt-0.5">
              Catat
            </span>
          </div>

          {/* 4. Edukasi */}
          <button
            onClick={() => setActiveTab('edukasi')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'edukasi' ? 'text-[#E94F86]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className={`text-[10px] ${activeTab === 'edukasi' ? 'font-bold' : 'font-medium'}`}>
              Edukasi
            </span>
          </button>

          {/* 5. Profil */}
          <button
            onClick={() => setActiveTab('profil')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profil' ? 'text-[#E94F86]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className={`text-[10px] ${activeTab === 'profil' ? 'font-bold' : 'font-medium'}`}>
              Profil
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
