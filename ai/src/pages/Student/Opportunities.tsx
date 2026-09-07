import React from 'react';
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
                href={`mailto:${item.contactEmail}?subject=Application for ${item.title}`}
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
