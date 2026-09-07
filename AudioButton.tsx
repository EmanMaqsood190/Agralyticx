import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speechService } from '../../services/speech';
import { useLanguage } from '../../i18n/LanguageContext';

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  className = '',
  size = 'md',
  label
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      speechService.stopSpeaking();
      setIsPlaying(false);
    } else {
      setNotice(null);
      setIsPlaying(true);
      speechService.speak(
        text,
        language,
        () => {
          setIsPlaying(false);
        },
        () => {
          // Voice playback isn't available for this language/device.
          // Tell the user instead of leaving the button doing nothing.
          setNotice(t.voiceNotAvailable);
          setTimeout(() => setNotice(null), 4000);
        }
      );
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
          isPlaying
            ? 'bg-[#2E7D32] text-white shadow-md animate-pulse'
            : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#DDE8DD]'
        } ${sizeClasses[size]} ${className}`}
        title={isPlaying ? 'Stop voice' : t.listen}
      >
        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        {label || (isPlaying ? 'Playing...' : t.listen)}
      </button>
      {notice && (
        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 max-w-[220px]">
          {notice}
        </span>
      )}
    </div>
  );
};
