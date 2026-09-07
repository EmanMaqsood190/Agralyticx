import React, { useState } from 'react';
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

        <h1 className="w-full text-center text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          💰 {t.marketTitle}
        </h1>

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
                  <p className={`text-sm font-bold mt-0.5 ${rate.priceChange >= 0 ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                    {rate.priceChange >= 0 ? `+${rate.priceChange}%` : `${rate.priceChange}%`}
                  </p>
                </div>

                <div className="bg-[#F8FAF7] p-3 rounded-xl border border-[#DDE8DD]">
                  <span className="text-[#5F6B63]">{t.historicalTrend}:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {rate.historicalTrend.map((h, i) => (
                      <div
                        key={i}
                        title={`${h.date}: Rs. ${h.price}`}
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
