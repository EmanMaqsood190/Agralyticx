import React, { useState, useEffect } from 'react';
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
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#2E7D32] bg-[#E8F5E9]'
                      : 'border-[#DDE8DD] hover:bg-[#F8FAF7]'
                  }`}
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
                      className={`flex flex-col ${m.senderId === user?.userId ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          m.senderId === user?.userId
                            ? 'bg-[#2E7D32] text-white rounded-tr-xs'
                            : 'bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] rounded-tl-xs'
                        }`}
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
