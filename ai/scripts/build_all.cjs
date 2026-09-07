const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}

// 1. i18n translations
const en = {
  appName: "AGRALYTICX AI",
  tagline: "Smart Farming, Smarter Future.",
  dashboard: "Dashboard",
  community: "Community",
  more: "More",
  language: "Language",
  profile: "Profile",
  settings: "Settings",
  logout: "Sign Out",
  signIn: "Sign In",
  signUp: "Create Account",
  createAccount: "Create Account",
  welcome: "Welcome",
  roles: {
    farmer: "Farmer",
    farmerDesc: "Get help with your farm, crops, weather, and mandi prices",
    studentResearcher: "Student / Researcher",
    studentResearcherDesc: "Learn and explore agricultural research & projects",
    company: "Company",
    companyDesc: "Find agricultural talent, research, and solutions",
    landowner: "Landowner",
    landownerDesc: "Manage your land, hire farm workers, and book transport",
    transport: "Transport",
    transportDesc: "Manage agricultural deliveries and freight requests",
  },
  chooseLanguage: "Choose your language",
  chooseRole: "Choose your role",
  getStarted: "Get Started",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "Don't have an account?",
  fullName: "Full Name",
  emailAddress: "Email Address",
  password: "Password",
  confirmPassword: "Confirm Password",
  passwordMismatch: "Passwords do not match",
  creatingAccount: "Creating account...",
  signingIn: "Signing in...",
  save: "Save",
  cancel: "Cancel",
  search: "Search",
  filter: "Filter",
  edit: "Edit",
  delete: "Delete",
  viewAll: "View All",
  back: "Back",
  submit: "Submit",
  loading: "Loading...",
  success: "Success",
  error: "Error",
  listen: "Listen",
  speak: "Speak",
  listening: "Listening...",
  thinking: "Thinking...",
  farmerDashboard: "Farmer Dashboard",
  scanCrop: "Scan Crop",
  scanCropDesc: "Identify crop diseases & get instant remedies",
  marketRates: "Market Rates",
  marketRatesDesc: "See today's mandi crop prices and fuel rates",
  weather: "Weather",
  weatherDesc: "Live agricultural weather, rain & spray advisories",
  aiHelp: "AI Farming Help",
  aiHelpDesc: "Voice-first smart assistant for your farming queries",
  myFarm: "My Farm",
  myFarmDesc: "Manage your farm location, crops, and land details",
  farmerHourlyRate: "Current Farmer Hourly Rate: Rs. 350 - 500 / hr",
  cropScannerTitle: "Crop Health & Disease Scanner",
  uploadImage: "Upload Image",
  takePhoto: "Take Photo / Camera",
  analyzeCrop: "Analyze Crop Health",
  analyzingImage: "Analyzing crop image with AI...",
  cropProblemIdentified: "Identified Crop Issue",
  confidence: "Confidence",
  severity: "Severity Level",
  simpleExplanation: "Simple Explanation",
  suggestedNextSteps: "Suggested Immediate Action",
  preventiveMeasures: "Preventive Measures",
  agriculturalCaution: "Agricultural Caution: Always verify with local agricultural extension officers for heavy chemical applications.",
  scanAnotherCrop: "Scan Another Crop",
  marketTitle: "Agricultural Market (Mandi) Rates",
  todaysMandiPrices: "Today's Mandi Crop Prices",
  selectOrSearchCrop: "Select or Search Crop",
  searchCropPlaceholder: "Search Wheat, Rice, Cotton, Corn...",
  allCities: "All Cities",
  fuelRatesTitle: "Transport Fuel Rates (Diesel / Petrol)",
  dieselRate: "Diesel (Transport Rate)",
  petrolRate: "Petrol",
  transportAdvice: "Check fuel rates to negotiate the best freight cost for your produce.",
  historicalTrend: "7-Day Price Trend",
  per40kg: "per 40 kg (Maund)",
  weatherTitle: "Live Agricultural Weather",
  feelsLike: "Feels Like",
  humidity: "Humidity",
  windSpeed: "Wind Speed",
  rainChance: "Rain Chance",
  liveGpsLocation: "Live GPS Location",
  useMyLocation: "Use My Location",
  sprayAdvisoryTitle: "Pesticide Spray Advisory",
  sowingAdvisoryTitle: "Irrigation & Sowing Advisory",
  forecast7Day: "7-Day Weather Forecast",
  aiAssistantTitle: "Voice-First AI Farming Assistant",
  voiceFirstTitle: "Speak in English, Urdu or Punjabi",
  speakOrTypePrompt: "Tap the microphone to speak, or type your question below.",
  typeQuestionPlaceholder: "Ask about crop diseases, fertilizer schedule, seeds, or irrigation...",
  suggestedQuestions: [
    "How much urea fertilizer should I apply for wheat?",
    "What is the best treatment for cotton leaf curl virus?",
    "Is today suitable for pesticide spray based on weather?",
    "How do I improve basmati rice grain length and yield?"
  ],
  clearConversation: "Clear Chat",
  voiceInputLimitation: "Web Speech API is available in modern browsers (Chrome, Edge, Safari).",
  farmDetailsTitle: "My Farm Information",
  farmLocation: "Farm Location / Village",
  farmSizeAcres: "Farm Size (in Acres)",
  mainCrops: "Main Crops Cultivated",
  soilType: "Soil Type",
  waterSource: "Water / Irrigation Source",
  noFarmDataYet: "You haven't added your farm information yet.",
  addFarmInfo: "Add Farm Information",
  editFarmInfo: "Edit Farm Information",
  farmSavedSuccess: "Farm information saved successfully!",
  studentDashboardTitle: "Student & Research Dashboard",
  studentRepository: "Student & Research Repository",
  researchArea: "Research Area",
  university: "University / Institute",
  projectTitle: "Project Title",
  researchInterests: "Research Interests",
  contactCompany: "Contact Company",
  companyDirectory: "Company Directory",
  opportunitiesAndGrants: "Opportunities & Grants",
  researchResources: "Research Resources",
  createResearchProfile: "Create Research Profile",
  editResearchProfile: "Edit Research Profile",
  noResearchProfileYet: "You have not created your research profile yet.",
  contactStudent: "Contact Researcher",
  antiSpamNotice: "To prevent spam, you can send 1 message. Direct messaging unlocks once they reply.",
  companyDashboardTitle: "Agribusiness & Company Portal",
  companyProfile: "Company Profile",
  agriculturalNeeds: "Agricultural Needs & RFPs",
  problemsAndChallenges: "Current Agricultural Challenges",
  findStudents: "Find Students & Researchers",
  postOpportunity: "Post Opportunity",
  companyName: "Company Name",
  agriculturalSpecialization: "Agri Specialization",
  noCompanyProfileYet: "You haven't set up your company profile yet.",
  createCompanyProfile: "Create Company Profile",
  inbox: "Inquiries & Inbox",
  replyToStudent: "Reply to Researcher",
  blockConversation: "Block",
  landownerTitle: "Landowner Hub",
  landDetails: "My Land Records",
  hireFarmers: "Hire Farm Workers",
  hireFarmersDesc: "Post farm jobs (harvesting, sowing) and dispatch to local farmers",
  bookTransport: "Book Crop Transport",
  bookTransportDesc: "Book cargo trucks and tractor trolleys for mandi transport",
  availableLand: "Available Land for Farming",
  cropSuitability: "Soil & Crop Suitability",
  numberOfFarmersNeeded: "Number of Workers Needed",
  jobType: "Type of Farm Work",
  hourlyRateOffered: "Hourly Rate (PKR)",
  workDate: "Work Date & Time",
  activeJobsPosted: "Active Farm Job Postings",
  acceptJob: "Accept Job",
  rejectJob: "Reject Job",
  jobNotificationTitle: "New Farm Work Notification",
  farmersAcceptedCount: "Farmers Accepted",
  transportDashboardTitle: "Transport & Logistics Dashboard",
  vehicleFleet: "Fleet Availability",
  deliveryRequests: "Available Delivery Requests",
  assignedDeliveries: "Assigned Freight Shipments",
  routeMap: "Interactive Route Map & GPS",
  transportSiteGuide: "Logistics Flow Guide",
  acceptDelivery: "Accept Trip",
  startTrip: "Start Trip",
  completeDelivery: "Mark Delivered",
  cargoType: "Crop / Cargo",
  quantityInTons: "Quantity (Tons)",
  pickupDropLocation: "Pickup & Destination",
  estimatedFare: "Estimated Fare",
  financeTitle: "Public Agricultural Finance Directory",
  openFinanceDesc: "Open-access Pakistani agricultural loans, government subsidies, and solar schemes.",
  ztblLoanSchemes: "ZTBL Zarai Agri Loans",
  kamyabKisanScheme: "Kamyab Kisan Subsidies",
  solarTubewellSubsidy: "Solar Tube-well Financing",
  cropInsuranceTakaful: "Crop Insurance & Takaful",
  noInvestorAccountNeeded: "Public Open Data: Accessible to all farmers without investor login.",
  communityTitle: "Community Chat",
  communitySubtitle: "Real-time discussion with verified members of your role",
  membersOnline: "Community Members",
  typeMessagePlaceholder: "Type your message here...",
  send: "Send",
  voiceMessage: "Voice Input",
  reportMessage: "Report",
  noMessagesYet: "No messages yet. Start the conversation!",
  strictlyNoPostsNotice: "Direct group chat only. No social media posts or feed clutter.",
  unauthorizedAccess: "Access Denied",
  unauthorizedRoleMessage: "You do not have permission to view this role's private area.",
  loginRequired: "Please sign in to access your dashboard.",
};

const ur = {
  appName: "ایگرالیٹکس اے آئی",
  tagline: "جدید زراعت، روشن مستقبل۔",
  dashboard: "ڈیش بورڈ",
  community: "کمیونٹی",
  more: "مزید",
  language: "زبان",
  profile: "پروفائل",
  settings: "ترتیبات",
  logout: "لاگ آؤٹ",
  signIn: "لاگ ان کریں",
  signUp: "نیا اکاؤنٹ بنائیں",
  createAccount: "اکاؤنٹ بنائیں",
  welcome: "خوش آمدید",
  roles: {
    farmer: "کسان",
    farmerDesc: "اپنی فصل، منڈی ریٹ، موسم اور زرعی رہنمائی حاصل کریں",
    studentResearcher: "طالب علم / محقق",
    studentResearcherDesc: "زرعی تحقیق، منصوبے اور نئی ٹیکنالوجی سیکھیں",
    company: "کمپنی",
    companyDesc: "زرعی ماہرین، نئی ریسرچ اور کاروباری مواقع تلاش کریں",
    landowner: "زمیندار",
    landownerDesc: "زمین کا انتظام، کسانوں کی ہائرنگ اور ٹرانسپورٹ بکنگ",
    transport: "ٹرانسپورٹ",
    transportDesc: "زرعی پیداوار اور فصلوں کی ترسیل کا انتظام کریں",
  },
  chooseLanguage: "اپنی زبان منتخب کریں",
  chooseRole: "اپنا کردار منتخب کریں",
  getStarted: "شروع کریں",
  alreadyHaveAccount: "کیا پہلے سے اکاؤنٹ موجود ہے؟",
  dontHaveAccount: "اکاؤنٹ نہیں ہے؟",
  fullName: "پورا نام",
  emailAddress: "ای میل ایڈریس",
  password: "پاس ورڈ",
  confirmPassword: "پاس ورڈ کی تصدیق",
  passwordMismatch: "پاس ورڈ مماثل نہیں ہیں",
  creatingAccount: "اکاؤنٹ بنایا جا رہا ہے...",
  signingIn: "لاگ ان ہو رہا ہے...",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  search: "تلاش کریں",
  filter: "فلٹر",
  edit: "ترمیم کریں",
  delete: "حذف کریں",
  viewAll: "سب دیکھیں",
  back: "واپس",
  submit: "جمع کروائیں",
  loading: "لوڈ ہو رہا ہے...",
  success: "کامیاب",
  error: "خرابی",
  listen: "سنیں",
  speak: "بولیں",
  listening: "سنا جا رہا ہے...",
  thinking: "سوچ رہا ہے...",
  farmerDashboard: "کسان ڈیش بورڈ",
  scanCrop: "فصل اسکین کریں",
  scanCropDesc: "فصل کی بیماری پہچانیں اور فوری علاج حاصل کریں",
  marketRates: "منڈی کے ریٹ",
  marketRatesDesc: "آج کے منڈی ریٹ اور ڈیزل کی قیمتیں دیکھیں",
  weather: "موسم کا حال",
  weatherDesc: "لائیو زرعی موسم، بارش اور سپرے کی ہدایات",
  aiHelp: "اے آئی زرعی مددگار",
  aiHelpDesc: "آواز کے ذریعے اپنی زبان میں فوری زرعی مشورہ لیں",
  myFarm: "میری زمین / فارم",
  myFarmDesc: "اپنے رقبے، فصلوں اور پانی کی معلومات محفوظ کریں",
  farmerHourlyRate: "کسان کی فی گھنٹہ اجرت: 350 تا 500 روپے",
  cropScannerTitle: "فصل کی بیماری اور صحت کا اسکینر",
  uploadImage: "تصویر اپ لوڈ کریں",
  takePhoto: "کیمرے سے تصویر لیں",
  analyzeCrop: "فصل کا معائنہ کریں",
  analyzingImage: "اے آئی کے ذریعے فصل کا معائنہ ہو رہا ہے...",
  cropProblemIdentified: "تشخیص شدہ بیماری / مسئلہ",
  confidence: "یقین کی سطح",
  severity: "نقصان کی شدت",
  simpleExplanation: "آسان وضاحت",
  suggestedNextSteps: "فوری ضروری اقدامات",
  preventiveMeasures: "حفاظتی تدابیر",
  agriculturalCaution: "زرعی احتیاط: زہریلی دوا کے استعمال سے پہلے قریبی زرعی افسر سے تصدیق ضرور کریں۔",
  scanAnotherCrop: "دوسری فصل اسکین کریں",
  marketTitle: "غلہ منڈی کے تازہ ترین ریٹ",
  todaysMandiPrices: "آج کے غلہ منڈی ریٹ",
  selectOrSearchCrop: "فصل منتخب یا تلاش کریں",
  searchCropPlaceholder: "گندم، چاول، کپاس، مکئی تلاش کریں...",
  allCities: "تمام شہر",
  fuelRatesTitle: "ٹرانسپورٹ ایندھن (ڈیزل / پٹرول) کے ریٹ",
  dieselRate: "ڈیزل ریٹ (ٹرانسپورٹ)",
  petrolRate: "پٹرول",
  transportAdvice: "بہترین کرایہ طے کرنے کے لیے ڈیزل کی قیمت مدنظر رکھیں۔",
  historicalTrend: "گزشتہ 7 دن کے ریٹس",
  per40kg: "فی 40 کلوگرام (من)",
  weatherTitle: "لائیو زرعی موسم کی صورتحال",
  feelsLike: "محسوس شدہ درجہ حرارت",
  humidity: "نمی کا تناسب",
  windSpeed: "ہوا کی رفتار",
  rainChance: "بارش کا امکان",
  liveGpsLocation: "لائیو جی پی ایس لوکیشن",
  useMyLocation: "میری لوکیشن استعمال کریں",
  sprayAdvisoryTitle: "سپرے کے لیے موسمی مشورہ",
  sowingAdvisoryTitle: "آبپاشی اور بجائی کی ہدایات",
  forecast7Day: "آئندہ 7 دنوں کی پیشگوئی",
  aiAssistantTitle: "وائس فرسٹ اے آئی زرعی معاون",
  voiceFirstTitle: "اردو، پنجابی یا انگلش میں بولیں",
  speakOrTypePrompt: "مائیک دبائیں اور بولیں، یا نیچے سوال لکھیں۔",
  typeQuestionPlaceholder: "کھاد کا شیڈول، بیماری، بیج یا پانی کے متعلق سوال پوچھیں...",
  suggestedQuestions: [
    "گندم کو یوریا کھاد ڈالنے کا بہترین وقت کیا ہے؟",
    "کپاس کے مروڑیا وائرس کا فوری علاج کیا ہے؟",
    "کیا آج کے موسم میں سپرے کرنا درست ہے؟",
    "باسمتی چاول کا دانہ لمبا اور پیداوار کیسے بڑھائیں؟"
  ],
  clearConversation: "چیٹ صاف کریں",
  voiceInputLimitation: "کروم، ایج یا سفاری براؤزر پر مائیک کی آواز بہترین کام کرتی ہے۔",
  farmDetailsTitle: "میری زرعی زمین کی تفصیلات",
  farmLocation: "زمین کا مقام / گاؤں",
  farmSizeAcres: "کل رقبہ (ایکڑ میں)",
  mainCrops: "کاشت شدہ اہم فصلیں",
  soilType: "زمین / مٹی کی قسم",
  waterSource: "پانی کا ذریعہ (نہر / ٹیوب ویل)",
  noFarmDataYet: "آپ نے ابھی تک اپنی زمین کی معلومات درج نہیں کیں۔",
  addFarmInfo: "زمین کی معلومات شامل کریں",
  editFarmInfo: "معلومات میں ترمیم کریں",
  farmSavedSuccess: "زمین کی معلومات کامیابی سے محفوظ ہوگئیں!",
  studentDashboardTitle: "طالب علم اور ریسرچ ڈیش بورڈ",
  studentRepository: "طلبہ اور تحقیقی ذخیرہ (ریپوزٹری)",
  researchArea: "تحقیقی شعبہ",
  university: "یونیورسٹی / ادارہ",
  projectTitle: "منصوبے کا عنوان",
  researchInterests: "تحقیقی دلچسپیاں",
  contactCompany: "کمپنی سے رابطہ کریں",
  companyDirectory: "کمپنی ڈائریکٹری",
  opportunitiesAndGrants: "مواقع اور ریسرچ گرانٹس",
  researchResources: "تحقیقی وسائل",
  createResearchProfile: "ریسرچ پروفائل بنائیں",
  editResearchProfile: "پروفائل تبدیل کریں",
  noResearchProfileYet: "آپ نے ابھی تک ریسرچ پروفائل نہیں بنائی۔",
  contactStudent: "محقق سے رابطہ کریں",
  antiSpamNotice: "اسپام روکنے کے لیے صرف 1 میسج جا سکتا ہے۔ کمپنی کے جواب کے بعد مکمل چیٹ کھلے گی۔",
  companyDashboardTitle: "زرعی کاروباری اور کمپنی پورٹل",
  companyProfile: "کمپنی پروفائل",
  agriculturalNeeds: "زرعی ضروریات اور منصوبے",
  problemsAndChallenges: "موجودہ زرعی مسائل اور چیلنجز",
  findStudents: "طلبہ اور محققین تلاش کریں",
  postOpportunity: "نیا موقع شائع کریں",
  companyName: "کمپنی کا نام",
  agriculturalSpecialization: "زرعی شعبہ / مہارت",
  noCompanyProfileYet: "آپ نے کمپنی پروفائل سیٹ نہیں کی۔",
  createCompanyProfile: "کمپنی پروفائل بنائیں",
  inbox: "ان باکس اور رابطے",
  replyToStudent: "محقق کو جواب دیں",
  blockConversation: "بلاک کریں",
  landownerTitle: "زمیندار پورٹل",
  landDetails: "زمین کا ریکارڈ",
  hireFarmers: "کسان / مزدور ہائر کریں",
  hireFarmersDesc: "کٹائی، بجائی کے لیے مقامی کسانوں کو فوری نوٹیفکیشن بھیجیں",
  bookTransport: "فصل کی ٹرانسپورٹ بک کریں",
  bookTransportDesc: "منڈی تک مال پہنچانے کے لیے شہزور یا ٹرک بک کروائیں",
  availableLand: "کاشت کے لیے دستیاب زمین",
  cropSuitability: "مٹی اور فصل کی مناسبت",
  numberOfFarmersNeeded: "کتنے کسان / مزدور درکار ہیں",
  jobType: "کام کی قسم (کٹائی / بجائی)",
  hourlyRateOffered: "فی گھنٹہ معاوضہ (روپے)",
  workDate: "کام کی تاریخ اور وقت",
  activeJobsPosted: "شائع شدہ ملازمتیں",
  acceptJob: "کام قبول کریں",
  rejectJob: "مسترد کریں",
  jobNotificationTitle: "کام کی نئی اطلاع",
  farmersAcceptedCount: "کسانوں نے قبول کیا",
  transportDashboardTitle: "ٹرانسپورٹ اور ترسیل ڈیش بورڈ",
  vehicleFleet: "گاڑیوں کی دستیابی",
  deliveryRequests: "دستیاب ترسیلی درخواستیں",
  assignedDeliveries: "مقرر شدہ ٹرانسپورٹ آرڈرز",
  routeMap: "لائیو نقشہ اور جی پی ایس روٹ",
  transportSiteGuide: "ترسیل کا تصویری گائیڈ",
  acceptDelivery: "ٹرپ قبول کریں",
  startTrip: "سفر شروع کریں",
  completeDelivery: "ترسیل مکمل",
  cargoType: "فصل / مال کی قسم",
  quantityInTons: "وزن (ٹن میں)",
  pickupDropLocation: "روانگی اور منزل کا مقام",
  estimatedFare: "اندازاً کرایہ",
  financeTitle: "زرعی مالیاتی اور حکومتی اسکیمیں",
  openFinanceDesc: "زرعی ترقیاتی بینک، کامیاب کسان اور سولر ٹیوب ویل کی اوپن معلومات۔",
  ztblLoanSchemes: "زرعی ترقیاتی بینک (ZTBL) قرضہ جات",
  kamyabKisanScheme: "کامیاب کسان سبسڈی پروگرام",
  solarTubewellSubsidy: "سولر ٹیوب ویل فنانسنگ",
  cropInsuranceTakaful: "فصلوں کی تکافل اور انشورنس",
  noInvestorAccountNeeded: "کھلی عوامی معلومات: کسی خاص لاگ ان کے بغیر تمام کسان دیکھ سکتے ہیں۔",
  communityTitle: "کمیونٹی چیٹ",
  communitySubtitle: "اپنے شعبے کے دیگر ممبران کے ساتھ لائیو گفتگو",
  membersOnline: "کمیونٹی ممبران",
  typeMessagePlaceholder: "اپنا پیغام یہاں لکھیں...",
  send: "بھیجیں",
  voiceMessage: "آواز کے ذریعے پیغام",
  reportMessage: "رپورٹ",
  noMessagesYet: "ابھی کوئی پیغام نہیں ہے۔ بات چیت شروع کریں!",
  strictlyNoPostsNotice: "براہ راست چیٹ روم۔ کوئی غیر ضروری سوشل میڈیا پوسٹس نہیں۔",
  unauthorizedAccess: "رسائی ناممکن ہے",
  unauthorizedRoleMessage: "آپ کو دوسرے کردار کے نجی ڈیش بورڈ دیکھنے کی اجازت نہیں ہے۔",
  loginRequired: "ڈیش بورڈ کے لیے لاگ ان کرنا ضروری ہے۔",
};

const pa = {
  appName: "ایگرالیٹکس اے آئی",
  tagline: "سیانی کھیتی، سوہنا کل۔",
  dashboard: "ڈیش بورڈ",
  community: "ساتھ / کمیونٹی",
  more: "ہور",
  language: "بولی",
  profile: "پروفائل",
  settings: "سیٹنگز",
  logout: "باہر نکلو",
  signIn: "لاگ ان ہوؤ",
  signUp: "نواں کھاتہ بناؤ",
  createAccount: "کھاتہ بناؤ",
  welcome: "جی آیاں نوں",
  roles: {
    farmer: "جٹ / کسان",
    farmerDesc: "فصل دی بیماری، منڈی دا بھاء، موسم تے مفت زرعی صلاح",
    studentResearcher: "طالب علم / کھوجی",
    studentResearcherDesc: "کھیتی باڑی دی ریسرچ، پراجیکٹ تے نویاں ول سکھو",
    company: "کمپنی",
    companyDesc: "زرعی ماہرین، ریسرچ پراجیکٹ تے حل لبھو",
    landowner: "زمیندار / جاگیردار",
    landownerDesc: "رقبے دا بندوبست، وڈھی لئی کسان تے گڈی بک کرو",
    transport: "ٹرانسپورٹ / گڈی والا",
    transportDesc: "فصل منڈی تک پہنچاؤ تے نویاں بکنگاں لوو",
  },
  chooseLanguage: "اپنی بولی چنو",
  chooseRole: "اپنا کردار چنو",
  getStarted: "شروع کرو",
  alreadyHaveAccount: "پہلاں توں کھاتہ بنیا اے؟",
  dontHaveAccount: "کھاتہ نہیں بنیا؟",
  fullName: "پورا ناں",
  emailAddress: "ای میل پتہ",
  password: "پاس ورڈ",
  confirmPassword: "پاس ورڈ دی تصدیق",
  passwordMismatch: "پاس ورڈ اکو جئے نہیں نیں",
  creatingAccount: "کھاتہ بندا پیا اے...",
  signingIn: "لاگ ان ہندا پیا اے...",
  save: "سانبھو",
  cancel: "چھڈو",
  search: "لبھو",
  filter: "چھانٹی کرو",
  edit: "تبدیل کرو",
  delete: "مٹاؤ",
  viewAll: "سارا کجھ ویکھو",
  back: "پچھانہہ",
  submit: "جمع کرو",
  loading: "کم ہو رہیا اے...",
  success: "کامیاب",
  error: "خرابی",
  listen: "سنو",
  speak: "بولو",
  listening: "سن رہیا ہاں...",
  thinking: "سوچ رہیا اے...",
  farmerDashboard: "کسان دا ڈیش بورڈ",
  scanCrop: "فصل دی فوٹو کھچو",
  scanCropDesc: "فصل دی بیماری پچھانو تے پکا علاج پاؤ",
  marketRates: "منڈی دے بھاء",
  marketRatesDesc: "اج دے منڈی بھاء تے ڈیزل دا ریٹ ویکھو",
  weather: "موسم دا حال",
  weatherDesc: "لائیو موسم، بارش تے سپرے دی صلاح",
  aiHelp: "اے آئی کھیتی مددگار",
  aiHelpDesc: "اپنی بولی چ بول کے فوری زرعی مشورہ لوو",
  myFarm: "میرا کھیت / رقبہ",
  myFarmDesc: "اپنے رقبے، کنک، چاول تے نہری پانی دا ریکارڈ رکھو",
  farmerHourlyRate: "دیہاڑی / فی گھنٹہ ریٹ: 350 توں 500 روپے",
  cropScannerTitle: "فصل دی بیماری لبھن آلا کیمرہ",
  uploadImage: "فصل دی فوٹو لاؤ",
  takePhoto: "کیمرے نال فوٹو لوو",
  analyzeCrop: "فصل چیک کرو",
  analyzingImage: "اے آئی فصل نوں چیک کر رہیا اے...",
  cropProblemIdentified: "فصل دی بیماری / مسئلہ",
  confidence: "پکی گل",
  severity: "نقصان دا خطرہ",
  simpleExplanation: "سوکھا ویروا",
  suggestedNextSteps: "ہن کیہ کرنا چاہیدا اے",
  preventiveMeasures: "اگوں لئی بچاء دی تدبیر",
  agriculturalCaution: "زرعی احتیاط: کوئی وی دوائی سپرے کرن توں پہلاں زرعی ماہر نال وی ضرور پچھو۔",
  scanAnotherCrop: "ہور فصل دی فوٹو لوو",
  marketTitle: "غلہ منڈی دے اج دے بھاء",
  todaysMandiPrices: "اج دے منڈی ریٹ",
  selectOrSearchCrop: "فصل چنو یا لبھو",
  searchCropPlaceholder: "کنک، جھونا، کپاہ، مکئی لبھو...",
  allCities: "سارے شہر",
  fuelRatesTitle: "ٹرانسپورٹ ایندھن (ڈیزل / پٹرول) دا ریٹ",
  dieselRate: "ڈیزل بھاء (ٹرانسپورٹ)",
  petrolRate: "پٹرول",
  transportAdvice: "منڈی دا کرایہ طے کرن ویلے ڈیزل دا بھاء ضرور ویکھو۔",
  historicalTrend: "پچھلے 7 دناں دے ریٹ",
  per40kg: "فی 40 کلو (من)",
  weatherTitle: "کھیتی باڑی موسم دی صورتحال",
  feelsLike: "محسوس درجہ حرارت",
  humidity: "ہوا چ نمی",
  windSpeed: "ہوا دی رفتار",
  rainChance: "مینھ دا امکان",
  liveGpsLocation: "لائیو جی پی ایس لوکیشن",
  useMyLocation: "میری لوکیشن ورتو",
  sprayAdvisoryTitle: "سپرے کرن لئی صلاح",
  sowingAdvisoryTitle: "پانی تے بیجائی دی صلاح",
  forecast7Day: "آؤندے 7 دناں دا موسم",
  aiAssistantTitle: "بول کے پچھن آلا زرعی معاون",
  voiceFirstTitle: "پنجابی، اردو یا انگریزی چ بولو",
  speakOrTypePrompt: "مائیک دبا کے بولو، یا تھلے سوال لکھو۔",
  typeQuestionPlaceholder: "کھاد، بیج، پانی یا بیماری بارے سوال پچھو...",
  suggestedQuestions: [
    "کنک نوں یوریا کھاد کیہڑے ویلے دینی چاہیدی اے؟",
    "کپاہ دے مروڑیا وائرس دا کیہ پکا علاج اے؟",
    "کیہ اج دے موسم چ سپرے کرنا ٹھیک رہے گا؟",
    "باسمتی جھونے دی پیداوار ودھاون دا ول دسو؟"
  ],
  clearConversation: "چیٹ صاف کرو",
  voiceInputLimitation: "کروم یا سفاری براؤزر چ آواز ساریاں نالوں ودھیا کام کردی اے۔",
  farmDetailsTitle: "میرے رقبے دی تفصیل",
  farmLocation: "رقبے دی تھاں / پنڈ",
  farmSizeAcres: "کل رقبہ (ایکڑ چ)",
  mainCrops: "بیجیاں گئیاں فصلاں",
  soilType: "زمین / مٹی دی قسم",
  waterSource: "پانی دا وسیلہ (نہر / ٹیوب ویل)",
  noFarmDataYet: "تسیں اجے تیکر اپنے رقبے دی معلومات نہیں پائی۔",
  addFarmInfo: "رقبے دی معلومات پاؤ",
  editFarmInfo: "معلومات بدلو",
  farmSavedSuccess: "رقبے دی معلومات سانبھ لئی گئی اے!",
  studentDashboardTitle: "طالب علم تے کھوجی ڈیش بورڈ",
  studentRepository: "طلبہ ریسرچ ریپوزٹری",
  researchArea: "تحقیقی شعبہ",
  university: "یونیورسٹی / ادارہ",
  projectTitle: "پراجیکٹ دا ناں",
  researchInterests: "ریسرچ چ دلچسپی",
  contactCompany: "کمپنی نال رابطہ کرو",
  companyDirectory: "کمپنی ڈائریکٹری",
  opportunitiesAndGrants: "موقعے تے ریسرچ گرانٹس",
  researchResources: "کھوج دے وسیلے",
  createResearchProfile: "ریسرچ پروفائل بناؤ",
  editResearchProfile: "پروفائل بدلو",
  noResearchProfileYet: "تسیں اجے تیکر ریسرچ پروفائل نہیں بنائی۔",
  contactStudent: "کھوجی نال رابطہ کرو",
  antiSpamNotice: "فضول میسج روکن لئی صرف 1 میسج جا سکدا اے۔ اوہناں دے جواب توں بعد چیٹ کھل جاوے گی۔",
  companyDashboardTitle: "زرعی کاروباری کمپنی پورٹل",
  companyProfile: "کمپنی پروفائل",
  agriculturalNeeds: "زرعی لوڑاں تے پراجیکٹ",
  problemsAndChallenges: "موجودہ زرعی مسئلے تے چیلنج",
  findStudents: "طلبہ تے ریسرچر لبھو",
  postOpportunity: "نواں موقع پوسٹ کرو",
  companyName: "کمپنی دا ناں",
  agriculturalSpecialization: "زرعی مہارت",
  noCompanyProfileYet: "تسیں کمپنی پروفائل نہیں بنائی۔",
  createCompanyProfile: "کمپنی پروفائل بناؤ",
  inbox: "ان باکس تے سنیہے",
  replyToStudent: "جواب دیو",
  blockConversation: "بلاک کرو",
  landownerTitle: "زمیندار پورٹل",
  landDetails: "رقبے دا ریکارڈ",
  hireFarmers: "کسان / دیہاڑی دار ہائر کرو",
  hireFarmersDesc: "وڈھی یا بیجائی لئی نیڑے دے کساناں نوں کم دی اطلاع بھیجو",
  bookTransport: "فصل چکن لئی گڈی بک کرو",
  bookTransportDesc: "منڈی مال لیجان لئی شہزور یا ٹرالی بک کرواؤ",
  availableLand: "کاشت لئی خالی رقبہ",
  cropSuitability: "مٹی تے فصل دی مناسبت",
  numberOfFarmersNeeded: "کینے بندے درکار نیں",
  jobType: "کم دی قسم (وڈھی / بیجائی)",
  hourlyRateOffered: "فی گھنٹہ دیہاڑی (روپے)",
  workDate: "کم دی تاریخ تے ویلا",
  activeJobsPosted: "نویاں نکلیاں نوکریاں",
  acceptJob: "کم منظور کرو",
  rejectJob: "رد کرو",
  jobNotificationTitle: "نویں کم دی اطلاع",
  farmersAcceptedCount: "کساناں نے منظور کیتا",
  transportDashboardTitle: "ٹرانسپورٹ تے گڈیاں دا ڈیش بورڈ",
  vehicleFleet: "گڈیاں دی موجودگی",
  deliveryRequests: "دستیاب مال چکن دیاں درخاستاں",
  assignedDeliveries: "ملی ہوئی بکنگ",
  routeMap: "لائیو نقشہ تے جی پی ایس روٹ",
  transportSiteGuide: "ترسیل دا نقشہ گائیڈ",
  acceptDelivery: "چکر منظور کرو",
  startTrip: "سفر شروع کرو",
  completeDelivery: "مال پہنچ گیا",
  cargoType: "فصل / مال دی ونڈ",
  quantityInTons: "وزن (ٹن چ)",
  pickupDropLocation: "مال چکن تے لہاݨ دی تھاں",
  estimatedFare: "اندازاً کرایہ",
  financeTitle: "زرعی مالیاتی تے سرکاری سکیماں",
  openFinanceDesc: "زرعی ترقیاتی بینک، کامیاب کسان تے سولر ٹیوب ویل دی کھلی معلومات۔",
  ztblLoanSchemes: "زرعی بینک (ZTBL) دے قرضے",
  kamyabKisanScheme: "کامیاب کسان سبسڈی پروگرام",
  solarTubewellSubsidy: "سولر ٹیوب ویل سبسڈی",
  cropInsuranceTakaful: "فصل تکافل تے انشورنس",
  noInvestorAccountNeeded: "کھلی سرکاری معلومات: سارے کسان بغیر لاگ ان ویکھ سکدے نیں۔",
  communityTitle: "ساتھ / کمیونٹی چیٹ",
  communitySubtitle: "اپنے شعبے دے سجناں نال لائیو گپ شپ",
  membersOnline: "کمیونٹی ممبر",
  typeMessagePlaceholder: "اپنا سنیہا ایتھے لکھو...",
  send: "ٹورو",
  voiceMessage: "آواز نال سنیہا",
  reportMessage: "رپورٹ",
  noMessagesYet: "اجے کوئی سنیہا نہیں آیا۔ گپ شپ شروع کرو!",
  strictlyNoPostsNotice: "سدھی گل بات دا گروپ۔ کوئی فالتو پوسٹاں نہیں۔",
  unauthorizedAccess: "پہنچ بند اے",
  unauthorizedRoleMessage: "تہاڈے کول ایس ڈیش بورڈ دی اجازت نہیں اے۔",
  loginRequired: "ڈیش بورڈ ویکھن لئی لاگ ان کرو۔",
};

const translationsFile = `import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  dashboard: string;
  community: string;
  more: string;
  language: string;
  profile: string;
  settings: string;
  logout: string;
  signIn: string;
  signUp: string;
  createAccount: string;
  welcome: string;
  roles: {
    farmer: string;
    farmerDesc: string;
    studentResearcher: string;
    studentResearcherDesc: string;
    company: string;
    companyDesc: string;
    landowner: string;
    landownerDesc: string;
    transport: string;
    transportDesc: string;
  };
  chooseLanguage: string;
  chooseRole: string;
  getStarted: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  fullName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  passwordMismatch: string;
  creatingAccount: string;
  signingIn: string;
  save: string;
  cancel: string;
  search: string;
  filter: string;
  edit: string;
  delete: string;
  viewAll: string;
  back: string;
  submit: string;
  loading: string;
  success: string;
  error: string;
  listen: string;
  speak: string;
  listening: string;
  thinking: string;
  farmerDashboard: string;
  scanCrop: string;
  scanCropDesc: string;
  marketRates: string;
  marketRatesDesc: string;
  weather: string;
  weatherDesc: string;
  aiHelp: string;
  aiHelpDesc: string;
  myFarm: string;
  myFarmDesc: string;
  farmerHourlyRate: string;
  cropScannerTitle: string;
  uploadImage: string;
  takePhoto: string;
  analyzeCrop: string;
  analyzingImage: string;
  cropProblemIdentified: string;
  confidence: string;
  severity: string;
  simpleExplanation: string;
  suggestedNextSteps: string;
  preventiveMeasures: string;
  agriculturalCaution: string;
  scanAnotherCrop: string;
  marketTitle: string;
  todaysMandiPrices: string;
  selectOrSearchCrop: string;
  searchCropPlaceholder: string;
  allCities: string;
  fuelRatesTitle: string;
  dieselRate: string;
  petrolRate: string;
  transportAdvice: string;
  historicalTrend: string;
  per40kg: string;
  weatherTitle: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  rainChance: string;
  liveGpsLocation: string;
  useMyLocation: string;
  sprayAdvisoryTitle: string;
  sowingAdvisoryTitle: string;
  forecast7Day: string;
  aiAssistantTitle: string;
  voiceFirstTitle: string;
  speakOrTypePrompt: string;
  typeQuestionPlaceholder: string;
  suggestedQuestions: string[];
  clearConversation: string;
  voiceInputLimitation: string;
  farmDetailsTitle: string;
  farmLocation: string;
  farmSizeAcres: string;
  mainCrops: string;
  soilType: string;
  waterSource: string;
  noFarmDataYet: string;
  addFarmInfo: string;
  editFarmInfo: string;
  farmSavedSuccess: string;
  studentDashboardTitle: string;
  studentRepository: string;
  researchArea: string;
  university: string;
  projectTitle: string;
  researchInterests: string;
  contactCompany: string;
  companyDirectory: string;
  opportunitiesAndGrants: string;
  researchResources: string;
  createResearchProfile: string;
  editResearchProfile: string;
  noResearchProfileYet: string;
  contactStudent: string;
  antiSpamNotice: string;
  companyDashboardTitle: string;
  companyProfile: string;
  agriculturalNeeds: string;
  problemsAndChallenges: string;
  findStudents: string;
  postOpportunity: string;
  companyName: string;
  agriculturalSpecialization: string;
  noCompanyProfileYet: string;
  createCompanyProfile: string;
  inbox: string;
  replyToStudent: string;
  blockConversation: string;
  landownerTitle: string;
  landDetails: string;
  hireFarmers: string;
  hireFarmersDesc: string;
  bookTransport: string;
  bookTransportDesc: string;
  availableLand: string;
  cropSuitability: string;
  numberOfFarmersNeeded: string;
  jobType: string;
  hourlyRateOffered: string;
  workDate: string;
  activeJobsPosted: string;
  acceptJob: string;
  rejectJob: string;
  jobNotificationTitle: string;
  farmersAcceptedCount: string;
  transportDashboardTitle: string;
  vehicleFleet: string;
  deliveryRequests: string;
  assignedDeliveries: string;
  routeMap: string;
  transportSiteGuide: string;
  acceptDelivery: string;
  startTrip: string;
  completeDelivery: string;
  cargoType: string;
  quantityInTons: string;
  pickupDropLocation: string;
  estimatedFare: string;
  financeTitle: string;
  openFinanceDesc: string;
  ztblLoanSchemes: string;
  kamyabKisanScheme: string;
  solarTubewellSubsidy: string;
  cropInsuranceTakaful: string;
  noInvestorAccountNeeded: string;
  communityTitle: string;
  communitySubtitle: string;
  membersOnline: string;
  typeMessagePlaceholder: string;
  send: string;
  voiceMessage: string;
  reportMessage: string;
  noMessagesYet: string;
  strictlyNoPostsNotice: string;
  unauthorizedAccess: string;
  unauthorizedRoleMessage: string;
  loginRequired: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: ${JSON.stringify(en, null, 2)},
  ur: ${JSON.stringify(ur, null, 2)},
  pa: ${JSON.stringify(pa, null, 2)}
};
`;

save('src/i18n/translations.ts', translationsFile);

// 2. Language Context
const langContext = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { translations, Translations } from './translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('agralyticx_lang') as LanguageCode;
    return saved && ['en', 'ur', 'pa'].includes(saved) ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('agralyticx_lang', lang);
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === 'ur' || language === 'pa';
  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
`;
save('src/i18n/LanguageContext.tsx', langContext);

console.log('i18n generated successfully');