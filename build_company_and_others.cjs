const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}

// 1. Company Dashboard
const companyDashboard = `import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Inbox, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { AudioButton } from '../../components/common/AudioButton';

export const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const primaryActions = [
    {
      title: t.findResearchers,
      desc: 'Discover university researchers, agronomists, and biotechnology projects.',
      icon: <Users className="w-8 h-8 text-[#2E7D32]" />,
      path: '/company/students',
      tag: 'Academic Talent'
    },
    {
      title: t.manageCompanyProfile,
      desc: 'Update your corporate agribusiness profile, crop needs, and research requirements.',
      icon: <Building2 className="w-8 h-8 text-[#2E7D32]" />,
      path: '/company/profile',
      tag: 'Corporate Profile'
    },
    {
      title: t.inbox,
      desc: 'View direct proposals and inquiries from students and agricultural researchers.',
      icon: <Inbox className="w-8 h-8 text-[#2E7D32]" />,
      path: '/company/inbox',
      tag: 'Direct Inquiries'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
            🏢 {t.roles.company}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome}, <span className="text-[#2E7D32]">{user?.name}</span>
          </h1>
        </div>

        <AudioButton text={\`Welcome to the Company Agribusiness Hub, \${user?.name}. Find researchers, post agricultural challenges, and manage incoming proposals.\`} size="md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
save('src/pages/Company/CompanyDashboard.tsx', companyDashboard);

// 2. Company Profile Editor
const companyProfilePage = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { db } from '../../services/db';
import type { CompanyProfile } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const CompanyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('Lahore');
  const [description, setDescription] = useState('');
  const [currentNeeds, setCurrentNeeds] = useState('');
  const [opportunities, setOpportunities] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const all = db.getAllCompanies();
      const myProfile = all.find((c) => c.userId === user.userId);
      if (myProfile) {
        setCompanyName(myProfile.companyName);
        setSpecialization(myProfile.specialization);
        setCity(myProfile.city);
        setDescription(myProfile.description);
        setCurrentNeeds(myProfile.currentNeeds.join(', '));
        setOpportunities(myProfile.opportunities.join(', '));
      } else {
        setCompanyName(user.name);
      }
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const profile: CompanyProfile = {
      userId: user.userId,
      companyName: companyName.trim(),
      email: user.email,
      specialization: specialization.trim(),
      city: city.trim(),
      description: description.trim(),
      currentNeeds: currentNeeds.split(',').map((s) => s.trim()).filter(Boolean),
      problemsChallenges: ['Salinity mitigation', 'Post-harvest shelf life'],
      opportunities: opportunities.split(',').map((s) => s.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    };

    db.saveCompanyProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/company/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          🏢 {t.manageCompanyProfile}
        </h1>

        <AudioButton text="Update your agribusiness profile and list your active research challenges." size="sm" />
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] text-[#2E7D32] font-bold text-sm flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Company profile updated successfully!</span>
        </div>
      )}

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#DDE8DD] shadow-xl bg-white">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Al-Khair Seeds & Agritech"
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                Specialization / Industry
              </label>
              <input
                type="text"
                required
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Hybrid Seeds, Bio-Pesticides, Solar Irrigation"
                className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
              Headquarters City
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Lahore / Faisalabad / Multan"
              className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
              Company Overview
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your agribusiness products and operations..."
              className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
              {t.agriculturalNeeds} (comma separated)
            </label>
            <input
              type="text"
              required
              value={currentNeeds}
              onChange={(e) => setCurrentNeeds(e.target.value)}
              placeholder="e.g. Heat tolerant wheat seeds, biological fall armyworm control"
              className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
              Active Opportunities & Grants (comma separated)
            </label>
            <input
              type="text"
              value={opportunities}
              onChange={(e) => setOpportunities(e.target.value)}
              placeholder="e.g. Field Trial Grants, Agronomy Internships"
              className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-[#DDE8DD]">
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
`;
save('src/pages/Company/CompanyProfile.tsx', companyProfilePage);

// 3. Company Inbox
const companyInbox = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { db } from '../../services/db';
import type { Conversation } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const CompanyInbox: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState('');

  const loadData = () => {
    if (user) {
      const list = db.getConversationsForUser(user.userId);
      setConversations(list);
      if (selectedConv) {
        const updated = list.find((c) => c.id === selectedConv.id);
        if (updated) setSelectedConv(updated);
      }
    }
  };

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('agralyticx_conversations', () => loadData());
    return unsub;
  }, [user]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedConv || !replyText.trim()) return;

    db.startOrSendMessage(
      selectedConv.id,
      { id: user.userId, name: user.name, role: user.role },
      { id: selectedConv.studentId, name: selectedConv.studentName, role: 'student_researcher' },
      replyText.trim()
    );

    setReplyText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/company/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
          📬 {t.inbox} ({conversations.length})
        </h1>

        <AudioButton text="Review direct research proposals and respond to unlock two-way conversation." size="sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-4 border border-[#DDE8DD] bg-white space-y-2 max-h-[600px] overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5F6B63]">
              No inquiries yet. When researchers reach out, they will appear here.
            </div>
          ) : (
            conversations.map((c) => {
              const isSelected = selectedConv?.id === c.id;
              const senderName = c.studentName;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedConv(c)}
                  className={\`w-full text-left p-3.5 rounded-2xl border transition-all \${
                    isSelected
                      ? 'border-[#2E7D32] bg-[#E8F5E9]'
                      : 'border-[#DDE8DD] hover:bg-[#F8FAF7]'
                  }\`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1F2933]">{senderName}</h4>
                    {c.status === 'pending_company_reply' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Pending Reply
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5F6B63] truncate mt-1">
                    {c.lastMessage}
                  </p>
                </button>
              );
            })
          )}
        </div>

        <div className="md:col-span-2 glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white flex flex-col justify-between min-h-[450px]">
          {selectedConv ? (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div className="pb-3 border-b border-[#DDE8DD] flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#1F2933]">
                    {selectedConv.studentName}
                  </h3>
                  <span className="text-xs text-[#5F6B63]">
                    {selectedConv.status === 'active' ? '✓ Two-Way Active' : 'Anti-Spam 1st Inquiry'}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedConv.messages.map((m) => (
                    <div
                      key={m.id}
                      className={\`flex flex-col \${m.senderId === user?.userId ? 'items-end' : 'items-start'}\`}
                    >
                      <div
                        className={\`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed \${
                          m.senderId === user?.userId
                            ? 'bg-[#2E7D32] text-white rounded-tr-xs'
                            : 'bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] rounded-tl-xs'
                        }\`}
                      >
                        <p>{m.text}</p>
                        <span className="text-[10px] opacity-70 block mt-1 text-right">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendReply} className="flex gap-2 pt-4 border-t border-[#DDE8DD]">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to unlock collaborative chat..."
                  className="flex-1 px-4 py-2.5 border border-[#DDE8DD] rounded-2xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[#5F6B63] space-y-2 py-16">
              <Inbox className="w-10 h-10 text-[#DDE8DD]" />
              <p className="text-sm">Select an inquiry conversation to read and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;
save('src/pages/Company/CompanyInbox.tsx', companyInbox);

// 4. Landowner Hub
const landownerHub = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trees, 
  UserPlus, 
  Truck, 
  Plus, 
  Clock, 
  X
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { db } from '../../services/db';
import type { LandRecord, FarmerJob, TransportBooking } from '../../types';

export const LandownerHub: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [lands, setLands] = useState<LandRecord[]>([]);
  const [jobs, setJobs] = useState<FarmerJob[]>([]);
  
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [transportModalOpen, setTransportModalOpen] = useState(false);
  const [addLandModalOpen, setAddLandModalOpen] = useState(false);

  const [jobTitle, setJobTitle] = useState('Wheat Harvesting & Threshing (کنک دی کٹائی)');
  const [jobLocation, setJobLocation] = useState('Chak 42 RB, Sargodha');
  const [jobHours, setJobHours] = useState(8);
  const [jobWage, setJobWage] = useState(350);
  const [jobSuccess, setJobSuccess] = useState(false);

  const [pickupLocation, setPickupLocation] = useState('Farm Gate Chak 42, Sargodha');
  const [deliveryLocation, setDeliveryLocation] = useState('Sargodha Grain Market Mandi');
  const [cropType, setCropType] = useState('Wheat');
  const [weightTons, setWeightTons] = useState(5);
  const [pickupDate, setPickupDate] = useState('Tomorrow 8:00 AM');
  const [transportSuccess, setTransportSuccess] = useState(false);

  const [parcelName, setParcelName] = useState('');
  const [acres, setAcres] = useState(10);
  const [tehsil, setTehsil] = useState('');
  const [district, setDistrict] = useState('');

  const loadData = () => {
    if (user) {
      setLands(db.getLandRecords(user.userId));
      setJobs(db.getAllFarmerJobs().filter((j) => j.landownerId === user.userId));
    }
  };

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('agralyticx_jobs', () => loadData());
    return unsub;
  }, [user]);

  const handleHireFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newJob: FarmerJob = {
      id: \`job_\${Date.now()}\`,
      landownerId: user.userId,
      landownerName: user.name,
      phone: '+92 300 1234567',
      jobType: 'Harvesting',
      crop: 'Wheat',
      location: jobLocation,
      district: 'Sargodha',
      farmersNeeded: 4,
      hourlyRate: Number(jobWage),
      workingHours: \`\${jobHours} Hours/Day\`,
      date: 'Tomorrow',
      budget: Number(jobHours) * Number(jobWage) * 4,
      status: 'Open',
      createdAt: new Date().toISOString(),
      applicants: []
    };

    db.createFarmerJob(newJob);
    setJobSuccess(true);
    setTimeout(() => {
      setJobSuccess(false);
      setHireModalOpen(false);
    }, 2000);
  };

  const handleBookTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const estimatedCost = Number(weightTons) * 1200 + 3500;

    const booking: TransportBooking = {
      id: \`tb_\${Date.now()}\`,
      requesterId: user.userId,
      requesterName: user.name,
      requesterRole: 'landowner',
      phone: '+92 300 1234567',
      pickupLocation,
      destination: deliveryLocation,
      cropCargo: cropType,
      quantityTons: Number(weightTons),
      vehicleRequirement: 'Mazda (Small Truck)',
      scheduledDate: pickupDate,
      status: 'Pending',
      estimatedCostPkr: estimatedCost,
      createdAt: new Date().toISOString()
    };

    db.createTransportBooking(booking);
    setTransportSuccess(true);
    setTimeout(() => {
      setTransportSuccess(false);
      setTransportModalOpen(false);
    }, 2000);
  };

  const handleAddLand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const rec: LandRecord = {
      id: \`land_\${Date.now()}\`,
      userId: user.userId,
      title: parcelName.trim(),
      acres: Number(acres),
      location: \`\${tehsil}, \${district}\`,
      tehsil: tehsil.trim(),
      district: district.trim(),
      soilSuitability: ['Wheat', 'Cotton', 'Sugarcane'],
      waterSource: 'Canal + Solar',
      isAvailableForLease: false,
      updatedAt: new Date().toISOString()
    };

    db.saveLandRecord(rec);
    setLands((prev) => [...prev, rec]);
    setAddLandModalOpen(false);
    setParcelName('');
    setTehsil('');
    setDistrict('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
            🌳 {t.roles.landowner}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome}, <span className="text-[#2E7D32]">{user?.name}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setHireModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.hireFarmers}</span>
          </button>

          <button
            type="button"
            onClick={() => setTransportModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-white border border-[#DDE8DD] hover:bg-[#F8FAF7] text-[#1F2933] font-bold text-sm shadow-xs flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#2E7D32]" />
            <span>{t.bookTransport}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
            <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
              <Trees className="w-5 h-5 text-[#2E7D32]" />
              <span>{t.landRecordsTitle}</span>
            </h3>
            <button
              type="button"
              onClick={() => setAddLandModalOpen(true)}
              className="p-1.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#DDE8DD]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {lands.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5F6B63]">
              No land parcels registered yet. Tap + to add acreage.
            </div>
          ) : (
            lands.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl border border-[#DDE8DD] bg-[#F8FAF7] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1F2933]">{l.title}</h4>
                  <span className="text-xs font-extrabold text-[#2E7D32]">{l.acres} Acres</span>
                </div>
                <p className="text-xs text-[#5F6B63]">📍 {l.tehsil}, {l.district}</p>
                <div className="flex gap-2 text-[11px] text-[#5F6B63] pt-1">
                  <span>Water: {l.waterSource}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
            <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2E7D32]" />
              <span>Active Farmer Jobs</span>
            </h3>
          </div>

          {jobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5F6B63]">
              No active job dispatches. Click "Hire Farmers" above to alert local farmers.
            </div>
          ) : (
            jobs.map((j) => (
              <div key={j.id} className="p-4 rounded-2xl border border-[#DDE8DD] bg-[#F8FAF7] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#1F2933]">{j.crop} {j.jobType}</h4>
                  <span className={\`text-xs font-bold px-2 py-0.5 rounded-full \${
                    j.status === 'Open' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-amber-100 text-amber-800'
                  }\`}>
                    {j.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-bold text-[#2E7D32]">Rs. {j.hourlyRate}/hour • {j.workingHours}</span>
                  <span className="text-[#5F6B63]">📍 {j.location}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {hireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDE8DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
              <div>
                <h3 className="text-lg font-bold text-[#1F2933]">{t.hireFarmers}</h3>
                <p className="text-xs text-[#5F6B63]">Direct dispatch alert with automatic Punjabi/Urdu translation</p>
              </div>
              <button type="button" onClick={() => setHireModalOpen(false)}>
                <X className="w-5 h-5 text-[#5F6B63]" />
              </button>
            </div>

            {jobSuccess && (
              <div className="p-3.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold border border-[#4CAF50]">
                ✓ Job dispatched to farmer community!
              </div>
            )}

            <form onSubmit={handleHireFarmer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Hours Needed</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={jobHours}
                    onChange={(e) => setJobHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Rate (PKR/Hour)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={jobWage}
                    onChange={(e) => setJobWage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Field Location</label>
                <input
                  type="text"
                  required
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setHireModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DDE8DD] text-sm text-[#5F6B63]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md"
                >
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {transportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDE8DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
              <div>
                <h3 className="text-lg font-bold text-[#1F2933]">{t.bookTransport}</h3>
                <p className="text-xs text-[#5F6B63]">Dispatch harvest transport request to freight network</p>
              </div>
              <button type="button" onClick={() => setTransportModalOpen(false)}>
                <X className="w-5 h-5 text-[#5F6B63]" />
              </button>
            </div>

            {transportSuccess && (
              <div className="p-3.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold border border-[#4CAF50]">
                ✓ Transport request dispatched to nearby drivers!
              </div>
            )}

            <form onSubmit={handleBookTransport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Pickup Location (Farm Gate)</label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Destination Mandi / Mill</label>
                <input
                  type="text"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Crop Type</label>
                  <input
                    type="text"
                    required
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Weight (Tons)</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    required
                    value={weightTons}
                    onChange={(e) => setWeightTons(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTransportModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DDE8DD] text-sm text-[#5F6B63]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md"
                >
                  Dispatch Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addLandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDE8DD] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
              <h3 className="text-lg font-bold text-[#1F2933]">Register Land Parcel</h3>
              <button type="button" onClick={() => setAddLandModalOpen(false)}>
                <X className="w-5 h-5 text-[#5F6B63]" />
              </button>
            </div>

            <form onSubmit={handleAddLand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Parcel Name</label>
                <input
                  type="text"
                  required
                  value={parcelName}
                  onChange={(e) => setParcelName(e.target.value)}
                  placeholder="e.g. North Canal Orchard"
                  className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Total Acres</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={acres}
                    onChange={(e) => setAcres(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">Tehsil & District</label>
                  <input
                    type="text"
                    required
                    value={tehsil}
                    onChange={(e) => setTehsil(e.target.value)}
                    placeholder="Bhalwal, Sargodha"
                    className="w-full px-3.5 py-2.5 border border-[#DDE8DD] rounded-xl text-sm focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddLandModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#DDE8DD] text-sm text-[#5F6B63]"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md"
                >
                  Save Parcel
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
save('src/pages/Landowner/LandownerHub.tsx', landownerHub);

// 5. Transport Dashboard
const transportDashboard = `import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Navigation, Compass } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { db } from '../../services/db';
import type { TransportBooking } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

export const TransportDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [requests, setRequests] = useState<TransportBooking[]>([]);
  const selectedRoute = {
    name: 'Sargodha Farm to Faisalabad Grain Mandi',
    from: [32.0836, 72.6711] as [number, number],
    to: [31.4504, 73.1350] as [number, number],
    distance: '95 km',
    rate: 'PKR 14,500'
  };

  const loadData = () => {
    const list = db.getAllTransportBookings();
    setRequests(list);
  };

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('agralyticx_transport', () => loadData());
    return unsub;
  }, []);

  const handleAcceptRequest = (reqId: string) => {
    db.updateTransportStatus(reqId, 'Accepted');
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
            🚚 {t.roles.transport}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933]">
            {t.welcome}, <span className="text-[#2E7D32]">{user?.name}</span>
          </h1>
        </div>

        <AudioButton text="View crop delivery requests, live route distances, and optimize your freight logistics." size="md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">
          <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#2E7D32]" />
            <span>Open Delivery Requests</span>
          </h3>

          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-[#DDE8DD] bg-[#F8FAF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                    🌾 {r.cropCargo} ({r.quantityTons} Tons)
                  </span>
                  <span className="text-sm font-extrabold text-[#2E7D32]">
                    Rs. {(r.estimatedCostPkr || 9500).toLocaleString()}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-[#5F6B63]">
                  <p>📍 From: <strong className="text-[#1F2933]">{r.pickupLocation}</strong></p>
                  <p>🏁 To: <strong className="text-[#1F2933]">{r.destination}</strong></p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#DDE8DD]">
                  <span className="text-[11px] text-[#5F6B63]">By {r.requesterName}</span>
                  {r.status === 'Pending' ? (
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(r.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-xs shadow-xs"
                    >
                      Accept Trip
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Trip Accepted</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#2E7D32]" />
              <span>Freight Route Navigator</span>
            </h3>
            <span className="text-xs font-bold text-[#2E7D32]">
              {selectedRoute.distance} • {selectedRoute.rate}
            </span>
          </div>

          <div className="h-72 rounded-2xl overflow-hidden border border-[#DDE8DD] relative z-0">
            <MapContainer
              center={[31.76, 72.90]}
              zoom={8}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={selectedRoute.from}>
                <Popup>Farm Pickup: Sargodha</Popup>
              </Marker>
              <Marker position={selectedRoute.to}>
                <Popup>Destination: Faisalabad Mandi</Popup>
              </Marker>
              <Polyline
                positions={[selectedRoute.from, selectedRoute.to]}
                color="#2E7D32"
                weight={4}
              />
            </MapContainer>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E8F5E9]/60 border border-[#DDE8DD] text-xs text-[#2E7D32] font-semibold">
            🚛 Optimized route avoiding narrow rural unpaved tracks. Average transit time: 2 hours 15 mins.
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-[#DDE8DD] bg-white space-y-4">
        <h3 className="text-lg font-extrabold text-[#1F2933] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#2E7D32]" />
          <span>Site Guide: How Agralyticx Connects the Agricultural Ecosystem</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🌾</span>
            <h4 className="font-bold text-[#1F2933]">1. Farmer</h4>
            <p className="text-[#5F6B63] text-[11px]">Scans disease, checks live mandi prices & uses AI audio assistant</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🌳</span>
            <h4 className="font-bold text-[#1F2933]">2. Landowner</h4>
            <p className="text-[#5F6B63] text-[11px]">Dispatches hourly work alerts & books freight to mandis</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🚚</span>
            <h4 className="font-bold text-[#1F2933]">3. Transport</h4>
            <p className="text-[#5F6B63] text-[11px]">Accepts haulage trips with diesel calculator & route map</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🎓</span>
            <h4 className="font-bold text-[#1F2933]">4. Researcher</h4>
            <p className="text-[#5F6B63] text-[11px]">Uploads trial projects & applies for agribusiness grants</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] space-y-1.5">
            <span className="text-xl">🏢</span>
            <h4 className="font-bold text-[#1F2933]">5. Company</h4>
            <p className="text-[#5F6B63] text-[11px]">Discovers academic talent to solve agricultural R&D needs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
`;
save('src/pages/Transport/TransportDashboard.tsx', transportDashboard);

// 6. Community Real-Time Role Chat
const communityChat = `import React, { useState, useEffect, useRef } from 'react';
import { Users, Send, Mic, MicOff } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { db } from '../../services/db';
import { speechService } from '../../services/speech';
import type { CommunityMessage, CommunityMember } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

export const CommunityChat: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const userRole = user?.role || 'farmer';

  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    setMessages(db.getCommunityMessages(userRole));
    setMembers(db.getCommunityMembers(userRole));
  };

  useEffect(() => {
    loadData();
    const unsubMsg = db.subscribe(\`agralyticx_chat_\${userRole}\`, () => loadData());
    return unsubMsg;
  }, [userRole]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inputText.trim()) return;

    db.sendCommunityMessage(
      userRole,
      { id: user.userId, name: user.name, role: user.role },
      inputText.trim()
    );

    setInputText('');
  };

  const handleStartMic = () => {
    setIsListening(true);
    speechService.startListening(
      language,
      (text) => {
        setInputText(text);
        setIsListening(false);
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const roleTitle = userRole === 'student_researcher' ? t.roles.studentResearcher : t.roles[userRole as keyof typeof t.roles];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              Real-Time Peer Chat Room
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2933] mt-1">
            💬 {roleTitle} {t.community}
          </h1>
          <p className="text-xs text-[#5F6B63]">
            {t.noSocialFeedNotice}
          </p>
        </div>

        <AudioButton text="This is your dedicated peer community room. Exchange real-time agricultural advice with fellow members." size="sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-3xl p-5 border border-[#DDE8DD] bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1F2933] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#2E7D32]" />
              <span>Members ({members.length})</span>
            </h4>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto">
            {members.map((m) => (
              <div key={m.userId} className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold text-xs flex items-center justify-center border border-[#DDE8DD]">
                    {m.name.charAt(0)}
                  </div>
                  {m.status === 'online' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border-2 border-white"></span>
                  )}
                </div>

                <div className="text-xs truncate">
                  <span className="font-bold text-[#1F2933] block truncate">{m.name}</span>
                  <span className="text-[10px] text-[#5F6B63]">Verified Account</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white flex flex-col justify-between h-[520px]">
          <div className="space-y-4 overflow-y-auto pr-2 flex-1">
            {messages.map((m) => {
              const isMe = m.senderId === user?.userId;
              return (
                <div
                  key={m.id}
                  className={\`flex flex-col \${isMe ? 'items-end' : 'items-start'}\`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-[#1F2933]">{m.senderName}</span>
                    <span className="text-[9px] text-[#5F6B63]">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={\`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed \${
                      isMe
                        ? 'bg-[#2E7D32] text-white rounded-tr-xs shadow-xs'
                        : 'bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] rounded-tl-xs'
                    }\`}
                  >
                    <p>{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t border-[#DDE8DD]">
            <button
              type="button"
              onClick={isListening ? () => setIsListening(false) : handleStartMic}
              className={\`p-2.5 rounded-2xl border transition-all \${
                isListening
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-white border-[#DDE8DD] text-[#2E7D32] hover:bg-[#E8F5E9]'
              }\`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send a real-time message to peer room..."
              className="flex-1 px-4 py-2.5 bg-[#F8FAF7] border border-[#DDE8DD] rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-6 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
`;
save('src/pages/Community/CommunityChat.tsx', communityChat);

// 7. Profile Settings Page
const profilePage = `import React from 'react';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { LanguageCode } from '../../types';
import { useNavigate } from 'react-router-dom';

export const ProfileSettings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const roleTitle = user ? (user.role === 'student_researcher' ? t.roles.studentResearcher : t.roles[user.role as keyof typeof t.roles]) : '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
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

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#DDE8DD] shadow-xl bg-white space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#DDE8DD]">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] font-extrabold text-2xl flex items-center justify-center border border-[#DDE8DD]">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1F2933]">{user?.name}</h2>
            <p className="text-xs text-[#5F6B63]">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              {roleTitle}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1F2933] uppercase">
            {t.language}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: 'en', label: 'English' },
              { code: 'ur', label: 'اردو (Urdu)' },
              { code: 'pa', label: 'پنجابی (Pakistani Punjabi)' }
            ].map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code as LanguageCode)}
                className={\`p-3 rounded-2xl border text-xs font-bold transition-all \${
                  language === l.code
                    ? 'border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]'
                    : 'border-[#DDE8DD] bg-white text-[#1F2933] hover:bg-[#F8FAF7]'
                }\`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[#DDE8DD] flex justify-end">
          <button
            type="button"
            onClick={handleSignOut}
            className="px-6 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
`;
save('src/pages/Profile/ProfileSettings.tsx', profilePage);

console.log('Build updated successfully');
