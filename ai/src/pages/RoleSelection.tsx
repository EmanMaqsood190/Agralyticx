import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  GraduationCap,
  Building2,
  Trees,
  Truck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { UserRole } from '../types';

import bgImage from '../assets/role-select-bg.jpg';
import farmerImg from '../assets/characters/farmer.png';
import studentImg from '../assets/characters/student.png';
import companyImg from '../assets/characters/company.png';
import landownerImg from '../assets/characters/landowner.png';
import transportImg from '../assets/characters/transport.png';

const DEFAULT_ROLE: UserRole = 'farmer';

export const RoleSelection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  /*
   * ---------------------------------------------------------
   * SELECTED ROLE
   * ---------------------------------------------------------
   *
   * Farmer is selected by default when the role-selection
   * page is opened.
   */
  const [selectedRole, setSelectedRole] =
    useState<UserRole>(DEFAULT_ROLE);

  const [hoveredRole, setHoveredRole] =
    useState<UserRole | null>(null);

  /*
   * ---------------------------------------------------------
   * MOUSE / HOVER
   * ---------------------------------------------------------
   */
  const handleRowMouseLeave = () => {
    setHoveredRole(null);
  };

  const handleCardMouseEnter = (
    roleId: UserRole
  ) => {
    setHoveredRole(roleId);
  };

  /*
   * ---------------------------------------------------------
   * ROLES
   * ---------------------------------------------------------
   */
  const rolesConfig: {
    id: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
  }[] = [
    {
      id: 'student_researcher',
      title: t.roles.studentResearcher,
      description: t.roles.studentResearcherDesc,
      icon: (
        <GraduationCap className="w-4 h-4" />
      ),
      image: studentImg
    },
    {
      id: 'landowner',
      title: t.roles.landowner,
      description: t.roles.landownerDesc,
      icon: (
        <Trees className="w-4 h-4" />
      ),
      image: landownerImg
    },
    {
      id: 'farmer',
      title: t.roles.farmer,
      description: t.roles.farmerDesc,
      icon: (
        <Sprout className="w-4 h-4" />
      ),
      image: farmerImg
    },
    {
      id: 'company',
      title: t.roles.company,
      description: t.roles.companyDesc,
      icon: (
        <Building2 className="w-4 h-4" />
      ),
      image: companyImg
    },
    {
      id: 'transport',
      title: t.roles.transport,
      description: t.roles.transportDesc,
      icon: (
        <Truck className="w-4 h-4" />
      ),
      image: transportImg
    }
  ];

  /*
   * ---------------------------------------------------------
   * ACTIVE ROLE
   * ---------------------------------------------------------
   *
   * Hover temporarily makes a card active.
   * When mouse leaves, selected role becomes active again.
   */
  const activeRole =
    hoveredRole ?? selectedRole;

  /*
   * ---------------------------------------------------------
   * SAVE ROLE
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   * Both Sign Up and Sign In use this function.
   *
   * This ensures that when the user selects Student and then
   * clicks "Already have an account? Sign in", the Sign In
   * page knows that Student was selected.
   */
  const saveSelectedRole = () => {
    localStorage.setItem(
      'agralyticx_onboarding_role',
      selectedRole
    );
  };

  /*
   * ---------------------------------------------------------
   * CONTINUE TO SIGN UP
   * ---------------------------------------------------------
   */
  const handleContinue = () => {
    saveSelectedRole();
    navigate('/sign-up');
  };

  /*
   * ---------------------------------------------------------
   * GO TO SIGN IN
   * ---------------------------------------------------------
   */
  const handleSignIn = () => {
    saveSelectedRole();
    navigate('/sign-in');
  };

  /*
   * =========================================================
   * UI
   * =========================================================
   */
  return (
    <div className="no-page-scroll relative h-full overflow-hidden flex flex-col">

      {/* =====================================================
          BACKGROUND IMAGE
          ===================================================== */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          DARK OVERLAY
          ===================================================== */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,20,14,0.88) 0%, rgba(10,20,14,0.62) 35%, rgba(10,20,14,0.72) 75%, rgba(6,14,10,0.94) 100%)'
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          HEADER
          ===================================================== */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center px-4 pt-7">
        <button
          type="button"
          onClick={() =>
            navigate('/welcome')
          }
          className="flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />

          <span>
            {t.back}
          </span>
        </button>
      </header>

      {/* =====================================================
          MAIN
          ===================================================== */}
      <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-4">

        <div className="w-full max-w-5xl flex flex-col items-center gap-3">

          {/* =================================================
              HEADING
              ================================================= */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-lg leading-tight">
              {t.chooseRole}
            </h1>

            <br />
          </div>

          {/* =================================================
              ROLE CARDS
              ================================================= */}
          <div
            className="role-row"
            onMouseLeave={handleRowMouseLeave}
          >
            {rolesConfig.map((item) => {
              const isActive =
                activeRole === item.id;

              const isChosen =
                selectedRole === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() =>
                    handleCardMouseEnter(
                      item.id
                    )
                  }
                  onFocus={() =>
                    handleCardMouseEnter(
                      item.id
                    )
                  }
                  onClick={() =>
                    setSelectedRole(
                      item.id
                    )
                  }
                  className={[
                    'role-card',
                    isActive
                      ? 'role-card-active'
                      : 'role-card-inactive',
                    isChosen
                      ? 'role-card-chosen'
                      : ''
                  ].join(' ')}
                  aria-pressed={isChosen}
                >
                  <div className="role-card-image-wrap">

                    {/* Role image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="role-card-image"
                      loading="eager"
                      decoding="async"
                    />

                    <div className="role-card-gradient" />

                    {/* Selected check */}
                    {isChosen && (
                      <span className="role-card-check">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="role-card-label">

                    <span className="role-card-icon">
                      {item.icon}
                    </span>

                    <span className="role-card-title">
                      {item.title}
                    </span>

                  </div>
                </button>
              );
            })}
          </div>

          {/* =================================================
              ACTION ROW
              ================================================= */}
          <div className="flex flex-col items-center gap-1.5 mt-1">

            {/* =================================================
                CREATE ACCOUNT
                ================================================= */}
            <button
              type="button"
              onClick={handleContinue}
              className="px-8 py-2.5 rounded-xl gradient-brand-btn text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>
                {t.createAccount}
              </span>

              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* =================================================
                SIGN IN
                ================================================= */}
            <button
              type="button"
              onClick={handleSignIn}
              className="text-xs font-semibold text-[#8BD98E] hover:text-white hover:underline transition-colors"
            >
              {t.alreadyHaveAccount}{' '}
              {t.signIn}
            </button>

          </div>

        </div>
      </main>
    </div>
  );
};