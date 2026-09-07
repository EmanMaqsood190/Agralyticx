import { LanguageCode } from '../types';

class SpeechService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  public isSpeechSupported(): boolean {
    return !!this.recognition && typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public startListening(
    language: LanguageCode,
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): void {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      onEnd();
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }

    // Map language code
    const langMap: Record<LanguageCode, string> = {
      en: 'en-US',
      ur: 'ur-PK',
      pa: 'pa-PK'
    };

    this.recognition.lang = langMap[language] || 'ur-PK';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        onError('Microphone permission was denied. Please allow microphone access in your browser.');
      } else if (event.error === 'no-speech') {
        onError('No speech detected. Please try again.');
      } else {
        onError('Speech recognition encountered an issue. Please try typing your question.');
      }
      onEnd();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (err: any) {
      this.isListening = false;
      onError('Could not start microphone: ' + (err.message || 'Unknown error'));
      onEnd();
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
    }
  }

  public speak(text: string, language: LanguageCode, onComplete?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Map language codes and voice preferences
    const langCodes: Record<LanguageCode, string> = {
      en: 'en-US',
      ur: 'ur-PK',
      pa: 'pa-PK'
    };

    utterance.lang = langCodes[language] || 'en-US';
    utterance.rate = language === 'en' ? 1.0 : 0.9;
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(langCodes[language]) || v.lang.includes(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new SpeechService();
