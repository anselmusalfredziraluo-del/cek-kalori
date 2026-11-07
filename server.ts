import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
export { app };
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure data directory exists for local server-side persistence
const DATA_DIR = path.resolve('.data');
const DATA_FILE = path.join(DATA_DIR, 'cek_kalori_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBStorage {
  users: Record<string, any>;
  foodLogs: Record<string, any[]>;
  customFoods: Record<string, any[]>;
}

function readStorage(): DBStorage {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading storage file:', err);
  }
  return { users: {}, foodLogs: {}, customFoods: {} };
}

function writeStorage(data: DBStorage) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing storage file:', err);
  }
}

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (e) {
    console.warn('Failed to initialize GoogleGenAI client:', e);
  }
}

// ==========================================
// API ENDPOINTS
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'CEK KALORI',
    aiAvailable: !!aiClient,
    timestamp: new Date().toISOString()
  });
});

// Gemini Food Scan AI API
app.post('/api/gemini/scan-food', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'Gambar tidak ditemukan. Silakan unggah atau ambil foto makanan.'
      });
    }

    if (!aiClient) {
      return res.status(503).json({
        success: false,
        message: 'Layanan AI belum siap atau API Key belum dikonfigurasi. Silakan masukkan makanan secara manual.',
        canManualFallback: true
      });
    }

    // Strip data URL header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const systemPrompt = `
Anda adalah AI pakar analisis makanan dan gizi Indonesia untuk aplikasi "CEK KALORI".
Tugas Anda adalah mengenali makanan dan minuman yang terdapat dalam foto yang dikirimkan pengguna.
Berikut adalah 56 daftar makanan yang tersedia dalam database CEK KALORI:
1. Nasi putih (150 gram, 195 kkal)
2. Nasi goreng (1 piring, 400-600 kkal)
3. Mi instan (1 bungkus, 350-450 kkal)
4. Ayam goreng (1 potong, 250-350 kkal)
5. Ayam geprek + nasi (1 porsi, 500-700 kkal)
6. Nasi uduk + telur (1 porsi, 400-550 kkal)
7. Bakso (1 mangkuk, 300-450 kkal)
8. Mi ayam (1 mangkuk, 400-550 kkal)
9. Seblak (1 porsi, 300-500 kkal)
10. Martabak telur (1 potong, 200-300 kkal)
11. Roti cokelat (1 buah, 200-300 kkal)
12. Pisang goreng (1 buah, 100-150 kkal)
13. Kentang goreng (1 porsi kecil, 200-300 kkal)
14. Kopi susu gula aren (1 gelas, 150-250 kkal)
15. Teh manis (1 gelas, 80-120 kkal)
16. Es teh jumbo (1 gelas, 150-250 kkal)
17. Burger daging (1 buah, 300-500 kkal)
18. Pizza (1 potong, 250-350 kkal)
19. Hot dog (1 buah, 250-400 kkal)
20. Kebab (1 buah, 350-500 kkal)
21. Sandwich telur (1 buah, 250-350 kkal)
22. Pempek (1 porsi, 300-500 kkal)
23. Siomay (1 porsi, 300-450 kkal)
24. Batagor (1 porsi, 350-500 kkal)
25. Gorengan (bakwan, tahu, tempe) (1 buah, 100-200 kkal)
26. Risol mayo (1 buah, 150-250 kkal)
27. Donat (1 buah, 200-350 kkal)
28. Croffle (1 buah, 250-400 kkal)
29. Salad buah (1 mangkuk, 200-350 kkal)
30. Yogurt (1 cup, 100-200 kkal)
31. Susu cokelat (1 kotak, 150-250 kkal)
32. Boba milk tea (1 gelas, 250-450 kkal)
33. Jus alpukat dengan gula (1 gelas, 250-400 kkal)
34. Es krim (1 cup kecil, 150-250 kkal)
35. Roti bakar cokelat keju (1 porsi, 350-500 kkal)
36. Martabak manis (1 potong, 250-400 kkal)
37. Nasi liwet (1 porsi, 400-550 kkal)
38. Nasi bakar ayam (1 bungkus, 350-500 kkal)
39. Nasi campur (1 porsi, 500-700 kkal)
40. Nasi tim ayam (1 mangkuk, 300-450 kkal)
41. Capcay kuah (1 porsi, 150-250 kkal)
42. Tumis kangkung (1 porsi, 100-180 kkal)
43. Sayur sop (1 mangkuk, 80-150 kkal)
44. Perkedel kentang (1 buah, 100-180 kkal)
45. Telur dadar (1 porsi, 150-250 kkal)
46. Tempe orek (1 porsi, 150-250 kkal)
47. Sosis goreng (2 buah, 150-250 kkal)
48. Nugget ayam (5 buah, 200-300 kkal)
49. Roti canai (1 lembar, 250-350 kkal)
50. Pancake (2 buah kecil, 200-300 kkal)
51. Puding cokelat (1 cup, 150-250 kkal)
52. Es campur (1 mangkuk, 250-400 kkal)
53. Es doger (1 mangkuk, 250-400 kkal)
54. Susu kedelai manis (1 gelas, 100-180 kkal)
55. Teh tarik (1 gelas, 150-250 kkal)
56. Smoothie buah (1 gelas, 150-300 kkal)

Instruksi:
1. Periksa apakah gambar berisi makanan atau minuman. Jika bukan makanan, set recognized = false.
2. Jika terdeteksi makanan, berikan nama makanan yang paling mirip dalam bahasa Indonesia yang lazim.
3. Cocokkan dengan salah satu dari 56 makanan di atas jika relevan.
4. Jangan menyatakan bahwa AI dapat mengukur kalori secara akurat 100% hanya berdasarkan foto; tekankan bahwa ini estimasi awal.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: 'Analisis makanan pada foto ini dan kembalikan respon sesuai format JSON terstruktur.',
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recognized: { type: Type.BOOLEAN },
            foodName: { type: Type.STRING },
            matchedNameFromList: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            detectedPortion: { type: Type.STRING },
            caloriesMin: { type: Type.NUMBER },
            caloriesMax: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            fiber: { type: Type.NUMBER },
            analysisNotes: { type: Type.STRING },
            alternativeSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'recognized',
            'foodName',
            'confidence',
            'detectedPortion',
            'caloriesMin',
            'caloriesMax',
            'analysisNotes',
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Respons AI kosong');
    }

    const parsed = JSON.parse(resultText);

    res.json({
      success: true,
      data: parsed,
    });
  } catch (err: any) {
    console.error('Error scanning food with Gemini API:', err);
    res.status(500).json({
      success: false,
      message: 'Maaf, makanan belum dapat dikenali. Silakan cari makanan secara manual.',
      details: err.message,
    });
  }
});

// Storage Endpoints for Multi-User Persistence
app.get('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  const storage = readStorage();
  res.json({
    success: true,
    data: {
      profile: storage.users[userId] || null,
      logs: storage.foodLogs[userId] || [],
      customFoods: storage.customFoods[userId] || [],
    },
  });
});

app.post('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  const { profile, logs, customFoods } = req.body;
  const storage = readStorage();

  if (profile) storage.users[userId] = profile;
  if (logs) storage.foodLogs[userId] = logs;
  if (customFoods) storage.customFoods[userId] = customFoods;

  writeStorage(storage);
  res.json({ success: true, message: 'Data berhasil disimpan di server' });
});

app.delete('/api/user-data/:userId', (req, res) => {
  const { userId } = req.params;
  const storage = readStorage();

  delete storage.users[userId];
  delete storage.foodLogs[userId];
  delete storage.customFoods[userId];

  writeStorage(storage);
  res.json({ success: true, message: 'Data pengguna dan catatan berhasil dihapus' });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CEK KALORI server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}
