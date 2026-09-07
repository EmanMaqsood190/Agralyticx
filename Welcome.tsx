import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Check, Leaf } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageCode } from '../types';
import fieldImage from '../assets/field-sunsett.jpg';
import { createPortal } from 'react-dom';

export const Welcome: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Tracks whether the user has actually tapped a language on THIS visit,
  // separate from `language` itself (which now always starts at 'en' for
  // anyone not signed in) — so no button is pre-highlighted on load.
  const [pickedLanguage, setPickedLanguage] = useState<LanguageCode | null>(null);

  const handleLanguageSelect = (lang: LanguageCode) => {
    setPickedLanguage(lang);
    setLanguage(lang);
  };

  const handleContinue = () => {
    if (!pickedLanguage) return;
    navigate('/role-selection');
  };

  const leaves = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const inGutter = i % 3 !== 0;
        const left = inGutter
          ? (i % 2 === 0 ? Math.random() * 16 : 84 + Math.random() * 16)
          : 18 + Math.random() * 64;
        return {
          id: i,
          left,
          size: 16 + Math.random() * 16,
          duration: 10 + Math.random() * 9,
          delay: Math.random() * -20,
          rotateStart: Math.random() * 360,
          isSprout: i % 5 === 0
        };
      }),
    []
  );

  const pollen = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 4,
        duration: 8 + Math.random() * 7,
        delay: Math.random() * -15
      })),
    []
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 4 + Math.random() * 5,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * -6
      })),
    []
  );

  const languagesList: { code: LanguageCode; native: string }[] = [
    { code: 'en', native: 'English' },
    { code: 'ur', native: 'اردو' },
    { code: 'pa', native: 'پنجابی' }
  ];

  return (
    <div className="h-full animated-bg flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background field photo — portaled to <body> so it escapes
          the scrollable <main> and isn't clipped by its overflow. */}
      {createPortal(
        <div
          className="fixed inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${fieldImage})` }}
          aria-hidden="true"
        />,
        document.body
      )}
      {createPortal(
        <div
          className="fixed inset-0 z-[1] bg-gradient-to-b from-white/10 via-transparent to-white/25"
          aria-hidden="true"
        />,
        document.body
      )}

      <div className="flow-layer" aria-hidden="true">
        <div className="flow-shape flow-shape-1" />
        <div className="flow-shape flow-shape-2" />
        <div className="flow-shape flow-shape-3" />
      </div>

      <div className="sparkle-layer" aria-hidden="true">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="sparkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`
            }}
          />
        ))}
      </div>

      <div className="pollen-layer" aria-hidden="true">
        {pollen.map((p) => (
          <span
            key={p.id}
            className="pollen"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      <div className="leaf-layer" aria-hidden="true">
        {leaves.map((leaf) => {
          const LeafIcon = leaf.isSprout ? Sprout : Leaf;
          return (
            <LeafIcon
              key={leaf.id}
              className="leaf"
              style={{
                left: `${leaf.left}%`,
                width: leaf.size,
                height: leaf.size,
                color: leaf.id % 4 === 0 ? '#F4C95D' : '#4CAF50',
                animationDuration: `${leaf.duration}s`,
                animationDelay: `${leaf.delay}s`,
                transform: `rotate(${leaf.rotateStart}deg)`
              }}
            />
          );
        })}
      </div>

      {/* ---- Main card ---- */}
      <main className="relative z-[2] w-full max-w-lg px-6 py-8">
        <div className="glass-card rounded-3xl p-8 border border-[#DDE8DD] shadow-2xl space-y-6">

          <div className="flex items-center justify-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-[#2E7D32]">
              AGRALYTICX AI
            </span>
          </div>

          <h2 className="text-center text-base font-bold text-[#1F2933] uppercase tracking-wide">
            {t.chooseLanguage}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {languagesList.map((lang) => {
              const isSelected = pickedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`
                    lang-card p-5 rounded-xl border-2 text-left relative
                    transition-all duration-200 ease-out
                    hover:scale-[1.04] hover:shadow-lg active:scale-95
                    flex items-center justify-between gap-3
                    ${
                      isSelected
                        ? 'lang-card-selected border-[#2E7D32] shadow-md scale-[1.02]'
                        : 'border-[#DDE8DD] hover:border-[#4CAF50]'
                    }
                  `}
                >
                  <span
                    dir={lang.code === 'en' ? 'ltr' : 'rtl'}
                    className="text-lg font-bold text-[#1F2933] font-urdu"
                  >
                    {lang.native}
                  </span>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!pickedLanguage}
            className={`
              w-full py-3.5 rounded-2xl font-bold shadow-lg transition-all
              flex items-center justify-center gap-2
              ${
                pickedLanguage
                  ? 'gradient-brand-btn hover:shadow-xl text-white'
                  : 'bg-[#DDE8DD] text-[#9AA79A] cursor-not-allowed shadow-none'
              }
            `}
          >
            <span>{t.chooseRole}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      </main>

    </div>
  );
};