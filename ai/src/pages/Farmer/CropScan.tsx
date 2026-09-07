import React, { useState } from 'react';
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
      const diag = await aiService.analyzeCropImage(selectedImage, language);
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
    ? `Crop Issue: ${result.issue}. Explanation: ${result.simpleExplanation[language]}. Recommended Action: ${result.nextSteps[language].join('. ')}. ${result.caution[language]}`
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

        <h1 className="w-full text-center text-xl sm:text-2xl font-extrabold text-[#1F2933]"> 
  🌱 {t.cropScannerTitle} 
</h1>


        
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
                <p className={`text-lg font-extrabold ${
                  result.severity === 'Severe' || result.severity === 'High' ? 'text-red-600' : 'text-amber-600'
                }`}>
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
