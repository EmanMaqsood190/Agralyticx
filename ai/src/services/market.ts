import { MarketRateItem, FuelRateData } from '../types';

export const CURRENT_FUEL_RATES: FuelRateData = {
  dieselPrice: 284.42, // PKR per liter (High Speed Diesel for freight)
  petrolPrice: 260.95,
  cngPrice: 220.00,
  city: 'Pakistan National Standard',
  lastUpdated: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
};

export const MANDI_RATES_DATABASE: MarketRateItem[] = [
  {
    id: 'rate_wheat_lhr',
    cropKey: 'wheat',
    name: {
      en: 'Wheat (Grade 1 Grain)',
      ur: 'گندم (درجہ اول)',
      pa: 'کنک (درجہ اول)'
    },
    category: 'Grains & Cereals',
    city: 'Lahore',
    mandiName: 'Badami Bagh Grain Mandi',
    minPrice: 3850,
    maxPrice: 4050,
    modalPrice: 3950,
    unit: '40 kg (Maund)',
    priceChange: +1.8,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 3820 },
      { date: 'Day -5', price: 3850 },
      { date: 'Day -4', price: 3890 },
      { date: 'Day -3', price: 3900 },
      { date: 'Day -2', price: 3920 },
      { date: 'Yesterday', price: 3930 },
      { date: 'Today', price: 3950 }
    ]
  },
  {
    id: 'rate_wheat_mul',
    cropKey: 'wheat',
    name: {
      en: 'Wheat (Grade 1 Grain)',
      ur: 'گندم (درجہ اول)',
      pa: 'کنک (درجہ اول)'
    },
    category: 'Grains & Cereals',
    city: 'Multan',
    mandiName: 'Ghalla Mandi Multan',
    minPrice: 3800,
    maxPrice: 3980,
    modalPrice: 3900,
    unit: '40 kg (Maund)',
    priceChange: +0.5,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 3800 },
      { date: 'Day -5', price: 3820 },
      { date: 'Day -4', price: 3840 },
      { date: 'Day -3', price: 3880 },
      { date: 'Day -2', price: 3890 },
      { date: 'Yesterday', price: 3900 },
      { date: 'Today', price: 3900 }
    ]
  },
  {
    id: 'rate_rice_super_lhr',
    cropKey: 'rice_basmati',
    name: {
      en: 'Super Basmati Rice (Paddy/Jhona)',
      ur: 'سپر باسمتی چاول (دھان / جھونا)',
      pa: 'سپر باسمتی چاول (جھونا)'
    },
    category: 'Grains & Cereals',
    city: 'Gujranwala',
    mandiName: 'Kamoke Rice Mandi (Hub of Basmati)',
    minPrice: 4200,
    maxPrice: 4600,
    modalPrice: 4450,
    unit: '40 kg (Maund)',
    priceChange: +2.3,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 4300 },
      { date: 'Day -5', price: 4350 },
      { date: 'Day -4', price: 4380 },
      { date: 'Day -3', price: 4400 },
      { date: 'Day -2', price: 4420 },
      { date: 'Yesterday', price: 4430 },
      { date: 'Today', price: 4450 }
    ]
  },
  {
    id: 'rate_cotton_mul',
    cropKey: 'cotton',
    name: {
      en: 'Cotton (Phutti / Raw Cotton)',
      ur: 'کپاس (پھٹی)',
      pa: 'کپاہ (پھٹی)'
    },
    category: 'Cash Crops & Fibres',
    city: 'Bahawalpur',
    mandiName: 'Yazman Cotton Mandi',
    minPrice: 7800,
    maxPrice: 8400,
    modalPrice: 8150,
    unit: '40 kg (Maund)',
    priceChange: -1.2,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 8300 },
      { date: 'Day -5', price: 8280 },
      { date: 'Day -4', price: 8250 },
      { date: 'Day -3', price: 8200 },
      { date: 'Day -2', price: 8180 },
      { date: 'Yesterday', price: 8160 },
      { date: 'Today', price: 8150 }
    ]
  },
  {
    id: 'rate_corn_fsd',
    cropKey: 'corn',
    name: {
      en: 'Corn / Maize (Hybrid Grain)',
      ur: 'مکئی (ہائبرڈ اناج)',
      pa: 'مکی (ہائبرڈ اناج)'
    },
    category: 'Grains & Feed',
    city: 'Faisalabad',
    mandiName: 'Dijkot Grain Market',
    minPrice: 2450,
    maxPrice: 2700,
    modalPrice: 2580,
    unit: '40 kg (Maund)',
    priceChange: +0.8,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 2500 },
      { date: 'Day -5', price: 2520 },
      { date: 'Day -4', price: 2540 },
      { date: 'Day -3', price: 2550 },
      { date: 'Day -2', price: 2570 },
      { date: 'Yesterday', price: 2575 },
      { date: 'Today', price: 2580 }
    ]
  },
  {
    id: 'rate_sugarcane_sgd',
    cropKey: 'sugarcane',
    name: {
      en: 'Sugarcane (Official Mill Support Rate)',
      ur: 'گنا (سرکاری امدادی قیمت)',
      pa: 'کماد / گنا (سرکاری ریٹ)'
    },
    category: 'Cash Crops',
    city: 'Sargodha',
    mandiName: 'Bhalwal Sugar Mill Gate',
    minPrice: 425,
    maxPrice: 460,
    modalPrice: 450,
    unit: '40 kg (Maund)',
    priceChange: 0,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 450 },
      { date: 'Day -5', price: 450 },
      { date: 'Day -4', price: 450 },
      { date: 'Day -3', price: 450 },
      { date: 'Day -2', price: 450 },
      { date: 'Yesterday', price: 450 },
      { date: 'Today', price: 450 }
    ]
  }
];

class MarketService {
  public getAllRates(): MarketRateItem[] {
    return MANDI_RATES_DATABASE;
  }

  public getFuelRates(): FuelRateData {
    return CURRENT_FUEL_RATES;
  }
}

export const marketService = new MarketService();
