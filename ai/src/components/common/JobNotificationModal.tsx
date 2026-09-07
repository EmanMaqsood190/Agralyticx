import React, { useState, useEffect } from 'react';
import { Briefcase, CheckCircle, XCircle, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import { db } from '../../services/db';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { FarmerJob } from '../../types';
import { AudioButton } from './AudioButton';

export const JobNotificationModal: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeJob, setActiveJob] = useState<FarmerJob | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'farmer') return;

    const checkJobs = () => {
      const allJobs = db.getAllFarmerJobs();
      // Find open job that farmer hasn't responded to yet
      const openJob = allJobs.find(
        (j) => j.status === 'Open' && !j.applicants.some((a) => a.farmerId === user.userId)
      );
      if (openJob && !isDismissed) {
        setActiveJob(openJob);
      }
    };

    checkJobs();
    const unsub = db.subscribe('agralyticx_farmer_jobs', () => {
      checkJobs();
    });
    return unsub;
  }, [user, isDismissed]);

  if (!activeJob || isDismissed || user?.role !== 'farmer') return null;

  const handleRespond = (action: 'accepted' | 'rejected') => {
    db.respondToJob(activeJob.id, user.userId, user.name, action, user.phone || '0300-1234567');
    setActionDone(action === 'accepted' ? t.acceptJob : t.rejectJob);
    setTimeout(() => {
      setIsDismissed(true);
      setActiveJob(null);
    }, 1500);
  };

  const notificationSpeechText = `New Farm Job: ${activeJob.jobType} for ${activeJob.crop} in ${activeJob.location}. Hourly rate is ${activeJob.hourlyRate} rupees. Tap accept to apply.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#4CAF50] space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE8DD]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1F2933]">
                {t.jobNotificationTitle}
              </h3>
              <p className="text-xs text-[#5F6B63]">{activeJob.landownerName}</p>
            </div>
          </div>
          <AudioButton text={notificationSpeechText} size="sm" />
        </div>

        {/* Job Details Card */}
        <div className="bg-[#F8FAF7] p-4 rounded-2xl border border-[#DDE8DD] space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#5F6B63] font-medium">{t.jobType}:</span>
            <span className="font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
              {activeJob.jobType} - {activeJob.crop}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#1F2933]">
            <MapPin className="w-4 h-4 text-[#4CAF50] shrink-0" />
            <span>{activeJob.location}, {activeJob.district}</span>
          </div>

          <div className="flex items-center gap-2 text-[#1F2933]">
            <Calendar className="w-4 h-4 text-[#4CAF50] shrink-0" />
            <span>{activeJob.date} ({activeJob.workingHours})</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#DDE8DD]">
            <div className="flex items-center gap-1.5 text-[#1F2933] font-bold">
              <DollarSign className="w-4 h-4 text-[#2E7D32]" />
              <span>Rs. {activeJob.hourlyRate} / hr</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5F6B63]">
              <Users className="w-3.5 h-3.5" />
              <span>{activeJob.farmersNeeded} {t.numberOfFarmersNeeded}</span>
            </div>
          </div>
        </div>

        {/* Action Status Feedback */}
        {actionDone ? (
          <div className="text-center py-2 font-bold text-[#2E7D32] bg-[#E8F5E9] rounded-xl animate-pulse">
            ✓ {actionDone}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleRespond('rejected')}
              className="py-3 rounded-xl font-bold text-[#5F6B63] bg-[#F8FAF7] hover:bg-[#DDE8DD] transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-5 h-5 text-red-500" />
              {t.rejectJob}
            </button>
            <button
              type="button"
              onClick={() => handleRespond('accepted')}
              className="py-3 rounded-xl font-bold text-white bg-[#2E7D32] hover:bg-[#1b4d1f] shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-5 h-5" />
              {t.acceptJob}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
