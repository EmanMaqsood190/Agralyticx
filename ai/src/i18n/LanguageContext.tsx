import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { LanguageCode } from '../types';
import { translations, Translations } from './translations';
import { useAuth } from '../auth/AuthContext';
import { db } from '../services/db';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'ur', 'pa'];

const isValidLanguage = (value: unknown): value is LanguageCode => {
  return (
    typeof value === 'string' &&
    SUPPORTED_LANGUAGES.includes(value as LanguageCode)
  );
};

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuth();

  /*
   * ------------------------------------------------------------
   * INITIAL LANGUAGE
   * ------------------------------------------------------------
   *
   * If a signed-in user already exists, use the language saved
   * for that account.
   *
   * Otherwise default to English.
   */
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const activeUserId = localStorage.getItem(
      'agralyticx_active_user_id'
    );

    const savedLanguage = localStorage.getItem(
      'agralyticx_lang'
    ) as LanguageCode | null;

    if (activeUserId && isValidLanguage(savedLanguage)) {
      return savedLanguage;
    }

    return 'en';
  });

  /*
   * ------------------------------------------------------------
   * APPLY HTML LANGUAGE + RTL/LTR
   * ------------------------------------------------------------
   *
   * Urdu and Punjabi are displayed right-to-left in this app.
   * English remains left-to-right.
   */
  const applyDocumentLanguage = useCallback(
    (lang: LanguageCode) => {
      const rtl = lang === 'ur' || lang === 'pa';

      document.documentElement.lang = lang;
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';

      /*
       * Helpful for components that need to know the current
       * direction through CSS.
       */
      document.documentElement.setAttribute(
        'data-language',
        lang
      );

      document.documentElement.setAttribute(
        'data-direction',
        rtl ? 'rtl' : 'ltr'
      );
    },
    []
  );

  /*
   * ------------------------------------------------------------
   * SYNC LANGUAGE WHEN USER LOGS IN / LOGS OUT
   * ------------------------------------------------------------
   */
  useEffect(() => {
    if (user) {
      const accountLanguage: LanguageCode = isValidLanguage(
        user.language
      )
        ? user.language
        : 'en';

      setLanguageState(accountLanguage);

      localStorage.setItem(
        'agralyticx_lang',
        accountLanguage
      );

      localStorage.setItem(
        'agralyticx_active_user_id',
        user.userId
      );

      applyDocumentLanguage(accountLanguage);
    } else {
      /*
       * No signed-in account.
       *
       * Reset to English so one user's language does not leak
       * into another anonymous session.
       */
      setLanguageState('en');

      localStorage.removeItem('agralyticx_lang');
      localStorage.removeItem('agralyticx_active_user_id');

      applyDocumentLanguage('en');
    }
  }, [user, applyDocumentLanguage]);

  /*
   * ------------------------------------------------------------
   * CHANGE LANGUAGE
   * ------------------------------------------------------------
   */
  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      /*
       * Never allow an unsupported value.
       */
      if (!isValidLanguage(lang)) {
        console.warn(
          `Unsupported language "${String(lang)}". Falling back to English.`
        );

        lang = 'en';
      }

      /*
       * IMPORTANT:
       *
       * Update React state immediately.
       *
       * This makes the entire UI switch language immediately,
       * without needing a refresh.
       */
      setLanguageState(lang);

      /*
       * Apply RTL/LTR immediately.
       */
      applyDocumentLanguage(lang);

      /*
       * If a real user is signed in, save the language to their
       * account/profile as well.
       */
      if (user) {
        localStorage.setItem(
          'agralyticx_lang',
          lang
        );

        localStorage.setItem(
          'agralyticx_active_user_id',
          user.userId
        );

        /*
         * Save the selected language into the user's stored
         * profile.
         *
         * db.saveUserProfile() already merges the profile, so
         * existing fields such as password are preserved.
         */
        const currentProfile = db.getUserProfile(user.userId);

        if (currentProfile) {
          db.saveUserProfile({
            ...currentProfile,
            language: lang,
          });
        }
      } else {
        /*
         * Anonymous language selection:
         *
         * Keep it alive during this React session, but don't
         * permanently associate it with a previous user.
         */
        localStorage.setItem(
          'agralyticx_lang',
          lang
        );
      }
    },
    [user, applyDocumentLanguage]
  );

  /*
   * ------------------------------------------------------------
   * KEEP HTML DIRECTION IN SYNC WITH CURRENT LANGUAGE
   * ------------------------------------------------------------
   */
  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language, applyDocumentLanguage]);

  /*
   * ------------------------------------------------------------
   * RTL
   * ------------------------------------------------------------
   */
  const isRTL =
    language === 'ur' ||
    language === 'pa';

  /*
   * ------------------------------------------------------------
   * TRANSLATIONS
   * ------------------------------------------------------------
   *
   * Your translations.ts already contains:
   *
   * en = English
   * ur = Urdu
   * pa = Punjabi
   *
   * So we simply select the correct dictionary here.
   */
  const t =
    translations[language] ||
    translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider'
    );
  }

  return context;
};