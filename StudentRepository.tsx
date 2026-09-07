import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  GraduationCap,
  ArrowLeft,
  User,
  Check,
  Save,
  Mail
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import {
  getStudents,
  saveStudentProfile,
  ResearchStudent,
  FundingOption
} from '../../services/researchApi';

const RESEARCH_NICHES = [
  'AI & Data Science',
  'Crop Genetics',
  'Plant Pathology',
  'Precision Agriculture',
  'Irrigation & Water',
  'Soil Science',
  'Agri Robotics',
  'Post-Harvest Technology',
  'Food Technology',
  'Climate & Environment',
  'Seeds & Crop Improvement',
  'Pest & Disease Management'
];

export const StudentRepository: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [students, setStudents] = useState<ResearchStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditingMyProfile, setIsEditingMyProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // STUDENT PROFILE FORM
  // ============================================================

  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [semester, setSemester] = useState('');

  const [researchArea, setResearchArea] = useState('');
  const [researchTopic, setResearchTopic] = useState('');
  const [projectTitle, setProjectTitle] = useState('');

  const [researchKeywords, setResearchKeywords] = useState('');
  const [researchNiche, setResearchNiche] = useState('');
  const [customResearchNiche, setCustomResearchNiche] = useState('');

  const [skills, setSkills] = useState('');
  const [researchInterests, setResearchInterests] = useState('');

  const [fundingPreference, setFundingPreference] =
    useState<'free' | 'stipend' | 'either'>('either');

  const [description, setDescription] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // ============================================================
  // LOAD STUDENTS FROM MONGODB
  // ============================================================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const results = await getStudents({
        keywords: [],
        funding: 'either',
        specific: '',
        topic: '',
        keyword: '',
        researchTopic: ''
      });

      setStudents(results);
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD CURRENT STUDENT PROFILE
  // ============================================================

  const loadMyProfile = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${user.userId}`
      );

      if (!response.ok) {
        return;
      }

      const profile = await response.json();

      if (!profile) return;

      setUniversity(profile.university || '');
      setDegree(profile.degree || '');
      setSemester(profile.semester || '');

      setResearchArea(profile.researchArea || '');
      setResearchTopic(profile.researchTopic || '');
      setProjectTitle(profile.projectTitle || '');

      setResearchKeywords(
        Array.isArray(profile.researchKeywords)
          ? profile.researchKeywords.join(', ')
          : ''
      );

      setResearchNiche(
        Array.isArray(profile.researchNiches) &&
        profile.researchNiches.length > 0
          ? profile.researchNiches[0]
          : ''
      );

      setCustomResearchNiche(profile.customResearchNiche || '');

      setSkills(
        Array.isArray(profile.skills)
          ? profile.skills.join(', ')
          : ''
      );

      setResearchInterests(
        Array.isArray(profile.researchInterests)
          ? profile.researchInterests.join(', ')
          : profile.researchInterests || ''
      );

      setFundingPreference(
        profile.fundingPreference || 'either'
      );

      setDescription(
        profile.description ||
        profile.bio ||
        ''
      );

      setPortfolioUrl(
        profile.portfolioUrl || ''
      );
    } catch (error) {
      console.error('Failed to load my student profile:', error);
    }
  };

  // Companies only browse/contact researchers here — they do not
  // have (or need) a student research profile of their own.
  const isCompanyViewer = user?.role === 'company';

  useEffect(() => {
    loadStudents();

    if (!isCompanyViewer) {
      loadMyProfile();
    }
  }, [user]);

  // ============================================================
  // CONTACT VIA GMAIL
  // ============================================================

  const openGmailCompose = (email?: string | null) => {
    if (!email || !email.trim()) {
      alert('This researcher has not provided a contact email yet.');
      return;
    }

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email.trim()
    )}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // ============================================================
  // SAVE STUDENT PROFILE TO MONGODB
  // ============================================================

  const handleSaveProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) return;

    try {
      setLoading(true);

      const selectedNiche =
        researchNiche === 'Custom'
          ? customResearchNiche.trim()
          : researchNiche.trim();

      const updatedProfile: ResearchStudent = {
        userId: user.userId,

        name: user.name,
        email: user.email,

        university: university.trim(),
        degree: degree.trim(),
        semester: semester.trim(),

        researchArea: researchArea.trim(),
        researchTopic: researchTopic.trim(),
        projectTitle: projectTitle.trim(),

        researchKeywords: researchKeywords
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),

        researchNiches: selectedNiche
          ? [selectedNiche]
          : [],

        customResearchNiche:
          researchNiche === 'Custom'
            ? customResearchNiche.trim()
            : '',

        skills: skills
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),

        researchInterests: researchInterests.trim(),

        fundingPreference,

        description: description.trim(),

        bio: description.trim(),

        portfolioUrl: portfolioUrl.trim(),

        availableForCollaboration: true,

        updatedAt: new Date().toISOString()
      };

      await saveStudentProfile(updatedProfile);

      setIsEditingMyProfile(false);
      setSaveSuccess(true);

      await loadStudents();

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save student profile:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to save research profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOCAL SEARCH
  // ============================================================

  const filtered = students.filter((student) => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return true;

    const searchableText = [
      student.name,
      student.university,
      student.degree,
      student.researchArea,
      student.researchTopic,
      student.projectTitle,
      student.researchInterests,
      student.description,
      student.bio,
      ...(student.skills || []),
      ...(student.researchKeywords || []),
      ...(student.researchNiches || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(term);
  });

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">

        <button
          type="button"
          onClick={() => navigate('/student-research/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          📚 {t.studentRepository}
        </h1>

        {isCompanyViewer ? (
          <div className="w-[1px]" />
        ) : (
          <button
            type="button"
            onClick={() =>
              setIsEditingMyProfile(!isEditingMyProfile)
            }
            className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />

            <span>
              {isEditingMyProfile
                ? t.cancel
                : t.editResearchProfile}
            </span>
          </button>
        )}

      </div>

      {/* Success */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] text-[#2E7D32] font-bold text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>
            Research profile saved successfully!
          </span>
        </div>
      )}

      {/* ========================================================
          EDIT PROFILE
      ======================================================== */}

      {isEditingMyProfile && !isCompanyViewer && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-[#4CAF50] bg-white space-y-4 shadow-xl">

          <h3 className="text-lg font-extrabold text-[#1F2933]">
            {t.createResearchProfile} / {t.editResearchProfile}
          </h3>

          <form
            onSubmit={handleSaveProfile}
            className="space-y-4"
          >

            {/* Academic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  {t.university}
                </label>

                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) =>
                    setUniversity(e.target.value)
                  }
                  placeholder="e.g. University of Agriculture Faisalabad"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Degree
                </label>

                <input
                  type="text"
                  value={degree}
                  onChange={(e) =>
                    setDegree(e.target.value)
                  }
                  placeholder="e.g. BS Computer Science"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Semester
                </label>

                <input
                  type="text"
                  value={semester}
                  onChange={(e) =>
                    setSemester(e.target.value)
                  }
                  placeholder="e.g. 6th"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

            </div>

            {/* Research Area + Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Research Area
                </label>

                <input
                  type="text"
                  required
                  value={researchArea}
                  onChange={(e) =>
                    setResearchArea(e.target.value)
                  }
                  placeholder="e.g. AI & Data Science"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Research Topic
                </label>

                <input
                  type="text"
                  required
                  value={researchTopic}
                  onChange={(e) =>
                    setResearchTopic(e.target.value)
                  }
                  placeholder="e.g. How AI works in agriculture"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

            </div>

            {/* Project */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.projectTitle}
              </label>

              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) =>
                  setProjectTitle(e.target.value)
                }
                placeholder="e.g. AI-based crop disease detection"
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Research Keywords */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                Research Keywords
              </label>

              <input
                type="text"
                required
                value={researchKeywords}
                onChange={(e) =>
                  setResearchKeywords(e.target.value)
                }
                placeholder="e.g. Artificial Intelligence, Machine Learning, Computer Vision"
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />

              <p className="text-[11px] text-[#5F6B63] mt-1">
                Separate multiple keywords with commas.
              </p>
            </div>

            {/* Research Niche */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Research Niche
                </label>

                <select
                  value={researchNiche}
                  onChange={(e) =>
                    setResearchNiche(e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#2E7D32]"
                >
                  <option value="">
                    Select research niche
                  </option>

                  {RESEARCH_NICHES.map((niche) => (
                    <option
                      key={niche}
                      value={niche}
                    >
                      {niche}
                    </option>
                  ))}

                  <option value="Custom">
                    Custom
                  </option>
                </select>
              </div>

              {researchNiche === 'Custom' && (
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                    Custom Research Niche
                  </label>

                  <input
                    type="text"
                    required
                    value={customResearchNiche}
                    onChange={(e) =>
                      setCustomResearchNiche(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Agricultural AI Robotics"
                    className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              )}

            </div>

            {/* Skills + Interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Skills
                </label>

                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) =>
                    setSkills(e.target.value)
                  }
                  placeholder="e.g. Python, MongoDB, Computer Vision"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Research Interests
                </label>

                <input
                  type="text"
                  required
                  value={researchInterests}
                  onChange={(e) =>
                    setResearchInterests(e.target.value)
                  }
                  placeholder="e.g. Machine Learning, Smart Farming"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

            </div>

            {/* Funding */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                Funding Preference
              </label>

              <select
                value={fundingPreference}
                onChange={(e) =>
                  setFundingPreference(
                    e.target.value as
                      | 'free'
                      | 'stipend'
                      | 'either'
                  )
                }
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#2E7D32]"
              >
                <option value="either">
                  Either Free or Stipend
                </option>

                <option value="free">
                  Free / Unpaid Research
                </option>

                <option value="stipend">
                  Stipend Required
                </option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                Brief Bio / Research Abstract
              </label>

              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe your research focus, experience and academic interests..."
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                Portfolio URL
              </label>

              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) =>
                  setPortfolioUrl(e.target.value)
                }
                placeholder="https://github.com/yourusername"
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() =>
                  setIsEditingMyProfile(false)
                }
                className="px-5 py-2 rounded-xl border border-[#DDE8DD] text-sm text-[#5F6B63]"
              >
                {t.cancel}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] disabled:opacity-60 text-white font-bold text-sm flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />

                <span>
                  {loading
                    ? 'Saving...'
                    : t.save}
                </span>
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ========================================================
          SEARCH
      ======================================================== */}

      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1">

          <Search className="w-4 h-4 text-[#5F6B63] absolute left-3.5 top-3.5" />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search by researcher name, topic, project, university..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDE8DD] rounded-2xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
          />

        </div>

      </div>

      {/* ========================================================
          RESULTS
      ======================================================== */}

      {loading && students.length === 0 ? (
        <div className="text-center py-10 text-sm font-semibold text-[#5F6B63]">
          Loading researchers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-sm text-[#5F6B63]">
          No researchers found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {filtered.map((student) => (

            <div
              key={student.userId}
              className="glass-card rounded-3xl p-6 border border-[#DDE8DD] hover:border-[#4CAF50] bg-white shadow-sm space-y-4 transition-all"
            >

              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DDE8DD]">

                <div className="space-y-1">

                  {student.researchArea && (
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                      {student.researchArea}
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-[#1F2933]">
                    {student.name || 'Researcher'}
                  </h3>

                  {student.university && (
                    <p className="text-xs text-[#5F6B63] flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>
                        {student.university}
                      </span>
                    </p>
                  )}

                  {isCompanyViewer && student.email && (
                    <p className="text-xs text-[#5F6B63] flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>
                        {student.email}
                      </span>
                    </p>
                  )}

                </div>

                {isCompanyViewer && (
                  <button
                    type="button"
                    onClick={() =>
                      openGmailCompose(student.email)
                    }
                    disabled={!student.email}
                    title={
                      student.email
                        ? `Email ${student.name || 'this researcher'}`
                        : 'No contact email on file'
                    }
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </button>
                )}

              </div>

              <div className="space-y-2 text-xs">

                {student.researchTopic && (
                  <div>
                    <span className="font-bold text-[#1F2933]">
                      Research Topic:{' '}
                    </span>

                    <span className="text-[#5F6B63]">
                      {student.researchTopic}
                    </span>
                  </div>
                )}

                {student.projectTitle && (
                  <div>
                    <span className="font-bold text-[#1F2933]">
                      Project:{' '}
                    </span>

                    <span className="text-[#5F6B63]">
                      {student.projectTitle}
                    </span>
                  </div>
                )}

                {student.description && (
                  <p className="text-[#5F6B63] line-clamp-2 leading-relaxed">
                    {student.description}
                  </p>
                )}

              </div>

              {(student.researchKeywords?.length ||
                student.skills?.length ||
                student.researchNiches?.length) ? (

                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-[#DDE8DD]">

                  {student.researchNiches?.map(
                    (niche, index) => (
                      <span
                        key={`niche-${index}`}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E8F5E9] border border-[#DDE8DD] text-[#2E7D32] font-semibold"
                      >
                        {niche}
                      </span>
                    )
                  )}

                  {student.researchKeywords?.map(
                    (keyword, index) => (
                      <span
                        key={`keyword-${index}`}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] font-medium"
                      >
                        {keyword}
                      </span>
                    )
                  )}

                  {student.skills?.map(
                    (skill, index) => (
                      <span
                        key={`skill-${index}`}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] font-medium"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              ) : null}

            </div>

          ))}

        </div>
      )}

    </div>
  );
};
