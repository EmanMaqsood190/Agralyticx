import React, { useEffect, useMemo, useState } from 'react';

import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Users,
  X,
  XCircle,
  Trash2,
  Loader2,
} from 'lucide-react';

import { useAuth } from '../../auth/AuthContext';
import { db } from '../../services/db';

import type {
  FarmerJob,
  FarmerJobTranslatedContent,
  LanguageCode,
} from '../../types';

import { useLanguage } from '../../i18n/LanguageContext';

interface DisplayJob extends FarmerJob {
  displayTitle?: string;
  displayDescription?: string;
  displayLocation?: string;
  displayDistrict?: string;
  displayCrop?: string;
  displayJobType?: string;
  displayDate?: string;
  displayWorkingHours?: string;
  displayPayment?: string;
}

/* ============================================================
   FARMER JOB UI TRANSLATIONS
   ============================================================ */

const JOB_UI: Record<
  LanguageCode,
  {
    farmerJobs: string;
    availableJobs: string;
    jobsDescription: string;

    new: string;
    job: string;
    jobs: string;

    noJobs: string;
    noJobsDescription: string;

    viewDetails: string;
    postedBy: string;

    jobDescription: string;
    noDescription: string;

    jobType: string;
    crop: string;
    location: string;
    date: string;
    workingHours: string;
    payment: string;
    farmersNeeded: string;
    district: string;

    acceptJob: string;
    rejectJob: string;

    accepted: string;
    rejected: string;
    pending: string;

    acceptedSuccessfully: string;
    rejectedSuccessfully: string;

    removeJob: string;
    removeConfirmation: string;
    remove: string;
    cancel: string;

    closingMessage: string;

    translating: string;
    translationFailed: string;
  }
> = {
  en: {
    farmerJobs: 'Farmer Jobs',
    availableJobs: 'Available Farm Jobs',

    jobsDescription:
      'Jobs posted by landowners will appear here. Open a job to view its complete details.',

    new: 'NEW',
    job: 'job',
    jobs: 'jobs',

    noJobs: 'No jobs available yet',

    noJobsDescription:
      'When a landowner posts a real job for farmers, it will appear here automatically.',

    viewDetails: 'View Details',
    postedBy: 'Posted by',

    jobDescription: 'Job Description',

    noDescription:
      'No additional description was provided by the landowner.',

    jobType: 'Job Type',
    crop: 'Crop',
    location: 'Location',
    date: 'Date',
    workingHours: 'Working Hours',
    payment: 'Payment',
    farmersNeeded: 'Farmers Needed',
    district: 'District',

    acceptJob: 'Accept Job',
    rejectJob: 'Reject Job',

    accepted: 'Accepted',
    rejected: 'Rejected',
    pending: 'Pending',

    acceptedSuccessfully:
      'Job accepted successfully.',

    rejectedSuccessfully:
      'Job rejected. You can still view this job later.',

    removeJob: 'Remove Job',

    removeConfirmation:
      'Remove this job from your Jobs section?',

    remove: 'Remove',
    cancel: 'Cancel',


    translating: 'Translating...',

    translationFailed:
      'Translation unavailable. Showing the original job text.',
  },

  ur: {
    farmerJobs: 'کسانوں کی نوکریاں',

    availableJobs: 'دستیاب زرعی کام',

    jobsDescription:
      'زمین مالکان کی طرف سے پوسٹ کیے گئے کام یہاں ظاہر ہوں گے۔ مکمل تفصیلات دیکھنے کے لیے کام کھولیں۔',

    new: 'نیا',
    job: 'کام',
    jobs: 'کام',

    noJobs: 'ابھی کوئی کام دستیاب نہیں',

    noJobsDescription:
      'جب کوئی زمین مالک کسانوں کے لیے حقیقی کام پوسٹ کرے گا تو وہ یہاں خود بخود ظاہر ہوگا۔',

    viewDetails: 'تفصیلات دیکھیں',

    postedBy: 'پوسٹ کیا گیا',

    jobDescription: 'کام کی تفصیل',

    noDescription:
      'زمین مالک کی طرف سے کوئی اضافی تفصیل فراہم نہیں کی گئی۔',

    jobType: 'کام کی قسم',
    crop: 'فصل',
    location: 'مقام',
    date: 'تاریخ',
    workingHours: 'کام کے اوقات',
    payment: 'ادائیگی',
    farmersNeeded: 'درکار کسان',
    district: 'ضلع',

    acceptJob: 'کام قبول کریں',
    rejectJob: 'کام مسترد کریں',

    accepted: 'قبول کیا گیا',
    rejected: 'مسترد کیا گیا',
    pending: 'زیرِ التوا',

    acceptedSuccessfully:
      'کام کامیابی سے قبول کر لیا گیا۔',

    rejectedSuccessfully:
      'کام مسترد کر دیا گیا۔ آپ اسے بعد میں بھی دیکھ سکتے ہیں۔',

    removeJob: 'کام ہٹائیں',

    removeConfirmation:
      'کیا آپ اس کام کو اپنی Jobs فہرست سے ہٹانا چاہتے ہیں؟',

    remove: 'ہٹائیں',
    cancel: 'منسوخ کریں',

    translating: 'ترجمہ کیا جا رہا ہے...',

    translationFailed:
      'ترجمہ دستیاب نہیں۔ اصل کام کا متن دکھایا جا رہا ہے۔',
  },

  pa: {
    farmerJobs: 'کساناں دے کم',

    availableJobs: 'دستیاب کھیتی باڑی دے کم',

    jobsDescription:
      'زمین مالکان ولوں پوسٹ کیتے گئے کم ایتھے نظر آون گے۔ مکمل تفصیل ویکھن لئی کم کھولو۔',

    new: 'نواں',
    job: 'کم',
    jobs: 'کم',

    noJobs: 'ہن تک کوئی کم دستیاب نہیں',

    noJobsDescription:
      'جدوں کوئی زمین مالک کساناں لئی حقیقی کم پوسٹ کرے گا، اوہ ایتھے آپ نظر آ جائے گا۔',

    viewDetails: 'تفصیل ویکھو',

    postedBy: 'پوسٹ کرن والا',

    jobDescription: 'کم دی تفصیل',

    noDescription:
      'زمین مالک ولوں کوئی ہور تفصیل نہیں دِتی گئی۔',

    jobType: 'کم دی قسم',
    crop: 'فصل',
    location: 'تھاں',
    date: 'تاریخ',
    workingHours: 'کم دے اوقات',
    payment: 'ادائیگی',
    farmersNeeded: 'لوڑ والے کسان',
    district: 'ضلع',

    acceptJob: 'کم قبول کرو',
    rejectJob: 'کم رد کرو',

    accepted: 'قبول ہو گیا',
    rejected: 'رد ہو گیا',
    pending: 'زیرِ التوا',

    acceptedSuccessfully:
      'کم کامیابی نال قبول ہو گیا۔',

    rejectedSuccessfully:
      'کم رد کر دِتا گیا۔ تسی ایہ کم بعد وچ وی ویکھ سکدے او۔',

    removeJob: 'کم ہٹاؤ',

    removeConfirmation:
      'کی تسی ایہ کم اپنی Jobs فہرست وچوں ہٹانا چاہندے او؟',

    remove: 'ہٹاؤ',
    cancel: 'منسوخ کرو',


    translating: 'ترجمہ ہو رہیا اے...',

    translationFailed:
      'ترجمہ دستیاب نہیں۔ اصل کم دا متن دکھایا جا رہیا اے۔',
  },
};

/* ============================================================
   PAKISTANI PUNJABI
   GURMUKHI -> SHAHMUKHI
   ============================================================ */

const PUNJABI_REPLACEMENTS: Array<[string, string]> = [
  /* Locations */
  ['ਚੱਕ 42 ਆਰਬੀ, ਸਰਗੋਧਾ', 'چک 42 آر بی، سرگودھا'],
  ['ਚੱਕ 42 ਆਰਬੀ', 'چک 42 آر بی'],
  ['ਚੱਕ', 'چک'],
  ['ਆਰਬੀ', 'آر بی'],
  ['ਸਰਗੋਧਾ', 'سرگودھا'],

  /* Location vocabulary */
  ['ਜ਼ਿਲ੍ਹਾ', 'ضلع'],
  ['ਜ਼ਿਲਾ', 'ضلع'],
  ['ਪਿੰਡ', 'پنڈ'],
  ['ਸ਼ਹਿਰ', 'شہر'],

  /* Farming */
  ['ਕਣਕ ਦੀ ਵਾਢੀ ਅਤੇ ਪਿੜਾਈ', 'کنک دی کٹائی تے گاہ'],
  ['ਕਣਕ ਦੀ ਵਾਢੀ', 'کنک دی کٹائی'],
  ['ਕਣਕ ਦੀ ਕਟਾਈ', 'کنک دی کٹائی'],
  ['ਵਾਢੀ ਅਤੇ ਪਿੜਾਈ', 'کٹائی تے گاہ'],

  ['ਕਣਕ', 'کنک'],
  ['ਵਾਢੀ', 'کٹائی'],
  ['ਪਿੜਾਈ', 'گاہ'],

  ['ਖੇਤ', 'کھیت'],
  ['ਖੇਤੀ', 'کھیتی'],

  ['ਕਿਸਾਨਾਂ', 'کساناں'],
  ['ਕਿਸਾਨ', 'کسان'],

  ['ਕੰਮ', 'کم'],
  ['ਨਵਾਂ', 'نواں'],

  ['ਜ਼ਮੀਨ ਮਾਲਕ', 'زمین مالک'],
  ['ਜ਼ਮੀਨ', 'زمین'],
  ['ਮਾਲਕ', 'مالک'],

  ['ਫ਼ਸਲ', 'فصل'],
  ['ਫਸਲ', 'فصل'],

  ['ਸਿੰਚਾਈ', 'آبپاشی'],
  ['ਬਿਜਾਈ', 'بوائی'],
  ['ਜੁਤਾਈ', 'جتائی'],

  /* Time */
  ['ਘੰਟੇ', 'گھنٹے'],
  ['ਘੰਟਾ', 'گھنٹہ'],
  ['ਦਿਨ', 'دن'],
  ['ਹਫ਼ਤਾ', 'ہفتہ'],
  ['ਹਫਤਾ', 'ہفتہ'],

  /* Money */
  ['ਰੁਪਏ', 'روپے'],

  /* Common words */
  ['ਲਈ', 'لئی'],
  ['ਦੀਆਂ', 'دیاں'],
  ['ਦੇ', 'دے'],
  ['ਦੀ', 'دی'],
  ['ਦਾ', 'دا'],
  ['ਨੂੰ', 'نوں'],
  ['ਵਿੱਚ', 'وچ'],
  ['ਵੱਲੋਂ', 'ولوں'],
  ['ਇੱਥੇ', 'ایتھے'],
  ['ਉੱਥੇ', 'اوتھے'],
  ['ਵੇਖੋ', 'ویکھو'],
  ['ਵੇਖਣ', 'ویکھن'],
  ['ਕਰੋ', 'کرو'],
  ['ਕਰਨਾ', 'کرنا'],
  ['ਚਾਹੀਦਾ', 'چاہیدا'],

  /* English date words if they reach Punjabi */
  ['Tomorrow', 'کل'],
  ['tomorrow', 'کل'],
  ['Today', 'اج'],
  ['today', 'اج'],
  ['Yesterday', 'کلّ'],
  ['yesterday', 'کلّ'],
];

/* ============================================================
   NORMALIZE PUNJABI
   ============================================================ */

const normalizePunjabi = (
  value: string
): string => {
  if (!value) {
    return value;
  }

  let result = value;

  for (
    const [from, to]
    of PUNJABI_REPLACEMENTS
  ) {
    result = result
      .split(from)
      .join(to);
  }

  return result;
};

/* ============================================================
   DATE FORMATTER
   ============================================================ */

const formatDateForLanguage = (
  value: string | undefined,
  language: LanguageCode
): string => {
  if (!value) {
    return '-';
  }

  const raw = String(value).trim();

  if (language === 'en') {
    return raw;
  }

  const lower = raw.toLowerCase();

  /* Urdu */
  if (language === 'ur') {
    if (
      lower === 'tomorrow' ||
      lower === 'tomorrow.'
    ) {
      return 'کل';
    }

    if (
      lower === 'today' ||
      lower === 'today.'
    ) {
      return 'آج';
    }

    if (
      lower === 'yesterday' ||
      lower === 'yesterday.'
    ) {
      return 'گزشتہ روز';
    }

    if (lower === 'monday') return 'پیر';
    if (lower === 'tuesday') return 'منگل';
    if (lower === 'wednesday') return 'بدھ';
    if (lower === 'thursday') return 'جمعرات';
    if (lower === 'friday') return 'جمعہ';
    if (lower === 'saturday') return 'ہفتہ';
    if (lower === 'sunday') return 'اتوار';

    return raw;
  }

  /* Punjabi Shahmukhi */
  if (language === 'pa') {
    if (
      lower === 'tomorrow' ||
      lower === 'tomorrow.'
    ) {
      return 'کل';
    }

    if (
      lower === 'today' ||
      lower === 'today.'
    ) {
      return 'اج';
    }

    if (
      lower === 'yesterday' ||
      lower === 'yesterday.'
    ) {
      return 'کلّ';
    }

    if (lower === 'monday') return 'سوموار';
    if (lower === 'tuesday') return 'منگل';
    if (lower === 'wednesday') return 'بدھ';
    if (lower === 'thursday') return 'جمعرات';
    if (lower === 'friday') return 'جمعہ';
    if (lower === 'saturday') return 'ہفتہ';
    if (lower === 'sunday') return 'اتوار';

    return normalizePunjabi(raw);
  }

  return raw;
};

/* ============================================================
   WORKING HOURS FORMATTER
   ============================================================ */

const formatWorkingHoursForLanguage = (
  value: string | undefined,
  language: LanguageCode
): string => {
  if (!value) {
    return '-';
  }

  let result = String(value).trim();

  if (language === 'en') {
    return result;
  }

  if (language === 'ur') {
    result = result
      .replace(
        /Hours\s*\/\s*Day/gi,
        'گھنٹے/دن'
      )
      .replace(
        /Hour\s*\/\s*Day/gi,
        'گھنٹہ/دن'
      )
      .replace(
        /Hours\s+per\s+Day/gi,
        'گھنٹے/دن'
      )
      .replace(
        /Hour\s+per\s+Day/gi,
        'گھنٹہ/دن'
      )
      .replace(
        /Hours/gi,
        'گھنٹے'
      )
      .replace(
        /Hour/gi,
        'گھنٹہ'
      )
      .replace(
        /\s*\/\s*Day/gi,
        '/دن'
      )
      .replace(
        /\s+per\s+Day/gi,
        '/دن'
      );

    return result;
  }

  if (language === 'pa') {
    result = normalizePunjabi(result);

    result = result
      .replace(
        /Hours\s*\/\s*Day/gi,
        'گھنٹے/دن'
      )
      .replace(
        /Hour\s*\/\s*Day/gi,
        'گھنٹہ/دن'
      )
      .replace(
        /Hours\s+per\s+Day/gi,
        'گھنٹے/دن'
      )
      .replace(
        /Hour\s+per\s+Day/gi,
        'گھنٹہ/دن'
      )
      .replace(
        /Hours/gi,
        'گھنٹے'
      )
      .replace(
        /Hour/gi,
        'گھنٹہ'
      )
      .replace(
        /\s*\/\s*Day/gi,
        '/دن'
      )
      .replace(
        /\s+per\s+Day/gi,
        '/دن'
      );

    return normalizePunjabi(result);
  }

  return result;
};

/* ============================================================
   PAYMENT FORMATTER
   ============================================================ */

const formatPaymentForLanguage = (
  value: number | string | undefined,
  language: LanguageCode
): string => {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return '-';
  }

  if (language === 'en') {
    return `Rs. ${value}/hour`;
  }

  if (language === 'ur') {
    return `${value} روپے/گھنٹہ`;
  }

  if (language === 'pa') {
    return `${value} روپے/گھنٹہ`;
  }

  return `Rs. ${value}/hour`;
};

/* ============================================================
   LOCATION FORMATTER
   ============================================================ */

const formatLocationForLanguage = (
  value: string | undefined,
  language: LanguageCode
): string => {
  if (!value) {
    return '-';
  }

  if (language === 'pa') {
    return normalizePunjabi(value);
  }

  return value;
};

/* ============================================================
   DISTRICT FORMATTER
   ============================================================ */

const formatDistrictForLanguage = (
  value: string | undefined,
  language: LanguageCode
): string => {
  if (!value) {
    return '-';
  }

  if (language === 'pa') {
    return normalizePunjabi(value);
  }

  return value;
};

/* ============================================================
   TEXT STYLE
   ============================================================ */

const textClass = (
  language: LanguageCode,
  classes: string = ''
): string => {
  if (language === 'ur') {
    return `${classes} leading-[2.1] break-words`;
  }

  if (language === 'pa') {
    return `${classes} leading-[1.9] break-words`;
  }

  return classes;
};

/* ============================================================
   TRANSLATION
   ============================================================ */

const translateText = async (
  text: string,
  from: LanguageCode,
  to: LanguageCode
): Promise<string> => {
  if (!text || !text.trim()) {
    return '';
  }

  if (from === to) {
    if (to === 'pa') {
      return normalizePunjabi(text);
    }

    return text;
  }

  try {
    const url =
      'https://translate.googleapis.com/translate_a/single' +
      '?client=gtx' +
      `&sl=${encodeURIComponent(from)}` +
      `&tl=${encodeURIComponent(to)}` +
      '&dt=t' +
      `&q=${encodeURIComponent(text.trim())}`;

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Translation failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (
      Array.isArray(data) &&
      Array.isArray(data[0])
    ) {
      let result = '';

      for (
        const item of data[0]
      ) {
        if (
          Array.isArray(item) &&
          typeof item[0] === 'string'
        ) {
          result += item[0];
        }
      }

      if (result.trim()) {
        return to === 'pa'
          ? normalizePunjabi(result)
          : result;
      }
    }

    return text;
  } catch (error) {
    console.error(
      'Farmer job translation error:',
      error
    );

    return text;
  }
};

/* ============================================================
   TRANSLATE JOB
   ============================================================ */

const getTranslatedJob = async (
  job: FarmerJob,
  language: LanguageCode
): Promise<DisplayJob> => {
  const originalLanguage =
    job.originalLanguage || 'en';

  /* ==========================================================
     SAME LANGUAGE
     ========================================================== */

  if (
    originalLanguage === language
  ) {
    return {
      ...job,

      displayTitle:
        language === 'pa'
          ? normalizePunjabi(
              job.title || ''
            )
          : job.title,

      displayDescription:
        language === 'pa'
          ? normalizePunjabi(
              job.description || ''
            )
          : job.description,

      displayLocation:
        formatLocationForLanguage(
          job.location,
          language
        ),

      displayDistrict:
        formatDistrictForLanguage(
          job.district,
          language
        ),

      displayCrop:
        language === 'pa'
          ? normalizePunjabi(
              job.crop || ''
            )
          : job.crop,

      displayJobType:
        language === 'pa'
          ? normalizePunjabi(
              job.jobType || ''
            )
          : job.jobType,

      displayDate:
        formatDateForLanguage(
          job.date,
          language
        ),

      displayWorkingHours:
        formatWorkingHoursForLanguage(
          job.workingHours,
          language
        ),

      displayPayment:
        formatPaymentForLanguage(
          job.hourlyRate,
          language
        ),
    };
  }

  /* ==========================================================
     CACHED TRANSLATION
     ========================================================== */

  const cached =
    db.getFarmerJobTranslation(
      job.id,
      language
    );

  if (cached) {
    return {
      ...job,

      displayTitle:
        language === 'pa'
          ? normalizePunjabi(
              cached.title || ''
            )
          : cached.title ||
            job.title,

      displayDescription:
        language === 'pa'
          ? normalizePunjabi(
              cached.description || ''
            )
          : cached.description ||
            job.description,

      displayLocation:
        formatLocationForLanguage(
          cached.location ||
            job.location,
          language
        ),

      displayDistrict:
        formatDistrictForLanguage(
          cached.district ||
            job.district,
          language
        ),

      displayCrop:
        language === 'pa'
          ? normalizePunjabi(
              cached.crop || ''
            )
          : cached.crop ||
            job.crop,

      displayJobType:
        language === 'pa'
          ? normalizePunjabi(
              cached.jobType || ''
            )
          : cached.jobType ||
            job.jobType,

      /*
       * These three values are always formatted
       * separately from the cached text translation.
       */
      displayDate:
        formatDateForLanguage(
          job.date,
          language
        ),

      displayWorkingHours:
        formatWorkingHoursForLanguage(
          job.workingHours,
          language
        ),

      displayPayment:
        formatPaymentForLanguage(
          job.hourlyRate,
          language
        ),
    };
  }

  /* ==========================================================
     TRANSLATE TEXT FIELDS
     ========================================================== */

  const results =
    await Promise.all([
      translateText(
        job.title || '',
        originalLanguage,
        language
      ),

      translateText(
        job.description || '',
        originalLanguage,
        language
      ),

      translateText(
        job.location || '',
        originalLanguage,
        language
      ),

      translateText(
        job.district || '',
        originalLanguage,
        language
      ),

      translateText(
        job.crop || '',
        originalLanguage,
        language
      ),

      translateText(
        job.jobType || '',
        originalLanguage,
        language
      ),
    ]);

  const translation:
    FarmerJobTranslatedContent = {
    title:
      results[0] ||
      job.title ||
      '',

    description:
      results[1] ||
      job.description ||
      '',

    location:
      results[2] ||
      job.location ||
      '',

    district:
      results[3] ||
      job.district ||
      '',

    crop:
      results[4] ||
      job.crop ||
      '',

    jobType:
      results[5] ||
      job.jobType ||
      '',
  };

  db.saveFarmerJobTranslation(
    job.id,
    language,
    translation
  );

  return {
    ...job,

    displayTitle:
      language === 'pa'
        ? normalizePunjabi(
            translation.title
          )
        : translation.title,

    displayDescription:
      language === 'pa'
        ? normalizePunjabi(
            translation.description
          )
        : translation.description,

    displayLocation:
      formatLocationForLanguage(
        translation.location,
        language
      ),

    displayDistrict:
      formatDistrictForLanguage(
        translation.district,
        language
      ),

    displayCrop:
      language === 'pa'
        ? normalizePunjabi(
            translation.crop
          )
        : translation.crop,

    displayJobType:
      language === 'pa'
        ? normalizePunjabi(
            translation.jobType
          )
        : translation.jobType,

    displayDate:
      formatDateForLanguage(
        job.date,
        language
      ),

    displayWorkingHours:
      formatWorkingHoursForLanguage(
        job.workingHours,
        language
      ),

    displayPayment:
      formatPaymentForLanguage(
        job.hourlyRate,
        language
      ),
  };
};

/* ============================================================
   COMPONENT
   ============================================================ */

export const FarmerJobs: React.FC =
  () => {
    const { user } = useAuth();
    const { language } =
      useLanguage();

    const ui =
      JOB_UI[language] ||
      JOB_UI.en;

    const [jobs, setJobs] =
      useState<FarmerJob[]>([]);

    const [displayJobs, setDisplayJobs] =
      useState<DisplayJob[]>([]);

    const [seenJobIds, setSeenJobIds] =
      useState<string[]>([]);

    const [selectedJob, setSelectedJob] =
      useState<DisplayJob | null>(
        null
      );

    const [
      responseMessage,
      setResponseMessage,
    ] = useState<string | null>(
      null
    );

    const [translating, setTranslating] =
      useState(false);

    /* ========================================================
       LOAD JOBS
       ======================================================== */

    const loadJobs = () => {
      if (!user) {
        return;
      }

      const farmerJobs =
        db.getJobsForFarmer(
          user.userId
        );

      const seen =
        db.getSeenFarmerJobIds(
          user.userId
        );

      setJobs(farmerJobs);
      setSeenJobIds(seen);
    };

    /* ========================================================
       INITIAL LOAD
       ======================================================== */

    useEffect(() => {
      if (
        !user ||
        user.role !== 'farmer'
      ) {
        return;
      }

      loadJobs();

      const unsubscribeJobs =
        db.subscribe(
          'agralyticx_farmer_jobs',
          () => {
            loadJobs();
          }
        );

      const unsubscribeSeen =
        db.subscribe(
          `agralyticx_farmer_seen_jobs_${user.userId}`,
          () => {
            loadJobs();
          }
        );

      const unsubscribeDeleted =
        db.subscribe(
          `agralyticx_farmer_deleted_jobs_${user.userId}`,
          () => {
            loadJobs();
          }
        );

      return () => {
        unsubscribeJobs();
        unsubscribeSeen();
        unsubscribeDeleted();
      };
    }, [user]);

    /* ========================================================
       TRANSLATE JOBS
       ======================================================== */

    useEffect(() => {
      let cancelled = false;

      const translateJobs =
        async () => {
          if (jobs.length === 0) {
            setDisplayJobs([]);
            setTranslating(false);
            return;
          }

          setTranslating(true);

          try {
            const translatedJobs =
              await Promise.all(
                jobs.map((job) =>
                  getTranslatedJob(
                    job,
                    language
                  )
                )
              );

            if (!cancelled) {
              setDisplayJobs(
                translatedJobs
              );
            }
          } catch (error) {
            console.error(
              'Could not translate farmer jobs:',
              error
            );

            if (!cancelled) {
              setDisplayJobs(
                jobs.map((job) => ({
                  ...job,

                  displayTitle:
                    language === 'pa'
                      ? normalizePunjabi(
                          job.title || ''
                        )
                      : job.title,

                  displayDescription:
                    language === 'pa'
                      ? normalizePunjabi(
                          job.description ||
                            ''
                        )
                      : job.description,

                  displayLocation:
                    formatLocationForLanguage(
                      job.location,
                      language
                    ),

                  displayDistrict:
                    formatDistrictForLanguage(
                      job.district,
                      language
                    ),

                  displayCrop:
                    language === 'pa'
                      ? normalizePunjabi(
                          job.crop || ''
                        )
                      : job.crop,

                  displayJobType:
                    language === 'pa'
                      ? normalizePunjabi(
                          job.jobType || ''
                        )
                      : job.jobType,

                  displayDate:
                    formatDateForLanguage(
                      job.date,
                      language
                    ),

                  displayWorkingHours:
                    formatWorkingHoursForLanguage(
                      job.workingHours,
                      language
                    ),

                  displayPayment:
                    formatPaymentForLanguage(
                      job.hourlyRate,
                      language
                    ),
                }))
              );
            }
          } finally {
            if (!cancelled) {
              setTranslating(false);
            }
          }
        };

      translateJobs();

      return () => {
        cancelled = true;
      };
    }, [jobs, language]);

    /* ========================================================
       NEW JOB COUNT
       ======================================================== */

    const newJobsCount =
      useMemo(() => {
        return jobs.filter(
          (job) =>
            !seenJobIds.includes(
              job.id
            )
        ).length;
      }, [
        jobs,
        seenJobIds,
      ]);

    /* ========================================================
       OPEN JOB
       ======================================================== */

    const openJob = (
      job: DisplayJob
    ) => {
      if (!user) {
        return;
      }

      db.markFarmerJobSeen(
        user.userId,
        job.id
      );

      setSeenJobIds(
        (previous) => {
          if (
            previous.includes(
              job.id
            )
          ) {
            return previous;
          }

          return [
            ...previous,
            job.id,
          ];
        }
      );

      /*
       * IMPORTANT:
       * Re-format every non-translatable field when
       * opening the modal. This prevents raw English
       * database values from appearing in Urdu/Punjabi.
       */
      const selected: DisplayJob =
        {
          ...job,

          displayLocation:
            formatLocationForLanguage(
              job.displayLocation ||
                job.location,
              language
            ),

          displayDistrict:
            formatDistrictForLanguage(
              job.displayDistrict ||
                job.district,
              language
            ),

          displayDate:
            formatDateForLanguage(
              job.displayDate ||
                job.date,
              language
            ),

          displayWorkingHours:
            formatWorkingHoursForLanguage(
              job.displayWorkingHours ||
                job.workingHours,
              language
            ),

          displayPayment:
            formatPaymentForLanguage(
              job.hourlyRate,
              language
            ),
        };

      setSelectedJob(selected);
      setResponseMessage(null);
    };

    /* ========================================================
       CLOSE MODAL
       ======================================================== */

    const closeJob = () => {
      setSelectedJob(null);
      setResponseMessage(null);
    };

    /* ========================================================
       DELETE JOB
       ======================================================== */

    const deleteJob = (
      event: React.MouseEvent,
      job: FarmerJob
    ) => {
      event.stopPropagation();

      if (!user) {
        return;
      }

      const title =
        job.title ||
        `${job.jobType || ''} - ${
          job.crop || ''
        }`;

      const confirmed =
        window.confirm(
          `${ui.removeConfirmation}\n\n"${title}"`
        );

      if (!confirmed) {
        return;
      }

      db.deleteFarmerJobForUser(
        user.userId,
        job.id
      );

      if (
        selectedJob &&
        selectedJob.id === job.id
      ) {
        setSelectedJob(null);
      }

      loadJobs();
    };

    /* ========================================================
       ACCEPT / REJECT
       ======================================================== */

    const respond = (
      action:
        | 'accepted'
        | 'rejected'
    ) => {
      if (
        !user ||
        !selectedJob
      ) {
        return;
      }

      db.respondToJob(
        selectedJob.id,
        user.userId,
        user.name,
        action,
        user.phone || ''
      );

      if (
        action === 'accepted'
      ) {
        setResponseMessage(
          ui.acceptedSuccessfully
        );
      } else {
        setResponseMessage(
          ui.rejectedSuccessfully
        );
      }

      window.setTimeout(
        () => {
          setSelectedJob(null);
          setResponseMessage(null);
          loadJobs();
        },
        1200
      );
    };

    /* ========================================================
       ROLE CHECK
       ======================================================== */

    if (
      !user ||
      user.role !== 'farmer'
    ) {
      return null;
    }

    /* ========================================================
       RTL
       ======================================================== */

    const isRTL =
      language === 'ur' ||
      language === 'pa';

    const direction =
      isRTL ? 'rtl' : 'ltr';

    /* ========================================================
       RENDER
       ======================================================== */

    return (
      <div
        dir={direction}
        className={`min-h-full px-4 sm:px-6 lg:px-8 py-8 ${
          language === 'ur'
            ? 'leading-[2]'
            : language === 'pa'
            ? 'leading-[1.9]'
            : ''
        }`}
      >
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ==================================================
              HEADER
              ================================================== */}

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#DDE8DD] bg-white/80">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="min-w-0">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-extrabold mb-3">

                  <Briefcase className="w-3.5 h-3.5 shrink-0" />

                  {ui.farmerJobs}

                </div>

                <h1
                  className={textClass(
                    language,
                    'text-2xl sm:text-4xl font-extrabold text-[#1F2933]'
                  )}
                >
                  {ui.availableJobs}
                </h1>

                <p
                  className={textClass(
                    language,
                    'mt-3 text-sm text-[#5F6B63]'
                  )}
                >
                  {ui.jobsDescription}
                </p>

              </div>

              {newJobsCount >
                0 && (
                <div className="self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] shrink-0">

                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />

                  <span
                    className={textClass(
                      language,
                      'text-sm font-extrabold text-[#2E7D32]'
                    )}
                  >
                    {newJobsCount}{' '}
                    {newJobsCount ===
                    1
                      ? ui.job
                      : ui.jobs}{' '}
                    {ui.new}
                  </span>

                </div>
              )}

            </div>

          </div>

          {/* ==================================================
              TRANSLATING
              ================================================== */}

          {translating &&
            jobs.length >
              0 && (
              <div
                className={textClass(
                  language,
                  'flex items-center justify-center gap-2 text-sm text-[#5F6B63]'
                )}
              >
                <Loader2 className="w-4 h-4 animate-spin text-[#2E7D32]" />

                {ui.translating}
              </div>
            )}

          {/* ==================================================
              EMPTY STATE
              ================================================== */}

          {jobs.length ===
          0 ? (
            <div className="glass-card rounded-3xl p-12 border border-[#DDE8DD] bg-white/80 text-center">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-4">

                <Briefcase className="w-8 h-8" />

              </div>

              <h2
                className={textClass(
                  language,
                  'text-xl font-extrabold text-[#1F2933]'
                )}
              >
                {ui.noJobs}
              </h2>

              <p
                className={textClass(
                  language,
                  'mt-3 text-sm text-[#5F6B63] max-w-md mx-auto'
                )}
              >
                {
                  ui.noJobsDescription
                }
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {displayJobs.map(
                (job) => {
                  const isNew =
                    !seenJobIds.includes(
                      job.id
                    );

                  const applicants =
                    Array.isArray(
                      (job as any)
                        .applicants
                    )
                      ? (
                          job as any
                        )
                          .applicants
                      : [];

                  const farmerResponse =
                    applicants.find(
                      (
                        applicant: any
                      ) =>
                        applicant &&
                        applicant.farmerId ===
                          user.userId
                    );

                  return (
                    <div
                      key={job.id}
                      onClick={() =>
                        openJob(
                          job
                        )
                      }
                      className={`w-full text-left rounded-3xl p-5 sm:p-6 border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                        isNew
                          ? 'bg-[#F1FAF2] border-[#4CAF50] shadow-md ring-2 ring-[#4CAF50]/20'
                          : 'bg-white/80 border-[#DDE8DD]'
                      }`}
                    >

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        {/* JOB INFO */}

                        <div className="flex items-start gap-4 min-w-0">

                          <div
                            className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center ${
                              isNew
                                ? 'bg-[#2E7D32] text-white'
                                : 'bg-[#E8F5E9] text-[#2E7D32]'
                            }`}
                          >
                            <Briefcase className="w-6 h-6" />
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2 mb-2">

                              <h2
                                className={textClass(
                                  language,
                                  'text-lg font-extrabold text-[#1F2933]'
                                )}
                              >
                                {job.displayTitle ||
                                  `${
                                    job.displayJobType ||
                                    job.jobType ||
                                    ''
                                  } - ${
                                    job.displayCrop ||
                                    job.crop ||
                                    ''
                                  }`}
                              </h2>

                              {isNew && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#2E7D32] text-white text-[10px] font-extrabold whitespace-nowrap">
                                  {
                                    ui.new
                                  }
                                </span>
                              )}

                              {farmerResponse && (
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap ${
                                    farmerResponse.status ===
                                    'accepted'
                                      ? 'bg-green-100 text-green-700'
                                      : farmerResponse.status ===
                                        'rejected'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {farmerResponse.status ===
                                  'accepted'
                                    ? ui.accepted
                                    : farmerResponse.status ===
                                      'rejected'
                                    ? ui.rejected
                                    : ui.pending}
                                </span>
                              )}

                            </div>

                            <p
                              className={textClass(
                                language,
                                'text-sm text-[#5F6B63]'
                              )}
                            >
                              {
                                ui.postedBy
                              }{' '}

                              <span className="font-bold text-[#1F2933]">
                                {
                                  job.landownerName
                                }
                              </span>
                            </p>

                            <div
                              className={textClass(
                                language,
                                'flex flex-wrap gap-x-5 gap-y-3 mt-3 text-xs text-[#5F6B63]'
                              )}
                            >

                              {/* LOCATION */}

                              <span className="flex items-center gap-1.5">

                                <MapPin className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />

                                <span>
                                  {job.displayLocation ||
                                    formatLocationForLanguage(
                                      job.location,
                                      language
                                    )}
                                </span>

                              </span>

                              {/* PAYMENT */}

                              <span className="flex items-center gap-1.5">

                                <DollarSign className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />

                                <span>
                                  {job.displayPayment ||
                                    formatPaymentForLanguage(
                                      job.hourlyRate,
                                      language
                                    )}
                                </span>

                              </span>

                              {/* DATE */}

                              <span className="flex items-center gap-1.5">

                                <Calendar className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />

                                <span>
                                  {job.displayDate ||
                                    formatDateForLanguage(
                                      job.date,
                                      language
                                    )}
                                </span>

                              </span>

                            </div>

                          </div>

                        </div>

                        {/* RIGHT SIDE */}

                        <div className="flex items-center justify-between lg:justify-end gap-4">

                          <div
                            className={textClass(
                              language,
                              'text-right'
                            )}
                          >
                            <p className="text-xs text-[#5F6B63]">
                              {
                                ui.farmersNeeded
                              }
                            </p>

                            <p className="font-extrabold text-[#2E7D32]">
                              {
                                job.farmersNeeded
                              }
                            </p>
                          </div>

                          <span
                            className={textClass(
                              language,
                              'text-sm font-bold text-[#2E7D32] whitespace-nowrap'
                            )}
                          >
                            {
                              ui.viewDetails
                            }{' '}
                            →
                          </span>

                          <button
                            type="button"
                            onClick={(
                              event
                            ) =>
                              deleteJob(
                                event,
                                job
                              )
                            }
                            className="w-10 h-10 shrink-0 rounded-xl border border-red-200 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                            title={
                              ui.removeJob
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* ======================================================
            JOB DETAILS MODAL
            ====================================================== */}

        {selectedJob && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={
              closeJob
            }
          >

            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DDE8DD]"
              onClick={(
                event
              ) =>
                event.stopPropagation()
              }
              dir={direction}
            >

              {/* MODAL HEADER */}

              <div className="sticky top-0 bg-white border-b border-[#DDE8DD] px-6 py-5 flex items-start justify-between gap-4">

                <div className="flex items-start gap-3 min-w-0">

                  <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">

                    <h2
                      className={textClass(
                        language,
                        'text-xl font-extrabold text-[#1F2933]'
                      )}
                    >
                      {selectedJob.displayTitle ||
                        selectedJob.title ||
                        `${
                          selectedJob.displayJobType ||
                          selectedJob.jobType ||
                          ''
                        } - ${
                          selectedJob.displayCrop ||
                          selectedJob.crop ||
                          ''
                        }`}
                    </h2>

                    <p
                      className={textClass(
                        language,
                        'text-sm text-[#5F6B63] mt-2'
                      )}
                    >
                      {
                        selectedJob.landownerName
                      }
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    closeJob
                  }
                  className="w-9 h-9 shrink-0 rounded-xl hover:bg-[#F8FAF7] flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-[#5F6B63]" />
                </button>

              </div>

              <div className="p-6 space-y-6">

                {/* DESCRIPTION */}

                <div>

                  <h3
                    className={textClass(
                      language,
                      'text-sm font-extrabold text-[#2E7D32] mb-3'
                    )}
                  >
                    {
                      ui.jobDescription
                    }
                  </h3>

                  <div
                    className={textClass(
                      language,
                      'rounded-2xl bg-[#F8FAF7] border border-[#DDE8DD] p-5 text-sm text-[#1F2933] whitespace-pre-wrap'
                    )}
                  >
                    {selectedJob.displayDescription &&
                    selectedJob.displayDescription.trim()
                      ? selectedJob.displayDescription
                      : ui.noDescription}
                  </div>

                </div>

                {/* DETAILS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* JOB TYPE */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <Briefcase className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.jobType
                      }
                    </div>

                    <p
                      className={textClass(
                        language,
                        'font-bold text-[#1F2933]'
                      )}
                    >
                      {selectedJob.displayJobType ||
                        selectedJob.jobType ||
                        '-'}
                    </p>

                  </div>

                  {/* CROP */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <Briefcase className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.crop
                      }
                    </div>

                    <p
                      className={textClass(
                        language,
                        'font-bold text-[#1F2933]'
                      )}
                    >
                      {selectedJob.displayCrop ||
                        selectedJob.crop ||
                        '-'}
                    </p>

                  </div>

                  {/* LOCATION */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.location
                      }
                    </div>

                    <p
                      className={textClass(
                        language,
                        'font-bold text-[#1F2933]'
                      )}
                    >
                      {selectedJob.displayLocation ||
                        formatLocationForLanguage(
                          selectedJob.location,
                          language
                        )}
                    </p>

                  </div>

                  {/* DATE */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <Calendar className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.date
                      }
                    </div>

                    <p
                      className={textClass(
                        language,
                        'font-bold text-[#1F2933]'
                      )}
                    >
                      {selectedJob.displayDate ||
                        formatDateForLanguage(
                          selectedJob.date,
                          language
                        )}
                    </p>

                  </div>

                  {/* WORKING HOURS */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <Clock className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.workingHours
                      }
                    </div>

                    <p
                      className={textClass(
                        language,
                        'font-bold text-[#1F2933]'
                      )}
                    >
                      {selectedJob.displayWorkingHours ||
                        formatWorkingHoursForLanguage(
                          selectedJob.workingHours,
                          language
                        )}
                    </p>

                  </div>

                  {/* PAYMENT */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <DollarSign className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.payment
                      }
                    </div>

                    <p
                      className={textClass(
                        language,
                        'font-bold text-[#2E7D32]'
                      )}
                    >
                      {selectedJob.displayPayment ||
                        formatPaymentForLanguage(
                          selectedJob.hourlyRate,
                          language
                        )}
                    </p>

                  </div>

                  {/* FARMERS NEEDED */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <Users className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.farmersNeeded
                      }
                    </div>

                    <p className="font-bold text-[#1F2933]">
                      {
                        selectedJob.farmersNeeded
                      }
                    </p>

                  </div>

                  {/* DISTRICT */}

                  <div className="rounded-2xl border border-[#DDE8DD] p-4">

                    <div
                      className={textClass(
                        language,
                        'flex items-center gap-2 text-xs text-[#5F6B63] mb-2'
                      )}
                    >
                      <MapPin className="w-4 h-4 text-[#2E7D32] shrink-0" />

                      {
                        ui.district
                      }
                    </div>

                    <p
                      className={textClass(
                        language,
                        'font-bold text-[#1F2933]'
                      )}
                    >
                      {selectedJob.displayDistrict ||
                        formatDistrictForLanguage(
                          selectedJob.district,
                          language
                        )}
                    </p>

                  </div>

                </div>

                {/* RESPONSE */}

                {responseMessage ? (
                  <div
                    className={textClass(
                      language,
                      'rounded-2xl bg-[#E8F5E9] border border-[#4CAF50] p-4 text-center text-sm font-bold text-[#2E7D32]'
                    )}
                  >
                    {
                      responseMessage
                    }
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">

                    <button
                      type="button"
                      onClick={() =>
                        respond(
                          'rejected'
                        )
                      }
                      className={textClass(
                        language,
                        'py-3.5 rounded-2xl border border-red-200 bg-red-50 text-red-600 font-extrabold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors'
                      )}
                    >
                      <XCircle className="w-5 h-5 shrink-0" />

                      {
                        ui.rejectJob
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        respond(
                          'accepted'
                        )
                      }
                      className={textClass(
                        language,
                        'py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors'
                      )}
                    >
                      <CheckCircle className="w-5 h-5 shrink-0" />

                      {
                        ui.acceptJob
                      }
                    </button>

                  </div>
                )}

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={(
                    event
                  ) =>
                    deleteJob(
                      event,
                      selectedJob
                    )
                  }
                  className={textClass(
                    language,
                    'w-full py-3 rounded-2xl border border-red-200 bg-white text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors'
                  )}
                >
                  <Trash2 className="w-4 h-4 shrink-0" />

                  {
                    ui.removeJob
                  }
                </button>

                <p
                  className={textClass(
                    language,
                    'text-center text-xs text-[#7A857D]'
                  )}
                >
                  {
                    ui.closingMessage
                  }
                </p>

              </div>

            </div>

          </div>
        )}
      </div>
    );
  };
