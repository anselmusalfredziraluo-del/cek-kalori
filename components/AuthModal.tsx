import React, { useState, useEffect } from 'react';
import { useApp, getStoredAccounts } from '../context/AppContext';
import { AppleLogo } from './AppleLogo';
import { ShieldCheck, Mail, User, Scale, Ruler, X, ArrowRight, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  initialMode,
}) => {
  const {
    loginUser,
    registerUser,
    loginAsTrialUser,
    isAuthModalOpen: contextIsOpen,
    closeAuthModal,
    authModalMode: contextMode,
  } = useApp();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const handleClose = propOnClose || closeAuthModal;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode || contextMode || 'login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [foodPreferences, setFoodPreferences] = useState('Semua makanan seimbang');
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync mode if context or prop initialMode changes
  useEffect(() => {
    if (initialMode) setMode(initialMode);
    else if (contextMode) setMode(contextMode);
  }, [initialMode, contextMode]);

  if (!isOpen) return null;

  // Retrieve any previously saved accounts on this device
  const savedAccounts = getStoredAccounts();
  const accountList = Object.values(savedAccounts);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Silakan masukkan nama lengkap atau panggilan Anda.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Silakan masukkan alamat email yang valid.');
        return;
      }
      if (!privacyAgreed) {
        setErrorMsg('Anda perlu menyetujui jaminan privasi data untuk melanjutkan.');
        return;
      }

      setIsSubmitting(true);
      try {
        const success = await registerUser({
          name: name.trim(),
          email: email.trim(),
          birthDate: birthDate || undefined,
          foodPreferences: foodPreferences || undefined,
          heightCm: heightCm ? parseFloat(heightCm) : undefined,
          weightKg: weightKg ? parseFloat(weightKg) : undefined,
          isPrivacyAccepted: true,
        });
        if (success) {
          handleClose();
        }
      } catch (err: any) {
        setErrorMsg('Terjadi kesalahan saat pendaftaran.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Login
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Silakan masukkan alamat email yang valid.');
        return;
      }
      setIsSubmitting(true);
      try {
        const success = await loginUser(email.trim(), name.trim() || undefined);
        if (success) {
          handleClose();
        }
      } catch (err: any) {
        setErrorMsg('Terjadi kesalahan saat masuk.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleQuickDemo = () => {
    loginAsTrialUser();
    handleClose();
  };

  const handleSelectSavedAccount = async (savedEmail: string, savedName: string) => {
    setEmail(savedEmail);
    setName(savedName);
    setIsSubmitting(true);
    try {
      const ok = await loginUser(savedEmail, savedName);
      if (ok) handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-3 shadow-xs">
            <AppleLogo size={36} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'register' ? 'Buat Akun CEK KALORI' : 'Masuk ke Akun Anda'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            {mode === 'register'
              ? 'Daftar untuk menyimpan riwayat makanan, profil gizi, dan hidup lebih sehat.'
              : 'Pilih atau masukkan email akun Anda untuk membuka seluruh catatan makanan.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk ke Akun
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Saved Accounts Quick Picker in Login Mode */}
        {mode === 'login' && accountList.length > 0 && (
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Akun Terdaftar di Perangkat Ini:
            </span>
            <div className="space-y-1.5">
              {accountList.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectSavedAccount(acc.email, acc.name)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#E94F86] hover:bg-pink-50/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-pink-100 text-[#E94F86] flex items-center justify-center font-bold text-xs shrink-0">
                      {acc.name ? acc.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#E94F86]">
                        {acc.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{acc.email}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#E94F86] shrink-0" />
                </button>
              ))}
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-center">
              <span className="text-[11px] text-slate-400">atau masukkan email lain di bawah:</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap / Panggilan *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#E94F86] focus:ring-2 focus:ring-pink-100 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#E94F86] focus:ring-2 focus:ring-pink-100 transition-all"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              {/* Optional Health Information */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">
                    Informasi Fisik & Gizi
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Opsional
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Tinggi Badan (cm)
                    </label>
                    <div className="relative">
                      <Ruler className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="number"
                        min="100"
                        max="250"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder="165"
                        className="w-full pl-9 pr-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Berat Badan (kg)
                    </label>
                    <div className="relative">
                      <Scale className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="number"
                        min="30"
                        max="250"
                        step="0.5"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        placeholder="58"
                        className="w-full pl-9 pr-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Preferensi Makanan
                  </label>
                  <select
                    value={foodPreferences}
                    onChange={(e) => setFoodPreferences(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86] bg-white"
                  >
                    <option value="Semua makanan seimbang">Semua makanan seimbang</option>
                    <option value="Kurangi minyak & gorengan">Kurangi minyak & gorengan</option>
                    <option value="Batasi minuman manis & gula">Batasi minuman manis & gula</option>
                    <option value="Tinggi protein & serat">Tinggi protein & serat</option>
                    <option value="Vegetarian / Nabati">Vegetarian / Nabati</option>
                  </select>
                </div>
              </div>

              {/* Privacy Explanation */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-slate-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#4D8B45] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <p className="font-semibold text-emerald-950 mb-0.5">Jaminan Privasi Data</p>
                  <p className="text-slate-600">
                    Data pribadi dan catatan makanan Anda tersimpan aman dan terisolasi untuk kebutuhan pemantauan Anda sendiri.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none pt-1">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="rounded text-[#E94F86] focus:ring-pink-300"
                />
                <span>Saya menyetujui penyimpanan data untuk jurnal makanan saya</span>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] active:scale-[0.98] transition-all shadow-md shadow-pink-200 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isSubmitting ? (
              <span>Memproses...</span>
            ) : mode === 'register' ? (
              <span>Daftar Sekarang</span>
            ) : (
              <span>Masuk ke Akun</span>
            )}
          </button>
        </form>

        {/* Quick Demo Access (Strictly isolated trial user) */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] text-slate-400">Ingin mencoba aplikasi tanpa mendaftar?</p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="py-2 px-4 rounded-xl font-bold text-xs text-[#4D8B45] bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>⚡ Masuk Cepat sebagai Pengguna Uji Coba</span>
          </button>
        </div>
      </div>
    </div>
  );
};
