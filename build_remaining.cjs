const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}

// 1. Student / Researcher Dashboard
const studentDashboard = `import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  FolderGit2, 
  Building2, 
  Award, 
  BookOpen, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AudioButton } from '../../components/common/AudioButton';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const primaryActions = [
    {
      title: t.studentRepository,
      desc: 'Browse researcher projects, findings, and academic profiles across Pakistan.',
      icon: <FolderGit2 className="w-8 h-8 text-[#2E7D32]" />,
      path: '/student-research/repository',
      tag: 'Research Directory'
    },
    {
      title: t.companyDirectory,
      desc: 'Connect with agribusiness companies and discover industry challenges.',
      icon: <Building2 className="w-8 h-8 text-[#2E7D32]" />,
      path: '/student-research/companies',
      tag: 'Industry Linkages'
    },
    {
      title: t.opportunitiesAndGrants,
      desc: 'Apply for HEC/PARC research fellowships, internships, and field trial grants.',
      icon: <Award className="w-8 h-8 text-[#2E7D32]" />,
      path: '/student-research/opportunities',
      tag: 'Funding & Grants'
    },
    {
      title: t.createResearchProfile,
      desc: 'Showcase your skills, university, and agricultural research publications.',
      icon: <UserCheck className="w-8 h-8 text-[#2E7D32]" />,
      path: '/student-research/repository',
      tag: 'My Profile'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
            🎓 {t.roles.studentResearcher}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome}, <span className="text-[#2E7D32]">{user?.name}</span>
          </h1>
        </div>

        <AudioButton text={\`Welcome to the Student and Research Dashboard, \${user?.name}. Explore research repositories, agribusiness linkages, and academic grants.\`} size="md" />
      </div>

      {/* Primary Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {primaryActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className="glass-card glass-card-hover rounded-3xl p-6 border-2 border-[#DDE8DD] hover:border-[#4CAF50] bg-white flex flex-col justify-between gap-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {action.tag}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#1F2933] group-hover:text-[#2E7D32] transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-[#5F6B63] leading-relaxed">
                  {action.desc}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DDE8DD]/60 flex items-center justify-between text-sm font-bold text-[#2E7D32]">
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
`;
save('src/pages/Student/StudentDashboard.tsx', studentDashboard);

// 2. Student Repository Page (Directory of researchers + Profile Editor)
const studentRepository = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, 
  Search, 
  GraduationCap, 
  BookOpen, 
  ArrowLeft, 
  Plus, 
  User, 
  Check, 
  Mail, 
  Phone,
  Save,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../services/db';
import { StudentProfile } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const StudentRepository: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [isEditingMyProfile, setIsEditingMyProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [university, setUniversity] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [researchInterests, setResearchInterests] = useState('');
  const [description, setDescription] = useState('');

  const loadData = () => {
    const all = db.getAllStudents();
    setStudents(all);

    if (user) {
      const myProfile = all.find((s) => s.userId === user.userId);
      if (myProfile) {
        setUniversity(myProfile.university);
        setResearchArea(myProfile.researchArea);
        setProjectTitle(myProfile.projectTitle);
        setSkills(myProfile.skills.join(', '));
        setResearchInterests(myProfile.researchInterests);
        setDescription(myProfile.description);
      }
    }
  };

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('agralyticx_students', () => loadData());
    return unsub;
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updated: StudentProfile = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      university: university.trim(),
      researchArea: researchArea.trim(),
      projectTitle: projectTitle.trim(),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      researchInterests: researchInterests.trim(),
      description: description.trim(),
      availableForCollaboration: true,
      updatedAt: new Date().toISOString()
    };

    db.saveStudentProfile(updated);
    setIsEditingMyProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.researchArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDomain = selectedDomain === 'all' || s.researchArea.toLowerCase().includes(selectedDomain.toLowerCase());
    return matchSearch && matchDomain;
  });

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

        <button
          type="button"
          onClick={() => setIsEditingMyProfile(!isEditingMyProfile)}
          className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5" />
          <span>{isEditingMyProfile ? t.cancel : t.editResearchProfile}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] text-[#2E7D32] font-bold text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Research profile saved successfully!</span>
        </div>
      )}

      {/* Edit Profile Section */}
      {isEditingMyProfile && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-[#4CAF50] bg-white space-y-4 shadow-xl animate-in fade-in duration-200">
          <h3 className="text-lg font-extrabold text-[#1F2933]">
            {t.createResearchProfile} / {t.editResearchProfile}
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  {t.university}
                </label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University of Agriculture Faisalabad"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  {t.researchArea}
                </label>
                <input
                  type="text"
                  required
                  value={researchArea}
                  onChange={(e) => setResearchArea(e.target.value)}
                  placeholder="e.g. Plant Pathology, Precision Agri IoT"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.projectTitle}
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. CRISPR screening for Cotton Leaf Curl Virus resistance"
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Tissue Culture, Computer Vision, Soil Hydrology"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  {t.researchInterests}
                </label>
                <input
                  type="text"
                  required
                  value={researchInterests}
                  onChange={(e) => setResearchInterests(e.target.value)}
                  placeholder="e.g. Drought tolerance, bio-fertilizers"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                Brief Bio / Abstract
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your research focus and academic achievements..."
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingMyProfile(false)}
                className="px-5 py-2 rounded-xl border border-[#DDE8DD] text-sm text-[#5F6B63]"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{t.save}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Domain Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5F6B63] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by researcher name, project, university..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDE8DD] rounded-2xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
          />
        </div>
      </div>

      {/* Researchers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div
            key={s.userId}
            className="glass-card rounded-3xl p-6 border border-[#DDE8DD] hover:border-[#4CAF50] bg-white shadow-sm space-y-4 transition-all"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DDE8DD]">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {s.researchArea}
                </span>
                <h3 className="text-lg font-bold text-[#1F2933]">
                  {s.name}
                </h3>
                <p className="text-xs text-[#5F6B63] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{s.university}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-[#1F2933]">Project: </span>
                <span className="text-[#5F6B63]">{s.projectTitle}</span>
              </div>
              <p className="text-[#5F6B63] line-clamp-2 leading-relaxed">
                {s.description}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-1.5 border-t border-[#DDE8DD]">
              {s.skills.map((sk, i) => (
                <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`;
save('src/pages/Student/StudentRepository.tsx', studentRepository);

// 3. Company Directory for Students (Intermediate listing + Anti-Spam Inquiry Modal)
const companyDirectory = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  MapPin, 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../services/db';
import { CompanyProfile } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const CompanyDirectory: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [messageText, setMessageText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    const all = db.getAllCompanies();
    setCompanies(all);
  }, []);

  const handleOpenContact = (comp: CompanyProfile) => {
    setSelectedCompany(comp);
    setMessageText('');
    setSendSuccess(null);
    setErrorNotice(null);
    setModalOpen(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCompany || !messageText.trim()) return;

    const convId = \`conv_\${user.userId}_\${selectedCompany.userId}\`;
    const res = db.startOrSendMessage(
      convId,
      { id: user.userId, name: user.name, role: user.role },
      { id: selectedCompany.userId, name: selectedCompany.companyName, role: 'company' },
      messageText.trim()
    );

    if (res.success) {
      setSendSuccess('Inquiry sent directly to company inbox. Conversation unlocked once they reply.');
      setMessageText('');
      setTimeout(() => {
        setModalOpen(false);
      }, 2000);
    } else {
      setErrorNotice(res.error || 'Failed to send message.');
    }
  };

  const filtered = companies.filter((c) => {
    return (
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          🏢 {t.companyDirectory}
        </h1>

        <AudioButton text="Explore agribusiness companies, view their research needs, and send collaboration inquiries." size="sm" />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#5F6B63] absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search companies by name, specialization, location..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDE8DD] rounded-2xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
        />
      </div>

      {/* Companies Listing Grid */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <div
            key={c.userId}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] hover:border-[#4CAF50] bg-white shadow-sm transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDE8DD]">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {c.specialization}
                </span>
                <h3 className="text-2xl font-extrabold text-[#1F2933]">
                  {c.companyName}
                </h3>
                <p className="text-xs text-[#5F6B63] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{c.city}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenContact(c)}
                className="px-6 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 w-fit"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.contactCompany}</span>
              </button>
            </div>

            <p className="text-sm text-[#1F2933] leading-relaxed">
              {c.description}
            </p>

            {/* Current Needs & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-2">
                <span className="font-bold text-[#1F2933] uppercase">{t.agriculturalNeeds}:</span>
                <ul className="list-disc list-inside text-[#5F6B63] space-y-1">
                  {c.currentNeeds.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-2">
                <span className="font-bold text-[#1F2933] uppercase">Opportunities:</span>
                <ul className="list-disc list-inside text-[#2E7D32] font-medium space-y-1">
                  {c.opportunities.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 1-to-1 Contact Modal with Anti-Spam protection */}
      {modalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDE8DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
              <div>
                <h3 className="text-lg font-bold text-[#1F2933]">
                  {t.contactCompany}: {selectedCompany.companyName}
                </h3>
                <p className="text-xs text-[#5F6B63]">{t.antiSpamNotice}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#5F6B63] hover:text-[#1F2933]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sendSuccess && (
              <div className="p-3.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold border border-[#4CAF50]">
                ✓ {sendSuccess}
              </div>
            )}

            {errorNotice && (
              <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                {errorNotice}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                  Your Research Proposal / Inquiry Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Introduce your project, university background, and how your research addresses their agricultural needs..."
                  className="w-full p-3.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DDE8DD] text-sm text-[#5F6B63]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.send}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
`;
save('src/pages/Student/CompanyDirectory.tsx', companyDirectory);

// 4. Opportunities Page
const opportunitiesPage = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Calendar, MapPin, DollarSign, ArrowLeft, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { OpportunityItem } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const Opportunities: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const grantsList: OpportunityItem[] = [
    {
      id: 'opp_hec_2026',
      title: 'HEC-NRPU Agricultural Innovation Grant 2026',
      companyOrOrg: 'Higher Education Commission (HEC) & PARC',
      type: 'Grant',
      location: 'National (All Universities)',
      stipendOrFunding: 'Up to PKR 2,500,000 / Project',
      deadline: 'October 30, 2026',
      description: 'Funding research in climate-resilient crop genetics, bio-pesticides, and smart agricultural water sensors.',
      requirements: ['Enrolled M.Phil/Ph.D or Faculty Principal Investigator', 'Field trial site readiness in Punjab/Sindh'],
      contactEmail: 'grants@hec.gov.pk'
    },
    {
      id: 'opp_engro_fellowship',
      title: 'Engro Soil Health Research Fellowship',
      companyOrOrg: 'Engro Fertilizers Agri Division',
      type: 'Research Fellowship',
      location: 'Faisalabad / Lahore',
      stipendOrFunding: 'PKR 65,000 / Month + Field Allowance',
      deadline: 'September 15, 2026',
      description: '6-month paid fellowship working with agronomists on slow-release nitrogen coatings and saline land reclamation.',
      requirements: ['Agronomy or Soil Science student', 'Willingness to conduct field sampling in South Punjab'],
      contactEmail: 'fellowships@engrofertilizers.com'
    },
    {
      id: 'opp_fauji_internship',
      title: 'Fauji Fresh Post-Harvest Internship',
      companyOrOrg: 'Fauji Fresh n Freeze Ltd',
      type: 'Internship',
      location: 'Sahiwal Processing Facility',
      stipendOrFunding: 'PKR 40,000 / Month + Accommodation',
      deadline: 'Rolling Admission',
      description: 'Hands-on training in vegetable blast freezing, mango hot water treatment, and export quality controls.',
      requirements: ['Food Technology or Post-Harvest Agri student', 'Final year MS or BS'],
      contactEmail: 'careers@faujifresh.com'
    }
  ];

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
          🎯 {t.opportunitiesAndGrants}
        </h1>

        <AudioButton text="Browse active HEC grants, corporate fellowships, and agribusiness research internships." size="sm" />
      </div>

      <div className="space-y-4">
        {grantsList.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] hover:border-[#4CAF50] bg-white shadow-sm space-y-4 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DDE8DD]">
              <div>
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {item.type}
                </span>
                <h3 className="text-xl font-bold text-[#1F2933] mt-1">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-[#5F6B63]">
                  {item.companyOrOrg} • 📍 {item.location}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#5F6B63] block">Funding / Stipend:</span>
                <span className="text-base font-extrabold text-[#2E7D32]">{item.stipendOrFunding}</span>
              </div>
            </div>

            <p className="text-sm text-[#1F2933] leading-relaxed">
              {item.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#DDE8DD] text-xs">
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {item.deadline}</span>
              </div>

              <a
                href={\`mailto:\${item.contactEmail}?subject=Application for \${item.title}\`}
                className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-xs flex items-center gap-1.5 w-fit shadow-xs"
              >
                <span>Apply / Inquire</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`;
save('src/pages/Student/Opportunities.tsx', opportunitiesPage);

console.log('Student pages generated successfully');