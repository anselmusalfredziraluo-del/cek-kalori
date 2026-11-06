import { EducationalArticle } from '../types';

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'edu-01',
    title: 'Pengertian Kalori: Bahan Bakar Tubuh',
    category: 'Dasar Nutrisi',
    readTime: '3 menit',
    iconName: 'Flame',
    summary: 'Kalori adalah satuan energi yang didapatkan dari makanan dan minuman untuk menjaga fungsi organ dan beraktivitas.',
    content: [
      'Kalori (kilokalori atau kkal) merupakan unit pengukuran energi panas. Dalam konteks gizi, kalori mengukur seberapa banyak energi potensial yang terkandung di dalam makanan dan minuman yang kita konsumsi.',
      'Setiap saat, bahkan ketika sedang tidur, tubuh membutuhkan energi untuk memompa darah, bernapas, memperbarui sel-sel tubuh, dan menjaga suhu tubuh tetap stabil. Kebutuhan dasar ini disebut Angka Metabolisme Basal (BMR).',
      'Kebutuhan kalori harian tiap individu bervariasi tergantung pada usia, jenis kelamin, tinggi badan, berat badan, serta tingkat aktivitas fisik. Rata-rata orang dewasa di Indonesia memerlukan sekitar 1.800–2.250 kkal per hari.',
      'Yang terpenting bukanlah membatasi kalori secara ekstrem, melainkan memahami keseimbangan antara energi masuk (makanan) dan energi keluar (aktivitas fisik) serta kualitas zat gizi dari makanan tersebut.'
    ],
    keyTakeaways: [
      'Kalori adalah sumber energi esensial, bukan musuh.',
      'Kebutuhan kalori berbeda untuk setiap orang berdasarkan aktivitas dan metabolisme.',
      'Fokuslah pada kualitas makanan (makanan padat nutrisi), bukan sekadar menghitung angka kalori.'
    ],
    source: 'Kementerian Kesehatan Republik Indonesia & WHO Guideline on Energy Intake'
  },
  {
    id: 'edu-02',
    title: 'Fungsi Karbohidrat: Sumber Energi Utama',
    category: 'Makronutrien',
    readTime: '4 menit',
    iconName: 'Wheat',
    summary: 'Karbohidrat dipecah menjadi glukosa yang menjadi bahan bakar utama bagi otak, sel darah merah, dan otot.',
    content: [
      'Karbohidrat menyediakan 4 kkal energi per gram. Karbohidrat adalah sumber energi pilihan bagi otak manusia yang setiap hari mengonsumsi sekitar 120 gram glukosa murni untuk berpikir dan berkonsentrasi.',
      'Ada dua jenis karbohidrat utama: karbohidrat sederhana dan karbohidrat kompleks. Karbohidrat sederhana (gula pasir, sirup, permen) cepat diserap sehingga dapat memicu lonjakan gula darah mendadak.',
      'Karbohidrat kompleks (nasi merah, kentang berkulit, ubi jalar, oat, roti gandum utuh) memiliki rantai molekul lebih panjang dan kaya serat, sehingga dicerna perlahan dan memberi rasa kenyang yang stabil dan bertahan lebih lama.',
      'Dalam pedoman gizi seimbang Indonesia, karbohidrat dianjurkan menyumbang sekitar 50–60% dari total kebutuhan energi harian.'
    ],
    keyTakeaways: [
      'Otak membutuhkan glukosa dari karbohidrat setiap hari.',
      'Prioritaskan karbohidrat kompleks dan biji-bijian utuh daripada gula sederhana.',
      'Kombinasikan karbohidrat dengan protein dan sayuran untuk respon gula darah yang stabil.'
    ],
    source: 'Tabel Angka Kecukupan Gizi (AKG) Kemenkes RI'
  },
  {
    id: 'edu-03',
    title: 'Fungsi Protein: Pembangun dan Pemulih Jaringan',
    category: 'Makronutrien',
    readTime: '4 menit',
    iconName: 'Dumbbell',
    summary: 'Protein tersusun dari asam amino yang berfungsi memperbaiki jaringan tubuh, membentuk antibodi kekebalan, dan memproduksi enzim.',
    content: [
      'Setiap gram protein menghasilkan sekitar 4 kkal energi. Namun, peran utama protein bukan sebagai bahan bakar pembakaran harian, melainkan sebagai bahan bangunan utama sel tubuh, jaringan otot, kulit, rambut, hormon, serta antibodi sistem imun.',
      'Protein hewani (telur, ikan, daging ayam, sapi, susu) mengandung asam amino esensial lengkap yang mudah diserap oleh tubuh.',
      'Protein nabati (tahu, tempe, kacang merah, kedelai, kacang hijau) sangat kaya serat, bebas kolesterol jahat, dan ramah lingkungan. Tempe Indonesia bahkan diakui dunia sebagai superfood fermentasi yang kaya probiotik.',
      'Untuk orang dewasa sehat, anjuran konsumsi protein berkisar antara 0,8–1,2 gram per kilogram berat badan setiap harinya.'
    ],
    keyTakeaways: [
      'Protein sangat penting untuk menjaga massa otot dan daya tahan tubuh.',
      'Padukan sumber hewani (ikan, telur) dan nabati (tempe, tahu) untuk keseimbangan gizi optimal.',
      'Membantu meningkatkan rasa kenyang lebih lama sehingga mencegah makan berlebih.'
    ],
    source: 'Pedoman Gizi Seimbang Kemenkes RI'
  },
  {
    id: 'edu-04',
    title: 'Fungsi Lemak: Pelindung Organ dan Penyerapan Vitamin',
    category: 'Makronutrien',
    readTime: '4 menit',
    iconName: 'Droplet',
    summary: 'Lemak sehat sangat vital untuk kesehatan sel saraf, produksi hormon, serta penyerapan vitamin A, D, E, dan K.',
    content: [
      'Lemak menghasilkan energi paling padat, yakni 9 kkal per gram. Lemak bukanlah musuh kesehatan; tubuh kita mutlak membutuhkan lemak untuk melindungi organ vital, menyusun dinding sel, dan memproduksi hormon reproduksi.',
      'Vitamin A, D, E, dan K bersifat larut dalam lemak. Tanpa asupan lemak yang cukup, tubuh tidak dapat menyerap vitamin-vitamin penting tersebut dengan baik.',
      'Pilihlah lemak tak jenuh sehat seperti yang terdapat pada alpukat, kacang-kacangan, minyak zaitun, dan ikan laut berlemak (sumber omega-3).',
      'Batasi lemak jenuh dari minyak jelantah berulang kali pakai dan lemak trans dari makanan olahan yang digoreng berlebihan untuk menjaga kesehatan pembuluh darah jantung.'
    ],
    keyTakeaways: [
      'Lemak penting untuk penyerapan vitamin A, D, E, dan K.',
      'Utamakan lemak tak jenuh alami dari alpukat, kacang, dan ikan.',
      'Gunakan minyak goreng secara bijak dan hindari pemanasan minyak berulang kali.'
    ],
    source: 'Ikatan Dokter Anak & Spesialis Gizi Klinik Indonesia (PDGKI)'
  },
  {
    id: 'edu-05',
    title: 'Pentingnya Serat: Sahabat Pencernaan dan Jantung',
    category: 'Mikronutrien & Serat',
    readTime: '3 menit',
    iconName: 'Sparkles',
    summary: 'Serat pangan menjaga keteraturan buang air besar, memberi makan mikrobioma usus baik, dan menstabilkan kolesterol.',
    content: [
      'Serat pangan adalah bagian dari tumbuhan yang tidak dapat dicerna oleh enzim pencernaan manusia. Meskipun tidak menyumbang banyak kalori, serat memiliki peran luar biasa bagi kesehatan jangka panjang.',
      'Serat larut (ditemukan pada apel, oat, wortel, dan kacang-kacangan) menyerap air dan membentuk gel lembut yang membantu menurunkan kadar kolesterol LDL dan mengatur penyerapan gula darah.',
      'Serat tidak larut (sayuran berdaun hijau, bekatul, kulit biji-bijian) menambah massa feses dan melancarkan saluran cerna, mencegah sembelit dan risiko wasir.',
      'Kebutuhan serat harian orang dewasa Indonesia adalah sekitar 25–30 gram per hari, yang mudah dipenuhi jika kita rutin menyertakan sayur dan buah dalam setiap kali makan.'
    ],
    keyTakeaways: [
      'Serat memberi rasa kenyang mantap tanpa menambah kalori berlebih.',
      'Menjaga populasi bakteri baik (mikrobiota) di dalam usus besar.',
      'Membantu mengendalikan kadar kolesterol dan kestabilan gula darah.'
    ],
    source: 'Kementerian Kesehatan RI - Gerakan Masyarakat Hidup Sehat (GERMAS)'
  },
  {
    id: 'edu-06',
    title: 'Pengertian Gizi Seimbang: Konsep "Isi Piringku"',
    category: 'Pedoman Sehat',
    readTime: '4 menit',
    iconName: 'PieChart',
    summary: 'Konsep Isi Piringku dari Kemenkes menggantikan 4 Sehat 5 Sempurna dengan proporsi piring makan yang terukur dan aplikatif.',
    content: [
      'Kemenkes RI telah mengalihkan slogan lama "4 Sehat 5 Sempurna" menjadi "Pedoman Gizi Seimbang" dengan panduan visual "Isi Piringku".',
      'Dalam satu piring makan sekali konsumsi, bagilah menjadi dua bagian: setengah piring pertama terdiri dari 2/3 makanan pokok (nasi/umbi) dan 1/3 lauk pauk (ikan/telur/tempe).',
      'Setengah piring kedua terdiri dari 2/3 sayuran hijau/berwarna dan 1/3 buah-buahan segar.',
      'Selain komposisi makanan di piring, gizi seimbang mencakup 4 pilar utama: mengonsumsi aneka ragam pangan, membiasakan perilaku hidup bersih (cuci tangan), melakukan aktivitas fisik, dan memantau berat badan secara teratur.'
    ],
    keyTakeaways: [
      'Isi piringmu: 1/3 makanan pokok, 1/3 sayuran, 1/6 lauk pauk, 1/6 buah.',
      'Variasikan warna sayur dan buah setiap hari untuk melengkapi fitonutrien.',
      'Gizi seimbang tidak menuntut pantangan ketat, melainkan proporsi yang sadar.'
    ],
    source: 'Panduan Isi Piringku - Direktorat Promosi Kesehatan Kemenkes RI'
  },
  {
    id: 'edu-07',
    title: 'Pentingnya Mengonsumsi Buah dan Sayur',
    category: 'Pola Makan Sehat',
    readTime: '3 menit',
    iconName: 'Apple',
    summary: 'Kaya akan antioksidan, vitamin alami, dan mineral mikro yang melindungi sel tubuh dari kerusakan radikal bebas.',
    content: [
      'Sayuran dan buah-buahan mengandung beragam fitonutrien alami yang ditandai dengan warnanya: merah (likopen), oranye/kuning (beta-karoten), hijau (klorofil & lutein), serta ungu/biru (antosianin).',
      'Konsumsi minimal 400 gram atau 5 porsi buah dan sayur per hari terbukti menurunkan risiko penyakit tidak menular (PTM) seperti hipertensi, stroke, dan penyakit jantung koroner.',
      'Buah dan sayur memiliki densitas energi yang rendah namun volume yang tinggi karena kandungan air dan seratnya. Ini sangat membantu kita merasa kenyang secara alami tanpa surplus kalori berlebihan.',
      'Sajikan buah potong segar utuh sebagai camilan sehat harian dibandingkan jus buah kemasan berpemanis buatan.'
    ],
    keyTakeaways: [
      'Konsumsi minimal 3 porsi sayur dan 2 porsi buah setiap hari.',
      'Semakin bervariasi warna sayur dan buah, semakin lengkap vitamin yang didapat.',
      'Buah segar utuh lebih unggul daripada jus kemasan karena seratnya masih utuh.'
    ],
    source: 'World Health Organization (WHO) & Kemenkes RI'
  },
  {
    id: 'edu-08',
    title: 'Pentingnya Minum Air Putih: Hidrasi Optimal',
    category: 'Hidrasi',
    readTime: '3 menit',
    iconName: 'GlassWater',
    summary: 'Sekitar 60% tubuh manusia terdiri dari air. Kurang hidrasi sering kali disalahartikan otak sebagai rasa lapar palsu.',
    content: [
      'Air putih berfungsi sebagai pelarut zat gizi, pengatur suhu tubuh melalui keringat, pelumas sendi tulang, dan pembersih sisa metabolisme melalui ginjal.',
      'Anjuran umum bagi orang dewasa adalah minum sekitar 2 liter atau setara 8 gelas air putih setiap hari, atau disesuaikan dengan intensitas cuaca panas dan keringat saat berolahraga.',
      'Fakta menarik: Pusat rasa lapar dan rasa haus di otak (hipotalamus) terletak berdekatan. Sering kali saat kita merasa ingin ngemil makanan manis, tubuh sebenarnya hanya sedang membutuhkan hidrasi air putih!',
      'Periksa warna urin: jika berwarna kuning pucat jernih, hidrasi Anda baik. Jika berwarna kuning tua pekat, segera minum air putih.'
    ],
    keyTakeaways: [
      'Targetkan 8 gelas (kurang lebih 2 liter) air putih setiap hari.',
      'Minum segelas air putih sebelum makan membantu mengenali rasa lapar alami.',
      'Kurangi minuman manis bersoda, boba, atau sirup untuk mencegah lonjakan kalori cair.'
    ],
    source: 'Panduan Kecukupan Cairan Tubuh Kemenkes RI'
  },
  {
    id: 'edu-09',
    title: 'Pentingnya Aktivitas Fisik untuk Keseimbangan Energi',
    category: 'Gaya Hidup',
    readTime: '4 menit',
    iconName: 'Activity',
    summary: 'Aktivitas fisik teratur meningkatkan laju metabolisme, menjaga kebugaran jantung, dan memperbaiki suasana hati (mood).',
    content: [
      'Keseimbangan kalori bukan hanya tentang apa yang masuk lewat mulut, tetapi juga seberapa aktif tubuh kita bergerak membakar energi.',
      'WHO menganjurkan setiap orang dewasa melakukan aktivitas fisik intensitas sedang minimal 150 menit per minggu (misalnya jalan cepat 30 menit sehari selama 5 hari).',
      'Aktivitas fisik tidak harus selalu berupa olahraga berat di gym. Memilih naik tangga ketimbang lift, berjalan kaki saat belanja ke minimarket, mencuci kendaraan, atau membersihkan rumah juga membakar kalori ekstra (NEAT - Non-Exercise Activity Thermogenesis).',
      'Olahraga juga memicu pelepasan hormon endorfin dan dopamin yang meredakan stres emosional, sehingga mencegah kebiasaan makan pelampiasan emosi (emotional eating).'
    ],
    keyTakeaways: [
      'Luangkan 30 menit jalan kaki atau bersepeda 5 kali seminggu.',
      'Kurangi waktu duduk terus-menerus (sedentary lifestyle) dengan peregangan tiap 1 jam.',
      'Aktivitas fisik menjaga kesehatan pembuluh darah dan sensitivitas insulin.'
    ],
    source: 'WHO Guidelines on Physical Activity and Sedentary Behaviour'
  },
  {
    id: 'edu-10',
    title: 'Membangun Kebiasaan Makan Sehat dan Sadar (Mindful Eating)',
    category: 'Psikologi Makan',
    readTime: '4 menit',
    iconName: 'HeartHandshake',
    summary: 'Makan dengan sadar (mindful eating) berarti menikmati setiap suapan tanpa distraksi gadget, membantu mengenali sinyal kenyang alami tubuh.',
    content: [
      'Di era serba cepat, banyak orang terbiasa makan sambil menonton video di ponsel atau bekerja di depan laptop. Akibatnya, sinyal kenyang dari lambung ke otak sering terabaikan.',
      'Dibutuhkan waktu sekitar 15–20 menit bagi otak untuk menerima hormon rasa kenyang (leptin) setelah makanan masuk ke dalam lambung.',
      'Praktik makan sadar sederhana:',
      '1. Duduk dengan tenang saat makan tanpa menatap layar handphone.',
      '2. Kunyah makanan secara perlahan (sekitar 20–30 kali kunyahan) agar enzim ludah bekerja optimal.',
      '3. Sadari aroma, warna, dan tekstur makanan.',
      '4. Berhenti makan ketika sudah merasa cukup kenyang (sekitar 80% kenyang), jangan tunggu hingga begah kekenyangan.'
    ],
    keyTakeaways: [
      'Hindari makan sambil menatap layar gawai (distracted eating).',
      'Kunyah lebih perlahan untuk membantu pencernaan dan mendeteksi sinyal kenyang.',
      'Nikmati rasa makanan dengan penuh kesadaran dan rasa syukur.'
    ],
    source: 'The Center for Mindful Eating & Riset Psikologi Perilaku Makan'
  },
  {
    id: 'edu-11',
    title: 'Memahami Ukuran Porsi Menggunakan Telapak Tangan',
    category: 'Panduan Praktis',
    readTime: '3 menit',
    iconName: 'Hand',
    summary: 'Tidak punya timbangan dapur? Gunakan ukuran tangan Anda sendiri sebagai panduan porsi makan yang mudah dan fleksibel.',
    content: [
      'Menimbang makanan setiap kali makan sering kali terasa merepotkan dan tidak praktis saat sedang makan di luar atau di warung makan.',
      'Ukuran tangan kita sebanding dengan proporsi tubuh kita masing-masing, sehingga dapat dijadikan acuan takaran porsi yang sangat andal:',
      '- 1 Telapak tangan (tanpa jari): takaran 1 porsi protein padat (ikan, dada ayam, tempe).',
      '- 1 Kepalan tangan: takaran 1 porsi sayuran hijau atau sayuran berserat.',
      '- 1 Tangkup tangan: takaran 1 porsi karbohidrat matang (nasi, mi, kentang, buah potong).',
      '- 1 Ujung jempol: takaran 1 porsi lemak padat atau minyak/mentega (sekitar 1 sendok teh).',
      'Metode ini sangat fleksibel dan dapat diterapkan di mana saja dengan mudah.'
    ],
    keyTakeaways: [
      'Protein: seukuran telapak tangan.',
      'Sayuran: seukuran kepalan tangan penuh.',
      'Karbohidrat: seukuran mangkuk telapak tangan terbuka.',
      'Minyak/lemak: seukuran ruas ujung ibu jari.'
    ],
    source: 'Precision Nutrition & British Nutrition Foundation Hand Portion Guide'
  },
  {
    id: 'edu-12',
    title: 'Cara Membaca Label Informasi Nilai Gizi (Nutrition Facts)',
    category: 'Keterampilan Konsumen',
    readTime: '4 menit',
    iconName: 'ScanLine',
    summary: 'Pelajari trik produsen makanan kemasan dan cara melihat takaran saji serta jumlah sajian per kemasan dengan teliti.',
    content: [
      'Ketika membeli makanan atau minuman dalam kemasan, jangan hanya melihat angka kalori di depan kemasan. Perhatikan tabel "Informasi Nilai Gizi" di bagian belakang.',
      'Langkah 1: Perhatikan "Jumlah Sajian per Kemasan". Satu bungkus keripik atau satu botol minuman sering kali berisi 2 sampai 4 porsi saji, bukan 1 porsi tunggal!',
      'Langkah 2: Kalori yang tercantum biasanya adalah kalori per 1 takaran saji. Jika Anda menghabiskan seluruh isi kemasan, kalikan angka kalori dengan jumlah sajian.',
      'Langkah 3: Perhatikan kandungan Gula, Garam, dan Lemak (GGL). Batas anjuran konsumsi Kemenkes per orang per hari adalah: Gula maksimum 50 gram (4 sendok makan), Garam 5 gram (1 sendok teh), dan Lemak 67 gram (5 sendok makan).',
      'Langkah 4: Urutan daftar bahan/komposisi (ingredients) selalu diurutkan dari bahan yang bobotnya paling dominan hingga yang paling sedikit.'
    ],
    keyTakeaways: [
      'Selalu cek jumlah sajian per kemasan sebelum menyimpulkan total kalori.',
      'Waspadai kandungan gula tersembunyi pada minuman kemasan.',
      'Ingat rumus batasan harian Kemenkes: G4 - G1 - L5 (Gula 4 sdm, Garam 1 sdt, Lemak 5 sdm).'
    ],
    source: 'Badan Pengawas Obat dan Makanan (BPOM) RI & Kemenkes RI'
  }
];
