const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}

// 1. Farmer Dashboard (Uncrowded, 5 Primary Actions, Clean & Bright)
const farmerDashboard = `import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  TrendingUp, 
  CloudSun, 
  Bot, 
  Sprout, 
  ArrowRight, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AudioButton } from '../../components/common/AudioButton';
import { JobNotificationModal } from '../../components/common/JobNotificationModal';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const farmerName = user?.name || 'Farmer';

  const primaryActions = [
    {
      title: t.scanCrop,
      desc: t.scanCropDesc,
      icon: <Camera className="w-8 h-8 text-[#2E7D32]" />,
      path: '/farmer/crop-scan',
      tag: 'AI Diagnostic',
      color: 'from-[#E8F5E9] to-white',
      border: 'border-[#4CAF50]'
    },
    {
      title: t.marketRates,
      desc: t.marketRatesDesc,
      icon: <TrendingUp className="w-8 h-8 text-[#2E7D32]" />,
      path: '/farmer/market-rates',
      tag: 'Daily Mandi & Fuel',
      color: 'from-[#F8FAF7] to-white',
      border: 'border-[#DDE8DD]'
    },
    {
      title: t.weather,
      desc: t.weatherDesc,
      icon: <CloudSun className="w-8 h-8 text-[#2E7D32]" />,
      path: '/farmer/weather',
      tag: 'Live Forecast & Spray',
      color: 'from-[#E8F5E9]/50 to-white',
      border: 'border-[#DDE8DD]'
    },
    {
      title: t.aiHelp,
      desc: t.aiHelpDesc,
      icon: <Bot className="w-8 h-8 text-[#2E7D32]" />,
      path: '/farmer/ai-assistant',
      tag: 'Voice-First AI',
      color: 'from-[#E8F5E9] to-white',
      border: 'border-[#4CAF50]'
    },
    {
      title: t.myFarm,
      desc: t.myFarmDesc,
      icon: <Sprout className="w-8 h-8 text-[#2E7D32]" />,
      path: '/farmer/my-farm',
      tag: 'Land & Crops',
      color: 'from-[#F8FAF7] to-white',
      border: 'border-[#DDE8DD]'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Auto-translated job dispatch alerts from Landowners */}
      <JobNotificationModal />

      {/* Welcome Top Banner (Personalized, Clean, No Long Paragraphs) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              🌾 {t.roles.farmer}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome}, <span className="text-[#2E7D32]">{farmerName}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <AudioButton
            text={\`\${t.welcome}, \${farmerName}. Here are your 5 main farm tools: Scan Crop, Market Rates, Weather, AI Farming Help, and My Farm.\`}
            size="md"
          />
        </div>
      </div>

      {/* 5 Primary Action Cards Grid (Strictly Uncrowded) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {primaryActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className={\`glass-card glass-card-hover rounded-3xl p-6 border-2 \${action.border} bg-gradient-to-br \${action.color} flex flex-col justify-between gap-6 group\`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-[#DDE8DD] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {action.tag}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#1F2933] group-hover:text-[#2E7D32] transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-[#5F6B63] leading-relaxed">
                  {action.desc}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DDE8DD]/60 flex items-center justify-between text-sm font-bold text-[#2E7D32]">
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Hourly Wage Context Banner */}
      <div className="bg-[#E8F5E9]/60 rounded-2xl p-4 border border-[#DDE8DD] flex items-center justify-between text-xs sm:text-sm text-[#2E7D32] font-semibold">
        <span>💡 {t.farmerHourlyRate}</span>
        <Link to="/farmer/market-rates" className="underline hover:text-[#1b4d1f]">
          {t.marketRates} →
        </Link>
      </div>

    </div>
  );
};
`;
save('src/pages/Farmer/FarmerDashboard.tsx', farmerDashboard);

// 2. Crop Scanner (Real Image Upload/Camera, Real Diagnostic Engine, Severity, Remedies, Caution, Listen)
const cropScanPage = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldAlert, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService } from '../../services/ai';
import { db } from '../../services/db';
import { useAuth } from '../../auth/AuthContext';
import { CropDiagnosisResult } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const CropScan: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CropDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const diag = await aiService.analyzeCropImage(selectedImage);
      setResult(diag);
      if (user) {
        db.saveCropScan(user.userId, diag);
      }
    } catch (err: any) {
      setError(err.message || 'Crop analysis failed. Please try another clear photo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const speechText = result
    ? \`Crop Issue: \${result.issue}. Explanation: \${result.simpleExplanation[language]}. Recommended Action: \${result.nextSteps[language].join('. ')}. \${result.caution[language]}\`
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          🌱 {t.cropScannerTitle}
        </h1>

        <AudioButton text="Take or upload a clear photo of the infected crop leaf to identify diseases and get remedies." size="sm" />
      </div>

      {/* Main Upload / Camera Area */}
      {!result ? (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#DDE8DD] shadow-xl text-center space-y-6">
          
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-[#4CAF50] shadow-md">
                <img src={selectedImage} alt="Crop to analyze" className="w-full h-64 object-cover" />
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleAnalyze}
                className="px-8 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.analyzingImage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t.analyzeCrop}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#DDE8DD] hover:border-[#4CAF50] rounded-3xl p-8 sm:p-12 transition-colors space-y-4 bg-[#F8FAF7]/60">
              <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-bold text-[#1F2933]">
                  {t.uploadImage} / {t.takePhoto}
                </p>
                <p className="text-xs text-[#5F6B63]">
                  Supports clear leaf photos of Wheat, Cotton, Rice, Corn, Sugarcane & Vegetables
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <label className="cursor-pointer px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>{t.uploadImage}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                <label className="cursor-pointer px-6 py-3 rounded-xl bg-white border border-[#DDE8DD] hover:bg-[#F8FAF7] text-[#1F2933] font-bold text-sm shadow-xs transition-all flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#2E7D32]" />
                  <span>{t.takePhoto}</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

        </div>
      ) : (
        /* Diagnostic Result Card */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Result Banner */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-[#4CAF50] shadow-xl space-y-6 bg-white">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE8DD]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {result.cropName}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2933] mt-1">
                  {result.issue}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <AudioButton text={speechText} size="md" label="🔊 Listen Remedy" />
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-1.5 rounded-xl border border-[#DDE8DD] text-sm font-semibold text-[#5F6B63] hover:bg-[#F8FAF7]"
                >
                  {t.scanAnotherCrop}
                </button>
              </div>
            </div>

            {/* Confidence & Severity Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#DDE8DD]">
                <span className="text-xs text-[#5F6B63] font-medium">{t.confidence}</span>
                <p className="text-lg font-extrabold text-[#2E7D32]">{result.confidence}% Match</p>
              </div>
              <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#DDE8DD]">
                <span className="text-xs text-[#5F6B63] font-medium">{t.severity}</span>
                <p className={\`text-lg font-extrabold \${
                  result.severity === 'Severe' || result.severity === 'High' ? 'text-red-600' : 'text-amber-600'
                }\`}>
                  {result.severity}
                </p>
              </div>
            </div>

            {/* Simple Explanation */}
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-[#1F2933] uppercase tracking-wide">
                {t.simpleExplanation}
              </h4>
              <p className="text-base text-[#1F2933] leading-relaxed bg-[#E8F5E9]/40 p-4 rounded-2xl border border-[#DDE8DD]">
                {result.simpleExplanation[language]}
              </p>
            </div>

            {/* Next Steps / Remedies */}
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <span>{t.suggestedNextSteps}</span>
              </h4>
              <div className="space-y-2">
                {result.nextSteps[language].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-[#1F2933] bg-[#F8FAF7] p-3 rounded-xl border border-[#DDE8DD]">
                    <span className="w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preventive Measures */}
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-[#1F2933] uppercase tracking-wide flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#4CAF50]" />
                <span>{t.preventiveMeasures}</span>
              </h4>
              <ul className="list-disc list-inside text-sm text-[#5F6B63] space-y-1 pl-2">
                {result.preventiveMeasures[language].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Agricultural Caution */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>{result.caution[language]}</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
`;
save('src/pages/Farmer/CropScan.tsx', cropScanPage);

// 3. Market Rates Page (Mandi rates for major Pakistani cities, Crop filter, 7-day trend, Transport Fuel rates)
const marketRatesPage = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Fuel, 
  Truck, 
  ArrowLeft, 
  Building,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { marketService } from '../../services/market';
import { AudioButton } from '../../components/common/AudioButton';

export const MarketRates: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const allRates = marketService.getAllRates();
  const fuelRates = marketService.getFuelRates();

  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const cities = ['all', 'Lahore', 'Multan', 'Faisalabad', 'Gujranwala', 'Bahawalpur', 'Sargodha'];

  const filteredRates = allRates.filter((item) => {
    const matchesCrop = selectedCrop === 'all' || item.cropKey === selectedCrop;
    const matchesCity = selectedCity === 'all' || item.city === selectedCity;
    const matchesSearch = 
      item.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.ur.includes(searchTerm) ||
      item.name.pa.includes(searchTerm) ||
      item.mandiName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesCity && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          💰 {t.marketTitle}
        </h1>

        <AudioButton text="Check today's mandi crop prices and current diesel rates for transport calculation." size="sm" />
      </div>

      {/* Fuel Rate Box for Farmer Transport negotiation */}
      <div className="glass-card rounded-3xl p-6 border-2 border-[#8EC5E8]/60 bg-gradient-to-r from-blue-50/50 via-white to-green-50/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#2E7D32]">
            <Fuel className="w-4 h-4" />
            <span>{t.fuelRatesTitle}</span>
          </div>
          <p className="text-xs text-[#5F6B63]">
            {t.transportAdvice}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-[#5F6B63] font-medium">{t.dieselRate}</span>
            <p className="text-xl font-extrabold text-[#1F2933]">
              Rs. {fuelRates.dieselPrice} <span className="text-xs font-normal">/ L</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#5F6B63] font-medium">{t.petrolRate}</span>
            <p className="text-lg font-bold text-[#5F6B63]">
              Rs. {fuelRates.petrolPrice} <span className="text-xs font-normal">/ L</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5F6B63] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchCropPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDE8DD] rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>

        {/* City Filter */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#DDE8DD] rounded-2xl text-sm font-semibold text-[#1F2933] focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? t.allCities : c}
            </option>
          ))}
        </select>
      </div>

      {/* Mandi Cards List */}
      <div className="space-y-4">
        {filteredRates.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-3xl border border-[#DDE8DD] text-[#5F6B63]">
            No market rates found matching your search.
          </div>
        ) : (
          filteredRates.map((rate) => (
            <div
              key={rate.id}
              className="glass-card rounded-3xl p-6 border border-[#DDE8DD] hover:border-[#4CAF50] shadow-sm transition-all space-y-4 bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDE8DD]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                      {rate.category}
                    </span>
                    <span className="text-xs font-semibold text-[#5F6B63]">
                      📍 {rate.city} ({rate.mandiName})
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2933] mt-1">
                    {rate.name[language]}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-[#5F6B63]">{t.per40kg}</span>
                  <div className="text-2xl font-extrabold text-[#2E7D32]">
                    Rs. {rate.modalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Price Range & Historical Trend */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#F8FAF7] p-3 rounded-xl border border-[#DDE8DD]">
                  <span className="text-[#5F6B63]">Min - Max Range:</span>
                  <p className="text-sm font-bold text-[#1F2933] mt-0.5">
                    Rs. {rate.minPrice} - Rs. {rate.maxPrice}
                  </p>
                </div>

                <div className="bg-[#F8FAF7] p-3 rounded-xl border border-[#DDE8DD]">
                  <span className="text-[#5F6B63]">Daily Movement:</span>
                  <p className={\`text-sm font-bold mt-0.5 \${rate.priceChange >= 0 ? 'text-[#2E7D32]' : 'text-red-600'}\`}>
                    {rate.priceChange >= 0 ? \`+\${rate.priceChange}%\` : \`\${rate.priceChange}%\`}
                  </p>
                </div>

                <div className="bg-[#F8FAF7] p-3 rounded-xl border border-[#DDE8DD]">
                  <span className="text-[#5F6B63]">{t.historicalTrend}:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {rate.historicalTrend.map((h, i) => (
                      <div
                        key={i}
                        title={\`\${h.date}: Rs. \${h.price}\`}
                        className="flex-1 bg-[#2E7D32]/20 hover:bg-[#2E7D32] h-4 rounded-xs transition-colors cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
`;
save('src/pages/Farmer/MarketRates.tsx', marketRatesPage);

// 4. Weather Page (Live Open-Meteo API, Live GPS Geolocation, Spray & Sowing Advisory, 7-Day Forecast)
const weatherPage = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  CloudRain, 
  MapPin, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  Navigation,
  Sun
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { weatherService, PAKISTANI_CITIES } from '../../services/weather';
import { WeatherData } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const WeatherPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState<string>('Lahore');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    const data = await weatherService.getLiveWeather(city);
    setWeather(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const handleUseGps = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await weatherService.getLiveWeather('Custom Location', {
            lat: latitude,
            lon: longitude
          });
          setWeather(data);
          setIsLoading(false);
        },
        () => {
          fetchWeather(selectedCity);
        }
      );
    }
  };

  const weatherSpeech = weather
    ? \`Current temperature in \${weather.city} is \${weather.temperature} degrees Celsius. Humidity is \${weather.humidity} percent. Spray Advisory: \${weather.sprayAdvisory[language]}. Sowing Advisory: \${weather.sowingAdvisory[language]}.\`
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          🌤 {t.weatherTitle}
        </h1>

        <AudioButton text={weatherSpeech} size="sm" />
      </div>

      {/* City Switcher + GPS Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="w-5 h-5 text-[#2E7D32] shrink-0" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2.5 bg-white border border-[#DDE8DD] rounded-2xl text-sm font-bold text-[#1F2933] focus:ring-2 focus:ring-[#2E7D32]"
          >
            {Object.keys(PAKISTANI_CITIES).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleUseGps}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#E8F5E9] hover:bg-[#DDE8DD] text-[#2E7D32] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>{t.useMyLocation}</span>
        </button>
      </div>

      {isLoading || !weather ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-[#DDE8DD]">
          <div className="w-8 h-8 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-[#5F6B63]">Loading live Open-Meteo agricultural data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main Weather Card */}
          <div className="glass-card rounded-3xl p-8 border border-[#DDE8DD] shadow-lg bg-gradient-to-br from-blue-50/40 via-white to-green-50/40 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {weather.isRealTime ? '✓ Live Open-Meteo Data' : 'Demo Mode'}
                </span>
                <h2 className="text-3xl font-extrabold text-[#1F2933] mt-2">
                  {weather.city}
                </h2>
                <p className="text-sm font-medium text-[#5F6B63]">
                  {weather.condition}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Sun className="w-14 h-14 text-amber-500 animate-spin-slow" />
                <div className="text-4xl sm:text-6xl font-extrabold text-[#1F2933]">
                  {weather.temperature}°C
                </div>
              </div>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#DDE8DD]">
              <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#DDE8DD]">
                <span className="text-xs text-[#5F6B63]">{t.feelsLike}</span>
                <p className="text-base font-bold text-[#1F2933]">{weather.feelsLike}°C</p>
              </div>

              <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#DDE8DD] flex flex-col justify-between">
                <div className="flex items-center gap-1 text-xs text-[#5F6B63]">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t.humidity}</span>
                </div>
                <p className="text-base font-bold text-[#1F2933]">{weather.humidity}%</p>
              </div>

              <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#DDE8DD] flex flex-col justify-between">
                <div className="flex items-center gap-1 text-xs text-[#5F6B63]">
                  <Wind className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.windSpeed}</span>
                </div>
                <p className="text-base font-bold text-[#1F2933]">{weather.windSpeed} km/h</p>
              </div>

              <div className="bg-[#F8FAF7] p-3.5 rounded-2xl border border-[#DDE8DD] flex flex-col justify-between">
                <div className="flex items-center gap-1 text-xs text-[#5F6B63]">
                  <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.rainChance}</span>
                </div>
                <p className="text-base font-bold text-[#1F2933]">{weather.rainProbability}%</p>
              </div>
            </div>

          </div>

          {/* Smart Agricultural Advisories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Spray Advisory */}
            <div className="glass-card p-6 rounded-3xl border border-[#DDE8DD] space-y-2 bg-white">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2E7D32]">
                <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
                <span>{t.sprayAdvisoryTitle}</span>
              </div>
              <p className="text-sm text-[#1F2933] leading-relaxed">
                {weather.sprayAdvisory[language]}
              </p>
            </div>

            {/* Sowing & Irrigation Advisory */}
            <div className="glass-card p-6 rounded-3xl border border-[#DDE8DD] space-y-2 bg-white">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2E7D32]">
                <AlertCircle className="w-5 h-5 text-[#2E7D32]" />
                <span>{t.sowingAdvisoryTitle}</span>
              </div>
              <p className="text-sm text-[#1F2933] leading-relaxed">
                {weather.sowingAdvisory[language]}
              </p>
            </div>

          </div>

          {/* 7-Day Forecast */}
          <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] space-y-4 bg-white">
            <h3 className="text-base font-extrabold text-[#1F2933]">
              {t.forecast7Day}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {weather.forecast7Days.map((f, i) => (
                <div key={i} className="bg-[#F8FAF7] p-3 rounded-2xl border border-[#DDE8DD] text-center space-y-1">
                  <span className="text-xs font-bold text-[#5F6B63] block">{f.day}</span>
                  <Sun className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="text-sm font-bold text-[#1F2933]">{f.maxTemp}° / {f.minTemp}°</p>
                  <span className="text-[10px] text-blue-600 block">🌧 {f.rainProb}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
`;
save('src/pages/Farmer/WeatherPage.tsx', weatherPage);

// 5. AI Farming Assistant (Voice-First, Speech-to-Text with Mic Pulse, Audio Playback, Multilingual)
const aiAssistantPage = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService, AiChatMessage } from '../../services/ai';
import { speechService } from '../../services/speech';
import { AudioButton } from '../../components/common/AudioButton';

export const AiAssistant: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      text: language === 'ur'
        ? 'السلام علیکم! میں ایگرالیٹکس اے آئی زرعی معاون ہوں۔ آپ مائیک دبا کر بول سکتے ہیں یا نیچے سوال لکھ سکتے ہیں۔'
        : language === 'pa'
        ? 'جی آیاں نوں! میں تہاڈا کھیتی باڑی اے آئی مددگار ہاں۔ مائیک دبا کے بولو یا سوال لکھو۔'
        : 'Welcome! I am your AI Farming Assistant. Tap the microphone to speak in English, Urdu, or Punjabi, or type your question below.',
      timestamp: new Date().toISOString()
    }
  ]);

  const handleStartListening = () => {
    setErrorNotice(null);
    setIsListening(true);
    speechService.startListening(
      language,
      (recognizedText) => {
        setInputQuery(recognizedText);
        handleSendQuery(recognizedText);
      },
      (err) => {
        setErrorNotice(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    setErrorNotice(null);
    const userMsg: AiChatMessage = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await aiService.askFarmingAssistant(textToSend, language);
      const assistantMsg: AiChatMessage = {
        role: 'assistant',
        text: response,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
      // Speak out answer
      speechService.speak(response, language);
    } catch (err: any) {
      setErrorNotice(err.message || 'AI service error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
            🤖 {t.aiAssistantTitle}
          </h1>
          <p className="text-xs text-[#5F6B63]">{t.voiceFirstTitle}</p>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="p-2 text-[#5F6B63] hover:text-red-600 rounded-xl hover:bg-red-50"
          title={t.clearConversation}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Voice-First Hero Bar */}
      <div className="glass-card rounded-3xl p-6 border-2 border-[#4CAF50] bg-gradient-to-b from-[#E8F5E9]/80 to-white text-center space-y-4 shadow-lg">
        <p className="text-sm font-bold text-[#1F2933]">
          {isListening ? t.listening : t.speakOrTypePrompt}
        </p>

        {/* Big Microphone Tap Button */}
        <div>
          <button
            type="button"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={\`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl transition-all \${
              isListening
                ? 'bg-red-500 text-white animate-ping scale-110'
                : 'bg-[#2E7D32] hover:bg-[#1b4d1f] text-white hover:scale-105'
            }\`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        <span className="text-xs text-[#5F6B63] block">
          {isListening ? '🎙 Listening to your voice... Speak clearly' : 'Tap Mic to Speak in your selected language'}
        </span>
      </div>

      {/* Prompt Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#5F6B63] uppercase tracking-wider">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {t.suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputQuery(q);
                handleSendQuery(q);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-[#DDE8DD] hover:border-[#4CAF50] hover:bg-[#E8F5E9] text-[#1F2933] transition-all"
            >
              💡 {q}
            </button>
          ))}
        </div>
      </div>

      {errorNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-[#DDE8DD] space-y-4 max-h-96 overflow-y-auto bg-white/95">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={\`flex flex-col \${m.role === 'user' ? 'items-end' : 'items-start'}\`}
          >
            <div
              className={\`max-w-[85%] rounded-2xl p-4 space-y-2 text-sm leading-relaxed \${
                m.role === 'user'
                  ? 'bg-[#2E7D32] text-white rounded-tr-xs'
                  : 'bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] rounded-tl-xs'
              }\`}
            >
              <p>{m.text}</p>
              {m.role === 'assistant' && (
                <div className="pt-2 border-t border-[#DDE8DD]/60 flex justify-end">
                  <AudioButton text={m.text} size="sm" />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5F6B63] p-3 bg-[#F8FAF7] rounded-2xl border border-[#DDE8DD] w-fit">
            <div className="w-4 h-4 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
            <span>{t.thinking}</span>
          </div>
        )}
      </div>

      {/* Typing Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t.typeQuestionPlaceholder}
          className="flex-1 px-4 py-3 bg-white border border-[#DDE8DD] rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-6 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.send}</span>
        </button>
      </form>

    </div>
  );
};
`;
save('src/pages/Farmer/AiAssistant.tsx', aiAssistantPage);

// 6. My Farm Page (Location, Acreage, Crops, Soil, Water Source, Persistence)
const myFarmPage = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  Layers, 
  ArrowLeft, 
  Save, 
  Check, 
  Edit3, 
  Plus
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../services/db';
import { FarmData } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const MyFarm: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [farm, setFarm] = useState<FarmData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [totalAcres, setTotalAcres] = useState<number>(5);
  const [mainCrops, setMainCrops] = useState('');
  const [soilType, setSoilType] = useState('Loamy (زرخیز میرا)');
  const [waterSource, setWaterSource] = useState<FarmData['waterSource']>('Canal');

  useEffect(() => {
    if (user) {
      const data = db.getFarmData(user.userId);
      if (data) {
        setFarm(data);
        setLocation(data.location);
        setDistrict(data.district);
        setTotalAcres(data.totalAcres);
        setMainCrops(data.mainCrops.join(', '));
        setSoilType(data.soilType);
        setWaterSource(data.waterSource);
      }
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newFarm: FarmData = {
      userId: user.userId,
      location: location.trim(),
      district: district.trim(),
      totalAcres: Number(totalAcres),
      mainCrops: mainCrops.split(',').map((s) => s.trim()).filter(Boolean),
      soilType,
      waterSource,
      updatedAt: new Date().toISOString()
    };

    db.saveFarmData(newFarm);
    setFarm(newFarm);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          🌾 {t.farmDetailsTitle}
        </h1>

        <AudioButton text="Manage your farm location, acreage, soil quality and irrigation details." size="sm" />
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] text-[#2E7D32] font-bold text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{t.farmSavedSuccess}</span>
        </div>
      )}

      {!farm && !isEditing ? (
        /* Empty State */
        <div className="glass-card rounded-3xl p-12 text-center border border-[#DDE8DD] shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1F2933]">
            {t.noFarmDataYet}
          </h3>
          <p className="text-sm text-[#5F6B63] max-w-md mx-auto">
            Save your farm location and acreage to receive personalized sowing, harvest and weather advisories.
          </p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-8 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addFarmInfo}</span>
          </button>
        </div>
      ) : isEditing ? (
        /* Edit/Create Form */
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#DDE8DD] shadow-xl bg-white">
          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  {t.farmLocation}
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Chak 42 RB, Tehsil Kot Momin"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Sargodha / Multan"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  {t.farmSizeAcres}
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={totalAcres}
                  onChange={(e) => setTotalAcres(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  {t.waterSource}
                </label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2E7D32]"
                >
                  <option value="Canal">Canal Water (نہری پانی)</option>
                  <option value="Tube-well">Tube-well (ٹیوب ویل)</option>
                  <option value="Solar Tube-well">Solar Tube-well (سولر ٹیوب ویل)</option>
                  <option value="Rainfed">Rainfed / Barani (بارانی)</option>
                  <option value="Mixed">Mixed (Canal + Tube-well)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.mainCrops} (comma separated)
              </label>
              <input
                type="text"
                required
                value={mainCrops}
                onChange={(e) => setMainCrops(e.target.value)}
                placeholder="Wheat, Cotton, Rice, Corn, Sugarcane"
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#DDE8DD]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-xl border border-[#DDE8DD] text-sm font-semibold text-[#5F6B63] hover:bg-[#F8FAF7]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{t.save}</span>
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* Saved Farm View Card */
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] shadow-xl bg-white space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
            <div>
              <span className="text-xs font-bold uppercase text-[#2E7D32]">Registered Farm Parcel</span>
              <h2 className="text-2xl font-extrabold text-[#1F2933] mt-1">{farm.location}</h2>
              <p className="text-xs text-[#5F6B63]">District {farm.district}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-[#E8F5E9] hover:bg-[#DDE8DD] text-[#2E7D32] text-sm font-bold flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.edit}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-1">
              <span className="text-xs text-[#5F6B63]">{t.farmSizeAcres}</span>
              <p className="text-xl font-extrabold text-[#2E7D32]">{farm.totalAcres} Acres</p>
            </div>

            <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-1">
              <span className="text-xs text-[#5F6B63]">{t.waterSource}</span>
              <p className="text-base font-bold text-[#1F2933]">{farm.waterSource}</p>
            </div>

            <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-1">
              <span className="text-xs text-[#5F6B63]">{t.soilType}</span>
              <p className="text-base font-bold text-[#1F2933]">{farm.soilType}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#5F6B63] uppercase tracking-wider">{t.mainCrops}:</span>
            <div className="flex flex-wrap gap-2">
              {farm.mainCrops.map((c, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
                  🌾 {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
`;
save('src/pages/Farmer/MyFarm.tsx', myFarmPage);

console.log('Farmer pages generated successfully');