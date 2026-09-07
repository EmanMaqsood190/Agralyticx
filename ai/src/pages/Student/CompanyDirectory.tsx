import React, { useState, useEffect } from 'react';
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
  Mail,
  X
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../auth/AuthContext';
import { db } from '../../services/db';
import { CompanyProfile } from '../../types';
import { AudioButton } from '../../components/common/AudioButton';

const API_BASE = 'http://localhost:5000/api';

export const CompanyDirectory: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [messageText, setMessageText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // ============================================================
  // LOAD COMPANIES FROM MONGODB
  // ============================================================

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const response = await fetch(`${API_BASE}/companies`);

      if (!response.ok) {
        throw new Error('Failed to load companies.');
      }

      const data = await response.json();

      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load companies from MongoDB:', error);

      // Fall back to any locally cached companies so the page
      // still renders something instead of going blank.
      setCompanies(db.getAllCompanies());
      setLoadError(
        'Could not reach the server — showing cached data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleOpenContact = (comp: CompanyProfile) => {
    setSelectedCompany(comp);
    setMessageText('');
    setSendSuccess(null);
    setErrorNotice(null);
    setModalOpen(true);
  };

  // ============================================================
  // CONTACT VIA GMAIL
  // ============================================================

  const openGmailCompose = (email?: string | null) => {
    if (!email || !email.trim()) {
      alert('This company has not provided a work email yet.');
      return;
    }

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email.trim()
    )}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCompany || !messageText.trim()) return;

    const convId = `conv_${user.userId}_${selectedCompany.userId}`;
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
    const term = searchTerm.toLowerCase();

    return (
      (c.companyName || '').toLowerCase().includes(term) ||
      (c.specialization || c.industry || '').toLowerCase().includes(term) ||
      (c.city || c.location || '').toLowerCase().includes(term)
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

      {loadError && (
        <div className="p-3.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
          {loadError}
        </div>
      )}

      {/* Companies Listing Grid */}
      <div className="space-y-4">
        {loading && companies.length === 0 && (
          <div className="text-center py-10 text-sm font-semibold text-[#5F6B63]">
            Loading companies...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 text-sm text-[#5F6B63]">
            No companies found.
          </div>
        )}

        {filtered.map((c) => {
          const workEmail = c.workEmail || c.email || '';

          return (
          <div
            key={c.userId}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] hover:border-[#4CAF50] bg-white shadow-sm transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDE8DD]">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                  {c.specialization || c.industry}
                </span>
                <h3 className="text-2xl font-extrabold text-[#1F2933]">
                  {c.companyName}
                </h3>
                <p className="text-xs text-[#5F6B63] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{c.city || c.location}</span>
                </p>
                {workEmail && (
                  <p className="text-xs text-[#5F6B63] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{workEmail}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => openGmailCompose(workEmail)}
                  disabled={!workEmail}
                  title={
                    workEmail
                      ? `Email ${c.companyName}`
                      : 'No work email on file'
                  }
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl border border-[#DDE8DD] text-[#2E7D32] font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 hover:border-[#4CAF50] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenContact(c)}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 w-fit"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.contactCompany}</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-[#1F2933] leading-relaxed">
              {c.description || c.companyDescription}
            </p>

            {/* Current Needs & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-2">
                <span className="font-bold text-[#1F2933] uppercase">{t.agriculturalNeeds}:</span>
                <ul className="list-disc list-inside text-[#5F6B63] space-y-1">
                  {(c.currentNeeds || []).map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-2">
                <span className="font-bold text-[#1F2933] uppercase">Opportunities:</span>
                <ul className="list-disc list-inside text-[#2E7D32] font-medium space-y-1">
                  {(c.opportunities || []).map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          );
        })}
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
