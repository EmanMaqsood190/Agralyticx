import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Building2,
  FlaskConical,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { CompanyProfile } from '../../types';

const API_BASE = 'http://localhost:5000/api';

type ResearchOffer = 'free' | 'stipend' | 'both';

interface FormData {
  companyName: string;
  location: string;
  industry: string;
  researchTopic: string;
  researchDescription: string;
  companyDescription: string;
  researchOffer: ResearchOffer;
  workEmail: string;
}

const emptyForm: FormData = {
  companyName: '',
  location: '',
  industry: '',
  researchTopic: '',
  researchDescription: '',
  companyDescription: '',
  researchOffer: 'free',
  workEmail: ''
};

export const CompanyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>(emptyForm);

  const [saveSuccess, setSaveSuccess] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ============================================================
  // LOAD COMPANY PROFILES
  // ============================================================

  const loadProfiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `${API_BASE}/companies/user/${user.userId}`
      );

      if (!response.ok) {
        throw new Error('Failed to load company profiles');
      }

      const data = await response.json();

      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Unable to load your research profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [user]);

  // ============================================================
  // OPEN NEW PROFILE FORM
  // ============================================================

  const handleNewProfile = () => {
    setEditingProfileId(null);

    setFormData({
      ...emptyForm,
      companyName: '',
      workEmail: '',
    });

    setSaveSuccess('');
    setError('');
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // ============================================================
  // OPEN EDIT FORM
  // ============================================================

  const handleEdit = (profile: CompanyProfile) => {
    setEditingProfileId(profile.profileId);

    setFormData({
      companyName: profile.companyName || '',
      location: profile.location || '',
      industry: profile.industry || '',
      researchTopic: profile.researchTopic || '',
      researchDescription: profile.researchDescription || '',
      companyDescription: profile.companyDescription || '',
      researchOffer: profile.researchOffer || 'free',
      workEmail: profile.workEmail || ''
    });

    setSaveSuccess('');
    setError('');
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // ============================================================
  // CLOSE FORM
  // ============================================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingProfileId(null);
    setFormData(emptyForm);
    setError('');
  };

  // ============================================================
  // FORM INPUT
  // ============================================================

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  // ============================================================
  // SAVE / UPDATE PROFILE
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setError('');
    setSaveSuccess('');

    try {
      const payload = {
        companyName: formData.companyName.trim(),
        location: formData.location.trim(),
        industry: formData.industry.trim(),
        researchTopic: formData.researchTopic.trim(),
        researchDescription: formData.researchDescription.trim(),
        companyDescription: formData.companyDescription.trim(),
        researchOffer: formData.researchOffer,
        workEmail: formData.workEmail.trim()
      };

      let response: Response;

      // ========================================================
      // UPDATE EXISTING PROFILE
      // ========================================================

      if (editingProfileId) {
        response = await fetch(
          `${API_BASE}/companies/${editingProfileId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        );
      }

      // ========================================================
      // CREATE NEW PROFILE
      // ========================================================

      else {
        response = await fetch(`${API_BASE}/companies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.userId,
            ...payload
          })
        });
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message || 'Failed to save research profile'
        );
      }

      await response.json();

      await loadProfiles();

      setShowForm(false);
      setEditingProfileId(null);
      setFormData(emptyForm);

      setSaveSuccess(
        editingProfileId
          ? 'Research profile updated successfully!'
          : 'Research profile created successfully!'
      );

      setTimeout(() => {
        setSaveSuccess('');
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving the profile.'
      );
    }
  };

  // ============================================================
  // DELETE PROFILE
  // ============================================================

  const handleDelete = async (profileId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this research profile? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setDeletingId(profileId);
      setError('');

      const response = await fetch(
        `${API_BASE}/companies/${profileId}`,
        {
          method: 'DELETE'
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || 'Failed to delete research profile'
        );
      }

      setProfiles((previous) =>
        previous.filter(
          (profile) => profile.profileId !== profileId
        )
      );

      setSaveSuccess('Research profile deleted successfully!');

      setTimeout(() => {
        setSaveSuccess('');
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to delete the research profile.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // OFFER LABEL
  // ============================================================

  const getOfferLabel = (offer: ResearchOffer) => {
    if (offer === 'free') return 'Free';
    if (offer === 'stipend') return 'Stipend';
    return 'Both';
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8FAF7] px-4 sm:px-6 lg:px-8 py-8">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="max-w-6xl mx-auto">

        <div className="relative flex items-center justify-center pb-6 border-b border-[#DDE8DD]">

          <button
            type="button"
            onClick={() => navigate('/company/dashboard')}
            className="absolute left-0 flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2933] text-center">
            🏢 {t.manageCompanyProfile}
          </h1>

        </div>

        {/* ======================================================
            SUCCESS MESSAGE
        ====================================================== */}

        {saveSuccess && (
          <div className="mt-6 max-w-5xl mx-auto p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] text-[#2E7D32] font-bold text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* ======================================================
            ERROR MESSAGE
        ====================================================== */}

        {error && (
          <div className="mt-6 max-w-5xl mx-auto p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold text-sm">
            {error}
          </div>
        )}

        {/* ======================================================
            CREATE / EDIT FORM
        ====================================================== */}

        {showForm && (
          <div className="max-w-5xl mx-auto mt-8">

            <div className="bg-white rounded-3xl border border-[#DDE8DD] shadow-xl overflow-hidden">

              {/* FORM HEADER */}

              <div className="px-6 sm:px-10 py-6 bg-[#E8F5E9] border-b border-[#DDE8DD] flex items-center justify-between">

                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
                    {editingProfileId
                      ? 'Edit Research Profile'
                      : 'Create Research Profile'}
                  </h2>

                  <p className="text-sm text-[#5F6B63] mt-1">
                    {editingProfileId
                      ? 'Update the information for this research opportunity.'
                      : 'Add a research opportunity for students and researchers.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 rounded-xl text-[#5F6B63] hover:bg-white hover:text-[#2E7D32] transition"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-10 space-y-6"
              >

                {/* COMPANY NAME + LOCATION */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-bold text-[#1F2933] mb-2">
                      Company Name *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) =>
                        handleChange(
                          'companyName',
                          e.target.value
                        )
                      }
                      placeholder="e.g. Al-Khair Seeds & Agritech"
                      className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1F2933] mb-2">
                      Location *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) =>
                        handleChange(
                          'location',
                          e.target.value
                        )
                      }
                      placeholder="e.g. Islamabad, Pakistan"
                      className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    />
                  </div>

                </div>

                {/* INDUSTRY */}

                <div>
                  <label className="block text-sm font-bold text-[#1F2933] mb-2">
                    Industry *
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) =>
                      handleChange(
                        'industry',
                        e.target.value
                      )
                    }
                    placeholder="e.g. Agricultural Technology, Irrigation, Crop Science"
                    className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  />
                </div>

                {/* RESEARCH TOPIC */}

                <div>
                  <label className="block text-sm font-bold text-[#1F2933] mb-2">
                    Research Topic *
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.researchTopic}
                    onChange={(e) =>
                      handleChange(
                        'researchTopic',
                        e.target.value
                      )
                    }
                    placeholder="e.g. Smart Irrigation Systems"
                    className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  />
                </div>

                {/* RESEARCH DESCRIPTION */}

                <div>
                  <label className="block text-sm font-bold text-[#1F2933] mb-2">
                    Research Description *
                  </label>

                  <textarea
                    required
                    rows={5}
                    value={formData.researchDescription}
                    onChange={(e) =>
                      handleChange(
                        'researchDescription',
                        e.target.value
                      )
                    }
                    placeholder="Describe the research problem, objectives, required work, and what the student/researcher will work on..."
                    className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  />
                </div>

                {/* COMPANY DESCRIPTION */}

                <div>
                  <label className="block text-sm font-bold text-[#1F2933] mb-2">
                    Company Description *
                  </label>

                  <textarea
                    required
                    rows={4}
                    value={formData.companyDescription}
                    onChange={(e) =>
                      handleChange(
                        'companyDescription',
                        e.target.value
                      )
                    }
                    placeholder="Briefly describe your company, products, services, and work..."
                    className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  />
                </div>

                {/* RESEARCH OFFER */}

                <div>
                  <label className="block text-sm font-bold text-[#1F2933] mb-2">
                    Research Offer *
                  </label>

                  <select
                    required
                    value={formData.researchOffer}
                    onChange={(e) =>
                      handleChange(
                        'researchOffer',
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  >
                    <option value="free">
                      Free
                    </option>

                    <option value="stipend">
                      Stipend
                    </option>

                    <option value="both">
                      Both
                    </option>
                  </select>
                </div>

                {/* WORK EMAIL */}

                <div>
                  <label className="block text-sm font-bold text-[#1F2933] mb-2">
                    Work Email *
                  </label>

                  <input
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) =>
                      handleChange(
                        'workEmail',
                        e.target.value
                      )
                    }
                    placeholder="Enter your work email"
                    className="w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  />

                  <p className="text-xs text-[#5F6B63] mt-2">
                    Students and researchers will use this email to contact the company.
                  </p>
                </div>

                {/* BUTTONS */}

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-[#DDE8DD]">

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl border border-[#DDE8DD] bg-white text-[#5F6B63] font-bold text-sm hover:bg-[#F8FAF7] transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Save className="w-4 h-4" />

                    {editingProfileId
                      ? 'Update Profile'
                      : 'Save Profile'}
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

        {/* ======================================================
            PROFILE LIST
        ====================================================== */}

        {!showForm && (
          <div className="max-w-5xl mx-auto mt-8">

            {/* NEW PROFILE BUTTON */}

            <div className="flex justify-end mb-6">

              <button
                type="button"
                onClick={handleNewProfile}
                className="px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                New Research Profile
              </button>

            </div>

            {/* LOADING */}

            {loading && (
              <div className="bg-white rounded-3xl border border-[#DDE8DD] shadow-lg p-10 text-center">
                <p className="text-sm font-semibold text-[#5F6B63]">
                  Loading your research profiles...
                </p>
              </div>
            )}

            {/* EMPTY STATE */}

            {!loading && profiles.length === 0 && (
              <div className="bg-white rounded-3xl border border-[#DDE8DD] shadow-lg p-10 sm:p-14 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E8F5E9] flex items-center justify-center mb-5">
                  <FlaskConical className="w-8 h-8 text-[#2E7D32]" />
                </div>

                <h2 className="text-xl font-extrabold text-[#1F2933]">
                  No Research Profiles Yet
                </h2>

                <p className="text-sm text-[#5F6B63] mt-2 max-w-md mx-auto">
                  Create your first research profile to connect your company with students and agricultural researchers.
                </p>

                <button
                  type="button"
                  onClick={handleNewProfile}
                  className="mt-6 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create First Research Profile
                </button>

              </div>
            )}

            {/* PROFILE CARDS */}

            {!loading && profiles.length > 0 && (
              <div className="space-y-6">

                {profiles.map((profile) => (
                  <div
                    key={profile.profileId}
                    className="bg-white rounded-3xl border border-[#DDE8DD] shadow-lg overflow-hidden"
                  >

                    {/* CARD HEADER */}

                    <div className="px-6 sm:px-8 py-6 bg-[#E8F5E9] border-b border-[#DDE8DD]">

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FlaskConical className="w-5 h-5 text-[#2E7D32]" />

                            <span className="text-xs font-extrabold uppercase tracking-wide text-[#2E7D32]">
                              Research Profile
                            </span>
                          </div>

                          <h2 className="text-2xl font-extrabold text-[#1F2933]">
                            {profile.researchTopic}
                          </h2>

                          <p className="text-sm font-semibold text-[#5F6B63] mt-1">
                            {profile.companyName}
                          </p>
                        </div>

                        {/* ACTIONS */}

                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() => handleEdit(profile)}
                            className="px-4 py-2 rounded-xl border border-[#DDE8DD] bg-white text-[#2E7D32] font-bold text-sm flex items-center gap-2 hover:bg-[#F8FAF7] transition"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId === profile.profileId
                            }
                            onClick={() =>
                              handleDelete(profile.profileId)
                            }
                            className="px-4 py-2 rounded-xl border border-red-200 bg-white text-red-600 font-bold text-sm flex items-center gap-2 hover:bg-red-50 transition disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />

                            {deletingId === profile.profileId
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* CARD BODY */}

                    <div className="p-6 sm:p-8">

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LOCATION */}

                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-[#2E7D32]" />
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase text-[#5F6B63]">
                              Location
                            </p>

                            <p className="text-sm font-bold text-[#1F2933] mt-1">
                              {profile.location}
                            </p>
                          </div>
                        </div>

                        {/* INDUSTRY */}

                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-[#2E7D32]" />
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase text-[#5F6B63]">
                              Industry
                            </p>

                            <p className="text-sm font-bold text-[#1F2933] mt-1">
                              {profile.industry}
                            </p>
                          </div>
                        </div>

                        {/* OFFER */}

                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                            <FlaskConical className="w-5 h-5 text-[#2E7D32]" />
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase text-[#5F6B63]">
                              Research Offer
                            </p>

                            <p className="text-sm font-bold text-[#1F2933] mt-1">
                              {getOfferLabel(
                                profile.researchOffer
                              )}
                            </p>
                          </div>
                        </div>

                        {/* EMAIL */}

                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-[#2E7D32]" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase text-[#5F6B63]">
                              Work Email
                            </p>

                            <p className="text-sm font-bold text-[#1F2933] mt-1 break-all">
                              {profile.workEmail}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* RESEARCH DESCRIPTION */}

                      <div className="mt-7 pt-6 border-t border-[#DDE8DD]">

                        <h3 className="text-sm font-extrabold text-[#1F2933] mb-2">
                          Research Description
                        </h3>

                        <p className="text-sm leading-6 text-[#5F6B63] whitespace-pre-line">
                          {profile.researchDescription}
                        </p>

                      </div>

                      {/* COMPANY DESCRIPTION */}

                      <div className="mt-6">

                        <h3 className="text-sm font-extrabold text-[#1F2933] mb-2">
                          Company Description
                        </h3>

                        <p className="text-sm leading-6 text-[#5F6B63] whitespace-pre-line">
                          {profile.companyDescription}
                        </p>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};