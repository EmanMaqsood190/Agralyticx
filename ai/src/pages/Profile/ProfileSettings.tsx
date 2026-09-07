import React, { useState } from 'react';
import {
  LogOut,
  ArrowLeft,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { LanguageCode } from '../../types';
import { useNavigate } from 'react-router-dom';

export const ProfileSettings: React.FC = () => {
  const {
    user,
    signOut,
    deleteAccount
  } = useAuth();

  const {
    language,
    setLanguage,
    t
  } = useLanguage();

  const navigate = useNavigate();

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // ============================================================
  // CUSTOM DELETE CONFIRMATION MODAL
  // ============================================================

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ============================================================
  // SIGN OUT
  // ============================================================

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  // ============================================================
  // OPEN DELETE CONFIRMATION
  // ============================================================

  const handleDeleteAccount = () => {
    setDeleteError('');

    if (!deletePassword.trim()) {
      setDeleteError(t.errorEnterPassword);
      return;
    }

    setShowDeleteConfirm(true);
  };

  // ============================================================
  // ACTUAL ACCOUNT DELETION
  // ============================================================

  const confirmDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    setDeleteError('');
    setIsDeleting(true);

    const result = await deleteAccount(deletePassword);

    if (!result.success) {
      // deleteAccount() returns fixed English error strings
      // from AuthContext, so map known errors to the
      // currently selected website language.

      const knownErrors: Record<string, string> = {
        'Incorrect password.': t.incorrectPassword,
        'Please enter your password.': t.errorEnterPassword
      };

      setDeleteError(
        (result.error && knownErrors[result.error]) ||
          result.error ||
          t.unableToDeleteAccount
      );

      setIsDeleting(false);
      return;
    }

    navigate('/welcome');
  };

  // ============================================================
  // ROLE TITLE
  // ============================================================

  const roleTitle = user
    ? (
        user.role === 'student_researcher'
          ? t.roles.studentResearcher
          : t.roles[user.role as keyof typeof t.roles]
      )
    : '';

  // ============================================================
  // CUSTOM MODAL TRANSLATIONS
  // ============================================================

  const deleteModalText = {
    en: {
      title: 'Delete Account?',
      message:
        'Are you sure you want to permanently delete your account? This action cannot be undone.',
      cancel: 'Cancel',
      delete: 'Delete Account'
    },

    ur: {
      title: 'اکاؤنٹ حذف کریں؟',
      message:
        'کیا آپ واقعی اپنا اکاؤنٹ مستقل طور پر حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔',
      cancel: 'منسوخ کریں',
      delete: 'اکاؤنٹ حذف کریں'
    },

    pa: {
      title: 'اکاؤنٹ حذف کرنا ہے؟',
      message:
        'کیا تسی واقعی اپنا اکاؤنٹ ہمیشہ لئی حذف کرنا چاہندے او؟ ایہ کم واپس نہیں ہو سکدا۔',
      cancel: 'منسوخ کرو',
      delete: 'اکاؤنٹ حذف کرو'
    }
  };

  const modalText =
    deleteModalText[language as keyof typeof deleteModalText] ||
    deleteModalText.en;

  return (
    <>
      {/* ========================================================
          MAIN PROFILE PAGE
      ======================================================== */}

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
            👤 {t.profile}
          </h1>

          <div></div>

        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#DDE8DD] shadow-xl bg-white space-y-6">

          {/* ====================================================
              USER INFORMATION
          ==================================================== */}

          <div className="flex items-center gap-4 pb-6 border-b border-[#DDE8DD]">

            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#DDE8DD] bg-[#E8F5E9] shrink-0">

              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#2E7D32] font-extrabold text-2xl">
                  {user?.name?.charAt(0)}
                </div>
              )}

            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[#1F2933]">
                {user?.name}
              </h2>

              <p className="text-xs text-[#5F6B63]">
                {user?.email}
              </p>

              <span className="inline-block mt-1 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                {roleTitle}
              </span>
            </div>

          </div>

          {/* ====================================================
              LANGUAGE
          ==================================================== */}

          <div className="space-y-3">

            <label className="block text-xs font-bold text-[#1F2933] uppercase">
              {t.language}
            </label>

            <div className="grid grid-cols-3 gap-3">

              {[
                {
                  code: 'en',
                  label: 'English'
                },
                {
                  code: 'ur',
                  label: 'اردو (Urdu)'
                },
                {
                  code: 'pa',
                  label: 'پنجابی (Pakistani Punjabi)'
                }
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() =>
                    setLanguage(
                      l.code as LanguageCode
                    )
                  }
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                    language === l.code
                      ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]'
                      : 'border-[#DDE8DD] bg-white text-[#1F2933] hover:bg-[#F8FAF7]'
                  }`}
                >
                  {l.label}
                </button>
              ))}

            </div>

          </div>

          {/* ====================================================
              SIGN OUT
          ==================================================== */}

          <div className="pt-6 border-t border-[#DDE8DD] flex justify-end">

            <button
              type="button"
              onClick={handleSignOut}
              className="px-6 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.signOut}</span>
            </button>

          </div>

          {/* ====================================================
              DELETE ACCOUNT
          ==================================================== */}

          <div className="pt-6 border-t border-red-200">

            <div className="mb-4">

              <h3 className="text-base font-extrabold text-red-700">
                {t.deleteAccountTitle}
              </h3>

              <p className="text-xs text-[#5F6B63] mt-1">
                {t.deleteAccountDesc}
              </p>

            </div>

            <div className="space-y-3">

              {/* Password Label */}
              <label
                htmlFor="delete-account-password"
                className="block text-xs font-bold text-[#1F2933]"
              >
                {t.enterPasswordToConfirm}
              </label>

              {/* Password Input */}
              <div className="relative">

                <input
                  id="delete-account-password"
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError('');
                  }}
                  placeholder={t.password}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#DDE8DD] bg-white text-sm text-[#1F2933] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowDeletePassword((prev) => !prev)
                  }
                  aria-label={
                    showDeletePassword
                      ? t.hidePassword
                      : t.showPassword
                  }
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-[#5F6B63] hover:text-[#1F2933]"
                >
                  {showDeletePassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

              {/* Delete Error */}
              {deleteError && (
                <p className="text-sm font-semibold text-red-600">
                  {deleteError}
                </p>
              )}

              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />

                <span>
                  {isDeleting
                    ? t.deletingAccount
                    : t.deleteAccountBtn}
                </span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          CUSTOM DELETE CONFIRMATION MODAL
      ======================================================== */}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[999999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteConfirm(false);
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-modal-title"
            className="w-full max-w-md rounded-[28px] bg-white border border-[#DDE8DD] shadow-[0_30px_100px_rgba(20,40,25,0.25)] p-6 sm:p-7"
            onMouseDown={(e) => e.stopPropagation()}
          >

            {/* Warning Icon */}
            <div className="flex justify-center">

              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">

                <AlertTriangle className="w-7 h-7 text-red-500" />

              </div>

            </div>

            {/* Title */}
            <h2
              id="delete-account-modal-title"
              className="mt-5 text-center text-xl font-extrabold text-[#1F2933]"
            >
              {modalText.title}
            </h2>

            {/* Message */}
            <p
              className={`mt-3 text-center text-sm leading-6 text-[#5F6B63] ${
                language === 'ur' || language === 'pa'
                  ? 'font-medium'
                  : ''
              }`}
              dir={language === 'ur' || language === 'pa' ? 'rtl' : 'ltr'}
            >
              {modalText.message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-7">

              {/* Cancel */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl bg-[#F3F6F3] border border-[#E2E9E2] text-sm font-extrabold text-[#59665E] hover:bg-[#EAEFEA] transition"
              >
                {modalText.cancel}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-sm font-extrabold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />

                <span>
                  {isDeleting
                    ? t.deletingAccount
                    : modalText.delete}
                </span>
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
};