import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Camera,
  X,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { UserRole, Gender } from '../../types';

/* =========================================================
   GENDER AVATAR
   ========================================================= */

const createGenderAvatar = (gender: Gender): string => {
  let svg = '';

  if (gender === 'female') {
    svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
        <rect width="256" height="256" rx="128" fill="#FCEEF5"/>

        <path
          d="M64 118
             C55 73 78 30 128 30
             C178 30 201 73 192 118
             L190 178
             C187 205 166 221 128 221
             C90 221 69 205 66 178
             Z"
          fill="#3E2723"
        />

        <ellipse
          cx="128"
          cy="108"
          rx="50"
          ry="61"
          fill="#F2C7A5"
        />

        <path
          d="M78 94
             C73 57 94 38 128 38
             C162 38 183 57 178 94
             C164 70 148 62 128 62
             C108 62 92 70 78 94Z"
          fill="#3E2723"
        />

        <path
          d="M76 91
             C61 108 62 145 72 171
             C78 185 86 194 96 199
             L88 139
             C82 123 80 107 76 91Z"
          fill="#3E2723"
        />

        <path
          d="M180 91
             C195 108 194 145 184 171
             C178 185 170 194 160 199
             L168 139
             C174 123 176 107 180 91Z"
          fill="#3E2723"
        />

        <ellipse cx="108" cy="108" rx="5" ry="7" fill="#263238"/>
        <ellipse cx="148" cy="108" rx="5" ry="7" fill="#263238"/>

        <path
          d="M102 100 L98 97
             M106 99 L104 95
             M154 100 L158 97
             M150 99 L152 95"
          stroke="#263238"
          stroke-width="3"
          stroke-linecap="round"
        />

        <path
          d="M128 111 L124 124 Q128 127 132 124"
          fill="none"
          stroke="#C58F72"
          stroke-width="3"
          stroke-linecap="round"
        />

        <path
          d="M113 137 Q128 148 143 137"
          fill="none"
          stroke="#A85D65"
          stroke-width="4"
          stroke-linecap="round"
        />

        <path
          d="M52 230
             C57 185 83 163 128 163
             C173 163 199 185 204 230
             Z"
          fill="#E573A8"
        />

        <path
          d="M108 163
             Q128 180 148 163
             L140 190
             Q128 198 116 190
             Z"
          fill="#F48FB1"
        />

        <circle
          cx="128"
          cy="128"
          r="115"
          fill="none"
          stroke="#E8B6CC"
          stroke-width="5"
        />
      </svg>
    `;
  } else if (gender === 'male') {
    svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
        <rect width="256" height="256" rx="128" fill="#E8F5E9"/>

        <circle
          cx="128"
          cy="108"
          r="55"
          fill="#F2C7A5"
        />

        <path
          d="M73 105
             C70 63 94 38 128 38
             C162 38 186 63 183 105
             C171 76 151 67 128 67
             C105 67 85 76 73 105Z"
          fill="#263238"
        />

        <circle cx="108" cy="105" r="5" fill="#263238"/>
        <circle cx="148" cy="105" r="5" fill="#263238"/>

        <path
          d="M128 110 L124 124 Q128 127 132 124"
          fill="none"
          stroke="#C58F72"
          stroke-width="3"
          stroke-linecap="round"
        />

        <path
          d="M112 136 Q128 143 144 136"
          fill="none"
          stroke="#8D5A45"
          stroke-width="4"
          stroke-linecap="round"
        />

        <path
          d="M58 229
             C63 180 88 157 128 157
             C168 157 193 180 198 229Z"
          fill="#4CAF50"
        />

        <path
          d="M108 159 L128 183 L148 159"
          fill="none"
          stroke="#81C784"
          stroke-width="6"
        />

        <circle
          cx="128"
          cy="128"
          r="115"
          fill="none"
          stroke="#B9DDBB"
          stroke-width="5"
        />
      </svg>
    `;
  } else {
    svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
        <rect width="256" height="256" rx="128" fill="#EEF2F1"/>

        <circle
          cx="128"
          cy="108"
          r="55"
          fill="#F2C7A5"
        />

        <path
          d="M73 105
             C70 63 94 38 128 38
             C162 38 186 63 183 105
             C171 76 151 67 128 67
             C105 67 85 76 73 105Z"
          fill="#455A64"
        />

        <circle cx="108" cy="105" r="5" fill="#263238"/>
        <circle cx="148" cy="105" r="5" fill="#263238"/>

        <path
          d="M113 137 L143 137"
          fill="none"
          stroke="#8D5A45"
          stroke-width="4"
          stroke-linecap="round"
        />

        <path
          d="M58 229
             C63 180 88 157 128 157
             C168 157 193 180 198 229Z"
          fill="#81C784"
        />

        <circle
          cx="128"
          cy="128"
          r="115"
          fill="none"
          stroke="#C5D0CC"
          stroke-width="5"
        />
      </svg>
    `;
  }

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

/* =========================================================
   PAKISTAN LOCATIONS
   ========================================================= */

type LocalizedName = {
  en: string;
  ur: string;
  pa: string;
};

type City = {
  value: string;
  name: LocalizedName;
};

type Province = {
  value: string;
  name: LocalizedName;
  cities: City[];
};

const pakistanLocations: Province[] = [
  {
    value: 'punjab',
    name: {
      en: 'Punjab',
      ur: 'پنجاب',
      pa: 'پنجاب',
    },
    cities: [
      { value: 'lahore', name: { en: 'Lahore', ur: 'لاہور', pa: 'لاہور' } },
      { value: 'rawalpindi', name: { en: 'Rawalpindi', ur: 'راولپنڈی', pa: 'راولپنڈی' } },
      { value: 'faisalabad', name: { en: 'Faisalabad', ur: 'فیصل آباد', pa: 'فیصل آباد' } },
      { value: 'multan', name: { en: 'Multan', ur: 'ملتان', pa: 'ملتان' } },
      { value: 'gujranwala', name: { en: 'Gujranwala', ur: 'گوجرانوالہ', pa: 'گوجرانوالہ' } },
      { value: 'sialkot', name: { en: 'Sialkot', ur: 'سیالکوٹ', pa: 'سیالکوٹ' } },
      { value: 'bahawalpur', name: { en: 'Bahawalpur', ur: 'بہاولپور', pa: 'بہاولپور' } },
      { value: 'sargodha', name: { en: 'Sargodha', ur: 'سرگودھا', pa: 'سرگودھا' } },
      { value: 'sheikhupura', name: { en: 'Sheikhupura', ur: 'شیخوپورہ', pa: 'شیخوپورہ' } },
      { value: 'jhang', name: { en: 'Jhang', ur: 'جھنگ', pa: 'جھنگ' } },
      { value: 'gujrat', name: { en: 'Gujrat', ur: 'گجرات', pa: 'گجرات' } },
      { value: 'sahiwal', name: { en: 'Sahiwal', ur: 'ساہیوال', pa: 'ساہیوال' } },
      { value: 'okara', name: { en: 'Okara', ur: 'اوکاڑہ', pa: 'اوکاڑہ' } },
      { value: 'kasur', name: { en: 'Kasur', ur: 'قصور', pa: 'قصور' } },
      { value: 'rahim_yar_khan', name: { en: 'Rahim Yar Khan', ur: 'رحیم یار خان', pa: 'رحیم یار خان' } },
      { value: 'dera_ghazi_khan', name: { en: 'Dera Ghazi Khan', ur: 'ڈیرہ غازی خان', pa: 'ڈیرہ غازی خان' } },
      { value: 'muzaffargarh', name: { en: 'Muzaffargarh', ur: 'مظفرگڑھ', pa: 'مظفرگڑھ' } },
      { value: 'khanewal', name: { en: 'Khanewal', ur: 'خانیوال', pa: 'خانیوال' } },
      { value: 'lodhran', name: { en: 'Lodhran', ur: 'لودھراں', pa: 'لودھراں' } },
      { value: 'vehari', name: { en: 'Vehari', ur: 'وہاڑی', pa: 'وہاڑی' } },
      { value: 'pakpattan', name: { en: 'Pakpattan', ur: 'پاکپتن', pa: 'پاکپتن' } },
      { value: 'toba_tek_singh', name: { en: 'Toba Tek Singh', ur: 'ٹوبہ ٹیک سنگھ', pa: 'ٹوبہ ٹیک سنگھ' } },
      { value: 'chiniot', name: { en: 'Chiniot', ur: 'چنیوٹ', pa: 'چنیوٹ' } },
      { value: 'attock', name: { en: 'Attock', ur: 'اٹک', pa: 'اٹک' } },
      { value: 'chakwal', name: { en: 'Chakwal', ur: 'چکوال', pa: 'چکوال' } },
      { value: 'jhelum', name: { en: 'Jhelum', ur: 'جہلم', pa: 'جہلم' } },
      { value: 'mianwali', name: { en: 'Mianwali', ur: 'میانوالی', pa: 'میانوالی' } },
      { value: 'bhakkar', name: { en: 'Bhakkar', ur: 'بھکر', pa: 'بھکر' } },
      { value: 'khushab', name: { en: 'Khushab', ur: 'خوشاب', pa: 'خوشاب' } },
      { value: 'narowal', name: { en: 'Narowal', ur: 'نارووال', pa: 'نارووال' } },
      { value: 'hafizabad', name: { en: 'Hafizabad', ur: 'حافظ آباد', pa: 'حافظ آباد' } },
      { value: 'nankana_sahib', name: { en: 'Nankana Sahib', ur: 'ننکانہ صاحب', pa: 'ننکانہ صاحب' } },
      { value: 'bahawalnagar', name: { en: 'Bahawalnagar', ur: 'بہاولنگر', pa: 'بہاولنگر' } },
    ],
  },

  {
    value: 'sindh',
    name: {
      en: 'Sindh',
      ur: 'سندھ',
      pa: 'سندھ',
    },
    cities: [
      { value: 'karachi', name: { en: 'Karachi', ur: 'کراچی', pa: 'کراچی' } },
      { value: 'hyderabad', name: { en: 'Hyderabad', ur: 'حیدرآباد', pa: 'حیدرآباد' } },
      { value: 'sukkur', name: { en: 'Sukkur', ur: 'سکھر', pa: 'سکھر' } },
      { value: 'larkana', name: { en: 'Larkana', ur: 'لاڑکانہ', pa: 'لاڑکانہ' } },
      { value: 'nawabshah', name: { en: 'Nawabshah', ur: 'نوابشاہ', pa: 'نوابشاہ' } },
      { value: 'mirpur_khas', name: { en: 'Mirpur Khas', ur: 'میرپور خاص', pa: 'میرپور خاص' } },
      { value: 'jacobabad', name: { en: 'Jacobabad', ur: 'جیکب آباد', pa: 'جیکب آباد' } },
      { value: 'shikarpur', name: { en: 'Shikarpur', ur: 'شکارپور', pa: 'شکارپور' } },
      { value: 'khairpur', name: { en: 'Khairpur', ur: 'خیرپور', pa: 'خیرپور' } },
      { value: 'thatta', name: { en: 'Thatta', ur: 'ٹھٹھہ', pa: 'ٹھٹھہ' } },
      { value: 'badin', name: { en: 'Badin', ur: 'بدین', pa: 'بدین' } },
      { value: 'dadu', name: { en: 'Dadu', ur: 'دادو', pa: 'دادو' } },
      { value: 'tando_adam', name: { en: 'Tando Adam', ur: 'ٹنڈو آدم', pa: 'ٹنڈو آدم' } },
      { value: 'tando_allahyar', name: { en: 'Tando Allahyar', ur: 'ٹنڈو اللہ یار', pa: 'ٹنڈو اللہ یار' } },
      { value: 'umerkot', name: { en: 'Umerkot', ur: 'عمرکوٹ', pa: 'عمرکوٹ' } },
      { value: 'matiari', name: { en: 'Matiari', ur: 'مٹیاری', pa: 'مٹیاری' } },
      { value: 'jamshoro', name: { en: 'Jamshoro', ur: 'جامشورو', pa: 'جامشورو' } },
    ],
  },

  {
    value: 'khyber_pakhtunkhwa',
    name: {
      en: 'Khyber Pakhtunkhwa',
      ur: 'خیبر پختونخوا',
      pa: 'خیبر پختونخوا',
    },
    cities: [
      { value: 'peshawar', name: { en: 'Peshawar', ur: 'پشاور', pa: 'پشاور' } },
      { value: 'mardan', name: { en: 'Mardan', ur: 'مردان', pa: 'مردان' } },
      { value: 'mingora', name: { en: 'Mingora', ur: 'مینگورہ', pa: 'مینگورہ' } },
      { value: 'abbottabad', name: { en: 'Abbottabad', ur: 'ایبٹ آباد', pa: 'ایبٹ آباد' } },
      { value: 'kohat', name: { en: 'Kohat', ur: 'کوہاٹ', pa: 'کوہاٹ' } },
      { value: 'bannu', name: { en: 'Bannu', ur: 'بنوں', pa: 'بنوں' } },
      { value: 'dera_ismail_khan', name: { en: 'Dera Ismail Khan', ur: 'ڈیرہ اسماعیل خان', pa: 'ڈیرہ اسماعیل خان' } },
      { value: 'swabi', name: { en: 'Swabi', ur: 'صوابی', pa: 'صوابی' } },
      { value: 'nowshera', name: { en: 'Nowshera', ur: 'نوشہرہ', pa: 'نوشہرہ' } },
      { value: 'charsadda', name: { en: 'Charsadda', ur: 'چارسدہ', pa: 'چارسدہ' } },
      { value: 'haripur', name: { en: 'Haripur', ur: 'ہری پور', pa: 'ہری پور' } },
      { value: 'mansehra', name: { en: 'Mansehra', ur: 'مانسہرہ', pa: 'مانسہرہ' } },
      { value: 'chitral', name: { en: 'Chitral', ur: 'چترال', pa: 'چترال' } },
      { value: 'batkhela', name: { en: 'Batkhela', ur: 'بٹ خیلہ', pa: 'بٹ خیلہ' } },
      { value: 'parachinar', name: { en: 'Parachinar', ur: 'پاراچنار', pa: 'پاراچنار' } },
    ],
  },

  {
    value: 'balochistan',
    name: {
      en: 'Balochistan',
      ur: 'بلوچستان',
      pa: 'بلوچستان',
    },
    cities: [
      { value: 'quetta', name: { en: 'Quetta', ur: 'کوئٹہ', pa: 'کوئٹہ' } },
      { value: 'turbat', name: { en: 'Turbat', ur: 'تربت', pa: 'تربت' } },
      { value: 'khuzdar', name: { en: 'Khuzdar', ur: 'خضدار', pa: 'خضدار' } },
      { value: 'chaman', name: { en: 'Chaman', ur: 'چمن', pa: 'چمن' } },
      { value: 'sibi', name: { en: 'Sibi', ur: 'سبی', pa: 'سبی' } },
      { value: 'gwadar', name: { en: 'Gwadar', ur: 'گوادر', pa: 'گوادر' } },
      { value: 'zhob', name: { en: 'Zhob', ur: 'ژوب', pa: 'ژوب' } },
      { value: 'loralai', name: { en: 'Loralai', ur: 'لورالائی', pa: 'لورالائی' } },
      { value: 'mastung', name: { en: 'Mastung', ur: 'مستونگ', pa: 'مستونگ' } },
      { value: 'nushki', name: { en: 'Nushki', ur: 'نوشکی', pa: 'نوشکی' } },
    ],
  },

  {
    value: 'gilgit_baltistan',
    name: {
      en: 'Gilgit-Baltistan',
      ur: 'گلگت بلتستان',
      pa: 'گلگت بلتستان',
    },
    cities: [
      { value: 'gilgit', name: { en: 'Gilgit', ur: 'گلگت', pa: 'گلگت' } },
      { value: 'skardu', name: { en: 'Skardu', ur: 'سکردو', pa: 'سکردو' } },
      { value: 'chilas', name: { en: 'Chilas', ur: 'چلاس', pa: 'چلاس' } },
      { value: 'hunza', name: { en: 'Hunza', ur: 'ہنزہ', pa: 'ہنزہ' } },
      { value: 'ghizer', name: { en: 'Ghizer', ur: 'غذر', pa: 'غذر' } },
    ],
  },

  {
    value: 'azad_jammu_kashmir',
    name: {
      en: 'Azad Jammu & Kashmir',
      ur: 'آزاد جموں و کشمیر',
      pa: 'آزاد جموں و کشمیر',
    },
    cities: [
      { value: 'muzaffarabad', name: { en: 'Muzaffarabad', ur: 'مظفرآباد', pa: 'مظفرآباد' } },
      { value: 'mirpur', name: { en: 'Mirpur', ur: 'میرپور', pa: 'میرپور' } },
      { value: 'rawalakot', name: { en: 'Rawalakot', ur: 'راولاکوٹ', pa: 'راولاکوٹ' } },
      { value: 'kotli', name: { en: 'Kotli', ur: 'کوٹلی', pa: 'کوٹلی' } },
      { value: 'bagh', name: { en: 'Bagh', ur: 'باغ', pa: 'باغ' } },
      { value: 'bhimber', name: { en: 'Bhimber', ur: 'بھمبر', pa: 'بھمبر' } },
    ],
  },
];

/* =========================================================
   LOCATION TRANSLATIONS
   ========================================================= */

const locationLabels = {
  en: {
    province: 'Province',
    city: 'City / Location',
    selectProvince: 'Select Province',
    selectCity: 'Select City / Location',
    selectProvinceFirst: 'Select province first',
    customCity: 'Other / My city is not listed',
    enterCustomCity: 'Enter your city / location',
    help: 'Tell us where your farm is located.',
    phone: 'Phone Number',
    companyPhone: 'Company Phone Number',
    phoneHelp:
      'Enter your Pakistani mobile number, e.g. 03124567890.',
    cnic: 'CNIC Number',
    cnicHelp:
      'Required for identity and safety verification.',
    invalidPhone:
      'Please enter a valid Pakistani mobile number, e.g. 03124567890.',
    requiredPhone:
      'Please enter your phone number.',
    requiredCompanyPhone:
      'Please enter the company phone number.',
    requiredCnic:
      'Please enter your CNIC number.',
    invalidCnic:
      'Please enter CNIC in the format 35202-1234567-1.',
    requiredProvince:
      'Please select your province.',
    requiredLocation:
      'Please select your city or location.',
    requiredCustomCity:
      'Please enter your city name.',
  },

  ur: {
    province: 'صوبہ',
    city: 'شہر / مقام',
    selectProvince: 'صوبہ منتخب کریں',
    selectCity: 'شہر / مقام منتخب کریں',
    selectProvinceFirst: 'پہلے صوبہ منتخب کریں',
    customCity: 'دیگر / میرا شہر فہرست میں نہیں ہے',
    enterCustomCity: 'اپنا شہر / مقام لکھیں',
    help: 'اپنے فارم کا مقام درج کریں۔',
    phone: 'فون نمبر',
    companyPhone: 'کمپنی کا فون نمبر',
    phoneHelp:
      'اپنا پاکستانی موبائل نمبر درج کریں، مثلاً 03124567890۔',
    cnic: 'شناختی کارڈ نمبر',
    cnicHelp:
      'شناخت اور حفاظتی تصدیق کے لیے ضروری ہے۔',
    invalidPhone:
      'براہ کرم درست پاکستانی موبائل نمبر درج کریں، مثلاً 03124567890۔',
    requiredPhone:
      'براہ کرم اپنا فون نمبر درج کریں۔',
    requiredCompanyPhone:
      'براہ کرم کمپنی کا فون نمبر درج کریں۔',
    requiredCnic:
      'براہ کرم اپنا شناختی کارڈ نمبر درج کریں۔',
    invalidCnic:
      'براہ کرم شناختی کارڈ نمبر اس فارمیٹ میں درج کریں: 35202-1234567-1',
    requiredProvince:
      'براہ کرم اپنا صوبہ منتخب کریں۔',
    requiredLocation:
      'براہ کرم اپنا شہر یا مقام منتخب کریں۔',
    requiredCustomCity:
      'براہ کرم اپنے شہر کا نام لکھیں۔',
  },

  pa: {
    province: 'صوبہ',
    city: 'شہر / مقام',
    selectProvince: 'صوبہ چنو',
    selectCity: 'شہر / مقام چنو',
    selectProvinceFirst: 'پہلے صوبہ چنو',
    customCity: 'ہور / میرا شہر فہرست وچ نہیں',
    enterCustomCity: 'اپنا شہر / مقام لکھو',
    help: 'اپنے کھیت دا مقام درج کرو۔',
    phone: 'فون نمبر',
    companyPhone: 'کمپنی دا فون نمبر',
    phoneHelp:
      'اپنا پاکستانی موبائل نمبر درج کرو، مثال 03124567890۔',
    cnic: 'شناختی کارڈ نمبر',
    cnicHelp:
      'شناخت تے حفاظتی تصدیق لئی ضروری اے۔',
    invalidPhone:
      'مہربانی کرکے درست پاکستانی موبائل نمبر درج کرو، مثال 03124567890۔',
    requiredPhone:
      'مہربانی کرکے اپنا فون نمبر درج کرو۔',
    requiredCompanyPhone:
      'مہربانی کرکے کمپنی دا فون نمبر درج کرو۔',
    requiredCnic:
      'مہربانی کرکے اپنا شناختی کارڈ نمبر درج کرو۔',
    invalidCnic:
      'مہربانی کرکے شناختی کارڈ نمبر ایس فارمیٹ وچ درج کرو: 35202-1234567-1',
    requiredProvince:
      'مہربانی کرکے اپنا صوبہ چنو۔',
    requiredLocation:
      'مہربانی کرکے اپنا شہر یا مقام چنو۔',
    requiredCustomCity:
      'مہربانی کرکے اپنے شہر دا ناں لکھو۔',
  },
};

const getLocaleKey = (
  language: unknown
): 'en' | 'ur' | 'pa' => {
  const key = String(language).toLowerCase();

  if (key === 'ur' || key === 'urdu') {
    return 'ur';
  }

  if (
    key === 'pa' ||
    key === 'punjabi' ||
    key === 'pakistani_punjabi'
  ) {
    return 'pa';
  }

  return 'en';
};

/* =========================================================
   SIGN UP
   ========================================================= */

export const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  /* =======================================================
     ALWAYS OPEN SIGNUP FROM TOP
     ======================================================= */

  useEffect(() => {
    const main = document.querySelector('main');

    if (main) {
      main.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  /* =======================================================
     PRESELECTED ROLE
     ======================================================= */

  const preselectedRole =
    (localStorage.getItem(
      'agralyticx_onboarding_role'
    ) as UserRole) || 'farmer';

  /* =======================================================
     FORM STATE
     ======================================================= */

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [gender, setGender] =
    useState<Gender>('prefer_not_to_say');

  const [role, setRole] =
    useState<UserRole>(preselectedRole);

  /* =======================================================
     FARMER LOCATION STATE
     ======================================================= */

  const [province, setProvince] = useState('');
  const [location, setLocation] = useState('');
  const [customCity, setCustomCity] = useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =======================================================
     FIELD ERRORS
     ======================================================= */

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    cnic?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    province?: string;
    location?: string;
  }>({});

  /* =======================================================
     PASSWORD VISIBILITY
     ======================================================= */

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =======================================================
     ROLE CHECKS
     ======================================================= */

  const isCompany = role === 'company';
  const isStudent = role === 'student_researcher';
  const isFarmer = role === 'farmer';
  const isLandowner = role === 'landowner';
  const isTransport = role === 'transport';

  /* =======================================================
     REQUIRED FIELDS
     ======================================================= */

  const cnicRequired =
    isFarmer ||
    isLandowner ||
    isTransport ||
    isStudent;

  const emailRequired =
    isCompany ||
    isStudent;

  const phoneRequired = !isStudent;

  /* =======================================================
     LOCATION HELPERS
     ======================================================= */

  const locale = getLocaleKey(language);

  const selectedProvince =
    pakistanLocations.find(
      (item) => item.value === province
    );

  const availableCities =
    selectedProvince?.cities || [];

  const getLocalizedName = (
    name: LocalizedName
  ) => {
    return name[locale];
  };

  const locationText =
    locationLabels[locale];

  /* =======================================================
     ROLE CHANGE
     ======================================================= */

  const handleRoleChange = (
    newRole: UserRole
  ) => {
    setRole(newRole);
    setFieldErrors({});

    if (newRole === 'company') {
      setCnic('');
    }

    if (newRole === 'student_researcher') {
      setPhone('');
    }

    if (newRole !== 'farmer') {
      setProvince('');
      setLocation('');
      setCustomCity('');
    }
  };

  /* =======================================================
     PROVINCE CHANGE
     ======================================================= */

  const handleProvinceChange = (
    value: string
  ) => {
    setProvince(value);

    // Reset city and custom city when province changes.
    setLocation('');
    setCustomCity('');

    setFieldErrors((prev) => ({
      ...prev,
      province: undefined,
      location: undefined,
    }));
  };

  /* =======================================================
     CITY / LOCATION CHANGE
     ======================================================= */

  const handleLocationChange = (
    value: string
  ) => {
    setLocation(value);

    if (value !== 'custom') {
      setCustomCity('');
    }

    setFieldErrors((prev) => ({
      ...prev,
      location: undefined,
    }));
  };

  /* =======================================================
     CUSTOM CITY CHANGE
     ======================================================= */

  const handleCustomCityChange = (
    value: string
  ) => {
    setCustomCity(value);

    setFieldErrors((prev) => ({
      ...prev,
      location: undefined,
    }));
  };

  /* =======================================================
     CNIC CHANGE
     ======================================================= */

  const handleCnicChange = (
    value: string
  ) => {
    const digits = value
      .replace(/\D/g, '')
      .slice(0, 13);

    let formatted = digits;

    if (digits.length > 5) {
      formatted =
        digits.slice(0, 5) +
        '-' +
        digits.slice(5);
    }

    if (digits.length > 12) {
      formatted =
        digits.slice(0, 5) +
        '-' +
        digits.slice(5, 12) +
        '-' +
        digits.slice(12);
    }

    setCnic(formatted);

    setFieldErrors((prev) => ({
      ...prev,
      cnic: undefined,
    }));
  };

  /* =======================================================
     PHONE CHANGE
     ======================================================= */

  const handlePhoneChange = (
    value: string
  ) => {
    const digits = value
      .replace(/\D/g, '')
      .slice(0, 11);

    setPhone(digits);

    setFieldErrors((prev) => ({
      ...prev,
      phone: undefined,
    }));
  };

  /* =======================================================
     AVATAR CHANGE
     ======================================================= */

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      window.alert(
        'Please choose an image file.'
      );

      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert(
        'Please choose an image smaller than 5 MB.'
      );

      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return;
      }

      const image = new Image();

      image.onload = () => {
        const maxSize = 512;

        let width = image.width;
        let height = image.height;

        if (
          width > maxSize ||
          height > maxSize
        ) {
          const ratio = Math.min(
            maxSize / width,
            maxSize / height
          );

          width = Math.round(
            width * ratio
          );

          height = Math.round(
            height * ratio
          );
        }

        const canvas =
          document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const ctx =
          canvas.getContext('2d');

        if (!ctx) {
          setAvatar(reader.result);
          return;
        }

        ctx.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        const compressed =
          canvas.toDataURL(
            'image/jpeg',
            0.82
          );

        setAvatar(compressed);
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  /* =======================================================
     FORM SUBMIT
     ======================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setFieldErrors({});

    const newErrors: {
      name?: string;
      phone?: string;
      cnic?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      province?: string;
      location?: string;
    } = {};

    /* =====================================================
       NAME
       ===================================================== */

    if (!name.trim()) {
      newErrors.name = isCompany
        ? 'Please enter the company name.'
        : 'Please enter your full name.';
    }

    /* =====================================================
       PHONE
       ===================================================== */

    if (
      phoneRequired &&
      !phone.trim()
    ) {
      newErrors.phone = isCompany
        ? locationText.requiredCompanyPhone
        : locationText.requiredPhone;
    }

    if (
      phoneRequired &&
      phone.trim() &&
      !/^03\d{9}$/.test(phone.trim())
    ) {
      newErrors.phone =
        locationText.invalidPhone;
    }

    /* =====================================================
       EMAIL
       ===================================================== */

    if (
      emailRequired &&
      !email.trim()
    ) {
      newErrors.email = isCompany
        ? 'Please enter the company email address.'
        : 'Please enter your email address.';
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      newErrors.email =
        'Please enter a valid email address.';
    }

    /* =====================================================
       CNIC
       ===================================================== */

    if (
      cnicRequired &&
      !cnic.trim()
    ) {
      newErrors.cnic =
        locationText.requiredCnic;
    }

    if (
      cnic.trim() &&
      !/^\d{5}-\d{7}-\d{1}$/.test(
        cnic.trim()
      )
    ) {
      newErrors.cnic =
        locationText.invalidCnic;
    }

    /* =====================================================
       FARMER PROVINCE
       ===================================================== */

    if (
      isFarmer &&
      !province
    ) {
      newErrors.province =
        locationText.requiredProvince;
    }

    /* =====================================================
       FARMER CITY / LOCATION
       ===================================================== */

    if (
      isFarmer &&
      !location
    ) {
      newErrors.location =
        locationText.requiredLocation;
    }

    /* =====================================================
       CUSTOM CITY
       ===================================================== */

    if (
      isFarmer &&
      location === 'custom' &&
      !customCity.trim()
    ) {
      newErrors.location =
        locationText.requiredCustomCity;
    }

    /* =====================================================
       PASSWORD
       ===================================================== */

    if (password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters.';
    }

    /* =====================================================
       CONFIRM PASSWORD
       ===================================================== */

    if (!confirmPassword) {
      newErrors.confirmPassword =
        'Please confirm your password.';
    } else if (
      password !== confirmPassword
    ) {
      newErrors.confirmPassword =
        t.passwordMismatch;
    }

    /* =====================================================
       SHOW FIELD ERRORS
       ===================================================== */

    if (
      Object.keys(newErrors).length > 0
    ) {
      setFieldErrors(newErrors);
      return;
    }

    /* =====================================================
       FINAL LOCATION VALUE
       ===================================================== */

    let finalLocation = '';

    if (isFarmer) {
      if (location === 'custom') {
        finalLocation =
          customCity.trim();
      } else {
        finalLocation =
          availableCities.find(
            (city) =>
              city.value === location
          )?.name.en || location;
      }
    }

    /* =====================================================
       CREATE ACCOUNT
       ===================================================== */

    setIsSubmitting(true);

    try {
      const res = await signUp({
        name: name.trim(),
        email: email.trim(),
        phone: isStudent
          ? ''
          : phone.trim(),
        cnic: cnic.trim(),
        pass: password,
        role,
        language,
        gender,
        avatar:
          avatar ||
          createGenderAvatar(gender),

        // Farmer location
        province: isFarmer
          ? province
          : '',

        location: isFarmer
          ? finalLocation
          : '',
      });

      setIsSubmitting(false);

      /* ===================================================
         REDIRECT
         =================================================== */

      if (
        res.success &&
        res.user
      ) {
        const roleRoutes: Record<
          UserRole,
          string
        > = {
          farmer:
            '/farmer/dashboard',

          student_researcher:
            '/student-research/dashboard',

          company:
            '/company/dashboard',

          landowner:
            '/landowner',

          transport:
            '/transport/dashboard',
        };

        navigate(
          roleRoutes[res.user.role]
        );

        return;
      }

      setFieldErrors({
        password:
          res.error ||
          'Failed to create account.',
      });
    } catch (err) {
      console.error(
        'Signup error:',
        err
      );

      setIsSubmitting(false);

      setFieldErrors({
        password:
          'Something went wrong. Please try again.',
      });
    }
  };

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col py-8 px-4 sm:px-6 lg:px-8">

      {/* BACK BUTTON */}

      <div className="w-full max-w-3xl mx-auto mb-5 shrink-0">
        <button
          type="button"
          onClick={() =>
            navigate('/role-selection')
          }
          className="inline-flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />

          <span>
            {t.back}
          </span>
        </button>
      </div>

      {/* HEADER */}

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white">
            <Sprout className="w-6 h-6" />
          </div>

          <span className="text-2xl font-extrabold text-[#2E7D32]">
            AGRALYTICX AI
          </span>
        </Link>

        <h2 className="text-2xl font-extrabold text-[#1F2933]">
          {t.createAccount}
        </h2>
      </div>

      {/* FORM CARD */}

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-6 sm:px-10 rounded-3xl border border-[#DDE8DD] shadow-xl space-y-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {isCompany
                  ? 'Company Name'
                  : t.fullName}

                <span className="text-red-500">
                  {' '}*
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <User className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(
                      e.target.value
                    );

                    setFieldErrors(
                      (prev) => ({
                        ...prev,
                        name: undefined,
                      })
                    );
                  }}
                  placeholder={
                    isCompany
                      ? 'e.g. ABC Agri Solutions'
                      : 'e.g. Ayesha Khan'
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* GENDER */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.gender}

                <span className="text-red-500">
                  {' '}*
                </span>
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value as Gender
                  )
                }
                className="block w-full px-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white font-medium text-[#1F2933] focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
              >
                <option value="male">
                  {t.genderMale}
                </option>

                <option value="female">
                  {t.genderFemale}
                </option>

                <option value="prefer_not_to_say">
                  {t.genderPreferNotToSay}
                </option>
              </select>
            </div>

            {/* PROFILE PICTURE */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.profilePicture}

                <span className="text-[#5F6B63] font-normal normal-case">
                  {' '}({t.optional})
                </span>
              </label>

              <div className="flex items-center gap-3 p-3 rounded-2xl border border-[#DDE8DD] bg-[#F8FAF7]">

                <div className="relative shrink-0">

                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile preview"
                      className="w-14 h-14 rounded-full object-cover border border-[#DDE8DD]"
                    />
                  ) : (
                    <img
                      src={createGenderAvatar(
                        gender
                      )}
                      alt="Gender avatar preview"
                      className="w-14 h-14 rounded-full object-cover border border-[#DDE8DD]"
                    />
                  )}

                  {avatar && (
                    <button
                      type="button"
                      onClick={() =>
                        setAvatar('')
                      }
                      aria-label="Remove profile picture"
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#DDE8DD] text-[#5F6B63] flex items-center justify-center hover:text-red-600 hover:border-red-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex-1">

                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#DDE8DD] text-xs font-bold text-[#2E7D32] hover:border-[#4CAF50] hover:bg-[#E8F5E9] cursor-pointer transition-all">

                    <Camera className="w-4 h-4" />

                    {avatar
                      ? t.changePicture
                      : t.uploadPicture}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        handleAvatarChange
                      }
                    />
                  </label>

                  <p className="text-[10px] text-[#5F6B63] mt-1.5">
                    {t.profilePictureHelp}
                  </p>
                </div>
              </div>
            </div>

            {/* ROLE */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                {t.chooseRole}

                <span className="text-red-500">
                  {' '}*
                </span>
              </label>

              <select
                value={role}
                onChange={(e) =>
                  handleRoleChange(
                    e.target.value as UserRole
                  )
                }
                className="block w-full px-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white font-medium text-[#1F2933] focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
              >
                <option value="farmer">
                  🌾 {t.roles.farmer}
                </option>

                <option value="student_researcher">
                  🎓 {t.roles.studentResearcher}
                </option>

                <option value="company">
                  🏢 {t.roles.company}
                </option>

                <option value="landowner">
                  🌳 {t.roles.landowner}
                </option>

                <option value="transport">
                  🚚 {t.roles.transport}
                </option>
              </select>
            </div>

            {/* =================================================
                FARMER PROVINCE
                ONLY FARMERS SEE THIS
                ================================================= */}

            {isFarmer && (
              <>
                {/* PROVINCE */}

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                    {locationText.province}

                    <span className="text-red-500">
                      {' '}*
                    </span>
                  </label>

                  <select
                    value={province}
                    required
                    onChange={(e) =>
                      handleProvinceChange(
                        e.target.value
                      )
                    }
                    className="block w-full px-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white font-medium text-[#1F2933] focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                  >
                    <option value="">
                      {locationText.selectProvince}
                    </option>

                    {pakistanLocations.map(
                      (item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {getLocalizedName(
                            item.name
                          )}
                        </option>
                      )
                    )}
                  </select>

                  {fieldErrors.province && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.province}
                    </p>
                  )}
                </div>

                {/* CITY / LOCATION */}

                <div>
                  <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">
                    {locationText.city}

                    <span className="text-red-500">
                      {' '}*
                    </span>
                  </label>

                  <select
                    value={location}
                    required
                    disabled={!province}
                    onChange={(e) =>
                      handleLocationChange(
                        e.target.value
                      )
                    }
                    className="block w-full px-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white font-medium text-[#1F2933] focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!province
                        ? locationText.selectProvinceFirst
                        : locationText.selectCity}
                    </option>

                    {availableCities.map(
                      (city) => (
                        <option
                          key={city.value}
                          value={city.value}
                        >
                          {getLocalizedName(
                            city.name
                          )}
                        </option>
                      )
                    )}

                    {/* CUSTOM CITY OPTION */}

                    <option value="custom">
                      {locationText.customCity}
                    </option>
                  </select>

                  {/* CUSTOM CITY INPUT */}

                  {location === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        required
                        value={customCity}
                        onChange={(e) =>
                          handleCustomCityChange(
                            e.target.value
                          )
                        }
                        placeholder={
                          locationText.enterCustomCity
                        }
                        className="block w-full px-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                      />
                    </div>
                  )}

                  {fieldErrors.location && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.location}
                    </p>
                  )}

                  <p className="mt-1 text-[11px] text-[#6B7280]">
                    {locationText.help}
                  </p>
                </div>
              </>
            )}

            {/* =================================================
                PHONE
                HIDDEN FOR STUDENT / RESEARCHER
                ================================================= */}

            {!isStudent && (
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                  {isCompany
                    ? locationText.companyPhone
                    : locationText.phone}

                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                    <Phone className="w-5 h-5" />
                  </div>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) =>
                      handlePhoneChange(
                        e.target.value
                      )
                    }
                    placeholder="03124567890"
                    inputMode="numeric"
                    maxLength={11}
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}

                <p className="mt-1 text-[11px] text-[#6B7280]">
                  {locationText.phoneHelp}
                </p>
              </div>
            )}

            {/* =================================================
                CNIC
                ================================================= */}

            {cnicRequired && (
              <div>
                <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                  {locationText.cnic}

                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <input
                    type="text"
                    required
                    value={cnic}
                    onChange={(e) =>
                      handleCnicChange(
                        e.target.value
                      )
                    }
                    placeholder="35202-1234567-1"
                    maxLength={15}
                    inputMode="numeric"
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                {fieldErrors.cnic && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.cnic}
                  </p>
                )}

                <p className="mt-1 text-[11px] text-[#6B7280]">
                  {locationText.cnicHelp}
                </p>
              </div>
            )}

            {/* =================================================
                EMAIL
                ================================================= */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                {isCompany
                  ? 'Company Email'
                  : t.emailAddress}

                {emailRequired ? (
                  <span className="text-red-500">
                    {' '}*
                  </span>
                ) : (
                  <span className="font-normal normal-case text-[#6B7280]">
                    {' '}(Optional)
                  </span>
                )}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Mail className="w-5 h-5" />
                </div>

                <input
                  type="email"
                  required={emailRequired}
                  value={email}
                  onChange={(e) => {
                    setEmail(
                      e.target.value
                    );

                    setFieldErrors(
                      (prev) => ({
                        ...prev,
                        email: undefined,
                      })
                    );
                  }}
                  placeholder={
                    isCompany
                      ? 'company@example.com'
                      : 'you@example.com'
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.email}
                </p>
              )}

              {!emailRequired && (
                <p className="mt-1 text-[11px] text-[#6B7280]">
                  Email is optional. You can leave this field blank.
                </p>
              )}
            </div>

            {/* =================================================
                PASSWORD
                ================================================= */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                {t.password}

                <span className="text-red-500">
                  {' '}*
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Lock className="w-5 h-5" />
                </div>

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={password}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setPassword(value);

                    setFieldErrors(
                      (prev) => ({
                        ...prev,
                        password:
                          undefined,

                        confirmPassword:
                          confirmPassword &&
                          value !==
                            confirmPassword
                            ? t.passwordMismatch
                            : undefined,
                      })
                    );
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="block w-full pl-10 pr-11 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F6B63] hover:text-[#2E7D32]"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* =================================================
                CONFIRM PASSWORD
                ================================================= */}

            <div>
              <label className="block text-xs font-bold text-[#1F2933] uppercase mb-1">

                {t.confirmPassword}

                <span className="text-red-500">
                  {' '}*
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F6B63]">
                  <Lock className="w-5 h-5" />
                </div>

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setConfirmPassword(
                      value
                    );

                    setFieldErrors(
                      (prev) => ({
                        ...prev,
                        confirmPassword:
                          value &&
                          password !== value
                            ? t.passwordMismatch
                            : undefined,
                      })
                    );
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="block w-full pl-10 pr-11 py-2.5 border border-[#DDE8DD] rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F6B63] hover:text-[#2E7D32]"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* =================================================
                CREATE ACCOUNT
                ================================================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1b4d1f] text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>
                  {t.creatingAccount}
                </span>
              ) : (
                <>
                  <span>
                    {t.createAccount}
                  </span>

                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* SIGN IN */}

          <div className="pt-2 text-center text-xs text-[#5F6B63] border-t border-[#DDE8DD]">

            <span>
              {t.alreadyHaveAccount}{' '}
            </span>

            <Link
              to="/sign-in"
              className="font-bold text-[#2E7D32] hover:underline"
            >
              {t.signIn}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};