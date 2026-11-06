import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppleLogo } from './AppleLogo';
import {
  User,
  Mail,
  Calendar,
  Ruler,
  Scale,
  Bell,
  ShieldCheck,
  HelpCircle,
  Info,
  LogOut,
  Trash2,
  Check,
  X,
  Sparkles,
  Lock,
  Database,
  ExternalLink
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateProfile,
    logoutUser,
    deleteAccount,
    foodLogs,
    storageStatus,
    showToast,
    openAuthModal,
    loginAsTrialUser,
  } = useApp();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [heightCm, setHeightCm] = useState(user?.heightCm?.toString() || '');
  const [weightKg, setWeightKg] = useState(user?.weightKg?.toString() || '');
  const [foodPreferences, setFoodPreferences] = useState(
    user?.foodPreferences || 'Semua makanan seimbang'
  );

  // Settings state
  const [reminderBreakfast, setReminderBreakfast] = useState(
    user?.settings?.reminderBreakfast ?? true
  );
  const [reminderLunch, setReminderLunch] = useState(
    user?.settings?.reminderLunch ?? true
  );
  const [reminderDinner, setReminderDinner] = useState(
    user?.settings?.reminderDinner ?? true
  );
  const [reminderWater, setReminderWater] = useState(
    user?.settings?.reminderWater ?? true
  );

  // Modals
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Keep state synced with user changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBirthDate(user.birthDate || '');
      setHeightCm(user.heightCm?.toString() || '');
      setWeightKg(user.weightKg?.toString() || '');
      setFoodPreferences(user.foodPreferences || 'Semua makanan seimbang');
      setReminderBreakfast(user.settings?.reminderBreakfast ?? true);
      setReminderLunch(user.settings?.reminderLunch ?? true);
      setReminderDinner(user.settings?.reminderDinner ?? true);
      setReminderWater(user.settings?.reminderWater ?? true);
    }
  }, [user]);

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim(),
      birthDate: birthDate || undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      foodPreferences,
      settings: {
        reminderBreakfast,
        reminderLunch,
        reminderDinner,
        reminderWater,
        soundEnabled: true,
      },
    });
    setIsEditing(false);
  };

  const handleToggleReminder = async (type: 'bf' | 'lunch' | 'dinner' | 'water') => {
    let nextBf = reminderBreakfast;
    let nextLunch = reminderLunch;
    let nextDin = reminderDinner;
    let nextWater = reminderWater;

    if (type === 'bf') {
      nextBf = !reminderBreakfast;
      setReminderBreakfast(nextBf);
    } else if (type === 'lunch') {
      nextLunch = !reminderLunch;
      setReminderLunch(nextLunch);
    } else if (type === 'dinner') {
      nextDin = !reminderDinner;
      setReminderDinner(nextDin);
    } else if (type === 'water') {
      nextWater = !reminderWater;
      setReminderWater(nextWater);
    }

    await updateProfile({
      settings: {
        reminderBreakfast: nextBf,
        reminderLunch: nextLunch,
        reminderDinner: nextDin,
        reminderWater: nextWater,
        soundEnabled: true,
      },
    });
  };

  // If no user is logged in, show clear Sign In / Register / Trial options
  if (!user) {
    return (
      <div className="space-y-6 pb-28 md:pb-12 max-w-xl mx-auto pt-6 text-center">
        <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-pink-50 flex items-center justify-center mx-auto">
            <AppleLogo size={42} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Profil Pengguna
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Anda belum masuk ke akun. Masuk atau buat akun untuk menyimpan profil tubuh, preferensi makanan, dan catatan kalori harian Anda secara permanen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => openAuthModal('login')}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#E94F86] hover:bg-[#d83d74] transition-all shadow-md shadow-pink-200 cursor-pointer"
            >
              Masuk ke Akun
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-[#E94F86] bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
            >
              Daftar Sekarang
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={loginAsTrialUser}
              className="text-xs font-semibold text-[#4D8B45] hover:underline cursor-pointer"
            >
              ⚡ Masuk Cepat sebagai Pengguna Uji Coba
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 md:pb-12 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#4D8B45] uppercase tracking-wider">
            Pengaturan Akun & Privasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Profil Pengguna
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil kesehatan, preferensi makanan, dan privasi data Anda.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-auto py-2 px-4 rounded-xl font-semibold text-xs text-[#E94F86] bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
          >
            Edit Profil
          </button>
        )}
      </div>

      {/* Guest Mode Notice Banner */}
      {user.isGuest && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-amber-900">
            <span className="text-base shrink-0">💡</span>
            <div>
              <p className="font-bold">Anda sedang dalam Mode Uji Coba</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Catatan Anda tersimpan di peramban ini. Daftarkan akun Anda agar riwayat makan memiliki nama dan identitas pribadi.
              </p>
            </div>
          </div>
          <button
            onClick={() => openAuthModal('register')}
            className="py-1.5 px-3.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors self-start sm:self-auto shrink-0 cursor-pointer shadow-xs"
          >
            Daftar Akun Baru
          </button>
        </div>
      )}

      {/* User Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-white shadow-md flex items-center justify-center text-3xl font-extrabold text-[#E94F86]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#4D8B45] text-white flex items-center justify-center shadow-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {user.name}
            </h2>
            {user.isGuest ? (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Mode Uji Coba
              </span>
            ) : (
              <span className="text-[10px] font-bold text-[#4D8B45] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Akun Terdaftar
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="p-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
              {foodLogs.length} Catatan Makanan
            </span>
            {user?.heightCm && (
              <span className="p-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                TB: {user.heightCm} cm
              </span>
            )}
            {user?.weightKg && (
              <span className="p-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                BB: {user.weightKg} kg
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Ubah Informasi Profil</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Lahir (Opsional)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                min="50"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="Contoh: 168"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                min="20"
                max="250"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Contoh: 62"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#E94F86]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
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

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] text-xs shadow-sm cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      )}

      {/* Pengaturan Pengingat Makan (Bagian 14) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#E94F86]" />
          <h3 className="font-bold text-slate-900 text-base">
            Pengingat Waktu Makan & Hidrasi
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Atur pengingat berkala untuk menjaga keteraturan jam makan dan minum air putih.
        </p>

        <div className="space-y-3 pt-2">
          {[
            { id: 'bf', label: 'Pengingat Sarapan (07:30)', state: reminderBreakfast },
            { id: 'lunch', label: 'Pengingat Makan Siang (12:00)', state: reminderLunch },
            { id: 'dinner', label: 'Pengingat Makan Malam (19:00)', state: reminderDinner },
            { id: 'water', label: 'Pengingat Cukupi Air Putih (8 Gelas)', state: reminderWater },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
              <button
                type="button"
                onClick={() => handleToggleReminder(item.id as any)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  item.state ? 'bg-[#4D8B45]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    item.state ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status Database & Cloud Firestore (Bagian 15) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Status Database & Sinkronisasi
          </h3>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
            <span className="font-semibold text-slate-800">Metode Autentikasi:</span>
            <span className="font-bold text-slate-700">
              {user.isGuest ? 'Mode Uji Coba (Lokal)' : 'Akun Terdaftar (Lokal & Server)'}
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
            <span className="font-semibold text-slate-800">Penyimpanan Perangkat (localStorage):</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Aktif & Tersimpan Permanen
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
            <span className="font-semibold text-slate-800">Jumlah Catatan Aktif:</span>
            <span className="font-bold text-slate-900 tabular-nums">{foodLogs.length} makanan tercatat</span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
            <span className="font-semibold text-slate-800">Sinkronisasi Cloud Firestore:</span>
            <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
              Belum Dikonfigurasi (Offline-First)
            </span>
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            Catatan makanan Anda tersimpan secara persisten pada browser ini dan server aplikasi lokal. Firebase Authentication dan Cloud Firestore saat ini belum dikonfigurasi aktif, sehingga seluruh data tersimpan aman secara offline-first.
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ user, logs: foodLogs }, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `cek_kalori_cadangan_${new Date().toISOString().slice(0, 10)}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast('Cadangan data berhasil diunduh (JSON)!', 'success');
              }}
              className="py-2 px-3.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Unduh Cadangan Catatan (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privasi & Keamanan (Bagian 16) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#4D8B45]" />
          <h3 className="font-bold text-slate-900 text-base">
            Privasi & Keamanan Data
          </h3>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700 leading-relaxed space-y-1.5">
          <p className="font-semibold text-emerald-900">Prinsip Privasi CEK KALORI:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Data Anda hanya dapat dilihat dan dikelola oleh Anda sendiri.</li>
            <li>Informasi fisik seperti tinggi dan berat badan bersifat opsional.</li>
            <li>Angka kalori merupakan perkiraan dan bukan diagnosis medis.</li>
            <li>Anda bebas menghapus seluruh data kapan saja.</li>
          </ul>
        </div>
      </div>

      {/* Help & About Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setIsFaqOpen(true)}
          className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-pink-300 transition-colors text-left flex items-center justify-between shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-slate-500" />
            <div>
              <h4 className="font-bold text-xs text-slate-900">Bantuan & FAQ</h4>
              <p className="text-[11px] text-slate-500">Pertanyaan umum seputar kalori</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setIsAboutOpen(true)}
          className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-pink-300 transition-colors text-left flex items-center justify-between shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-500" />
            <div>
              <h4 className="font-bold text-xs text-slate-900">Tentang CEK KALORI</h4>
              <p className="text-[11px] text-slate-500">Visi & standar gizi aplikasi</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Account Actions: Logout & Delete Account */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full sm:w-auto py-2.5 px-5 rounded-2xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>{user.isGuest ? 'Keluar dari Sesi Uji Coba' : 'Keluar dari Akun'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full sm:w-auto py-2.5 px-5 rounded-2xl font-bold text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Hapus Akun & Seluruh Data</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#E94F86] flex items-center justify-center mx-auto mb-3.5">
              <LogOut className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              {user.isGuest ? 'Keluar dari Sesi Uji Coba?' : 'Konfirmasi Keluar dari Akun'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-sm mx-auto">
              {user.isGuest ? (
                <>
                  Sesi uji coba Anda akan diakhiri dan Anda akan diarahkan ke halaman Masuk/Daftar. Catatan makanan Anda tetap <strong className="text-slate-700">tersimpan aman di peramban ini</strong> dan tidak dihapus.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin keluar dari akun <strong className="text-slate-700">{user.email}</strong>? Seluruh catatan makanan Anda tetap <strong className="text-slate-700">tersimpan aman</strong> dan akan muncul kembali saat Anda masuk menggunakan email yang sama.
                </>
              )}
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logoutUser();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-[#E94F86] hover:bg-[#d83d74] text-xs transition-colors shadow-md shadow-pink-200 cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsFaqOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Bantuan & Tanya Jawab (FAQ)
            </h3>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  Apakah estimasi kalori ini 100% akurat?
                </h4>
                <p>
                  Angka kalori yang dicantumkan adalah estimasi berdasarkan Tabel Komposisi Pangan Indonesia (TKPI) Kemenkes RI. Kalori sebenarnya dapat berbeda berdasarkan porsi potongan, jumlah minyak, gula, dan resep bumbu setiap penjual atau masakan rumah.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  Mengapa ada makanan dengan rentang kalori (misal 400–600 kkal)?
                </h4>
                <p>
                  Masakan seperti nasi goreng atau seblak memiliki variasi bahan dan minyak yang sangat berbeda di setiap tempat. Kami menggunakan rentang agar Anda mendapatkan gambaran yang lebih realistis tanpa angka palsu yang dipaksakan.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  Bagaimana cara kerja fitur Scan AI Foto?
                </h4>
                <p>
                  Aplikasi menggunakan kecerdasan buatan Gemini untuk menganalisis gambar makanan Anda dan mencocokkannya dengan database makanan Indonesia. Anda dapat selalu mengoreksi nama makanan dan ukuran porsi sebelum disimpan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-pink-50 flex items-center justify-center mx-auto mb-4">
              <AppleLogo size={42} />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">CEK KALORI</h3>
            <p className="text-xs font-bold text-[#E94F86] mt-0.5">
              &ldquo;Makan dengan Sadar, Hidup Lebih Sehat&rdquo;
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-slate-50 text-xs text-slate-600 leading-relaxed text-left space-y-2">
              <p>
                Aplikasi kesehatan digital yang dirancang untuk membantu remaja, mahasiswa, dan orang dewasa mengenali asupan makanan dan membangun pola makan yang sadar dan seimbang.
              </p>
              <p className="text-[11px] text-slate-500">
                Data rujukan: Kementerian Kesehatan Republik Indonesia, World Health Organization (WHO), dan Badan POM RI.
              </p>
            </div>

            <p className="text-[11px] text-slate-400 mt-4">
              Versi 1.0.0 · Dibuat dengan cinta untuk kesehatan Indonesia
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Hapus Akun & Seluruh Data?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Seluruh profil, catatan makanan harian, dan makanan kustom Anda akan dihapus dari server dan memori perangkat.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteAccount();
                  setIsDeleteModalOpen(false);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 text-xs shadow-md shadow-red-200 cursor-pointer"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
