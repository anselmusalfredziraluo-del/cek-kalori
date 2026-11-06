import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { FoodItem, FoodLogEntry, UserProfile, MealType } from '../types';
import { INITIAL_FOODS_DATABASE } from '../data/foodsData';
import confetti from 'canvas-confetti';

interface StorageStatus {
  mode: 'local' | 'firestore';
  isLocalAvailable: boolean;
  isServerSynced: boolean;
  firestoreConfigured: boolean;
  totalSavedLogs: number;
}

interface AppContextType {
  user: UserProfile | null;
  isLoading: boolean;
  activeTab: 'beranda' | 'riwayat' | 'analisis' | 'tambah' | 'edukasi' | 'profil';
  setActiveTab: (tab: 'beranda' | 'riwayat' | 'analisis' | 'tambah' | 'edukasi' | 'profil') => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  foodsDatabase: FoodItem[];
  foodLogs: FoodLogEntry[];
  storageStatus: StorageStatus;
  
  // Auth Modal State & Triggers
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Auth & Profile
  loginUser: (email: string, name?: string) => Promise<boolean>;
  registerUser: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => Promise<boolean>;
  loginAsTrialUser: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  logoutUser: () => void;
  deleteAccount: () => Promise<boolean>;

  // Food Logging
  addFoodLog: (entry: Omit<FoodLogEntry, 'id' | 'userId' | 'createdAt'>) => Promise<boolean>;
  updateFoodLog: (id: string, updates: Partial<FoodLogEntry>) => Promise<boolean>;
  deleteFoodLog: (id: string) => Promise<boolean>;
  
  // Custom Food
  addCustomFood: (food: Omit<FoodItem, 'id' | 'categoryName' | 'isRange'>) => Promise<FoodItem>;
  
  // Helpers
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  dailySummary: {
    totalCaloriesMin: number;
    totalCaloriesMax: number;
    isRange: boolean;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
    totalFiber: number;
    itemsCount: number;
    byMeal: Record<MealType, FoodLogEntry[]>;
  };
  todayLogs: FoodLogEntry[];
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEY_USER = 'cek_kalori_active_user';
const STORAGE_KEY_REGISTERED_ACCOUNTS = 'cek_kalori_registered_accounts';
const STORAGE_PREFIX_LOGS = 'cek_kalori_logs_';
const STORAGE_PREFIX_CUSTOM = 'cek_kalori_custom_';
const STORAGE_BACKUP_LOGS = 'cek_kalori_master_logs_backup';

export function getStoredAccounts(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTERED_ACCOUNTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  } catch (e) {}
  return {};
}

export function saveStoredAccounts(accounts: Record<string, UserProfile>) {
  try {
    localStorage.setItem(STORAGE_KEY_REGISTERED_ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {}
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatCaloriesText(min: number, max: number, isRange: boolean): string {
  const roundedMin = Math.round(min);
  const roundedMax = Math.round(max);
  if (isRange && roundedMin !== roundedMax) {
    return `${roundedMin.toLocaleString('id-ID')}–${roundedMax.toLocaleString('id-ID')} kkal`;
  }
  return `${roundedMin.toLocaleString('id-ID')} kkal`;
}

// Default Guest / Trial User (Strictly isolated from registered accounts)
export const DEFAULT_TRIAL_USER: UserProfile = {
  id: 'usr_guest_demo',
  name: 'Pengguna Uji Coba',
  email: 'tamu@cekkalori.local',
  isPrivacyAccepted: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  isGuest: true,
  storageMode: 'local',
  settings: {
    reminderBreakfast: true,
    reminderLunch: true,
    reminderDinner: true,
    reminderWater: true,
    soundEnabled: true,
  },
};

// Default Welcome Seed Logs for initial first-time experience
function createInitialStarterLogs(userId: string): FoodLogEntry[] {
  const today = getTodayDateString();
  return [
    {
      id: 'log-init-1',
      userId,
      foodId: 'f-u-01',
      foodName: 'Nasi putih',
      category: 'umum',
      portionQuantity: 1,
      servingSize: '150 gram (1 centong munjung)',
      caloriesMin: 195,
      caloriesMax: 195,
      isRange: false,
      carbs: 43.5,
      protein: 4.1,
      fat: 0.4,
      fiber: 0.6,
      mealType: 'sarapan',
      date: today,
      time: '07:30',
      notes: 'Sarapan pagi dengan porsi seimbang',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      emoji: '🍚',
    },
    {
      id: 'log-init-2',
      userId,
      foodId: 'f-rm-09',
      foodName: 'Telur dadar',
      category: 'rumahan',
      portionQuantity: 1,
      servingSize: '1 porsi (1 butir telur + bumbu)',
      caloriesMin: 150,
      caloriesMax: 250,
      isRange: true,
      carbs: 2.0,
      protein: 9.5,
      fat: 14.0,
      fiber: 0.2,
      mealType: 'sarapan',
      date: today,
      time: '07:32',
      notes: 'Lauk protein telur dadar daun bawang',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      emoji: '🍳',
    },
    {
      id: 'log-init-3',
      userId,
      foodId: 'f-rm-07',
      foodName: 'Sayur sop',
      category: 'rumahan',
      portionQuantity: 1,
      servingSize: '1 mangkuk kuah bening',
      caloriesMin: 80,
      caloriesMax: 150,
      isRange: true,
      carbs: 14.0,
      protein: 4.0,
      fat: 3.0,
      fiber: 3.6,
      mealType: 'sarapan',
      date: today,
      time: '07:35',
      notes: 'Sayuran wortel dan buncis segar',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      emoji: '🍲',
    },
  ];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Synchronous User Profile Initialization:
  // If user previously logged in or clicked trial, restore it. If logged out, user is null.
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca profil dari localStorage:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem('cek_kalori_splash_shown');
  });

  // Auth modal management
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const [activeTab, setActiveTab] = useState<'beranda' | 'riwayat' | 'analisis' | 'tambah' | 'edukasi' | 'profil'>('beranda');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Storage status metadata
  const [isServerSynced, setIsServerSynced] = useState<boolean>(true);

  // 2. Synchronous Food Logs Initialization
  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>(() => {
    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUserStr) {
        const activeUser = JSON.parse(savedUserStr);
        if (activeUser && activeUser.id) {
          const userLogsStr = localStorage.getItem(STORAGE_PREFIX_LOGS + activeUser.id);
          if (userLogsStr !== null) {
            const parsed = JSON.parse(userLogsStr);
            if (Array.isArray(parsed)) return parsed;
          }
          // If first time for this active user, seed initial logs
          const starterLogs = createInitialStarterLogs(activeUser.id);
          try {
            localStorage.setItem(STORAGE_PREFIX_LOGS + activeUser.id, JSON.stringify(starterLogs));
          } catch (e) {}
          return starterLogs;
        }
      }
    } catch (e) {
      console.error('Gagal membaca catatan makanan dari localStorage:', e);
    }
    return [];
  });

  // 3. Synchronous Custom Foods Initialization
  const [customFoods, setCustomFoods] = useState<FoodItem[]>(() => {
    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUserStr) {
        const activeUser = JSON.parse(savedUserStr);
        if (activeUser && activeUser.id) {
          const customStr = localStorage.getItem(STORAGE_PREFIX_CUSTOM + activeUser.id);
          if (customStr) {
            const parsed = JSON.parse(customStr);
            if (Array.isArray(parsed)) return parsed;
          }
        }
      }
    } catch (e) {}
    return [];
  });

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  }, []);

  // Safe localStorage writer with verification
  const writeLocalLogs = useCallback((userId: string, logs: FoodLogEntry[]): boolean => {
    try {
      const serialized = JSON.stringify(logs);
      localStorage.setItem(STORAGE_PREFIX_LOGS + userId, serialized);
      localStorage.setItem(STORAGE_BACKUP_LOGS, serialized);
      return true;
    } catch (err: any) {
      console.error('LocalStorage write failed:', err);
      return false;
    }
  }, []);

  // Safe server sync in background
  const syncToServer = useCallback(async (userId: string, profile: UserProfile, logs: FoodLogEntry[], custom: FoodItem[]) => {
    try {
      const res = await fetch(`/api/user-data/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, logs, customFoods: custom }),
      });
      if (res.ok) {
        setIsServerSynced(true);
      } else {
        setIsServerSynced(false);
      }
    } catch (e) {
      setIsServerSynced(false);
    }
  }, []);

  // Sync with server on mount or user switch
  useEffect(() => {
    if (!user) return;
    const fetchServerData = async () => {
      try {
        const res = await fetch(`/api/user-data/${user.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            // Only merge if server has logs and local is empty
            if (Array.isArray(json.data.logs) && json.data.logs.length > 0 && foodLogs.length === 0) {
              setFoodLogs(json.data.logs);
              writeLocalLogs(user.id, json.data.logs);
            }
            if (Array.isArray(json.data.customFoods) && json.data.customFoods.length > 0 && customFoods.length === 0) {
              setCustomFoods(json.data.customFoods);
              localStorage.setItem(STORAGE_PREFIX_CUSTOM + user.id, JSON.stringify(json.data.customFoods));
            }
          }
          setIsServerSynced(true);
        }
      } catch (e) {
        // Local persistence continues seamlessly
      }
    };
    fetchServerData();
  }, [user?.id, writeLocalLogs]);

  // Combine default 56 foods with user custom foods
  const foodsDatabase = useMemo(() => {
    return [...INITIAL_FOODS_DATABASE, ...customFoods];
  }, [customFoods]);

  // Storage status metadata
  const storageStatus = useMemo<StorageStatus>(() => {
    let localOk = false;
    try {
      localStorage.setItem('__test_storage__', '1');
      localStorage.removeItem('__test_storage__');
      localOk = true;
    } catch (e) {
      localOk = false;
    }

    return {
      mode: 'local', // Local & Server Persistent Storage active
      isLocalAvailable: localOk,
      isServerSynced,
      firestoreConfigured: false, // Cloud Firestore pending cloud deployment
      totalSavedLogs: foodLogs.length,
    };
  }, [foodLogs.length, isServerSynced]);

  // Fast Trial / Guest Login handler
  const loginAsTrialUser = useCallback(() => {
    const trialUser = DEFAULT_TRIAL_USER;
    setUser(trialUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(trialUser));
    } catch (e) {}

    // Load trial logs
    let trialLogs: FoodLogEntry[] = [];
    const trialLogsStr = localStorage.getItem(STORAGE_PREFIX_LOGS + trialUser.id);
    if (trialLogsStr) {
      try {
        const parsed = JSON.parse(trialLogsStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          trialLogs = parsed;
        }
      } catch (e) {}
    }

    if (trialLogs.length === 0) {
      trialLogs = createInitialStarterLogs(trialUser.id);
      writeLocalLogs(trialUser.id, trialLogs);
    }

    setFoodLogs(trialLogs);

    // Load trial custom foods
    const trialCustomStr = localStorage.getItem(STORAGE_PREFIX_CUSTOM + trialUser.id);
    if (trialCustomStr) {
      try {
        const parsed = JSON.parse(trialCustomStr);
        if (Array.isArray(parsed)) setCustomFoods(parsed);
      } catch (e) {}
    } else {
      setCustomFoods([]);
    }

    setIsAuthModalOpen(false);
    showToast('Masuk sebagai Pengguna Uji Coba. Catatan Anda tersimpan di perangkat ini.', 'success');
  }, [showToast, writeLocalLogs]);

  // Login handler for registered accounts
  const loginUser = async (email: string, name?: string): Promise<boolean> => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        showToast('Silakan masukkan alamat email yang valid.', 'error');
        return false;
      }

      const accounts = getStoredAccounts();
      let targetProfile = accounts[cleanEmail];

      if (!targetProfile) {
        // If not in accounts registry yet, create new profile for this email
        const userId = 'usr_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
        targetProfile = {
          id: userId,
          name: name?.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          isPrivacyAccepted: true,
          createdAt: new Date().toISOString(),
          isGuest: false,
          storageMode: 'local',
          settings: {
            reminderBreakfast: true,
            reminderLunch: true,
            reminderDinner: true,
            reminderWater: true,
            soundEnabled: true,
          },
        };
        accounts[cleanEmail] = targetProfile;
        saveStoredAccounts(accounts);
      }

      const userId = targetProfile.id;

      // Load logs for this specific user account
      let userLogs: FoodLogEntry[] = [];
      const savedUserLogs = localStorage.getItem(STORAGE_PREFIX_LOGS + userId);
      if (savedUserLogs) {
        try {
          const parsed = JSON.parse(savedUserLogs);
          if (Array.isArray(parsed)) userLogs = parsed;
        } catch (e) {}
      }

      // If user had no logs yet, seed starter logs
      if (userLogs.length === 0) {
        userLogs = createInitialStarterLogs(userId);
        writeLocalLogs(userId, userLogs);
      }

      // Load custom foods for this user account
      let userCustom: FoodItem[] = [];
      const savedCustom = localStorage.getItem(STORAGE_PREFIX_CUSTOM + userId);
      if (savedCustom) {
        try {
          const parsed = JSON.parse(savedCustom);
          if (Array.isArray(parsed)) userCustom = parsed;
        } catch (e) {}
      }

      setUser(targetProfile);
      setFoodLogs(userLogs);
      setCustomFoods(userCustom);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(targetProfile));
      syncToServer(userId, targetProfile, userLogs, userCustom);

      setIsAuthModalOpen(false);
      showToast(`Selamat datang kembali, ${targetProfile.name}! 👋`, 'success');
      return true;
    } catch (err) {
      console.error('loginUser failed:', err);
      showToast('Gagal masuk ke akun. Silakan coba lagi.', 'error');
      return false;
    }
  };

  // Register handler
  const registerUser = async (profileData: Omit<UserProfile, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const cleanEmail = profileData.email.toLowerCase().trim();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        showToast('Silakan masukkan alamat email yang valid.', 'error');
        return false;
      }

      const userId = 'usr_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);

      const newProfile: UserProfile = {
        ...profileData,
        id: userId,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        isGuest: false,
        storageMode: 'local',
        settings: {
          reminderBreakfast: true,
          reminderLunch: true,
          reminderDinner: true,
          reminderWater: true,
          soundEnabled: true,
        },
      };

      // Save to registered accounts dictionary
      const accounts = getStoredAccounts();
      accounts[cleanEmail] = newProfile;
      saveStoredAccounts(accounts);

      // Initialize initial starter logs for this user
      const userLogs = createInitialStarterLogs(userId);
      writeLocalLogs(userId, userLogs);

      setUser(newProfile);
      setFoodLogs(userLogs);
      setCustomFoods([]);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newProfile));
      syncToServer(userId, newProfile, userLogs, []);

      setIsAuthModalOpen(false);
      showToast(`Akun berhasil dibuat! Seluruh catatan tersimpan aman. 🌱`, 'success');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      return true;
    } catch (err) {
      console.error('registerUser failed:', err);
      showToast('Gagal mendaftar akun. Silakan periksa kembali data Anda.', 'error');
      return false;
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    try {
      const updated: UserProfile = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));

      // Update in accounts dictionary
      const accounts = getStoredAccounts();
      if (accounts[user.email.toLowerCase()]) {
        accounts[user.email.toLowerCase()] = updated;
        saveStoredAccounts(accounts);
      }

      syncToServer(user.id, updated, foodLogs, customFoods);
      showToast('Profil berhasil diperbarui dan disimpan!');
      return true;
    } catch (err) {
      showToast('Gagal memperbarui profil.', 'error');
      return false;
    }
  };

  // Logout handler - Ends active session, preserves saved data, redirects to Auth screen
  const logoutUser = () => {
    try {
      // 1. Remove active session pointer
      localStorage.removeItem(STORAGE_KEY_USER);

      // 2. Clear current state (saved logs in localStorage remain untouched)
      setUser(null);
      setFoodLogs([]);
      setCustomFoods([]);

      // 3. Navigate back to Beranda and immediately show Auth Modal
      setActiveTab('beranda');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);

      showToast('Berhasil keluar dari akun. Seluruh catatan Anda tetap tersimpan.', 'info');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Delete Account & All Data permanently
  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const id = user.id;
      const email = user.email.toLowerCase();

      try {
        await fetch(`/api/user-data/${id}`, { method: 'DELETE' });
      } catch (e) {}

      // Remove from accounts registry
      const accounts = getStoredAccounts();
      if (accounts[email]) {
        delete accounts[email];
        saveStoredAccounts(accounts);
      }

      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_PREFIX_LOGS + id);
      localStorage.removeItem(STORAGE_PREFIX_CUSTOM + id);
      localStorage.removeItem(STORAGE_BACKUP_LOGS);

      setUser(null);
      setFoodLogs([]);
      setCustomFoods([]);
      setActiveTab('beranda');
      setAuthModalMode('register');
      setIsAuthModalOpen(true);

      showToast('Akun dan seluruh data telah dihapus secara permanen.', 'info');
      return true;
    } catch (err) {
      showToast('Gagal menghapus akun.', 'error');
      return false;
    }
  };

  // ==========================================
  // ADD FOOD LOG (Atomic, Anti-duplicate, Permanent)
  // ==========================================
  const addFoodLog = async (entry: Omit<FoodLogEntry, 'id' | 'userId' | 'createdAt'>): Promise<boolean> => {
    if (!user) {
      openAuthModal('register');
      showToast('Silakan masuk atau daftar akun untuk mencatat makanan.', 'info');
      return false;
    }

    try {
      const activeId = user.id;
      const nowTs = Date.now();

      // Anti-duplicate protection: avoid adding identical item within 1.5s
      const isDuplicate = foodLogs.some(
        (l) =>
          l.foodName === entry.foodName &&
          l.mealType === entry.mealType &&
          Math.abs(nowTs - new Date(l.createdAt).getTime()) < 1500
      );

      if (isDuplicate) {
        showToast('Makanan ini baru saja dicatat.', 'info');
        return false;
      }

      const newEntry: FoodLogEntry = {
        ...entry,
        id: 'log_' + nowTs + '_' + Math.random().toString(36).substring(2, 7),
        userId: activeId,
        createdAt: new Date().toISOString(),
      };

      const nextLogs = [newEntry, ...foodLogs];

      // 1. Immediately update React State
      setFoodLogs(nextLogs);

      // 2. Persist to LocalStorage synchronously with verification
      const writeSuccess = writeLocalLogs(activeId, nextLogs);
      if (!writeSuccess) {
        showToast('Penyimpanan lokal penuh atau tidak dapat diakses!', 'error');
        return false;
      }

      // 3. Sync to Server Persistence in background
      syncToServer(activeId, user, nextLogs, customFoods);

      showToast(`${entry.foodName} berhasil dicatat & disimpan! ✨`, 'success');
      return true;
    } catch (err: any) {
      console.error('addFoodLog failed:', err);
      showToast('Gagal menyimpan makanan ke jurnal.', 'error');
      return false;
    }
  };

  // ==========================================
  // UPDATE FOOD LOG
  // ==========================================
  const updateFoodLog = async (id: string, updates: Partial<FoodLogEntry>): Promise<boolean> => {
    if (!user) return false;
    try {
      const activeId = user.id;
      const nextLogs = foodLogs.map((log) => (log.id === id ? { ...log, ...updates } : log));

      setFoodLogs(nextLogs);
      writeLocalLogs(activeId, nextLogs);
      syncToServer(activeId, user, nextLogs, customFoods);

      showToast('Catatan makanan berhasil diubah dan disimpan.', 'success');
      return true;
    } catch (err) {
      showToast('Gagal memperbarui catatan makanan.', 'error');
      return false;
    }
  };

  // ==========================================
  // DELETE FOOD LOG
  // ==========================================
  const deleteFoodLog = async (id: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const activeId = user.id;
      const nextLogs = foodLogs.filter((log) => log.id !== id);

      setFoodLogs(nextLogs);
      writeLocalLogs(activeId, nextLogs);
      syncToServer(activeId, user, nextLogs, customFoods);

      showToast('Catatan makanan telah dihapus.', 'info');
      return true;
    } catch (err) {
      showToast('Gagal menghapus catatan makanan.', 'error');
      return false;
    }
  };

  // ==========================================
  // ADD CUSTOM FOOD
  // ==========================================
  const addCustomFood = async (food: Omit<FoodItem, 'id' | 'categoryName' | 'isRange'>): Promise<FoodItem> => {
    if (!user) {
      openAuthModal('register');
      throw new Error('Harap masuk terlebih dahulu.');
    }
    const activeId = user.id;
    const isRange = food.caloriesMin !== food.caloriesMax;
    const newFood: FoodItem = {
      ...food,
      id: 'custom_' + Date.now(),
      category: 'kustom',
      categoryName: 'Makanan Kustom Saya',
      isRange,
      isCustom: true,
      emoji: food.emoji || '🍽️',
    };

    const nextCustom = [newFood, ...customFoods];
    setCustomFoods(nextCustom);

    try {
      localStorage.setItem(STORAGE_PREFIX_CUSTOM + activeId, JSON.stringify(nextCustom));
    } catch (e) {}
    syncToServer(activeId, user, foodLogs, nextCustom);

    showToast(`Makanan "${newFood.name}" berhasil disimpan ke database!`);
    return newFood;
  };

  // Logs for selected date
  const todayLogs = useMemo(() => {
    return foodLogs.filter((log) => log.date === selectedDate);
  }, [foodLogs, selectedDate]);

  // Aggregate daily summary
  const dailySummary = useMemo(() => {
    let minCal = 0;
    let maxCal = 0;
    let hasAnyRange = false;
    let carbs = 0;
    let protein = 0;
    let fat = 0;
    let fiber = 0;

    const byMeal: Record<MealType, FoodLogEntry[]> = {
      sarapan: [],
      makan_siang: [],
      makan_malam: [],
      camilan: [],
    };

    todayLogs.forEach((log) => {
      minCal += log.caloriesMin;
      maxCal += log.caloriesMax;
      if (log.isRange) hasAnyRange = true;
      carbs += log.carbs;
      protein += log.protein;
      fat += log.fat;
      fiber += log.fiber;

      if (byMeal[log.mealType]) {
        byMeal[log.mealType].push(log);
      }
    });

    return {
      totalCaloriesMin: Math.round(minCal),
      totalCaloriesMax: Math.round(maxCal),
      isRange: hasAnyRange && minCal !== maxCal,
      totalCarbs: Math.round(carbs * 10) / 10,
      totalProtein: Math.round(protein * 10) / 10,
      totalFat: Math.round(fat * 10) / 10,
      totalFiber: Math.round(fiber * 10) / 10,
      itemsCount: todayLogs.length,
      byMeal,
    };
  }, [todayLogs]);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        activeTab,
        setActiveTab,
        showSplash,
        setShowSplash: (show: boolean) => {
          setShowSplash(show);
          if (!show) sessionStorage.setItem('cek_kalori_splash_shown', 'true');
        },
        foodsDatabase,
        foodLogs,
        storageStatus,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        loginUser,
        registerUser,
        loginAsTrialUser,
        updateProfile,
        logoutUser,
        deleteAccount,
        addFoodLog,
        updateFoodLog,
        deleteFoodLog,
        addCustomFood,
        selectedDate,
        setSelectedDate,
        dailySummary,
        todayLogs,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
