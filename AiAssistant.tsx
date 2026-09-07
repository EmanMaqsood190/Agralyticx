import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  Trash2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { aiService, AiChatMessage } from '../../services/ai';
import { speechService } from '../../services/speech';
import { AudioButton } from '../../components/common/AudioButton';

export const AiAssistant: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex((current) => (current === idx ? null : current)), 2000);
  };

  // Helper function to get localized Copy / Copied text
  const getCopyText = (isCopied: boolean) => {
    if (isCopied) {
      if (language === 'ur') return 'کاپپی ہو گیا';
      if (language === 'pa') return 'کاپی ہو گیا';
      return t.copied || 'Copied';
    } else {
      if (language === 'ur') return 'کاپپی کریں';
      if (language === 'pa') return 'کاپی کرو';
      return t.copy || 'Copy';
    }
  };

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: 'assistant',
      text: t.aiWelcomeMessage,
      timestamp: new Date().toISOString()
    }
  ]);

  // Tracks whether the user has actually started chatting, so that
  // switching the site language never overwrites a real conversation.
  const hasUserSentMessage = useRef(false);

  // Previously, this welcome message (and the mic hint text below) was
  // only ever set once, when the component first mounted. Changing the
  // site language from the navbar did not re-run that code, so the
  // Farmer AI Assistant kept showing the OLD language until the user
  // left the page and came back. This effect keeps it in sync with the
  // language picked anywhere in the app, immediately.
  useEffect(() => {
    if (!hasUserSentMessage.current) {
      setMessages([
        {
          role: 'assistant',
          text: t.aiWelcomeMessage,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [language, t.aiWelcomeMessage]);

  const handleStartListening = () => {
    setErrorNotice(null);
    setIsListening(true);
    speechService.startListening(
      language,
      (recognizedText) => {
        setInputQuery(recognizedText);
        handleSendQuery(recognizedText);
      },
      (err) => {
        setErrorNotice(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    setErrorNotice(null);
    const userMsg: AiChatMessage = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    hasUserSentMessage.current = true;
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await aiService.askFarmingAssistant(textToSend, language);
      const assistantMsg: AiChatMessage = {
        role: 'assistant',
        text: response,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorNotice(err.message || 'AI service error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    hasUserSentMessage.current = false;
    setMessages([
      {
        role: 'assistant',
        text: t.aiWelcomeMessage,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE8DD]">
        <button
          type="button"
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#5F6B63] hover:text-[#2E7D32]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2933]">
            🤖 {t.aiAssistantTitle}
          </h1>
          <p className="text-xs text-[#5F6B63]">{t.voiceFirstTitle}</p>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="p-2 text-[#5F6B63] hover:text-red-600 rounded-xl hover:bg-red-50"
          title={t.clearConversation}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Voice-First Hero Bar */}
      <div className="glass-card rounded-3xl p-6 border-2 border-[#4CAF50] bg-gradient-to-b from-[#E8F5E9]/80 to-white text-center space-y-4 shadow-lg">
        <p className="text-sm font-bold text-[#1F2933]">
          {isListening ? t.listening : t.speakOrTypePrompt}
        </p>

        {/* Big Microphone Tap Button */}
        <div>
          <button
            type="button"
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-ping scale-110'
                : 'bg-[#2E7D32] hover:bg-[#1b4d1f] text-white hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        <span className="text-xs text-[#5F6B63] block">
          {isListening ? `🎙 ${t.micHintListening}` : t.micHintIdle}
        </span>
      </div>

      {/* Prompt Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#5F6B63] uppercase tracking-wider">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {t.suggestedQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputQuery(q);
                handleSendQuery(q);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-[#DDE8DD] hover:border-[#4CAF50] hover:bg-[#E8F5E9] text-[#1F2933] transition-all"
            >
              💡 {q}
            </button>
          ))}
        </div>
      </div>

      {errorNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-[#DDE8DD] space-y-4 max-h-96 overflow-y-auto bg-white/95">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#2E7D32] text-white rounded-tr-xs'
                  : 'bg-[#F8FAF7] border border-[#DDE8DD] text-[#1F2933] rounded-tl-xs'
              }`}
            >
              <p>{m.text}</p>
              <div
                className={`pt-2 border-t flex items-center gap-3 ${
                  m.role === 'user'
                    ? 'border-white/25 justify-end'
                    : 'border-[#DDE8DD]/60 justify-end'
                }`}
              >
                <AudioButton text={m.text} size="sm" />
                <button
                  type="button"
                  onClick={() => handleCopy(m.text, idx)}
                  className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${
                    m.role === 'user'
                      ? 'text-white/80 hover:text-white'
                      : 'text-[#5F6B63] hover:text-[#2E7D32]'
                  }`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{getCopyText(true)}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{getCopyText(false)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#5F6B63] p-3 bg-[#F8FAF7] rounded-2xl border border-[#DDE8DD] w-fit">
            <div className="w-4 h-4 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
            <span>{t.thinking}</span>
          </div>
        )}
      </div>

      {/* Typing Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t.typeQuestionPlaceholder}
          className="flex-1 px-4 py-3 bg-white border border-[#DDE8DD] rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-6 py-3 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{t.send}</span>
        </button>
      </form>

    </div>
  );
};