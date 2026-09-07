import { CropDiagnosisResult, LanguageCode } from '../types';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Highly accurate agricultural diagnostic knowledge-base for Pakistani crops
const cropDiagnosesDatabase: CropDiagnosisResult[] = [
  {
    id: 'diag_wheat_rust',
    cropName: 'Wheat (گندم / کنک)',
    issue: 'Wheat Yellow/Brown Leaf Rust (Puccinia striiformis)',
    confidence: 94,
    severity: 'High',
    simpleExplanation: {
      en: 'Fungal spores have formed yellowish-orange pustules in lines along the wheat leaves, preventing sunlight absorption.',
      ur: 'گندم کے پتوں پر پیلے اور نارنجی رنگ کی لکیروں والی پھپھوندی ظاہر ہوئی ہے جو پتے کی خوراک بنانے کی صلاحیت متاثر کر رہی ہے۔',
      pa: 'کنک دے پتیاں اتے پیلے تے کھٹے رنگ دے پھپھوندی دھبے بݨ گئے نیں، جیدے نال سٹے نوں خوراک نئیں پہنچدی پئی۔'
    },
    nextSteps: {
      en: [
        'Apply Propiconazole or Tebuconazole fungicide spray immediately at 200ml/acre.',
        'Avoid excessive late nitrogen fertilization which worsens rust spread.',
        'Ensure proper field drainage to reduce leaf humidity.'
      ],
      ur: [
        'فوری طور پر پروپیکونازول یا ٹیبوکونازول فنجی سائیڈ 200 ملی لیٹر فی ایکڑ سپرے کریں۔',
        'نائٹروجن (یوریا) کھاد کا زیادہ استعمال فوری روکیں۔',
        'کھیت میں نمی کم کرنے کے لیے پانی کی نکاسی بہتر بنائیں۔'
      ],
      pa: [
        'فوری طور تے ٹیبوکونازول یا پروپیکونازول دوائی 200 ملی لیٹر فی ایکڑ سپرے کرو۔',
        'یوریا کھاد دا فالتو استعمال فوراً روکو۔',
        'کھیت چوں فالتو پانی کڈھو تاکہ پتے سکھی رہن۔'
      ]
    },
    preventiveMeasures: {
      en: [
        'Use rust-resistant wheat varieties (e.g., Akbar-19, Dilkash-20, Subhani-21).',
        'Avoid late sowing after November 25.'
      ],
      ur: [
        'بیماری کے خلاف قوت مدافعت رکھنے والی اقسام (جیسے اکبر 19، دلکش 20، سبحانی 21) کاشت کریں۔',
        '25 نومبر کے بعد پچھیتی کاشت سے پرہیز کریں۔'
      ],
      pa: [
        'بیماری توں محفوظ بیج (جیویں اکبر 19، دلکش 20) بیجو۔',
        '25 نومبر توں بعد پچھیتی بیجائی نہ کرو۔'
      ]
    },
    caution: {
      en: 'Wear protective goggles and gloves while spraying fungicides. Do not spray during windy conditions.',
      ur: 'سپرے کے دوران دستانے اور ماسک لازمی استعمال کریں۔ تیز ہوا میں سپرے نہ کریں۔',
      pa: 'سپرے کردے ویلے ماسک تے دستانے ضرور پاؤ، تیز ہوا چ سپرے نہ کرو۔'
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'diag_cotton_clcuv',
    cropName: 'Cotton (کپاس / کپاہ)',
    issue: 'Cotton Leaf Curl Virus (CLCuV) & Whitefly Infestation',
    confidence: 96,
    severity: 'Severe',
    simpleExplanation: {
      en: 'Leaves are curling upward with thickened veins and leaf enations, transmitted by the whitefly vector.',
      ur: 'کپاس کے پتے اوپر کی طرف مڑ رہے ہیں اور رگیں موٹی ہو گئی ہیں، یہ بیماری سفید مکھی کے ذریعے پھیلتی ہے۔',
      pa: 'کپاہ دے پتے اتے نوں مڑ رہے نیں تے نسّاں موٹیاں ہو گئیاں نیں، ایہ چٹی مکھی دے حملے دی وجہ توں پھیلدا اے۔'
    },
    nextSteps: {
      en: [
        'Control whitefly vector immediately using Pyriproxyfen + Diafenthiuron spray.',
        'Spray Micronutrient cocktail (Zinc + Boron + Magnesium) to boost crop immunity.',
        'Remove severely infected weed hosts from water channels.'
      ],
      ur: [
        'سفید مکھی کے خاتمے کے لیے پائری پروکسی فن یا ڈیا فین تھیوران کا سپرے کریں۔',
        'پودے کی طاقت بڑھانے کے لیے زنک، بوران اور پوٹاش کا فولیر سپرے کریں۔',
        'کھیت کے اردگرد کے جنگلی جڑی بوٹیوں کو فوری تلف کریں۔'
      ],
      pa: [
        'چٹی مکھی نوں مارن لئی ڈیافین تھیوران یا پائری پروکسی فن دا سپرے کرو۔',
        'بوٹے چ جان پاون لئی زنک تے بوران دا سپرے کرو۔',
        'کھیت دے وٹاں اتے اگی بوٹی صاف کرو۔'
      ]
    },
    preventiveMeasures: {
      en: [
        'Plant CLCuV-tolerant varieties (e.g., CKC-01, IUB-2013).',
        'Install yellow sticky traps across the field (10 traps/acre).'
      ],
      ur: [
        'مروڑیا وائرس کے خلاف مضبوط اقسام جیسے CKC-01 یا IUB-2013 کاشت کریں۔',
        'کھیت میں پیلے رنگ کے لیس دار ٹریپ (10 فی ایکڑ) لگائیں۔'
      ],
      pa: [
        'وائرس توں محفوظ بیج بیجو۔',
        'کھیت چ پیلے چپکݨ آلے ٹریپ لاؤ۔'
      ]
    },
    caution: {
      en: 'Do not repeat the same pesticide chemistry twice to prevent whitefly resistance.',
      ur: 'سفید مکھی میں مزاحمت روکنے کے لیے ایک ہی زہر بار بار سپرے نہ کریں۔',
      pa: 'مکھی چ زہر دی قوت بنن توں روکن لئی دوائی بدل کے سپرے کرو۔'
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'diag_rice_blast',
    cropName: 'Basmati Rice (چاول / جھونا)',
    issue: 'Rice Blast & Neck Rot (Magnaporthe oryzae)',
    confidence: 91,
    severity: 'High',
    simpleExplanation: {
      en: 'Diamond/spindle-shaped lesions on rice leaves with grey centers, causing neck breakage during panicle formation.',
      ur: 'چاول کے پتوں اور نالی پر بیضوی سرمئی دھبے بنے ہیں جو منجی کے نکلنے پر گردن توڑ بیماری پیدا کرتے ہیں۔',
      pa: 'جھونے دے پتیاں اتے لمبوترے سرمئی داغ بݨے نیں جیدے نال منجی ڈگن دا ڈر ہندا اے۔'
    },
    nextSteps: {
      en: [
        'Spray Tricyclazole 75% WP at 120g/acre or Azoxystrobin + Difenoconazole.',
        'Maintain 2 inches of standing water in the paddy to suppress spore flight.',
        'Split nitrogen doses instead of heavy single application.'
      ],
      ur: [
        'ٹرائی سائیکلازول 75 ڈبلیو پی 120 گرام فی ایکڑ یا ایزوکسسٹروبن کا سپرے کریں۔',
        'کھیت میں 2 انچ کھڑا پانی برقرار رکھیں۔',
        'یوریا کھاد ایک ساتھ نہ ڈالیں بلکہ قسطوں میں دیں۔'
      ],
      pa: [
        'ٹرائی سائیکلازول 120 گرام فی ایکڑ سپرے کرو۔',
        'جھونے چ دو انچ پانی کھڑا رکھو۔',
        'یوریا کھاد ہولی ہولی ونڈ کے پاؤ۔'
      ]
    },
    preventiveMeasures: {
      en: [
        'Treat seeds with fungicide before nursery transplantation.',
        'Avoid high plant density.'
      ],
      ur: [
        'پنیری لگانے سے پہلے بیج کو پھپھوندی کش زہر سے زہر آلود کریں۔',
        'پودوں کے درمیان مناسب فاصلہ رکھیں۔'
      ],
      pa: [
        'پنیری لان توں پہلاں بیج نوں دوائی لاؤ۔',
        'بوٹیاں چ کھلا فاصلہ رکھو۔'
      ]
    },
    caution: {
      en: 'Ensure spray reaches the base of tillers and panicle neck.',
      ur: 'سپرے کا رخ پودے کی نچلی گانٹھوں اور منجی کی گردن کی طرف رکھیں۔',
      pa: 'سپرے دا رخ بوٹے دی گانٹھ تے منجی دی گردن ول رکھو۔'
    },
    timestamp: new Date().toISOString()
  }
];

class AiService {
  private backendUrl = 'http://localhost:5000'; // same server your MongoDB backend already runs on

  public async analyzeCropImage(imageDataUrl: string, language: LanguageCode = 'en'): Promise<CropDiagnosisResult> {
    try {
      const res = await fetch(`${this.backendUrl}/api/ai/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl, language }),
      });
      if (!res.ok) throw new Error('Image analysis failed');
      const result = await res.json();
      return {
        ...result,
        id: 'scan_' + Date.now(),
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Image analysis failed:', err);
      throw new Error('Could not analyze the image. Make sure the server is running.');
    }
  }

  public async askFarmingAssistant(question: string, language: LanguageCode): Promise<string> {
    try {
      const res = await fetch(`${this.backendUrl}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      return data.answer;
    } catch (err) {
      console.error('AI request failed:', err);
      throw new Error(
        language === 'ur'
          ? 'AI سے رابطہ نہیں ہو سکا۔'
          : language === 'pa'
          ? 'AI نال رابطہ نہ ہو سکیا۔'
          : 'Could not reach the AI. Make sure the server is running.'
      );
    }
  }
}

export const aiService = new AiService();
