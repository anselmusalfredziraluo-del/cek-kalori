export type FoodCategory = 'umum' | 'cepat_saji' | 'rumahan' | 'kustom';

export type MealType = 'sarapan' | 'makan_siang' | 'makan_malam' | 'camilan';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  categoryName: string;
  servingSize: string;
  caloriesMin: number;
  caloriesMax: number;
  carbs: number; // in grams
  protein: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  isRange: boolean;
  source: string;
  emoji: string;
  description?: string;
  isCustom?: boolean;
}

export interface FoodLogEntry {
  id: string;
  userId: string;
  foodId: string;
  foodName: string;
  category: FoodCategory;
  portionQuantity: number; // e.g. 1, 1.5, 2
  servingSize: string; // e.g. "1 piring", "150 gram"
  caloriesMin: number;
  caloriesMax: number;
  isRange: boolean;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  mealType: MealType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  createdAt: string;
  emoji?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  heightCm?: number;
  weightKg?: number;
  foodPreferences?: string;
  dailyCalorieTargetMin?: number;
  dailyCalorieTargetMax?: number;
  avatarSeed?: string;
  isPrivacyAccepted: boolean;
  createdAt: string;
  isGuest?: boolean;
  storageMode?: 'local' | 'firestore';
  settings?: {
    reminderBreakfast: boolean;
    reminderLunch: boolean;
    reminderDinner: boolean;
    reminderWater: boolean;
    soundEnabled: boolean;
  };
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  source: string;
  iconName: string;
}
