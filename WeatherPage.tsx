import React, { useState, useEffect } from 'react';
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
    ? `Current temperature in ${weather.city} is ${weather.temperature} degrees Celsius. Humidity is ${weather.humidity} percent. Spray Advisory: ${weather.sprayAdvisory[language]}. Sowing Advisory: ${weather.sowingAdvisory[language]}.`
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
          🌤 {t.weatherTitle}
        </h1>

        
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
