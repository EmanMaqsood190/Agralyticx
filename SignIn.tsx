import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import {
  Sprout,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';

import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { UserRole } from '../../types';

export const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  /*
   * ---------------------------------------------------------
   * FORM STATE
   * ---------------------------------------------------------
   */

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const preselectedRole =
    (localStorage.getItem(
      'agralyticx_onboarding_role'
    ) as UserRole) || 'farmer';

  const [role, setRole] =
    useState<UserRole>(preselectedRole);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * FIELD ERRORS
   * ---------------------------------------------------------
   *
   * Errors are displayed directly below the field
   * that caused the problem.
   *
   * ---------------------------------------------------------
   */

  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  /*
   * ---------------------------------------------------------
   * PASSWORD VISIBILITY
   * ---------------------------------------------------------
   */

  const [showPassword, setShowPassword] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * ROLE CHECKS
   * ---------------------------------------------------------
   */

  const isFarmer =
    role === 'farmer';

  const isTransport =
    role === 'transport';

  const isLandowner =
    role === 'landowner';

  const isStudent =
    role === 'student_researcher';

  const isCompany =
    role === 'company';

  /*
   * ---------------------------------------------------------
   * LOGIN METHOD
   *
   * Farmer / Transport / Landowner
   * -> CNIC
   *
   * Student / Company
   * -> Email
   * ---------------------------------------------------------
   */

  const usesCnic =
    isFarmer ||
    isTransport ||
    isLandowner;

  /*
   * ---------------------------------------------------------
   * ROLE CHANGE
   * ---------------------------------------------------------
   */

  const handleRoleChange = (
    newRole: UserRole
  ) => {
    setRole(newRole);

    setIdentifier('');

    setFieldErrors({});
  };

  /*
   * ---------------------------------------------------------
   * CNIC INPUT
   *
   * User can simply type:
   *
   * 3520212345671
   *
   * and it automatically becomes:
   *
   * 35202-1234567-1
   *
   * ---------------------------------------------------------
   */

  const handleCnicChange = (
    value: string
  ) => {
    /*
     * Remove everything except numbers.
     */

    const digits = value
      .replace(/\D/g, '')
      .slice(0, 13);

    let formatted = digits;

    /*
     * First hyphen after first 5 digits.
     */

    if (digits.length > 5) {
      formatted =
        digits.slice(0, 5) +
        '-' +
        digits.slice(5);
    }

    /*
     * Second hyphen before final digit.
     */

    if (digits.length > 12) {
      formatted =
        digits.slice(0, 5) +
        '-' +
        digits.slice(5, 12) +
        '-' +
        digits.slice(12);
    }

    setIdentifier(formatted);

    /*
     * Clear old identifier error while typing.
     */

    setFieldErrors((prev) => ({
      ...prev,
      identifier: undefined,
    }));
  };

  /*
   * ---------------------------------------------------------
   * EMAIL INPUT
   * ---------------------------------------------------------
   */

  const handleEmailChange = (
    value: string
  ) => {
    setIdentifier(value);

    setFieldErrors((prev) => ({
      ...prev,
      identifier: undefined,
    }));
  };

  /*
   * ---------------------------------------------------------
   * PASSWORD CHANGE
   * ---------------------------------------------------------
   */

  const handlePasswordChange = (
    value: string
  ) => {
    setPassword(value);

    setFieldErrors((prev) => ({
      ...prev,
      password: undefined,
    }));
  };

  /*
   * ---------------------------------------------------------
   * FORM SUBMIT
   * ---------------------------------------------------------
   */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /*
     * Clear previous errors.
     */

    setFieldErrors({});

    const newErrors: {
      identifier?: string;
      password?: string;
    } = {};

    /*
     * -------------------------------------------------------
     * IDENTIFIER REQUIRED
     * -------------------------------------------------------
     */

    if (!identifier.trim()) {
      newErrors.identifier = usesCnic
        ? t.errorEnterCnic
        : t.errorEnterEmail;
    }

    /*
     * -------------------------------------------------------
     * EMAIL FORMAT
     * -------------------------------------------------------
     */

    if (
      !usesCnic &&
      identifier.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        identifier.trim()
      )
    ) {
      newErrors.identifier =
        t.errorValidEmail;
    }

    /*
     * -------------------------------------------------------
     * CNIC FORMAT
     *
     * Exactly:
     *
     * 35202-1234567-1
     * -------------------------------------------------------
     */

    if (
      usesCnic &&
      identifier.trim() &&
      !/^\d{5}-\d{7}-\d{1}$/.test(
        identifier.trim()
      )
    ) {
      newErrors.identifier =
        t.errorCnicFormat;
    }

    /*
     * -------------------------------------------------------
     * PASSWORD REQUIRED
     * -------------------------------------------------------
     */

    if (!password) {
      newErrors.password =
        t.errorEnterPassword;
    }

    /*
     * -------------------------------------------------------
     * SHOW FIELD ERRORS
     *
     * No error notification at the top.
     * -------------------------------------------------------
     */

    if (
      Object.keys(newErrors).length > 0
    ) {
      setFieldErrors(newErrors);
      return;
    }

    /*
     * -------------------------------------------------------
     * SIGN IN
     * -------------------------------------------------------
     */

    setIsSubmitting(true);

    try {
      const res = await signIn(
        identifier.trim(),
        password,
        role
      );

      setIsSubmitting(false);

      /*
       * -----------------------------------------------------
       * REDIRECT
       * -----------------------------------------------------
       */

      if (
        res.success &&
        res.user
      ) {
        const roleRoutes: Record<
          UserRole,
          string
        > = {
          farmer:
            '/farmer/dashboard',

          student_researcher:
            '/student-research/dashboard',

          company:
            '/company/dashboard',

          landowner:
            '/landowner',

          transport:
            '/transport/dashboard',
        };

        navigate(
          roleRoutes[
            res.user.role
          ]
        );

        return;
      }

      /*
       * -----------------------------------------------------
       * LOGIN ERROR
       *
       * Authentication errors are related to the
       * credentials, so show them below the password
       * field instead of at the top.
       * -----------------------------------------------------
       */

      setFieldErrors({
        password:
          res.error ||
          t.errorInvalidLogin,
      });

    } catch (err) {
      setIsSubmitting(false);

      setFieldErrors({
        password:
          'Something went wrong. Please try again.',
      });
    }
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col py-8 px-4 sm:px-6 lg:px-8">

      {/* =====================================================
          BACK BUTTON
          ===================================================== */}

      <div className="w-full max-w-3xl mx-auto mb-5 shrink-0">

        <button
          type="button"
          onClick={() =>
            navigate('/role-selection')
          }
          className="inline-flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />

          <span>
            {t.back}
          </span>
        </button>

      </div>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">

        <Link
          to="/"
          className="inline-flex items-center gap-2"
        >

          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white">

            <Sprout className="w-6 h-6" />

          </div>

          <span className="text-2xl font-extrabold text-[#2E7D32]">
            AGRALYTICX AI
          </span>

        </Link>

        <h2 className="text-2xl font-extrabold text-[#1F2933]">
          {t.signIn}
        </h2>

        <p className="text-sm text-[#5F6B63]">
          {t.signInSubtitle}
        </p>

      </div>

      {/* =====================================================
          FORM CARD
          ===================================================== */}

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">

        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-[#DDE8DD] shadow-xl space-y-6">

          {/* =================================================
              FORM
              ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* =================================================
                ROLE
                ================================================= */}

            <div>

              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                {t.chooseRole}

                <span className="text-red-500">
                  {' '}*
                </span>

              </label>

              <select
                value={role}
                onChange={(e) =>
                  handleRoleChange(
                    e.target.value as UserRole
                  )
                }
                className="block w-full px-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white font-medium text-[#1F2933] focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
              >

                <option value="farmer">
                  🌾 {t.roles.farmer}
                </option>

                <option value="student_researcher">
                  🎓 {t.roles.studentResearcher}
                </option>

                <option value="company">
                  🏢 {t.roles.company}
                </option>

                <option value="landowner">
                  🌳 {t.roles.landowner}
                </option>

                <option value="transport">
                  🚚 {t.roles.transport}
                </option>

              </select>

            </div>

            {/* =================================================
                CNIC
                ================================================= */}

            {usesCnic && (

              <div>

                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                  {t.cnicNumber}

                  <span className="text-red-500">
                    {' '}*
                  </span>

                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">

                    <ShieldCheck className="w-5 h-5" />

                  </div>

                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) =>
                      handleCnicChange(
                        e.target.value
                      )
                    }
                    placeholder="35202-1234567-1"
                    maxLength={15}
                    inputMode="numeric"
                    autoComplete="username"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                  />

                </div>

                {fieldErrors.identifier && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.identifier}
                  </p>

                )}

                <p className="mt-1 text-[11px] text-[#6B7280]">
                  {t.useCnicRegistered}
                </p>

              </div>

            )}

            {/* =================================================
                EMAIL
                ================================================= */}

            {!usesCnic && (

              <div>

                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                  {isCompany
                    ? t.companyEmail
                    : t.emailAddress}

                  <span className="text-red-500">
                    {' '}*
                  </span>

                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">

                    <Mail className="w-5 h-5" />

                  </div>

                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) =>
                      handleEmailChange(
                        e.target.value
                      )
                    }
                    placeholder={
                      isCompany
                        ? 'company@example.com'
                        : 'you@example.com'
                    }
                    autoComplete="username"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                  />

                </div>

                {fieldErrors.identifier && (

                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.identifier}
                  </p>

                )}

                <p className="mt-1 text-[11px] text-[#6B7280]">
                  {t.useEmailRegistered}
                </p>

              </div>

            )}

            {/* =================================================
                PASSWORD
                ================================================= */}

            <div>

              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                {t.password}

                <span className="text-red-500">
                  {' '}*
                </span>

              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">

                  <Lock className="w-5 h-5" />

                </div>

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={password}
                  onChange={(e) =>
                    handlePasswordChange(
                      e.target.value
                    )
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-11 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />

                {/* PASSWORD EYE */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F6B63] hover:text-[#2E7D32] transition-colors"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword ? (

                    <EyeOff className="w-5 h-5" />

                  ) : (

                    <Eye className="w-5 h-5" />

                  )}

                </button>

              </div>

              {fieldErrors.password && (

                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>

              )}

            </div>

            {/* =================================================
                SIGN IN BUTTON
                ================================================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {isSubmitting ? (

                <span>
                  {t.signingIn}
                </span>

              ) : (

                <>
                  <span>
                    {t.signIn}
                  </span>

                  <ArrowRight className="w-4 h-4" />

                </>

              )}

            </button>

          </form>

          {/* =================================================
              SIGN UP
              ================================================= */}

          <div className="pt-2 text-center text-xs text-[#5F6B63] border-t border-[#DDE8DD]">

            <span>
              {t.dontHaveAccount}{' '}
            </span>

            <Link
              to="/role-selection"
              className="font-bold text-[#2E7D32] hover:underline"
            >
              {t.signUp}
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};