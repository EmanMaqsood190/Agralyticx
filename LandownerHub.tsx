import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Trees,
  UserPlus,
  Truck,
  Plus,
  Clock,
  X,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';

import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { db } from '../../services/db';

import type {
  LandRecord,
  FarmerJob,
  TransportBooking,
  LanguageCode
} from '../../types';

import landownerBgImage from '../../assets/landowner-dashboard-bg.png';

/* ============================================================
   JOB FORM TRANSLATIONS
   ============================================================ */

type JobFormText = {
  hireTitle: string;
  hireSubtitle: string;
  jobTitle: string;
  fieldType: string;
  selectFieldType: string;
  customField: string;
  customFieldPlaceholder: string;
  shortDescription: string;
  descriptionPlaceholder: string;
  farmersNeeded: string;
  workingHours: string;
  hoursPlaceholder: string;
  pricePerHour: string;
  pricePlaceholder: string;
  province: string;
  selectProvince: string;
  workAddress: string;
  addressPlaceholder: string;
  date: string;
  postingLanguage: string;
  postJob: string;
  updateJob: string;
  cancel: string;
  success: string;
  updateSuccess: string;
  validation: string;
  open: string;
  closed: string;
  accepted: string;
  farmers: string;
  noJobs: string;
  jobPostings: string;
  postedIn: string;
  english: string;
  urdu: string;
  punjabi: string;
  dispatchBooking: string;
  dispatchTransportSubtitle: string;
  viewJob: string;
  editJob: string;
  deleteJob: string;
  deleteConfirm: string;
  jobDetails: string;
  close: string;
  jobStatus: string;
  budget: string;
};

const JOB_FORM_UI: Record<LanguageCode, JobFormText> = {
  en: {
    hireTitle: 'Hire Farmers',
    hireSubtitle:
      'Create a farm job posting for farmers in your area.',
    jobTitle: 'Job Title',
    fieldType: 'Field Type',
    selectFieldType: 'Select field type',
    customField: 'Custom Field',
    customFieldPlaceholder: 'Enter your custom field type',
    shortDescription: 'Short Description',
    descriptionPlaceholder:
      'Briefly describe the work, responsibilities, crop condition, or required experience.',
    farmersNeeded: 'Number of Farmers',
    workingHours: 'Time / Working Hours',
    hoursPlaceholder: '0',
    pricePerHour: 'Price (PKR per Hour)',
    pricePlaceholder: '0',
    province: 'Province',
    selectProvince: 'Select Province',
    workAddress: 'Work Address',
    addressPlaceholder: 'Enter the exact address of the work site',
    date: 'Date',
    postingLanguage: 'Posting Language',
    postJob: 'Post Job',
    updateJob: 'Update Job',
    cancel: 'Cancel',
    success: 'Job posted successfully!',
    updateSuccess: 'Job updated successfully!',
    validation: 'Please complete all required job fields.',
    open: 'Open',
    closed: 'Closed',
    accepted: 'Accepted',
    farmers: 'farmers',
    noJobs:
      'No job postings yet. Click "Hire Farmers" to create one.',
    jobPostings: 'Farmer Job Postings',
    postedIn: 'Posted in',
    english: 'English',
    urdu: 'Urdu',
    punjabi: 'Punjabi',
    dispatchBooking: 'Dispatch Booking',
    dispatchTransportSubtitle:
      'Dispatch harvest transport request to freight network',
    viewJob: 'View',
    editJob: 'Edit',
    deleteJob: 'Delete',
    deleteConfirm:
      'Are you sure you want to delete this job posting?',
    jobDetails: 'Job Details',
    close: 'Close',
    jobStatus: 'Status',
    budget: 'Estimated Budget'
  },

  ur: {
    hireTitle: 'کسانوں کو کام پر رکھیں',
    hireSubtitle:
      'اپنے علاقے کے کسانوں کے لیے کھیت کے کام کی پوسٹنگ بنائیں۔',
    jobTitle: 'کام کا عنوان',
    fieldType: 'کام کی قسم',
    selectFieldType: 'کام کی قسم منتخب کریں',
    customField: 'اپنی مرضی کی قسم',
    customFieldPlaceholder: 'اپنی کام کی قسم درج کریں',
    shortDescription: 'مختصر تفصیل',
    descriptionPlaceholder:
      'کام، ذمہ داریوں، فصل کی حالت یا مطلوبہ تجربے کے بارے میں مختصر تفصیل لکھیں۔',
    farmersNeeded: 'کسانوں کی تعداد',
    workingHours: 'وقت / کام کے اوقات',
    hoursPlaceholder: '0',
    pricePerHour: 'قیمت (روپے فی گھنٹہ)',
    pricePlaceholder: '0',
    province: 'صوبہ',
    selectProvince: 'صوبہ منتخب کریں',
    workAddress: 'کام کا پتہ',
    addressPlaceholder: 'کام کی جگہ کا مکمل پتہ درج کریں',
    date: 'تاریخ',
    postingLanguage: 'پوسٹنگ کی زبان',
    postJob: 'کام پوسٹ کریں',
    updateJob: 'کام اپ ڈیٹ کریں',
    cancel: 'منسوخ کریں',
    success: 'کام کامیابی سے پوسٹ کر دیا گیا!',
    updateSuccess: 'کام کامیابی سے اپ ڈیٹ کر دیا گیا!',
    validation: 'براہِ کرم کام کی تمام ضروری معلومات مکمل کریں۔',
    open: 'کھلا',
    closed: 'بند',
    accepted: 'قبول شدہ',
    farmers: 'کسان',
    noJobs:
      'ابھی کوئی کام پوسٹ نہیں کیا گیا۔ کام بنانے کے لیے "کسانوں کو کام پر رکھیں" دبائیں۔',
    jobPostings: 'کسانوں کی کام کی پوسٹنگز',
    postedIn: 'پوسٹ کی زبان',
    english: 'انگریزی',
    urdu: 'اردو',
    punjabi: 'پنجابی',
    dispatchBooking: 'بکنگ بھیجیں',
    dispatchTransportSubtitle:
      'فریٹ نیٹ ورک کے لیے فصل کی ٹرانسپورٹ کی درخواست بھیجیں',
    viewJob: 'دیکھیں',
    editJob: 'ترمیم',
    deleteJob: 'حذف کریں',
    deleteConfirm:
      'کیا آپ واقعی اس کام کی پوسٹنگ حذف کرنا چاہتے ہیں؟',
    jobDetails: 'کام کی تفصیلات',
    close: 'بند کریں',
    jobStatus: 'حالت',
    budget: 'متوقع بجٹ'
  },

  pa: {
    hireTitle: 'کسان کم تے رکھو',
    hireSubtitle:
      'اپنے علاقے دے کساناں لئی کھیت دے کم دی پوسٹنگ بناؤ۔',
    jobTitle: 'کم دا عنوان',
    fieldType: 'کم دی قسم',
    selectFieldType: 'کم دی قسم چنو',
    customField: 'اپنی مرضی دی قسم',
    customFieldPlaceholder: 'اپنی کم دی قسم درج کرو',
    shortDescription: 'مختصر تفصیل',
    descriptionPlaceholder:
      'کم، ذمہ واریاں، فصل دی حالت یا لوڑیں دے تجربے بارے مختصر تفصیل لکھو۔',
    farmersNeeded: 'کساناں دی تعداد',
    workingHours: 'وقت / کم دے گھنٹے',
    hoursPlaceholder: '0',
    pricePerHour: 'قیمت (روپے فی گھنٹہ)',
    pricePlaceholder: '0',
    province: 'صوبہ',
    selectProvince: 'صوبہ چنو',
    workAddress: 'کم دا پتہ',
    addressPlaceholder: 'کم والی جگہ دا پورا پتہ درج کرو',
    date: 'تاریخ',
    postingLanguage: 'پوسٹنگ دی زبان',
    postJob: 'کم پوسٹ کرو',
    updateJob: 'کم اپ ڈیٹ کرو',
    cancel: 'منسوخ کرو',
    success: 'کم کامیابی نال پوسٹ ہو گیا اے!',
    updateSuccess: 'کم کامیابی نال اپ ڈیٹ ہو گیا اے!',
    validation:
      'مہربانی کرکے کم دی ساریاں ضروری معلومات پوری کرو۔',
    open: 'کھلا',
    closed: 'بند',
    accepted: 'قبول شدہ',
    farmers: 'کسان',
    noJobs:
      'ہن تک کوئی کم پوسٹ نہیں ہویا۔ کم بناؤن لئی "کسان کم تے رکھو" دباؤ۔',
    jobPostings: 'کساناں لئی کم دیاں پوسٹنگاں',
    postedIn: 'پوسٹ دی زبان',
    english: 'انگریزی',
    urdu: 'اردو',
    punjabi: 'پنجابی',
    dispatchBooking: 'بکنگ بھیجو',
    dispatchTransportSubtitle:
      'فصل دی ٹرانسپورٹ دی درخواست فریٹ نیٹ ورک نوں بھیجو',
    viewJob: 'ویکھو',
    editJob: 'ترمیم',
    deleteJob: 'حذف کرو',
    deleteConfirm:
      'کی تسی واقعی ایہ کم دی پوسٹنگ حذف کرنا چاندے او؟',
    jobDetails: 'کم دیاں تفصیلاں',
    close: 'بند کرو',
    jobStatus: 'حالت',
    budget: 'متوقع بجٹ'
  }
};

/* ============================================================
   FIELD TYPES
   ============================================================ */

const FIELD_TYPES = [
  'Harvesting',
  'Sowing',
  'Irrigation',
  'Ploughing',
  'Fertilization',
  'Spraying',
  'Weeding',
  'Custom Field'
];

const FIELD_TYPE_LABELS: Record<
  string,
  Record<LanguageCode, string>
> = {
  Harvesting: {
    en: 'Harvesting',
    ur: 'کٹائی',
    pa: 'کٹائی'
  },
  Sowing: {
    en: 'Sowing',
    ur: 'بوائی',
    pa: 'بوائی'
  },
  Irrigation: {
    en: 'Irrigation',
    ur: 'آبپاشی',
    pa: 'آبپاشی'
  },
  Ploughing: {
    en: 'Ploughing',
    ur: 'ہل چلانا',
    pa: 'جتائی'
  },
  Fertilization: {
    en: 'Fertilization',
    ur: 'کھاد ڈالنا',
    pa: 'کھاد پانا'
  },
  Spraying: {
    en: 'Spraying',
    ur: 'سپرے',
    pa: 'سپرے'
  },
  Weeding: {
    en: 'Weeding',
    ur: 'جڑی بوٹیاں صاف کرنا',
    pa: 'گوڈی'
  },
  'Custom Field': {
    en: 'Custom Field',
    ur: 'اپنی مرضی کی قسم',
    pa: 'اپنی مرضی دی قسم'
  }
};

/* ============================================================
   PROVINCES
   ============================================================ */

const PROVINCES = [
  {
    value: 'Punjab',
    labels: {
      en: 'Punjab',
      ur: 'پنجاب',
      pa: 'پنجاب'
    }
  },
  {
    value: 'Sindh',
    labels: {
      en: 'Sindh',
      ur: 'سندھ',
      pa: 'سندھ'
    }
  },
  {
    value: 'Khyber Pakhtunkhwa',
    labels: {
      en: 'Khyber Pakhtunkhwa',
      ur: 'خیبر پختونخوا',
      pa: 'خیبر پختونخوا'
    }
  },
  {
    value: 'Balochistan',
    labels: {
      en: 'Balochistan',
      ur: 'بلوچستان',
      pa: 'بلوچستان'
    }
  }
];

/* ============================================================
   HELPERS
   ============================================================ */

const getLanguageName = (
  selectedLanguage: LanguageCode,
  ui: JobFormText
) => {
  if (selectedLanguage === 'ur') return ui.urdu;
  if (selectedLanguage === 'pa') return ui.punjabi;
  return ui.english;
};

const formatRate = (
  rate: number,
  selectedLanguage: LanguageCode
) => {
  if (selectedLanguage === 'ur' || selectedLanguage === 'pa') {
    return `${rate} روپے فی گھنٹہ`;
  }

  return `Rs. ${rate}/hour`;
};

const formatHours = (
  hours: string,
  selectedLanguage: LanguageCode
) => {
  const raw = String(hours || '').trim();

  const match = raw.match(
    /^(\d+(?:\.\d+)?)\s*Hours?\/Day$/i
  );

  const value = match?.[1] || raw;

  if (selectedLanguage === 'ur' || selectedLanguage === 'pa') {
    return `${value} گھنٹے/دن`;
  }

  return `${value} Hours/Day`;
};

const formatDate = (
  dateValue: string,
  selectedLanguage: LanguageCode
) => {
  if (!dateValue) return '';

  const raw = String(dateValue).trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const date = new Date(`${raw}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  const locale =
    selectedLanguage === 'en'
      ? 'en-PK'
      : 'ur-PK';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const getProvinceLabel = (
  provinceValue: string,
  selectedLanguage: LanguageCode
) => {
  const item = PROVINCES.find(
    (p) => p.value === provinceValue
  );

  return item?.labels[selectedLanguage] || provinceValue;
};

const getAcceptedCount = (job: FarmerJob) => {
  if (!Array.isArray(job.applicants)) return 0;

  return job.applicants.filter(
    (applicant) => applicant.status === 'accepted'
  ).length;
};

const getHoursNumber = (workingHours: string) => {
  const match = String(workingHours || '').match(
    /(\d+(?:\.\d+)?)/ 
  );

  return match ? Number(match[1]) : '';
};

/* ============================================================
   COMPONENT
   ============================================================ */

export const LandownerHub: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const ui = JOB_FORM_UI[language] || JOB_FORM_UI.en;

  const isRTL =
    language === 'ur' ||
    language === 'pa';

  const [lands, setLands] = useState<LandRecord[]>([]);
  const [jobs, setJobs] = useState<FarmerJob[]>([]);

  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [transportModalOpen, setTransportModalOpen] = useState(false);
  const [addLandModalOpen, setAddLandModalOpen] = useState(false);

  /* ============================================================
     JOB FORM
     ============================================================ */

  const [editingJobId, setEditingJobId] =
    useState<string | null>(null);

  const [viewingJob, setViewingJob] =
    useState<FarmerJob | null>(null);

  const [postingLanguage, setPostingLanguage] =
    useState<LanguageCode>(language);

  const [jobTitle, setJobTitle] = useState('');
  const [fieldType, setFieldType] = useState('Harvesting');
  const [customField, setCustomField] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [farmersNeeded, setFarmersNeeded] =
    useState<number | ''>(1);

  const [jobHours, setJobHours] =
    useState<number | ''>('');

  const [jobWage, setJobWage] =
    useState<number | ''>('');

  const [province, setProvince] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobDate, setJobDate] = useState('');

  const [jobSuccess, setJobSuccess] =
    useState(false);

  const [jobError, setJobError] =
    useState('');

  /* ============================================================
     TRANSPORT
     ============================================================ */

  const [pickupLocation, setPickupLocation] =
    useState('Farm Gate Chak 42, Sargodha');

  const [deliveryLocation, setDeliveryLocation] =
    useState('Sargodha Grain Market Mandi');

  const [cropType, setCropType] =
    useState('Wheat');

  const [weightTons, setWeightTons] =
    useState(5);

  const [pickupDate, setPickupDate] =
    useState('Tomorrow 8:00 AM');

  const [transportSuccess, setTransportSuccess] =
    useState(false);

  /* ============================================================
     LAND
     ============================================================ */

  const [parcelName, setParcelName] = useState('');
  const [acres, setAcres] = useState(10);
  const [tehsil, setTehsil] = useState('');
  const [district, setDistrict] = useState('');

  /* ============================================================
     LOAD DATA
     ============================================================ */

  const loadData = () => {
    if (!user) return;

    setLands(
      db.getLandRecords(user.userId)
    );

    setJobs(
      db
        .getAllFarmerJobs()
        .filter(
          (job) =>
            job.landownerId === user.userId
        )
    );
  };

  useEffect(() => {
    loadData();

    const unsubscribe = db.subscribe(
      'agralyticx_farmer_jobs',
      () => loadData()
    );

    return unsubscribe;
  }, [user]);

  /* ============================================================
     RESET JOB FORM
     ============================================================ */

  const resetJobForm = () => {
    setEditingJobId(null);
    setJobTitle('');
    setFieldType('Harvesting');
    setCustomField('');
    setJobDescription('');
    setFarmersNeeded(1);
    setJobHours('');
    setJobWage('');
    setProvince('');
    setJobLocation('');
    setJobDate('');
    setPostingLanguage(language);
    setJobSuccess(false);
    setJobError('');
  };

  /* ============================================================
     CLOSE JOB FORM
     ============================================================ */

  const closeJobModal = () => {
    setHireModalOpen(false);
    resetJobForm();
  };

  /* ============================================================
     CREATE JOB
     ============================================================ */

  const openCreateJobModal = () => {
    resetJobForm();
    setHireModalOpen(true);
  };

  /* ============================================================
     EDIT JOB
     ============================================================ */

  const openEditJob = (job: FarmerJob) => {
    setEditingJobId(job.id);

    setJobTitle(job.title || '');

    const storedJobType = job.jobType || '';

    if (FIELD_TYPES.includes(storedJobType)) {
      setFieldType(storedJobType);
      setCustomField('');
    } else {
      setFieldType('Custom Field');
      setCustomField(storedJobType);
    }

    setJobDescription(job.description || '');

    setFarmersNeeded(
      Number(job.farmersNeeded) || 1
    );

    setJobHours(
      getHoursNumber(job.workingHours)
    );

    setJobWage(
      Number(job.hourlyRate) || ''
    );

    setProvince(job.district || '');
    setJobLocation(job.location || '');
    setJobDate(job.date || '');

    setPostingLanguage(
      job.originalLanguage || language
    );

    setJobError('');
    setJobSuccess(false);
    setViewingJob(null);
    setHireModalOpen(true);
  };

  /* ============================================================
     UPDATE JOB
     ============================================================ */

  const persistUpdatedJob = (
    updatedJob: FarmerJob
  ) => {
    const database = db as any;

    try {
      if (
        typeof database.updateFarmerJob ===
        'function'
      ) {
        database.updateFarmerJob(updatedJob);
        return;
      }
    } catch {
      // fallback below
    }

    const raw =
      localStorage.getItem(
        'agralyticx_farmer_jobs'
      ) || '[]';

    let allJobs: FarmerJob[] = [];

    try {
      const parsed = JSON.parse(raw);
      allJobs = Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      allJobs = [];
    }

    const updatedJobs = allJobs.map(
      (job: FarmerJob) =>
        job.id === updatedJob.id
          ? updatedJob
          : job
    );

    localStorage.setItem(
      'agralyticx_farmer_jobs',
      JSON.stringify(updatedJobs)
    );
  };

  /* ============================================================
     DELETE JOB
     ============================================================ */

  const deleteJob = (job: FarmerJob) => {
    if (!user) return;

    const confirmed = window.confirm(
      ui.deleteConfirm
    );

    if (!confirmed) return;

    const database = db as any;

    try {
      if (
        typeof database.deleteFarmerJob ===
        'function'
      ) {
        database.deleteFarmerJob(
          job.id,
          user.userId
        );
      } else {
        throw new Error('fallback');
      }
    } catch {
      const raw =
        localStorage.getItem(
          'agralyticx_farmer_jobs'
        ) || '[]';

      let allJobs: FarmerJob[] = [];

      try {
        const parsed = JSON.parse(raw);

        allJobs = Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        allJobs = [];
      }

      const updatedJobs =
        allJobs.filter(
          (item: FarmerJob) =>
            !(
              item.id === job.id &&
              item.landownerId ===
                user.userId
            )
        );

      localStorage.setItem(
        'agralyticx_farmer_jobs',
        JSON.stringify(updatedJobs)
      );
    }

    setJobs((previous) =>
      previous.filter(
        (item) => item.id !== job.id
      )
    );

    setViewingJob(null);
  };

  /* ============================================================
     CREATE / UPDATE JOB
     ============================================================ */

  const handleHireFarmer = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) return;

    setJobError('');

    const title = jobTitle.trim();
    const description = jobDescription.trim();
    const location = jobLocation.trim();
    const customValue = customField.trim();

    const numericFarmers =
      Number(farmersNeeded);

    const numericHours =
      Number(jobHours);

    const numericWage =
      Number(jobWage);

    if (
      !title ||
      !description ||
      !location ||
      !province ||
      !jobDate ||
      !fieldType ||
      !Number.isFinite(numericFarmers) ||
      numericFarmers < 1 ||
      !Number.isFinite(numericHours) ||
      numericHours < 1 ||
      !Number.isFinite(numericWage) ||
      numericWage < 1
    ) {
      setJobError(ui.validation);
      return;
    }

    if (
      fieldType === 'Custom Field' &&
      !customValue
    ) {
      setJobError(ui.validation);
      return;
    }

    const finalFieldType =
      fieldType === 'Custom Field'
        ? customValue
        : fieldType;

    const finalBudget =
      numericHours *
      numericWage *
      numericFarmers;

    /* ==========================================================
       UPDATE EXISTING JOB
       ========================================================== */

    if (editingJobId) {
      const existingJob = jobs.find(
        (job) =>
          job.id === editingJobId
      );

      if (!existingJob) {
        setJobError(ui.validation);
        return;
      }

      const acceptedCount =
        getAcceptedCount(existingJob);

      const updatedStatus =
        acceptedCount >= numericFarmers
          ? 'Closed'
          : 'Open';

      const updatedJob: FarmerJob = {
        ...existingJob,

        title,
        description,

        originalLanguage:
          postingLanguage,

        jobType:
          finalFieldType,

        crop:
          finalFieldType,

        location,

        district:
          province,

        farmersNeeded:
          numericFarmers,

        hourlyRate:
          numericWage,

        workingHours:
          `${numericHours} Hours/Day`,

        date:
          jobDate,

        budget:
          finalBudget,

        status:
          updatedStatus
      };

      persistUpdatedJob(updatedJob);

      setJobs((previous) =>
        previous.map((job) =>
          job.id === updatedJob.id
            ? updatedJob
            : job
        )
      );

      setJobSuccess(true);

      setTimeout(() => {
        setHireModalOpen(false);
        resetJobForm();
      }, 1200);

      return;
    }

    /* ==========================================================
       CREATE NEW JOB
       ========================================================== */

    const newJob: FarmerJob = {
      id: `job_${Date.now()}`,

      landownerId:
        user.userId,

      landownerName:
        user.name,

      phone:
        user.phone || '',

      title,

      description,

      originalLanguage:
        postingLanguage,

      jobType:
        finalFieldType,

      crop:
        finalFieldType,

      location,

      district:
        province,

      farmersNeeded:
        numericFarmers,

      hourlyRate:
        numericWage,

      workingHours:
        `${numericHours} Hours/Day`,

      date:
        jobDate,

      budget:
        finalBudget,

      status:
        'Open',

      createdAt:
        new Date().toISOString(),

      applicants: []
    };

    db.createFarmerJob(newJob);

    setJobSuccess(true);

    loadData();

    setTimeout(() => {
      setHireModalOpen(false);
      resetJobForm();
    }, 1500);
  };

  /* ============================================================
     TRANSPORT
     ============================================================ */

  const handleBookTransport = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) return;

    const estimatedCost =
      Number(weightTons) * 1200 + 3500;

    const booking: TransportBooking = {
      id: `tb_${Date.now()}`,
      requesterId: user.userId,
      requesterName: user.name,
      requesterRole: 'landowner',
      phone: '+92 300 1234567',
      pickupLocation,
      destination: deliveryLocation,
      cropCargo: cropType,
      quantityTons: Number(weightTons),
      vehicleRequirement:
        'Mazda (Small Truck)',
      scheduledDate: pickupDate,
      status: 'Pending',
      estimatedCostPkr: estimatedCost,
      createdAt:
        new Date().toISOString()
    };

    db.createTransportBooking(booking);

    setTransportSuccess(true);

    setTimeout(() => {
      setTransportSuccess(false);
      setTransportModalOpen(false);
    }, 2000);
  };

  /* ============================================================
     ADD LAND
     ============================================================ */

  const handleAddLand = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) return;

    const rec: LandRecord = {
      id: `land_${Date.now()}`,
      userId: user.userId,
      title: parcelName.trim(),
      acres: Number(acres),
      location:
        `${tehsil.trim()}, ${district.trim()}`,
      tehsil: tehsil.trim(),
      district: district.trim(),
      soilSuitability: [
        'Wheat',
        'Cotton',
        'Sugarcane'
      ],
      waterSource:
        'Canal + Solar',
      isAvailableForLease: false,
      updatedAt:
        new Date().toISOString()
    };

    db.saveLandRecord(rec);

    setLands((previous) => [
      ...previous,
      rec
    ]);

    setAddLandModalOpen(false);

    setParcelName('');
    setTehsil('');
    setDistrict('');
  };

  /* ============================================================
     SHARED INPUT CLASSES
     ============================================================ */

  const inputClass =
    'w-full px-4 py-3 border border-[#DDE8DD] rounded-xl text-sm leading-6 outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition';

  const numericInputClass =
    `${inputClass} text-left`;

  /* ============================================================
     HIRE FARMERS MODAL
     ============================================================ */

  const hireFarmersModal =
    hireModalOpen &&
    typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 w-screen h-screen overflow-y-auto bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 999999 }}
            dir={isRTL ? 'rtl' : 'ltr'}
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closeJobModal();
              }
            }}
          >
            <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
              <div
                className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#DDE8DD] max-h-[94vh] overflow-y-auto"
                style={{ zIndex: 1000000 }}
                onMouseDown={(e) =>
                  e.stopPropagation()
                }
              >
                <div className="p-6 sm:p-8">

                  <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-[#DDE8DD]">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-[#1F2933] leading-7">
                        {editingJobId
                          ? ui.editJob
                          : ui.hireTitle}
                      </h3>

                      <p className="text-sm text-[#5F6B63] mt-1.5 leading-6">
                        {ui.hireSubtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeJobModal}
                      className="shrink-0 p-2 rounded-xl hover:bg-[#F1F5F1] transition"
                    >
                      <X className="w-5 h-5 text-[#5F6B63]" />
                    </button>
                  </div>

                  {jobSuccess && (
                    <div className="mb-5 p-4 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-sm font-bold border border-[#4CAF50] leading-6">
                      ✓{' '}
                      {editingJobId
                        ? ui.updateSuccess
                        : ui.success}
                    </div>
                  )}

                  {jobError && (
                    <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-700 text-sm font-bold border border-red-200 leading-6">
                      {jobError}
                    </div>
                  )}

                  <form
                    onSubmit={handleHireFarmer}
                    className="space-y-5"
                  >

                    {/* 1 JOB TITLE */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.jobTitle}
                      </label>

                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) =>
                          setJobTitle(
                            e.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </div>

                    {/* 2 FIELD TYPE */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.fieldType}
                      </label>

                      <select
                        required
                        value={fieldType}
                        onChange={(e) => {
                          const value =
                            e.target.value;

                          setFieldType(value);

                          if (
                            value !==
                            'Custom Field'
                          ) {
                            setCustomField('');
                          }
                        }}
                        className={`${inputClass} bg-white`}
                      >
                        <option value="">
                          {ui.selectFieldType}
                        </option>

                        {FIELD_TYPES.map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                            >
                              {
                                FIELD_TYPE_LABELS[
                                  type
                                ][language]
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* 3 CUSTOM FIELD */}
                    {fieldType ===
                      'Custom Field' && (
                      <div>
                        <label className="block text-sm font-bold text-[#1F2933] mb-2">
                          {ui.customField}
                        </label>

                        <input
                          type="text"
                          required
                          value={customField}
                          onChange={(e) =>
                            setCustomField(
                              e.target.value
                            )
                          }
                          placeholder={
                            ui.customFieldPlaceholder
                          }
                          className={inputClass}
                        />
                      </div>
                    )}

                    {/* 4 DESCRIPTION */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.shortDescription}
                      </label>

                      <textarea
                        required
                        value={jobDescription}
                        onChange={(e) =>
                          setJobDescription(
                            e.target.value
                          )
                        }
                        placeholder={
                          ui.descriptionPlaceholder
                        }
                        rows={4}
                        maxLength={500}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* 5 FARMERS */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.farmersNeeded}
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={farmersNeeded}
                        onChange={(e) =>
                          setFarmersNeeded(
                            e.target.value === ''
                              ? ''
                              : Number(
                                  e.target.value
                                )
                          )
                        }
                        dir="ltr"
                        className={numericInputClass}
                      />
                    </div>

                    {/* 6 HOURS */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.workingHours}
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        required
                        value={jobHours}
                        onChange={(e) =>
                          setJobHours(
                            e.target.value === ''
                              ? ''
                              : Number(
                                  e.target.value
                                )
                          )
                        }
                        placeholder={
                          ui.hoursPlaceholder
                        }
                        dir="ltr"
                        className={numericInputClass}
                      />
                    </div>

                    {/* 7 PRICE */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.pricePerHour}
                      </label>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={jobWage}
                        onChange={(e) =>
                          setJobWage(
                            e.target.value === ''
                              ? ''
                              : Number(
                                  e.target.value
                                )
                          )
                        }
                        placeholder="0"
                        dir="ltr"
                        inputMode="numeric"
                        className={numericInputClass}
                      />
                    </div>

                    {/* 8 PROVINCE */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.province}
                      </label>

                      <select
                        required
                        value={province}
                        onChange={(e) =>
                          setProvince(
                            e.target.value
                          )
                        }
                        className={`${inputClass} bg-white`}
                      >
                        <option value="">
                          {ui.selectProvince}
                        </option>

                        {PROVINCES.map(
                          (item) => (
                            <option
                              key={item.value}
                              value={item.value}
                            >
                              {
                                item.labels[
                                  language
                                ]
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* 9 ADDRESS */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.workAddress}
                      </label>

                      <input
                        type="text"
                        required
                        value={jobLocation}
                        onChange={(e) =>
                          setJobLocation(
                            e.target.value
                          )
                        }
                        placeholder={
                          ui.addressPlaceholder
                        }
                        className={inputClass}
                      />
                    </div>

                    {/* 10 DATE */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.date}
                      </label>

                      <input
                        type="date"
                        required
                        value={jobDate}
                        onChange={(e) =>
                          setJobDate(
                            e.target.value
                          )
                        }
                        dir="ltr"
                        className={inputClass}
                      />
                    </div>

                    {/* POSTING LANGUAGE */}
                    <div>
                      <label className="block text-sm font-bold text-[#1F2933] mb-2">
                        {ui.postingLanguage}
                      </label>

                      <select
                        value={postingLanguage}
                        onChange={(e) =>
                          setPostingLanguage(
                            e.target
                              .value as LanguageCode
                          )
                        }
                        className={`${inputClass} bg-white`}
                      >
                        <option value="en">
                          {ui.english}
                        </option>

                        <option value="ur">
                          {ui.urdu}
                        </option>

                        <option value="pa">
                          {ui.punjabi}
                        </option>
                      </select>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#DDE8DD]">
                      <button
                        type="button"
                        onClick={closeJobModal}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#DDE8DD] text-sm font-bold text-[#5F6B63] hover:bg-[#F8FAF7] transition"
                      >
                        {ui.cancel}
                      </button>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md transition"
                      >
                        {editingJobId
                          ? ui.updateJob
                          : ui.postJob}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  /* ============================================================
     VIEW JOB MODAL
     ============================================================ */

  const viewJobModal =
    viewingJob &&
    typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 w-screen h-screen overflow-y-auto bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 999998 }}
            dir={isRTL ? 'rtl' : 'ltr'}
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                setViewingJob(null);
              }
            }}
          >
            <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
              <div
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#DDE8DD] max-h-[94vh] overflow-y-auto"
                onMouseDown={(e) =>
                  e.stopPropagation()
                }
              >
                <div className="p-6 sm:p-8">

                  <div className="flex items-start justify-between gap-4 pb-5 mb-5 border-b border-[#DDE8DD]">
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-[#1F2933] leading-7 break-words">
                        {viewingJob.title}
                      </h3>

                      <p className="text-sm text-[#5F6B63] mt-1.5 leading-6">
                        {ui.jobDetails}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setViewingJob(null)
                      }
                      className="shrink-0 p-2 rounded-xl hover:bg-[#F1F5F1]"
                    >
                      <X className="w-5 h-5 text-[#5F6B63]" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="text-sm font-bold text-[#2E7D32]">
                      {formatRate(
                        Number(
                          viewingJob.hourlyRate
                        ),
                        language
                      )}
                    </span>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        String(
                          viewingJob.status
                        ) === 'Closed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#E8F5E9] text-[#2E7D32]'
                      }`}
                    >
                      {String(
                        viewingJob.status
                      ) === 'Closed'
                        ? ui.closed
                        : ui.open}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <div className="rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                      <p className="text-xs text-[#7A857D] mb-1">
                        {ui.fieldType}
                      </p>

                      <p className="font-bold text-sm text-[#1F2933] leading-6 break-words">
                        {FIELD_TYPE_LABELS[
                          viewingJob.jobType
                        ]?.[language] ||
                          viewingJob.jobType}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                      <p className="text-xs text-[#7A857D] mb-1">
                        {ui.farmersNeeded}
                      </p>

                      <p className="font-bold text-sm text-[#1F2933]">
                        {viewingJob.farmersNeeded}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                      <p className="text-xs text-[#7A857D] mb-1">
                        {ui.workingHours}
                      </p>

                      <p className="font-bold text-sm text-[#1F2933] leading-6">
                        {formatHours(
                          viewingJob.workingHours,
                          language
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                      <p className="text-xs text-[#7A857D] mb-1">
                        {ui.accepted}
                      </p>

                      <p
                        className="font-bold text-sm text-[#1F2933]"
                        dir="ltr"
                      >
                        {getAcceptedCount(
                          viewingJob
                        )}{' '}
                        /{' '}
                        {viewingJob.farmersNeeded}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                      <p className="text-xs text-[#7A857D] mb-1">
                        {ui.province}
                      </p>

                      <p className="font-bold text-sm text-[#1F2933] leading-6">
                        {getProvinceLabel(
                          viewingJob.district,
                          language
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                      <p className="text-xs text-[#7A857D] mb-1">
                        {ui.date}
                      </p>

                      <p
                        className="font-bold text-sm text-[#1F2933] leading-6"
                        dir="ltr"
                      >
                        {formatDate(
                          viewingJob.date,
                          language
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                    <p className="text-xs text-[#7A857D] mb-1">
                      {ui.shortDescription}
                    </p>

                    <p className="text-sm text-[#1F2933] leading-7 break-words">
                      {viewingJob.description}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                    <p className="text-xs text-[#7A857D] mb-1">
                      {ui.workAddress}
                    </p>

                    <p className="text-sm font-bold text-[#1F2933] leading-7 break-words">
                      📍 {viewingJob.location}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                    <p className="text-xs text-[#7A857D] mb-1">
                      {ui.postingLanguage}
                    </p>

                    <p className="text-sm font-bold text-[#2E7D32]">
                      {getLanguageName(
                        viewingJob.originalLanguage ||
                          'en',
                        ui
                      )}
                    </p>
                  </div>

                  <div className="mt-3 rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-4">
                    <p className="text-xs text-[#7A857D] mb-1">
                      {ui.budget}
                    </p>

                    <p
                      className="text-sm font-bold text-[#1F2933]"
                      dir="ltr"
                    >
                      Rs. {Number(
                        viewingJob.budget || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 mt-5 border-t border-[#DDE8DD]">
                    <button
                      type="button"
                      onClick={() =>
                        setViewingJob(null)
                      }
                      className="px-6 py-3 rounded-xl border border-[#DDE8DD] text-sm font-bold text-[#5F6B63]"
                    >
                      {ui.close}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const selected =
                          viewingJob;

                        setViewingJob(null);
                        openEditJob(selected);
                      }}
                      className="px-6 py-3 rounded-xl bg-[#2E7D32] text-white text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      {ui.editJob}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteJob(viewingJob)
                      }
                      className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {ui.deleteJob}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  /* ============================================================
     PAGE
     ============================================================ */

  return (
    <>
      <div
        className="landowner-dashboard-bg max-w-6xl mx-auto px-4 py-8 space-y-8"
        dir={isRTL ? 'rtl' : 'ltr'}
      >

        {/* BACKGROUND */}

        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              `url(${landownerBgImage})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.45,
            zIndex: -1
          }}
        />

        {/* HEADER */}

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

          <div className="space-y-2 min-w-0">
            <span className="inline-flex text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
              🌳 {t.roles.landowner}
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F2933] leading-tight break-words">
              {t.welcome}{' '}
              <span className="text-[#2E7D32]">
                {user?.name}
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

            <button
              type="button"
              onClick={openCreateJobModal}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.hireFarmers}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setTransportModalOpen(true)
              }
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-white border border-[#DDE8DD] hover:bg-[#F8FAF7] text-[#1F2933] font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Truck className="w-4 h-4 text-[#2E7D32]" />
              <span>{t.bookTransport}</span>
            </button>
          </div>
        </div>

        {/* LAND + JOBS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LAND */}

          <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">

            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#DDE8DD]">

              <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2 min-w-0">
                <Trees className="w-5 h-5 text-[#2E7D32] shrink-0" />

                <span className="break-words">
                  {t.landRecordsTitle}
                </span>
              </h3>

              <button
                type="button"
                onClick={() =>
                  setAddLandModalOpen(true)
                }
                className="shrink-0 p-1.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#DDE8DD]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {lands.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5F6B63] leading-6">
                No land parcels registered yet. Tap + to add acreage.
              </div>
            ) : (
              lands.map((land) => (
                <div
                  key={land.id}
                  className="p-4 rounded-2xl border border-[#DDE8DD] bg-[#F8FAF7] space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm text-[#1F2933] leading-6 break-words">
                      {land.title}
                    </h4>

                    <span
                      className="shrink-0 text-xs font-extrabold text-[#2E7D32]"
                      dir="ltr"
                    >
                      {land.acres} Acres
                    </span>
                  </div>

                  <p className="text-xs text-[#5F6B63] leading-6 break-words">
                    📍 {land.tehsil},{' '}
                    {land.district}
                  </p>

                  <div className="text-[11px] text-[#5F6B63] pt-1">
                    Water: {land.waterSource}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* JOBS */}

          <div className="glass-card rounded-3xl p-6 border border-[#DDE8DD] bg-white space-y-4">

            <div className="flex items-center gap-2 pb-3 border-b border-[#DDE8DD]">
              <Clock className="w-5 h-5 text-[#2E7D32]" />

              <h3 className="text-lg font-bold text-[#1F2933]">
                {ui.jobPostings}
              </h3>
            </div>

            {jobs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5F6B63] leading-6">
                {ui.noJobs}
              </div>
            ) : (
              <div className="space-y-4">

                {jobs.map((job) => {
                  const acceptedCount =
                    getAcceptedCount(job);

                  const isClosed =
                    String(job.status) ===
                      'Closed' ||
                    acceptedCount >=
                      Number(
                        job.farmersNeeded
                      );

                  return (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl border border-[#DDE8DD] bg-[#F8FAF7] space-y-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">
                          <h4 className="font-bold text-base text-[#1F2933] leading-6 break-words">
                            {job.title ||
                              `${job.crop} ${job.jobType}`}
                          </h4>

                          {job.description && (
                            <p className="text-xs text-[#5F6B63] mt-1.5 leading-6 line-clamp-2 break-words">
                              {job.description}
                            </p>
                          )}
                        </div>

                        <span
                          className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                            isClosed
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#E8F5E9] text-[#2E7D32]'
                          }`}
                        >
                          {isClosed
                            ? ui.closed
                            : ui.open}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                        <span
                          className="font-bold text-[#2E7D32]"
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          {formatRate(
                            Number(
                              job.hourlyRate
                            ),
                            language
                          )}
                        </span>

                        <span className="text-[#5F6B63] leading-6">
                          ⏱️{' '}
                          {formatHours(
                            job.workingHours,
                            language
                          )}
                        </span>

                        <span className="text-[#5F6B63] leading-6">
                          👨‍🌾 {ui.accepted}:{' '}
                          <strong dir="ltr">
                            {acceptedCount}
                          </strong>{' '}
                          /{' '}
                          <strong dir="ltr">
                            {job.farmersNeeded}
                          </strong>{' '}
                          {ui.farmers}
                        </span>

                        <span className="text-[#5F6B63] leading-6">
                          📅{' '}
                          {formatDate(
                            job.date,
                            language
                          )}
                        </span>

                        <span className="text-[#5F6B63] sm:col-span-2 break-words leading-6">
                          📍 {job.location}
                        </span>

                        <span className="text-[#5F6B63] sm:col-span-2 break-words leading-6">
                          📍{' '}
                          {getProvinceLabel(
                            job.district,
                            language
                          )}
                        </span>
                      </div>

                      {job.originalLanguage && (
                        <div className="pt-1">
                          <span className="text-[10px] text-[#7A857D]">
                            {ui.postedIn}:{' '}
                            {getLanguageName(
                              job.originalLanguage,
                              ui
                            )}
                          </span>
                        </div>
                      )}

                      {/* JOB ACTIONS */}

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-[#DDE8DD]">

                        <button
                          type="button"
                          onClick={() =>
                            setViewingJob(job)
                          }
                          className="flex-1 min-w-[90px] px-3 py-2.5 rounded-xl bg-white border border-[#DDE8DD] hover:bg-[#E8F5E9] text-[#1F2933] text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                          {ui.viewJob}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditJob(job)
                          }
                          className="flex-1 min-w-[90px] px-3 py-2.5 rounded-xl bg-white border border-[#DDE8DD] hover:bg-[#E8F5E9] text-[#1F2933] text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#2E7D32]" />
                          {ui.editJob}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteJob(job)
                          }
                          className="flex-1 min-w-[90px] px-3 py-2.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {ui.deleteJob}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            TRANSPORT MODAL
            ======================================================== */}

        {transportModalOpen && (
          <div
            className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDE8DD] space-y-4 max-h-[92vh] overflow-y-auto">

              <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#DDE8DD]">

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#1F2933] leading-7">
                    {t.bookTransport}
                  </h3>

                  <p className="text-xs text-[#5F6B63] mt-1 leading-6">
                    {ui.dispatchTransportSubtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setTransportModalOpen(false)
                  }
                  className="shrink-0 p-2"
                >
                  <X className="w-5 h-5 text-[#5F6B63]" />
                </button>
              </div>

              {transportSuccess && (
                <div className="p-3.5 rounded-xl bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold border border-[#4CAF50] leading-6">
                  ✓ Transport request dispatched to nearby drivers!
                </div>
              )}

              <form
                onSubmit={handleBookTransport}
                className="space-y-4"
              >

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-2">
                    Pickup Location (Farm Gate)
                  </label>

                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) =>
                      setPickupLocation(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-2">
                    Destination Mandi / Mill
                  </label>

                  <input
                    type="text"
                    required
                    value={deliveryLocation}
                    onChange={(e) =>
                      setDeliveryLocation(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-bold text-[#1F2933] mb-2">
                      Crop Type
                    </label>

                    <input
                      type="text"
                      required
                      value={cropType}
                      onChange={(e) =>
                        setCropType(
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F2933] mb-2">
                      Weight (Tons)
                    </label>

                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      required
                      value={weightTons}
                      onChange={(e) =>
                        setWeightTons(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      dir="ltr"
                      className={numericInputClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setTransportModalOpen(false)
                    }
                    className="px-5 py-2.5 rounded-xl border border-[#DDE8DD] text-sm text-[#5F6B63]"
                  >
                    {t.cancel}
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold text-sm shadow-md"
                  >
                    {ui.dispatchBooking}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            ADD LAND MODAL
            ======================================================== */}

        {addLandModalOpen && (
          <div
            className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DDE8DD] space-y-4 max-h-[92vh] overflow-y-auto">

              <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#DDE8DD]">

                <h3 className="text-lg font-bold text-[#1F2933]">
                  Register Land Parcel
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setAddLandModalOpen(false)
                  }
                >
                  <X className="w-5 h-5 text-[#5F6B63]" />
                </button>
              </div>

              <form
                onSubmit={handleAddLand}
                className="space-y-4"
              >

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] mb-2">
                    Parcel Name
                  </label>

                  <input
                    type="text"
                    required
                    value={parcelName}
                    onChange={(e) =>
                      setParcelName(
                        e.target.value
                      )
                    }
                    placeholder="e.g. North Canal Orchard"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-bold text-[#1F2933] mb-2">
                      Total Acres
                    </label>

                    <input
                      type="number"
                      min="1"
                      required
                      value={acres}
                      onChange={(e) =>
                        setAcres(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      dir="ltr"
                      className={numericInputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F2933] mb-2">
                      Tehsil & District
                    </label>

                    <input
                      type="text"
                      required
                      value={tehsil}
                      onChange={(e) =>
                        setTehsil(
                          e.target.value
                        )
                      }
                      placeholder="Bhalwal, Sargodha"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() =>
                      setAddLandModalOpen(false)
                    }
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

      {/* ==========================================================
          JOB PORTALS
          ========================================================== */}

      {hireFarmersModal}
      {viewJobModal}
    </>
  );
};
