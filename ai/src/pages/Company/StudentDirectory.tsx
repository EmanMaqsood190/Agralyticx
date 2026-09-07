import React, { useMemo, useState } from 'react';

import {
  Search,
  GraduationCap,
  ArrowLeft,
  MessageSquare,
  Mail,
  X,
  MapPin,
  Briefcase,
  FlaskConical
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AudioButton } from '../../components/common/AudioButton';

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

type FundingOption =
  | 'either'
  | 'free'
  | 'stipend'
  | 'both';

interface DummyStudent {
  userId: string;
  name: string;
  university: string;
  degree: string;
  semester: string;
  city: string;

  researchArea: string;
  researchTopic: string;
  projectTitle: string;

  researchKeywords: string[];
  skills: string[];

  description: string;

  fundingPreference:
    | 'free'
    | 'stipend'
    | 'either';

  email: string;

  matchScore: number;
}

const DUMMY_STUDENTS: DummyStudent[] = [
  {
    userId: 'student-001',
    name: 'Ayesha Khan',
    university: 'National University of Sciences and Technology',
    degree: 'BS Computer Science',
    semester: '7th Semester',
    city: 'Islamabad',

    researchArea: 'AI & Data Science',
    researchTopic:
      'Application of Artificial Intelligence and Machine Learning in Agriculture',
    projectTitle:
      'AI-Based Crop Disease Detection System',

    researchKeywords: [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Science',
      'Computer Vision'
    ],

    skills: [
      'Python',
      'Machine Learning',
      'TensorFlow',
      'Data Analysis'
    ],

    description:
      'Interested in applying AI and machine learning techniques to agricultural problems, crop monitoring and disease detection.',

    fundingPreference: 'stipend',

    email: 'ayesha.research@example.com',

    matchScore: 94
  },

  {
    userId: 'student-002',
    name: 'Muhammad Hamza',
    university: 'COMSATS University Islamabad',
    degree: 'BS Artificial Intelligence',
    semester: '6th Semester',
    city: 'Islamabad',

    researchArea: 'AI & Data Science',
    researchTopic:
      'Why Artificial Intelligence Models Work for Agricultural Prediction',
    projectTitle:
      'Machine Learning Based Crop Yield Prediction',

    researchKeywords: [
      'AI',
      'Artificial Intelligence',
      'Machine Learning',
      'Predictive Analytics'
    ],

    skills: [
      'Python',
      'Scikit-learn',
      'Data Analytics',
      'ML'
    ],

    description:
      'Working on machine learning models for agricultural prediction and intelligent decision-support systems.',

    fundingPreference: 'either',

    email: 'hamza.research@example.com',

    matchScore: 91
  },

  {
    userId: 'student-003',
    name: 'Fatima Noor',
    university: 'University of Agriculture Faisalabad',
    degree: 'BS Agricultural Sciences',
    semester: '8th Semester',
    city: 'Faisalabad',

    researchArea: 'Plant Pathology',
    researchTopic:
      'Early Detection of Crop Diseases Using Computer Vision',
    projectTitle:
      'Computer Vision for Plant Disease Identification',

    researchKeywords: [
      'Plant Disease',
      'Computer Vision',
      'Crop Health',
      'AI'
    ],

    skills: [
      'Python',
      'Image Processing',
      'Plant Pathology',
      'Research'
    ],

    description:
      'Interested in combining agricultural science with computer vision for early identification of plant diseases.',

    fundingPreference: 'free',

    email: 'fatima.research@example.com',

    matchScore: 78
  },

  {
    userId: 'student-004',
    name: 'Ali Raza',
    university: 'University of Engineering and Technology Lahore',
    degree: 'BS Computer Engineering',
    semester: '7th Semester',
    city: 'Lahore',

    researchArea: 'Precision Agriculture',
    researchTopic:
      'IoT and Smart Sensors for Precision Farming',
    projectTitle:
      'IoT-Based Smart Irrigation System',

    researchKeywords: [
      'IoT',
      'Smart Agriculture',
      'Precision Farming',
      'Sensors'
    ],

    skills: [
      'Arduino',
      'IoT',
      'Embedded Systems',
      'Python'
    ],

    description:
      'Interested in smart agriculture, IoT systems, precision farming and intelligent irrigation solutions.',

    fundingPreference: 'stipend',

    email: 'ali.research@example.com',

    matchScore: 71
  }
];

export const StudentDirectory: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [funding, setFunding] =
    useState<FundingOption>('either');

  const [niche, setNiche] =
    useState('');

  const [customNiche, setCustomNiche] =
    useState('');

  const [keyword, setKeyword] =
    useState('');

  const [researchTopic, setResearchTopic] =
    useState('');

  const [students, setStudents] =
    useState<DummyStudent[]>([]);

  const [hasSearched, setHasSearched] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<DummyStudent | null>(null);

  const [messageText, setMessageText] =
    useState('');

  const [messageStatus, setMessageStatus] =
    useState('');

  // ============================================================
  // UI-ONLY SEARCH
  // ============================================================

  const searchStudents = () => {
    const selectedTopic =
      niche === 'Custom'
        ? customNiche.trim()
        : niche.trim();

    const selectedKeyword =
      keyword.trim().toLowerCase();

    const selectedResearchTopic =
      researchTopic.trim().toLowerCase();

    const filtered =
      DUMMY_STUDENTS.filter(
        (student) => {
          const topicMatch =
            !selectedTopic ||
            student.researchArea
              .toLowerCase()
              .includes(
                selectedTopic.toLowerCase()
              );

          const keywordMatch =
            !selectedKeyword ||
            student.researchKeywords.some(
              (item) =>
                item
                  .toLowerCase()
                  .includes(
                    selectedKeyword
                  )
            ) ||
            student.skills.some(
              (item) =>
                item
                  .toLowerCase()
                  .includes(
                    selectedKeyword
                  )
            ) ||
            student.researchTopic
              .toLowerCase()
              .includes(
                selectedKeyword
              );

          const researchTopicMatch =
            !selectedResearchTopic ||
            student.researchTopic
              .toLowerCase()
              .includes(
                selectedResearchTopic
              ) ||
            student.projectTitle
              .toLowerCase()
              .includes(
                selectedResearchTopic
              );

          const fundingMatch =
            funding === 'either' ||
            funding === 'both' ||
            student.fundingPreference ===
              'either' ||
            student.fundingPreference ===
              funding;

          return (
            topicMatch &&
            keywordMatch &&
            researchTopicMatch &&
            fundingMatch
          );
        }
      );

    setStudents(filtered);
    setHasSearched(true);
  };

  // ============================================================
  // RESET SEARCH
  // ============================================================

  const resetSearch = () => {
    setNiche('');
    setCustomNiche('');
    setKeyword('');
    setResearchTopic('');
    setFunding('either');
    setStudents([]);
    setHasSearched(false);
  };

  // ============================================================
  // CONTACT
  // UI ONLY
  // ============================================================

  const sendMessage = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!messageText.trim()) {
      return;
    }

    setMessageStatus(
      'Research proposal ready to send.'
    );

    setMessageText('');
  };

  // ============================================================
  // SEARCH SUMMARY
  // ============================================================

  const searchSummary = useMemo(() => {
    const values: string[] = [];

    if (niche === 'Custom' && customNiche.trim()) {
      values.push(customNiche.trim());
    } else if (niche) {
      values.push(niche);
    }

    if (keyword.trim()) {
      values.push(keyword.trim());
    }

    if (researchTopic.trim()) {
      values.push(researchTopic.trim());
    }

    return values;
  }, [
    niche,
    customNiche,
    keyword,
    researchTopic
  ]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8FAF7]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between pb-5 border-b border-[#DDE8DD]">

          <button
            type="button"
            onClick={() =>
              navigate('/company/dashboard')
            }
            className="flex items-center gap-2 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />

            <span>
              {t.back}
            </span>
          </button>

          <div className="text-center">

            <div className="flex items-center justify-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#2E7D32]" />
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
                Find Researchers
              </h1>

            </div>

            <p className="hidden sm:block text-xs text-[#5F6B63] mt-1">
              Discover students for research collaboration
            </p>

          </div>

          <AudioButton
            text="Find university students and researchers whose research matches your company's needs."
            size="sm"
          />

        </div>

        {/* ======================================================
            INTRO
        ====================================================== */}

        <div className="mt-6">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2933]">
            Find Research Talent
          </h2>

          <p className="text-sm text-[#5F6B63] mt-1">
            Search for students based on their research area,
            keywords, topic and funding preference.
          </p>

        </div>

        {/* ======================================================
            SEARCH CARD
        ====================================================== */}

        <div className="mt-6 bg-white rounded-3xl border border-[#DDE8DD] shadow-sm p-5 sm:p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

            {/* FUNDING */}

            <div>

              <label className="block text-xs font-bold text-[#5F6B63] mb-2">
                Funding
              </label>

              <select
                value={funding}
                onChange={(e) =>
                  setFunding(
                    e.target.value as FundingOption
                  )
                }
                className="w-full px-4 py-3 bg-[#F8FAF7] border border-[#DDE8DD] rounded-2xl text-sm font-semibold outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20"
              >
                <option value="either">
                  Any funding
                </option>

                <option value="free">
                  Free / Unpaid
                </option>

                <option value="stipend">
                  Stipend
                </option>

                <option value="both">
                  Both
                </option>
              </select>

            </div>

            {/* RESEARCH AREA */}

            <div>

              <label className="block text-xs font-bold text-[#5F6B63] mb-2">
                Research Area
              </label>

              <select
                value={niche}
                onChange={(e) =>
                  setNiche(e.target.value)
                }
                className="w-full px-4 py-3 bg-[#F8FAF7] border border-[#DDE8DD] rounded-2xl text-sm font-semibold outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20"
              >
                <option value="">
                  Any research area
                </option>

                {RESEARCH_NICHES.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

                <option value="Custom">
                  Custom
                </option>

              </select>

            </div>

            {/* CUSTOM AREA */}

            {niche === 'Custom' ? (

              <div>

                <label className="block text-xs font-bold text-[#5F6B63] mb-2">
                  Custom Area
                </label>

                <input
                  value={customNiche}
                  onChange={(e) =>
                    setCustomNiche(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Agri AI"
                  className="w-full px-4 py-3 bg-[#F8FAF7] border border-[#DDE8DD] rounded-2xl text-sm outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20"
                />

              </div>

            ) : (

              <div>

                <label className="block text-xs font-bold text-[#5F6B63] mb-2">
                  Keyword
                </label>

                <input
                  value={keyword}
                  onChange={(e) =>
                    setKeyword(
                      e.target.value
                    )
                  }
                  placeholder="e.g. AI"
                  className="w-full px-4 py-3 bg-[#F8FAF7] border border-[#DDE8DD] rounded-2xl text-sm outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20"
                />

              </div>
            )}

            {/* KEYWORD WHEN CUSTOM */}

            {niche === 'Custom' && (

              <div>

                <label className="block text-xs font-bold text-[#5F6B63] mb-2">
                  Keyword
                </label>

                <input
                  value={keyword}
                  onChange={(e) =>
                    setKeyword(
                      e.target.value
                    )
                  }
                  placeholder="e.g. AI"
                  className="w-full px-4 py-3 bg-[#F8FAF7] border border-[#DDE8DD] rounded-2xl text-sm outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20"
                />

              </div>
            )}

            {/* RESEARCH TOPIC */}

            <div>

              <label className="block text-xs font-bold text-[#5F6B63] mb-2">
                Research Topic
              </label>

              <input
                value={researchTopic}
                onChange={(e) =>
                  setResearchTopic(
                    e.target.value
                  )
                }
                placeholder="e.g. How AI works"
                className="w-full px-4 py-3 bg-[#F8FAF7] border border-[#DDE8DD] rounded-2xl text-sm outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20"
              />

            </div>

          </div>

          {/* SEARCH BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3 mt-5">

            <button
              type="button"
              onClick={searchStudents}
              className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-[#2E7D32] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#256628] transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />

              Search Researchers
            </button>

            <button
              type="button"
              onClick={resetSearch}
              className="px-6 py-3.5 rounded-2xl border border-[#DDE8DD] bg-white text-[#5F6B63] font-bold text-sm hover:border-[#4CAF50] hover:text-[#2E7D32] transition-colors"
            >
              Clear
            </button>

          </div>

        </div>

        {/* ======================================================
            SEARCH SUMMARY
        ====================================================== */}

        {hasSearched &&
          searchSummary.length > 0 && (

          <div className="mt-5 flex flex-wrap items-center gap-2">

            <span className="text-xs font-bold text-[#5F6B63]">
              Searching for:
            </span>

            {searchSummary.map(
              (item) => (

                <span
                  key={item}
                  className="px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold"
                >
                  {item}
                </span>

              )
            )}

          </div>

        )}

        {/* ======================================================
            INITIAL STATE
        ====================================================== */}

        {!hasSearched && (

          <div className="mt-6 bg-white rounded-3xl border border-[#DDE8DD] py-16 px-6 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E8F5E9] flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-[#2E7D32]" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#1F2933]">
              Find the right researcher
            </h3>

            <p className="max-w-md mx-auto mt-2 text-sm text-[#5F6B63]">
              Select your company's research requirements
              above to discover students and researchers
              who could be a good fit.
            </p>

          </div>

        )}

        {/* ======================================================
            NO RESULTS
        ====================================================== */}

        {hasSearched &&
          students.length === 0 && (

          <div className="mt-6 bg-white rounded-3xl border border-[#DDE8DD] py-16 px-6 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F8FAF7] flex items-center justify-center">
              <Search className="w-7 h-7 text-[#5F6B63]" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#1F2933]">
              No matching researchers found
            </h3>

            <p className="max-w-md mx-auto mt-2 text-sm text-[#5F6B63]">
              Try a broader research area, keyword or
              research topic.
            </p>

          </div>

        )}

        {/* ======================================================
            RESULTS
        ====================================================== */}

        {hasSearched &&
          students.length > 0 && (

          <div className="mt-6 space-y-4">

            {/* RESULTS HEADER */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

              <div>

                <h3 className="text-lg font-extrabold text-[#1F2933]">
                  Matching Researchers
                </h3>

                <p className="text-xs text-[#5F6B63] mt-1">
                  {students.length} researcher
                  {students.length !== 1
                    ? 's'
                    : ''}{' '}
                  found
                </p>

              </div>

              <div className="text-xs font-semibold text-[#5F6B63]">
                Ranked by research compatibility
              </div>

            </div>

            {/* STUDENT CARDS */}

            {students.map(
              (student) => (

                <div
                  key={student.userId}
                  className="bg-white rounded-3xl border border-[#DDE8DD] p-5 sm:p-6 hover:border-[#4CAF50] hover:shadow-md transition-all"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    {/* LEFT */}

                    <div className="flex gap-4">

                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#E8F5E9] flex items-center justify-center">
                        <GraduationCap className="w-7 h-7 text-[#2E7D32]" />
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-extrabold uppercase">
                            {student.researchArea}
                          </span>

                          <span className="px-2.5 py-1 rounded-full bg-[#F4C95D]/20 text-[#8A6500] text-[10px] font-extrabold">
                            {student.matchScore}% Match
                          </span>

                        </div>

                        <h3 className="mt-2 text-xl font-extrabold text-[#1F2933]">
                          {student.name}
                        </h3>

                        <p className="text-sm font-semibold text-[#5F6B63] mt-1">
                          {student.degree}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">

                          <span className="text-xs text-[#5F6B63] flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-[#2E7D32]" />
                            {student.university}
                          </span>

                          <span className="text-xs text-[#5F6B63] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                            {student.city}
                          </span>

                          <span className="text-xs text-[#5F6B63] flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-[#2E7D32]" />
                            {student.semester}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-2 lg:shrink-0">

                      <a
                        href={`mailto:${student.email}`}
                        className="flex-1 lg:flex-none px-4 py-2.5 rounded-2xl border border-[#DDE8DD] text-[#2E7D32] font-bold text-sm flex items-center justify-center gap-2 hover:border-[#4CAF50] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStudent(
                            student
                          )
                        }
                        className="flex-1 lg:flex-none px-5 py-2.5 rounded-2xl bg-[#2E7D32] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#256628] transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Contact
                      </button>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-5 pt-5 border-t border-[#DDE8DD] grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* RESEARCH TOPIC */}

                    <div>

                      <div className="flex items-center gap-2">

                        <FlaskConical className="w-4 h-4 text-[#2E7D32]" />

                        <span className="text-xs font-extrabold uppercase text-[#1F2933]">
                          Research Topic
                        </span>

                      </div>

                      <p className="text-sm text-[#5F6B63] mt-2 leading-relaxed">
                        {student.researchTopic}
                      </p>

                    </div>

                    {/* PROJECT */}

                    <div>

                      <div className="flex items-center gap-2">

                        <Briefcase className="w-4 h-4 text-[#2E7D32]" />

                        <span className="text-xs font-extrabold uppercase text-[#1F2933]">
                          Current Project
                        </span>

                      </div>

                      <p className="text-sm text-[#5F6B63] mt-2 leading-relaxed">
                        {student.projectTitle}
                      </p>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-5">

                    <p className="text-sm text-[#5F6B63] leading-relaxed">
                      {student.description}
                    </p>

                  </div>

                  {/* KEYWORDS + SKILLS */}

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>

                      <span className="text-xs font-extrabold uppercase text-[#1F2933]">
                        Research Keywords
                      </span>

                      <div className="flex flex-wrap gap-2 mt-2">

                        {student.researchKeywords.map(
                          (item) => (

                            <span
                              key={item}
                              className="px-2.5 py-1 rounded-full bg-[#F8FAF7] border border-[#DDE8DD] text-[#2E7D32] text-[11px] font-semibold"
                            >
                              {item}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                    <div>

                      <span className="text-xs font-extrabold uppercase text-[#1F2933]">
                        Skills
                      </span>

                      <div className="flex flex-wrap gap-2 mt-2">

                        {student.skills.map(
                          (item) => (

                            <span
                              key={item}
                              className="px-2.5 py-1 rounded-full bg-[#F8FAF7] border border-[#DDE8DD] text-[#2E7D32] text-[11px] font-semibold"
                            >
                              {item}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                  {/* FUNDING */}

                  <div className="mt-5 pt-4 border-t border-[#DDE8DD] flex items-center justify-between">

                    <span className="text-xs font-semibold text-[#5F6B63]">
                      Funding preference
                    </span>

                    <span className="px-3 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">

                      {student.fundingPreference ===
                      'stipend'
                        ? 'Stipend'
                        : student.fundingPreference ===
                          'free'
                        ? 'Free / Unpaid'
                        : 'Either'}

                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* ========================================================
          CONTACT MODAL
      ======================================================== */}

      {selectedStudent && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}

            <div className="p-5 sm:p-6 border-b border-[#DDE8DD] flex items-start justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#2E7D32]" />
                  </div>

                  <div>

                    <h3 className="font-extrabold text-lg text-[#1F2933]">
                      Contact Researcher
                    </h3>

                    <p className="text-xs text-[#5F6B63]">
                      {selectedStudent.name}
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedStudent(null);
                  setMessageText('');
                  setMessageStatus('');
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#F8FAF7]"
              >
                <X className="w-5 h-5 text-[#5F6B63]" />
              </button>

            </div>

            {/* MODAL BODY */}

            <form
              onSubmit={sendMessage}
              className="p-5 sm:p-6"
            >

              <div className="bg-[#F8FAF7] rounded-2xl p-4 mb-5">

                <p className="text-xs text-[#5F6B63]">
                  Research topic
                </p>

                <p className="text-sm font-bold text-[#1F2933] mt-1">
                  {selectedStudent.researchTopic}
                </p>

              </div>

              <label className="block text-xs font-extrabold text-[#1F2933] mb-2">
                Your Research Proposal
              </label>

              <textarea
                required
                rows={6}
                value={messageText}
                onChange={(e) =>
                  setMessageText(
                    e.target.value
                  )
                }
                placeholder="Explain your company's research need and why you would like to collaborate..."
                className="w-full p-4 border border-[#DDE8DD] rounded-2xl text-sm outline-none resize-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20"
              />

              {messageStatus && (

                <div className="mt-3 p-3 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
                  {messageStatus}
                </div>

              )}

              <div className="flex gap-3 mt-5">

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setMessageText('');
                    setMessageStatus('');
                  }}
                  className="flex-1 px-5 py-3 rounded-2xl border border-[#DDE8DD] text-[#5F6B63] font-bold text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-5 py-3 rounded-2xl bg-[#2E7D32] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#256628]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Proposal
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};
