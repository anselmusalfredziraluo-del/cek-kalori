import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { AddFoodView } from './components/AddFoodView';
import { AnalysisView } from './components/AnalysisView';
import { EducationView } from './components/EducationView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    user,
    showSplash,
    setShowSplash,
    activeTab,
    toastMessage,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  } = useApp();

  // If splash screen should be shown
  if (showSplash) {
    return (
      <SplashScreen
        onStart={() => {
          setShowSplash(false);
          // If user not logged in, prompt AuthModal or allow immediate entry
          if (!user) {
            openAuthModal('login');
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col text-slate-800">
      {/* Top Navigation Bar */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Banner if not logged in or in guest mode */}
        {!user ? (
          <div className="mb-4 p-3.5 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-base">🌱</span>
              <span>
                Anda belum masuk ke akun. Masuk atau daftar akun untuk menyimpan riwayat makanan Anda secara permanen.
              </span>
            </div>
            <button
              onClick={() => openAuthModal('login')}
              className="py-1.5 px-3 rounded-xl bg-[#E94F86] text-white font-bold text-xs shrink-0 hover:bg-[#d83d74] transition-colors cursor-pointer"
            >
              Masuk / Daftar
            </button>
          </div>
        ) : user.isGuest ? (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <span className="text-base">⚡</span>
              <span>
                Anda sedang dalam <strong>Mode Uji Coba</strong>. Data tersimpan di browser ini. Ingin akun pribadi dengan nama sendiri?
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openAuthModal('register')}
                className="py-1.5 px-3 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors cursor-pointer"
              >
                Daftar Akun
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="py-1.5 px-2.5 rounded-xl text-amber-800 font-semibold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Ganti Akun
              </button>
            </div>
          </div>
        ) : null}

        {/* Dynamic View rendering based on active tab */}
        {activeTab === 'beranda' && <DashboardView />}
        {activeTab === 'riwayat' && <HistoryView />}
        {activeTab === 'analisis' && <AnalysisView />}
        {activeTab === 'tambah' && <AddFoodView />}
        {activeTab === 'edukasi' && <EducationView />}
        {activeTab === 'profil' && <ProfileView />}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom duration-200 pointer-events-auto">
          <div
            className={`p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-semibold ${
              toastMessage.type === 'error'
                ? 'bg-red-500 text-white border-red-600'
                : toastMessage.type === 'info'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-emerald-600 text-white border-emerald-700'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : toastMessage.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span className="flex-1">{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
