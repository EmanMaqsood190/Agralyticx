import { LanguageCode } from '../types';

export interface Translations {
  gender: string;
genderMale: string;
genderFemale: string;
genderPreferNotToSay: string;
profilePicture: string;
uploadPicture: string;
changePicture: string;
profilePictureHelp: string;
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
  phoneNumber: string;
  companyPhoneNumber: string;
  cnicNumber: string;
  companyEmail: string;
  requiredAccountSafety: string;
  requiredIdentitySafety: string;
  optional: string;
  emailOptionalHelp: string;
  errorEnterCompanyName: string;
  errorEnterFullName: string;
  errorEnterCompanyPhone: string;
  errorEnterPhone: string;
  errorEnterCompanyEmail: string;
  errorEnterEmail: string;
  errorValidEmail: string;
  errorEnterCnic: string;
  errorCnicFormat: string;
  errorPasswordLength: string;
  errorCreateAccount: string;
  errorEnterPassword: string;
  errorInvalidLogin: string;
  signInSubtitle: string;
  signUpSubtitle: string;
  useCnicRegistered: string;
  useEmailRegistered: string;
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
  aiWelcomeMessage: string;
  micHintIdle: string;
  micHintListening: string;
  voiceNotAvailable: string;
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
    financeFarmerTool: string;
  financeCalculatorTitle: string;
  financeCalculatorSubtitle: string;
  financeChooseCalculator: string;
  financeCalculate: string;
  financeClear: string;
  financeResults: string;

  financeCrop: string;
  financeSelectCrop: string;
  financeCustomCropPlaceholder: string;
  financeSelectedCrop: string;

  financeRequiredFields: string;
  financeSelectCropError: string;
  financeCustomCropError: string;
  financePositiveLandArea: string;
  financePositiveYield: string;
  financePositiveLoan: string;
  financePositiveHours: string;
  financePositiveTransport: string;

  financeEmptyNotice: string;

  financeCropBudget: string;
  financeCropBudgetDesc: string;

  financeProfitLoss: string;
  financeProfitLossDesc: string;

  financeBreakEven: string;
  financeBreakEvenDesc: string;

  financeLoanEMI: string;
  financeLoanEMIDesc: string;

  financeMachinery: string;
  financeMachineryDesc: string;

  financeTransport: string;
  financeTransportDesc: string;

  financeLandArea: string;
  financeSeedCost: string;
  financeFertilizer: string;
  financePesticide: string;
  financeLabor: string;
  financeIrrigation: string;
  financeMachineryField: string;
  financeTransportField: string;
  financeOtherCosts: string;

  financeTotalProductionCost: string;
  financeExpectedYield: string;
  financeSellingPrice: string;
  financeSaleableYield: string;

  financeLoanAmount: string;
  financeAnnualRate: string;
  financeLoanTerm: string;

  financeMachineHours: string;
  financeFuelPerHour: string;
  financeFuelPrice: string;
  financeOperatorCost: string;
  financeOtherMachineCosts: string;

  financeDistance: string;
  financeTrips: string;
  financeVehicleCostPerKm: string;
  financeLoadingCost: string;
  financeOtherTransportCosts: string;

  financeEnterAmount: string;
  financeEnterArea: string;
  financeEnterTotalCost: string;
  financeEnterYield: string;
  financeEnterPricePerUnit: string;
  financeEnterLoanAmount: string;
  financeEnterRate: string;
  financeEnterMonths: string;
  financeEnterHours: string;
  financeEnterFuelUse: string;
  financeEnterFuelPrice: string;
  financeEnterHourlyCost: string;
  financeEnterDistance: string;
  financeEnterTrips: string;
  financeEnterCostPerKm: string;
  financeEnterLoadingCost: string;

  financeTotalCropBudget: string;
  financeCostPerAcre: string;
  financeExpectedRevenue: string;
  financeExpectedProfit: string;
  financeExpectedLoss: string;
  financeProfitMargin: string;
  financeBreakEvenSellingPrice: string;

  financeMonthlyEMI: string;
  financeTotalRepayment: string;
  financeTotalInterest: string;

  financeTotalMachineCost: string;
  financeCostPerMachineHour: string;

  financeTotalTransportCost: string;
  financeCostPerTrip: string;

  financeAcres: string;
  financeUnits: string;
  financeMonths: string;
  financeHours: string;
  financeLitresPerHour: string;
  financeKm: string;

  financeCropWheat: string;
  financeCropRice: string;
  financeCropCotton: string;
  financeCropMaize: string;
  financeCropSugarcane: string;
  financeCropPotato: string;
  financeCropOnion: string;
  financeCropTomato: string;
  financeCropMustard: string;
  financeCropChickpea: string;
  financeCropGroundnut: string;
  financeCropCustom: string;
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
  noSocialFeedNotice: string;
  findResearchers: string;
  manageCompanyProfile: string;
  agriLoansAndSubsidies: string;
  landRecordsTitle: string;
  signOut: string;
  unauthorizedAccess: string;
  unauthorizedRoleMessage: string;
  loginRequired: string;
  deleteAccountTitle: string;
  deleteAccountDesc: string;
  enterPasswordToConfirm: string;
  deleteAccountConfirmPrompt: string;
  deleteAccountBtn: string;
  deletingAccount: string;
  incorrectPassword: string;
  unableToDeleteAccount: string;
  showPassword: string;
  hidePassword: string;
  ccRoleFarmer: string;
  ccRoleStudent: string;
  ccRoleCompany: string;
  ccRoleLandowner: string;
  ccRoleTransport: string;
  ccDescFarmer: string;
  ccDescStudent: string;
  ccDescCompany: string;
  ccDescLandowner: string;
  ccDescTransport: string;
  ccHome: string;
  ccServersLabel: string;
  ccPrivateMessages: string;
  ccBadge: string;
  ccHeroLine1: string;
  ccHeroLine2: string;
  ccHeroLine3: string;
  ccHeroParagraph: string;
  ccExploreServers: string;
  ccYourCommunity: string;
  ccConversations: string;
  ccFindServer: string;
  ccFindServerDesc: string;
  ccCreateServerCard: string;
  ccCreateServerCardDesc: string;
  ccPrivateMessagesCardDesc: string;
  ccNewCommunity: string;
  ccCreateYourServer: string;
  ccCreateServerIntro: string;
  ccServerNameLabel: string;
  ccServerNamePlaceholder: string;
  ccDescriptionLabel: string;
  ccDescriptionPlaceholder: string;
  ccWhoCanJoin: string;
  ccWhoCanJoinDesc: string;
  ccCreateServerBtn: string;
  ccEnterServer: string;
  ccCommunitiesAvailable: string;
  ccSearchServersPlaceholder: string;
  ccLoadingCommunities: string;
  ccNoServersFound: string;
  ccBeFirstToCreate: string;
  ccPrivateLabel: string;
  ccPrivateMessagesDesc: string;
  ccLoadingPrivateMessages: string;
  ccNoPrivateConversations: string;
  ccNoPrivateConversationsDesc: string;
  ccEditServer: string;
  ccDeleteMyChatHistory: string;
  ccDeleteServer: string;
  ccServerOwner: string;
  ccCancel: string;
  ccSaveChanges: string;
  ccOneCommunityConversation: string;
  ccLoadingMessages: string;
  ccNoMessagesYetTitle: string;
  ccStartConversation: string;
  ccSave: string;
  ccJoinServerToChat: string;
  ccMembers: string;
  ccPeopleSuffix: string;
  ccCommunityMembers: string;
  ccDeleteConversationForMe: string;
  ccPrivateConversationLabel: string;
  ccOnlyYouAndCanSee: string;
  ccGlobalPrivateConversation: string;
  ccNoPrivateMessagesYet: string;
  ccSayHello: string;
  ccWelcomeTo: string;
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
  "appName": "AGRALYTICX AI",
  "tagline": "Smart Farming, Smarter Future",
  "dashboard": "Dashboard",
  "community": "Community",
  "more": "More",
  "language": "Language",
  "profile": "Profile",
  "settings": "Settings",
  "logout": "Sign Out",
  "signIn": "Sign In",
  "signUp": "Create Account",
  "createAccount": "Create Account",
  gender: "Gender",
genderMale: "Male",
genderFemale: "Female",
genderPreferNotToSay: "Prefer not to say",
profilePicture: "Profile Picture",
uploadPicture: "Upload Picture",
changePicture: "Change Picture",
profilePictureHelp: "Upload your own picture, or a gender-based avatar will be used automatically.",
  "welcome": "Welcome",
  "roles": {
    "farmer": "Farmer",
    "farmerDesc": "Manage your farm",
    "studentResearcher": "Student",
    "studentResearcherDesc": "Explore agriculture research",
    "company": "Company",
    "companyDesc": "Find agri talent",
    "landowner": "Landowner",
    "landownerDesc": "Manage your land",
    "transport": "Transport",
    "transportDesc": "Manage freight deliveries"
  },
  "chooseLanguage": "Choose your language",
  "chooseRole": "Choose your role",
  "getStarted": "Get Started",
  "alreadyHaveAccount": "Already have an account?",
  "dontHaveAccount": "Don't have an account?",
  "fullName": "Full Name",
  "emailAddress": "Email Address",
  "phoneNumber": "Phone Number",
  "companyPhoneNumber": "Company Phone Number",
  "cnicNumber": "CNIC Number",
  "companyEmail": "Company Email",
  "requiredAccountSafety": "Required for account safety and verification.",
  "requiredIdentitySafety": "Required for identity and safety verification.",
  "optional": "Optional",
  "emailOptionalHelp": "Email is optional. You can leave this field blank.",
  "errorEnterCompanyName": "Please enter the company name.",
  "errorEnterFullName": "Please enter your full name.",
  "errorEnterCompanyPhone": "Please enter the company phone number.",
  "errorEnterPhone": "Please enter your phone number.",
  "errorEnterCompanyEmail": "Please enter the company email address.",
  "errorEnterEmail": "Please enter your email address.",
  "errorValidEmail": "Please enter a valid email address.",
  "errorEnterCnic": "Please enter your CNIC number.",
  "errorCnicFormat": "Please enter CNIC in the format 35202-1234567-1.",
  "errorPasswordLength": "Password must be at least 6 characters.",
  "errorCreateAccount": "Failed to create account.",
    "errorEnterPassword": "Please enter your password.",
  "errorInvalidLogin": "Invalid login credentials.",
  "signInSubtitle": "Sign in to access your agricultural dashboard",
  "signUpSubtitle": "Create your verified account in 30 seconds",
  "useCnicRegistered": "Use the CNIC you registered with.",
  "useEmailRegistered": "Use the email address you registered with.",
  "password": "Password",
  "confirmPassword": "Confirm Password",
  "passwordMismatch": "Passwords do not match",
  "creatingAccount": "Creating account...",
  "signingIn": "Signing in...",
  "save": "Save",
  "cancel": "Cancel",
  "search": "Search",
  "filter": "Filter",
  "edit": "Edit",
  "delete": "Delete",
  "viewAll": "View All",
  "back": "Back",
  "submit": "Submit",
  "loading": "Loading...",
  "success": "Success",
  "error": "Error",
  "listen": "Listen",
  "speak": "Speak",
  "listening": "Listening...",
  "thinking": "Thinking...",
  "farmerDashboard": "Farmer Dashboard",
  "scanCrop": "Scan Crop",
  "scanCropDesc": "Identify crop diseases & get instant remedies",
  "marketRates": "Market Rates",
  "marketRatesDesc": "See today's mandi crop prices and fuel rates",
  "weather": "Weather",
  "weatherDesc": "Live agricultural weather, rain & spray advisories",
  "aiHelp": "AI Farming Help",
  "aiHelpDesc": "Voice-first smart assistant for your farming queries",
  "myFarm": "My Farm",
  "myFarmDesc": "Manage your farm location, crops, and land details",
  "farmerHourlyRate": "Current Farmer Hourly Rate: Rs. 350 - 500 / hr",
  "cropScannerTitle": "Crop Health & Disease Scanner",
  "uploadImage": "Upload Image",
  "takePhoto": "Take Photo / Camera",
  "analyzeCrop": "Analyze Crop Health",
  "analyzingImage": "Analyzing crop image with AI...",
  "cropProblemIdentified": "Identified Crop Issue",
  "confidence": "Confidence",
  "severity": "Severity Level",
  "simpleExplanation": "Simple Explanation",
  "suggestedNextSteps": "Suggested Immediate Action",
  "preventiveMeasures": "Preventive Measures",
  "agriculturalCaution": "Agricultural Caution: Always verify with local agricultural extension officers for heavy chemical applications.",
  "scanAnotherCrop": "Scan Another Crop",
  "marketTitle": "Agricultural Market (Mandi) Rates",
  "todaysMandiPrices": "Today's Mandi Crop Prices",
  "selectOrSearchCrop": "Select or Search Crop",
  "searchCropPlaceholder": "Search Wheat, Rice, Cotton, Corn...",
  "allCities": "All Cities",
  "fuelRatesTitle": "Transport Fuel Rates (Diesel / Petrol)",
  "dieselRate": "Diesel (Transport Rate)",
  "petrolRate": "Petrol",
  "transportAdvice": "Check fuel rates to negotiate the best freight cost for your produce.",
  "historicalTrend": "7-Day Price Trend",
  "per40kg": "per 40 kg (Maund)",
  "weatherTitle": "Live Agricultural Weather",
  "feelsLike": "Feels Like",
  "humidity": "Humidity",
  "windSpeed": "Wind Speed",
  "rainChance": "Rain Chance",
  "liveGpsLocation": "Live GPS Location",
  "useMyLocation": "Use My Location",
  "sprayAdvisoryTitle": "Pesticide Spray Advisory",
  "sowingAdvisoryTitle": "Irrigation & Sowing Advisory",
  "forecast7Day": "7-Day Weather Forecast",
  "aiAssistantTitle": "Voice-First AI Farming Assistant",
  "voiceFirstTitle": "Speak in English, Urdu or Punjabi",
  "speakOrTypePrompt": "Tap the microphone to speak, or type your question below.",
  "typeQuestionPlaceholder": "Ask about crop diseases, fertilizer schedule, seeds, or irrigation...",
  "suggestedQuestions": [
    "How much urea fertilizer should I apply for wheat?",
    "What is the best treatment for cotton leaf curl virus?",
    "Is today suitable for pesticide spray based on weather?",
    "How do I improve basmati rice grain length and yield?"
  ],
  "clearConversation": "Clear Chat",
  "voiceInputLimitation": "Web Speech API is available in modern browsers (Chrome, Edge, Safari).",
  "aiWelcomeMessage": "Welcome! I am your AI Farming Assistant. Tap the microphone to speak in English, Urdu, or Punjabi, or type your question below.",
  "micHintIdle": "Tap Mic to Speak in your selected language",
  "micHintListening": "Listening to your voice... Speak clearly",
  "voiceNotAvailable": "Voice playback for this language isn't available on this device/browser. You can still read the reply below.",
  "farmDetailsTitle": "My Farm Information",
  "farmLocation": "Farm Location / Village",
  "farmSizeAcres": "Farm Size (in Acres)",
  "mainCrops": "Main Crops Cultivated",
  "soilType": "Soil Type",
  "waterSource": "Water / Irrigation Source",
  "noFarmDataYet": "You haven't added your farm information yet.",
  "addFarmInfo": "Add Farm Information",
  "editFarmInfo": "Edit Farm Information",
  "farmSavedSuccess": "Farm information saved successfully!",
  "studentDashboardTitle": "Student & Research Dashboard",
  "studentRepository": "Student & Research Repository",
  "researchArea": "Research Area",
  "university": "University / Institute",
  "projectTitle": "Project Title",
  "researchInterests": "Research Interests",
  "contactCompany": "Contact Company",
  "companyDirectory": "Company Directory",
  "opportunitiesAndGrants": "Opportunities & Grants",
  "researchResources": "Research Resources",
  "createResearchProfile": "Create Research Profile",
  "editResearchProfile": "Edit Research Profile",
  "noResearchProfileYet": "You have not created your research profile yet.",
  "contactStudent": "Contact Researcher",
  "antiSpamNotice": "To prevent spam, you can send 1 message. Direct messaging unlocks once they reply.",
  "companyDashboardTitle": "Agribusiness & Company Portal",
  "companyProfile": "Company Profile",
  "agriculturalNeeds": "Agricultural Needs & RFPs",
  "problemsAndChallenges": "Current Agricultural Challenges",
  "findStudents": "Find Students & Researchers",
  "postOpportunity": "Post Opportunity",
  "companyName": "Company Name",
  "agriculturalSpecialization": "Agri Specialization",
  "noCompanyProfileYet": "You haven't set up your company profile yet.",
  "createCompanyProfile": "Create Company Profile",
  "inbox": "Inquiries & Inbox",
  "replyToStudent": "Reply to Researcher",
  "blockConversation": "Block",
  "landownerTitle": "Landowner Hub",
  "landDetails": "My Land Records",
  "hireFarmers": "Hire Farm Workers",
  "hireFarmersDesc": "Post farm jobs (harvesting, sowing) and dispatch to local farmers",
  "bookTransport": "Book Crop Transport",
  "bookTransportDesc": "Book cargo trucks and tractor trolleys for mandi transport",
  "availableLand": "Available Land for Farming",
  "cropSuitability": "Soil & Crop Suitability",
  "numberOfFarmersNeeded": "Number of Workers Needed",
  "jobType": "Type of Farm Work",
  "hourlyRateOffered": "Hourly Rate (PKR)",
  "workDate": "Work Date & Time",
  "activeJobsPosted": "Active Farm Job Postings",
  "acceptJob": "Accept Job",
  "rejectJob": "Reject Job",
  "jobNotificationTitle": "New Farm Work Notification",
  "farmersAcceptedCount": "Farmers Accepted",
  "transportDashboardTitle": "Transport & Logistics Dashboard",
  "vehicleFleet": "Fleet Availability",
  "deliveryRequests": "Available Delivery Requests",
  "assignedDeliveries": "Assigned Freight Shipments",
  "routeMap": "Interactive Route Map & GPS",
  "transportSiteGuide": "Logistics Flow Guide",
  "acceptDelivery": "Accept Trip",
  "startTrip": "Start Trip",
  "completeDelivery": "Mark Delivered",
  "cargoType": "Crop / Cargo",
  "quantityInTons": "Quantity (Tons)",
  "pickupDropLocation": "Pickup & Destination",
  "estimatedFare": "Estimated Fare",
  "financeTitle": "Agricultural Finance Directory",
    "financeFarmerTool": "Farmer Finance Tool",
  "financeCalculatorTitle": "Finance Calculator",
  "financeCalculatorSubtitle": "Calculate crop costs, expected profit, break-even prices, farm loan payments, machinery costs and transport expenses.",
  "financeChooseCalculator": "What do you want to calculate?",
  "financeCalculate": "Calculate",
  "financeClear": "Clear",
  "financeResults": "Calculation Results",

  "financeCrop": "Crop",
  "financeSelectCrop": "Select a crop",
  "financeCustomCropPlaceholder": "Type your crop name",
  "financeSelectedCrop": "Selected crop",

  "financeRequiredFields": "Please enter all required figures before calculating.",
  "financeSelectCropError": "Please select a crop.",
  "financeCustomCropError": "Please type the crop name.",
  "financePositiveLandArea": "Land area must be greater than zero.",
  "financePositiveYield": "Expected yield must be greater than zero.",
  "financePositiveLoan": "Loan amount and loan term must be greater than zero.",
  "financePositiveHours": "Machine working hours must be greater than zero.",
  "financePositiveTransport": "Distance and number of trips must be greater than zero.",

  "financeEmptyNotice": "Enter your actual figures. Numeric fields start empty and no farm costs are assumed.",

  "financeCropBudget": "Crop Budget",
  "financeCropBudgetDesc": "Estimate the complete cost of growing a crop from land preparation to harvest.",

  "financeProfitLoss": "Crop Profit / Loss",
  "financeProfitLossDesc": "Compare expected crop revenue with your production cost.",

  "financeBreakEven": "Break-even Price",
  "financeBreakEvenDesc": "Find the minimum selling price needed to recover your production cost.",

  "financeLoanEMI": "Farm Loan EMI",
  "financeLoanEMIDesc": "Estimate monthly installment, total repayment and total interest on a farm loan.",

  "financeMachinery": "Machinery & Fuel Cost",
  "financeMachineryDesc": "Calculate the cost of a tractor, harvester, pump or other machine job.",

  "financeTransport": "Farm Transport Cost",
  "financeTransportDesc": "Estimate the cost of moving farm inputs or harvested crops.",

  "financeLandArea": "Land Area",
  "financeSeedCost": "Seed Cost",
  "financeFertilizer": "Fertilizer & Nutrients",
  "financePesticide": "Pesticides & Crop Protection",
  "financeLabor": "Labor Cost",
  "financeIrrigation": "Irrigation / Water Cost",
  "financeMachineryField": "Machinery & Field Work",
  "financeTransportField": "Transport Cost",
  "financeOtherCosts": "Other Farm Costs",

  "financeTotalProductionCost": "Total Production Cost",
  "financeExpectedYield": "Expected Yield",
  "financeSellingPrice": "Expected Selling Price",
  "financeSaleableYield": "Expected Saleable Yield",

  "financeLoanAmount": "Loan Amount",
  "financeAnnualRate": "Annual Interest Rate",
  "financeLoanTerm": "Loan Term",

  "financeMachineHours": "Machine Working Hours",
  "financeFuelPerHour": "Fuel Consumption",
  "financeFuelPrice": "Fuel Price",
  "financeOperatorCost": "Operator Cost",
  "financeOtherMachineCosts": "Other Machine Costs",

  "financeDistance": "Distance Per Trip",
  "financeTrips": "Number of Trips",
  "financeVehicleCostPerKm": "Vehicle Cost",
  "financeLoadingCost": "Loading / Unloading",
  "financeOtherTransportCosts": "Other Transport Costs",

  "financeEnterAmount": "Enter amount",
  "financeEnterArea": "Enter land area",
  "financeEnterTotalCost": "Enter total cost",
  "financeEnterYield": "Enter expected yield",
  "financeEnterPricePerUnit": "Enter price per unit",
  "financeEnterLoanAmount": "Enter loan amount",
  "financeEnterRate": "Enter annual rate",
  "financeEnterMonths": "Enter number of months",
  "financeEnterHours": "Enter working hours",
  "financeEnterFuelUse": "Enter fuel use",
  "financeEnterFuelPrice": "Enter price per litre",
  "financeEnterHourlyCost": "Enter hourly cost",
  "financeEnterDistance": "Enter distance",
  "financeEnterTrips": "Enter number of trips",
  "financeEnterCostPerKm": "Enter cost per km",
  "financeEnterLoadingCost": "Enter cost per trip",

  "financeTotalCropBudget": "Total Crop Budget",
  "financeCostPerAcre": "Cost Per Acre",
  "financeExpectedRevenue": "Expected Revenue",
  "financeExpectedProfit": "Expected Profit",
  "financeExpectedLoss": "Expected Loss",
  "financeProfitMargin": "Profit Margin",
  "financeBreakEvenSellingPrice": "Break-even Selling Price",

  "financeMonthlyEMI": "Monthly EMI",
  "financeTotalRepayment": "Total Repayment",
  "financeTotalInterest": "Total Interest",

  "financeTotalMachineCost": "Total Machine Cost",
  "financeCostPerMachineHour": "Cost Per Machine Hour",

  "financeTotalTransportCost": "Total Transport Cost",
  "financeCostPerTrip": "Cost Per Trip",

  "financeAcres": "acres",
  "financeUnits": "units",
  "financeMonths": "months",
  "financeHours": "hours",
  "financeLitresPerHour": "litres/hour",
  "financeKm": "km",

  "financeCropWheat": "Wheat",
  "financeCropRice": "Rice",
  "financeCropCotton": "Cotton",
  "financeCropMaize": "Maize / Corn",
  "financeCropSugarcane": "Sugarcane",
  "financeCropPotato": "Potato",
  "financeCropOnion": "Onion",
  "financeCropTomato": "Tomato",
  "financeCropMustard": "Mustard",
  "financeCropChickpea": "Chickpea",
  "financeCropGroundnut": "Groundnut",
  "financeCropCustom": "Other / Custom Crop",
  "openFinanceDesc": "Open-access Pakistani agricultural loans, government subsidies, and solar schemes.",
  "ztblLoanSchemes": "ZTBL Zarai Agri Loans",
  "kamyabKisanScheme": "Kamyab Kisan Subsidies",
  "solarTubewellSubsidy": "Solar Tube-well Financing",
  "cropInsuranceTakaful": "Crop Insurance & Takaful",
  "noInvestorAccountNeeded": "Public Open Data: Accessible to all farmers without investor login.",
  "communityTitle": "Community Chat",
  "communitySubtitle": "Real-time discussion with verified members of your role",
  "membersOnline": "Community Members",
  "typeMessagePlaceholder": "Type your message here...",
  "send": "Send",
  "voiceMessage": "Voice Input",
  "reportMessage": "Report",
  "noMessagesYet": "No messages yet. Start the conversation!",
  "strictlyNoPostsNotice": "Direct group chat only. No social media posts or feed clutter.",
  "noSocialFeedNotice": "Private peer community. Real-time group chat without feeds or vanity posts.",
  "findResearchers": "Find Researchers",
  "manageCompanyProfile": "Manage Company Profile",
  "agriLoansAndSubsidies": "Agricultural Loans & Subsidies",
  "landRecordsTitle": "My Land Parcels",
  "signOut": "Sign Out",
  "unauthorizedAccess": "Access Denied",
  "unauthorizedRoleMessage": "You do not have permission to view this role's private area.",
  "loginRequired": "Please sign in to access your dashboard.",
  "deleteAccountTitle": "Delete Account",
  "deleteAccountDesc": "Permanently delete your account and remove your profile data. This action cannot be undone.",
  "enterPasswordToConfirm": "Enter your password to confirm",
  "deleteAccountConfirmPrompt": "Are you sure you want to permanently delete your account? This action cannot be undone.",
  "deleteAccountBtn": "Delete Account",
  "deletingAccount": "Deleting...",
  "incorrectPassword": "Incorrect password.",
  "unableToDeleteAccount": "Unable to delete your account.",
  "showPassword": "Show password",
  "hidePassword": "Hide password",
  "ccRoleFarmer": "Farmer",
  "ccRoleStudent": "Student / Researcher",
  "ccRoleCompany": "Company",
  "ccRoleLandowner": "Landowner",
  "ccRoleTransport": "Transport",
  "ccDescFarmer": "Connect with farmers, share field experience and discuss agricultural problems.",
  "ccDescStudent": "Collaborate on research, projects, experiments and agricultural innovation.",
  "ccDescCompany": "Connect with agricultural businesses, teams, partners and industry professionals.",
  "ccDescLandowner": "Connect with landowners and discuss land, farming opportunities and collaboration.",
  "ccDescTransport": "Connect with agricultural transport providers and coordinate logistics.",
  "ccHome": "Community Home",
  "ccServersLabel": "Servers",
  "ccPrivateMessages": "Private Messages",
  "ccBadge": "AGRALYTICX COMMUNITY",
  "ccHeroLine1": "Connect.",
  "ccHeroLine2": "Collaborate.",
  "ccHeroLine3": "Grow.",
  "ccHeroParagraph": "Join agricultural communities, exchange knowledge and build meaningful connections with people working across the agricultural ecosystem.",
  "ccExploreServers": "Explore Servers",
  "ccYourCommunity": "YOUR COMMUNITY",
  "ccConversations": "Conversations",
  "ccFindServer": "Find a Server",
  "ccFindServerDesc": "Discover communities created for your role.",
  "ccCreateServerCard": "Create a Server",
  "ccCreateServerCardDesc": "Build your own community and bring people together.",
  "ccPrivateMessagesCardDesc": "Continue private conversations with community members.",
  "ccNewCommunity": "NEW COMMUNITY",
  "ccCreateYourServer": "Create Your Server",
  "ccCreateServerIntro": "Create a dedicated space for verified {role} users.",
  "ccServerNameLabel": "Server Name",
  "ccServerNamePlaceholder": "e.g. Punjab Smart Farming",
  "ccDescriptionLabel": "Description",
  "ccDescriptionPlaceholder": "Tell other members what this community is about...",
  "ccWhoCanJoin": "Who can join?",
  "ccWhoCanJoinDesc": "Only verified {role} users can discover and join this server.",
  "ccCreateServerBtn": "Create Server",
  "ccEnterServer": "Enter a Server",
  "ccCommunitiesAvailable": "{count} {role} communities available",
  "ccSearchServersPlaceholder": "Search {role} servers...",
  "ccLoadingCommunities": "Loading communities...",
  "ccNoServersFound": "No servers found",
  "ccBeFirstToCreate": "Be the first to create a {role} community.",
  "ccPrivateLabel": "PRIVATE",
  "ccPrivateMessagesDesc": "Your private conversations are independent from community servers. Even if a server is deleted, your private conversations remain here.",
  "ccLoadingPrivateMessages": "Loading private messages...",
  "ccNoPrivateConversations": "No private conversations",
  "ccNoPrivateConversationsDesc": "Open a community member's profile and start a private conversation.",
  "ccEditServer": "Edit Server",
  "ccDeleteMyChatHistory": "Delete My Chat History",
  "ccDeleteServer": "Delete Server",
  "ccServerOwner": "SERVER OWNER",
  "ccCancel": "Cancel",
  "ccSaveChanges": "Save Changes",
  "ccOneCommunityConversation": "One community conversation",
  "ccLoadingMessages": "Loading messages...",
  "ccNoMessagesYetTitle": "No messages yet",
  "ccStartConversation": "Start the conversation with your community.",
  "ccSave": "Save",
  "ccJoinServerToChat": "Join Server to Chat",
  "ccMembers": "Members",
  "ccPeopleSuffix": "people",
  "ccCommunityMembers": "Community Members",
  "ccDeleteConversationForMe": "Delete Conversation for Me",
  "ccPrivateConversationLabel": "PRIVATE CONVERSATION",
  "ccOnlyYouAndCanSee": "Only you and {name} can see these messages.",
  "ccGlobalPrivateConversation": "Global private conversation",
  "ccNoPrivateMessagesYet": "No private messages yet",
  "ccSayHello": "Say hello to start the conversation.",
  "ccWelcomeTo": "Welcome to"
},
  ur: {
  "appName": "ایگرالیٹکس اے آئی",
  "tagline": "جدید زراعت، روشن مستقبل",
  "dashboard": "ڈیش بورڈ",
  "community": "کمیونٹی",
  "more": "مزید",
  "language": "زبان",
  "profile": "پروفائل",
  "settings": "ترتیبات",
  "logout": "لاگ آؤٹ",
  "signIn": "لاگ ان کریں",
  "signUp": "نیا اکاؤنٹ بنائیں",
  gender: "صنف",
genderMale: "مرد",
genderFemale: "خاتون",
genderPreferNotToSay: "بتانا نہیں چاہتا/چاہتی",
profilePicture: "پروفائل تصویر",
uploadPicture: "تصویر اپ لوڈ کریں",
changePicture: "تصویر تبدیل کریں",
profilePictureHelp: "اپنی تصویر اپ لوڈ کریں، ورنہ صنف کے مطابق اوتار خودکار طور پر استعمال ہوگا۔",
  "createAccount": "اکاؤنٹ بنائیں",
  "welcome": "خوش آمدید",
  "roles": {
    "farmer": "کسان",
    "farmerDesc": "اپنی زمین سنبھالیں",
    "studentResearcher": "طالب علم",
    "studentResearcherDesc": "زرعی تحقیق دیکھیں",
    "company": "کمپنی",
    "companyDesc": "زرعی ماہرین ڈھونڈیں",
    "landowner": "زمیندار",
    "landownerDesc": "زمین کا انتظام",
    "transport": "ٹرانسپورٹ",
    "transportDesc": "ترسیل کا انتظام"
  },
  "chooseLanguage": "اپنی زبان منتخب کریں",
  "chooseRole": "اپنا کردار منتخب کریں",
  "getStarted": "شروع کریں",
  "alreadyHaveAccount": "کیا پہلے سے اکاؤنٹ موجود ہے؟",
  "dontHaveAccount": "اکاؤنٹ نہیں ہے؟",
  "fullName": "پورا نام",
  "emailAddress": "ای میل ایڈریس",
  "phoneNumber": "فون نمبر",
  "companyPhoneNumber": "کمپنی کا فون نمبر",
  "cnicNumber": "شناختی کارڈ نمبر",
  "companyEmail": "کمپنی کی ای میل",
  "requiredAccountSafety": "اکاؤنٹ کی حفاظت اور تصدیق کے لیے ضروری ہے۔",
  "requiredIdentitySafety": "شناخت اور حفاظت کی تصدیق کے لیے ضروری ہے۔",
  "optional": "اختیاری",
  "emailOptionalHelp": "ای میل اختیاری ہے۔ آپ یہ خانہ خالی چھوڑ سکتے ہیں۔",
  "errorEnterCompanyName": "براہِ کرم کمپنی کا نام درج کریں۔",
  "errorEnterFullName": "براہِ کرم اپنا پورا نام درج کریں۔",
  "errorEnterCompanyPhone": "براہِ کرم کمپنی کا فون نمبر درج کریں۔",
  "errorEnterPhone": "براہِ کرم اپنا فون نمبر درج کریں۔",
  "errorEnterCompanyEmail": "براہِ کرم کمپنی کی ای میل درج کریں۔",
  "errorEnterEmail": "براہِ کرم اپنا ای میل ایڈریس درج کریں۔",
  "errorValidEmail": "براہِ کرم درست ای میل ایڈریس درج کریں۔",
  "errorEnterCnic": "براہِ کرم اپنا شناختی کارڈ نمبر درج کریں۔",
  "errorCnicFormat": "براہِ کرم شناختی کارڈ نمبر اس انداز میں درج کریں: 35202-1234567-1۔",
  "errorPasswordLength": "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے۔",
  "errorCreateAccount": "اکاؤنٹ بنانے میں مسئلہ پیش آیا۔",
    "errorEnterPassword": "براہِ کرم اپنا پاس ورڈ درج کریں۔",
  "errorInvalidLogin": "لاگ ان کی معلومات درست نہیں ہیں۔",
  "signInSubtitle": "اپنے زرعی ڈیش بورڈ تک رسائی کے لیے لاگ ان کریں",
  "signUpSubtitle": "صرف 30 سیکنڈ میں اپنا تصدیق شدہ اکاؤنٹ بنائیں",
  "useCnicRegistered": "وہی شناختی کارڈ نمبر استعمال کریں جس سے آپ نے رجسٹر کیا تھا۔",
  "useEmailRegistered": "وہی ای میل ایڈریس استعمال کریں جس سے آپ نے رجسٹر کیا تھا۔",
  "password": "پاس ورڈ",
  "confirmPassword": "پاس ورڈ کی تصدیق",
  "passwordMismatch": "پاس ورڈ مماثل نہیں ہیں",
  "creatingAccount": "اکاؤنٹ بنایا جا رہا ہے...",
  "signingIn": "لاگ ان ہو رہا ہے...",
  "save": "محفوظ کریں",
  "cancel": "منسوخ",
  "search": "تلاش کریں",
  "filter": "فلٹر",
  "edit": "ترمیم کریں",
  "delete": "حذف کریں",
  "viewAll": "سب دیکھیں",
  "back": "واپس",
  "submit": "جمع کروائیں",
  "loading": "لوڈ ہو رہا ہے...",
  "success": "کامیاب",
  "error": "خرابی",
  "listen": "سنیں",
  "speak": "بولیں",
  "listening": "سنا جا رہا ہے...",
  "thinking": "سوچ رہا ہے...",
  "farmerDashboard": "کسان ڈیش بورڈ",
  "scanCrop": "فصل اسکین کریں",
  "scanCropDesc": "فصل کی بیماری پہچانیں اور فوری علاج حاصل کریں",
  "marketRates": "منڈی کے ریٹ",
  "marketRatesDesc": "آج کے منڈی ریٹ اور ڈیزل کی قیمتیں دیکھیں",
  "weather": "موسم کا حال",
  "weatherDesc": "لائیو زرعی موسم، بارش اور سپرے کی ہدایات",
  "aiHelp": "اے آئی زرعی مددگار",
  "aiHelpDesc": "آواز کے ذریعے اپنی زبان میں فوری زرعی مشورہ لیں",
  "myFarm": "میری زمین / فارم",
  "myFarmDesc": "اپنے رقبے، فصلوں اور پانی کی معلومات محفوظ کریں",
  "farmerHourlyRate": "کسان کی فی گھنٹہ اجرت: 350 تا 500 روپے",
  "cropScannerTitle": "فصل کی بیماری اور صحت کا اسکینر",
  "uploadImage": "تصویر اپ لوڈ کریں",
  "takePhoto": "کیمرے سے تصویر لیں",
  "analyzeCrop": "فصل کا معائنہ کریں",
  "analyzingImage": "اے آئی کے ذریعے فصل کا معائنہ ہو رہا ہے...",
  "cropProblemIdentified": "تشخیص شدہ بیماری / مسئلہ",
  "confidence": "یقین کی سطح",
  "severity": "نقصان کی شدت",
  "simpleExplanation": "آسان وضاحت",
  "suggestedNextSteps": "فوری ضروری اقدامات",
  "preventiveMeasures": "حفاظتی تدابیر",
  "agriculturalCaution": "زرعی احتیاط: زہریلی دوا کے استعمال سے پہلے قریبی زرعی افسر سے تصدیق ضرور کریں۔",
  "scanAnotherCrop": "دوسری فصل اسکین کریں",
  "marketTitle": "غلہ منڈی کے تازہ ترین ریٹ",
  "todaysMandiPrices": "آج کے غلہ منڈی ریٹ",
  "selectOrSearchCrop": "فصل منتخب یا تلاش کریں",
  "searchCropPlaceholder": "گندم، چاول، کپاس، مکئی تلاش کریں...",
  "allCities": "تمام شہر",
  "fuelRatesTitle": "ٹرانسپورٹ ایندھن (ڈیزل / پٹرول) کے ریٹ",
  "dieselRate": "ڈیزل ریٹ (ٹرانسپورٹ)",
  "petrolRate": "پٹرول",
  "transportAdvice": "بہترین کرایہ طے کرنے کے لیے ڈیزل کی قیمت مدنظر رکھیں۔",
  "historicalTrend": "گزشتہ 7 دن کے ریٹس",
  "per40kg": "فی 40 کلوگرام (من)",
  "weatherTitle": "لائیو زرعی موسم کی صورتحال",
  "feelsLike": "محسوس شدہ درجہ حرارت",
  "humidity": "نمی کا تناسب",
  "windSpeed": "ہوا کی رفتار",
  "rainChance": "بارش کا امکان",
  "liveGpsLocation": "لائیو جی پی ایس لوکیشن",
  "useMyLocation": "میری لوکیشن استعمال کریں",
  "sprayAdvisoryTitle": "سپرے کے لیے موسمی مشورہ",
  "sowingAdvisoryTitle": "آبپاشی اور بجائی کی ہدایات",
  "forecast7Day": "آئندہ 7 دنوں کی پیشگوئی",
  "aiAssistantTitle": "وائس فرسٹ اے آئی زرعی معاون",
  "voiceFirstTitle": "اردو، پنجابی یا انگلش میں بولیں",
  "speakOrTypePrompt": "مائیک دبائیں اور بولیں، یا نیچے سوال لکھیں۔",
  "typeQuestionPlaceholder": "کھاد کا شیڈول، بیماری، بیج یا پانی کے متعلق سوال پوچھیں...",
  "suggestedQuestions": [
    "گندم کو یوریا کھاد ڈالنے کا بہترین وقت کیا ہے؟",
    "کپاس کے مروڑیا وائرس کا فوری علاج کیا ہے؟",
    "کیا آج کے موسم میں سپرے کرنا درست ہے؟",
    "باسمتی چاول کا دانہ لمبا اور پیداوار کیسے بڑھائیں؟"
  ],
  "clearConversation": "چیٹ صاف کریں",
  "voiceInputLimitation": "کروم، ایج یا سفاری براؤزر پر مائیک کی آواز بہترین کام کرتی ہے۔",
  "aiWelcomeMessage": "السلام علیکم! میں ایگرالیٹکس اے آئی زرعی معاون ہوں۔ آپ مائیک دبا کر بول سکتے ہیں یا نیچے سوال لکھ سکتے ہیں۔",
  "micHintIdle": "اپنی زبان میں بولنے کے لیے مائیک دبائیں",
  "micHintListening": "آپ کی آواز سنی جا رہی ہے... واضح انداز میں بولیں",
  "voiceNotAvailable": "اس زبان میں آواز اس ڈیوائس/براؤزر پر دستیاب نہیں۔ آپ نیچے جواب پڑھ سکتے ہیں۔",
  "farmDetailsTitle": "میری زرعی زمین کی تفصیلات",
  "farmLocation": "زمین کا مقام / گاؤں",
  "farmSizeAcres": "کل رقبہ (ایکڑ میں)",
  "mainCrops": "کاشت شدہ اہم فصلیں",
  "soilType": "زمین / مٹی کی قسم",
  "waterSource": "پانی کا ذریعہ (نہر / ٹیوب ویل)",
  "noFarmDataYet": "آپ نے ابھی تک اپنی زمین کی معلومات درج نہیں کیں۔",
  "addFarmInfo": "زمین کی معلومات شامل کریں",
  "editFarmInfo": "معلومات میں ترمیم کریں",
  "farmSavedSuccess": "زمین کی معلومات کامیابی سے محفوظ ہوگئیں!",
  "studentDashboardTitle": "طالب علم اور ریسرچ ڈیش بورڈ",
  "studentRepository": "طلبہ اور تحقیقی ذخیرہ (ریپوزٹری)",
  "researchArea": "تحقیقی شعبہ",
  "university": "یونیورسٹی / ادارہ",
  "projectTitle": "منصوبے کا عنوان",
  "researchInterests": "تحقیقی دلچسپیاں",
  "contactCompany": "کمپنی سے رابطہ کریں",
  "companyDirectory": "کمپنی ڈائریکٹری",
  "opportunitiesAndGrants": "مواقع اور ریسرچ گرانٹس",
  "researchResources": "تحقیقی وسائل",
  "createResearchProfile": "ریسرچ پروفائل بنائیں",
  "editResearchProfile": "پروفائل تبدیل کریں",
  "noResearchProfileYet": "آپ نے ابھی تک ریسرچ پروفائل نہیں بنائی۔",
  "contactStudent": "محقق سے رابطہ کریں",
  "antiSpamNotice": "اسپام روکنے کے لیے صرف 1 میسج جا سکتا ہے۔ کمپنی کے جواب کے بعد مکمل چیٹ کھلے گی۔",
  "companyDashboardTitle": "زرعی کاروباری اور کمپنی پورٹل",
  "companyProfile": "کمپنی پروفائل",
  "agriculturalNeeds": "زرعی ضروریات اور منصوبے",
  "problemsAndChallenges": "موجودہ زرعی مسائل اور چیلنجز",
  "findStudents": "طلبہ اور محققین تلاش کریں",
  "postOpportunity": "نیا موقع شائع کریں",
  "companyName": "کمپنی کا نام",
  "agriculturalSpecialization": "زرعی شعبہ / مہارت",
  "noCompanyProfileYet": "آپ نے کمپنی پروفائل سیٹ نہیں کی۔",
  "createCompanyProfile": "کمپنی پروفائل بنائیں",
  "inbox": "ان باکس اور رابطے",
  "replyToStudent": "محقق کو جواب دیں",
  "blockConversation": "بلاک کریں",
  "landownerTitle": "زمیندار پورٹل",
  "landDetails": "زمین کا ریکارڈ",
  "hireFarmers": "کسان / مزدور ہائر کریں",
  "hireFarmersDesc": "کٹائی، بجائی کے لیے مقامی کسانوں کو فوری نوٹیفکیشن بھیجیں",
  "bookTransport": "فصل کی ٹرانسپورٹ بک کریں",
  "bookTransportDesc": "منڈی تک مال پہنچانے کے لیے شہزور یا ٹرک بک کروائیں",
  "availableLand": "کاشت کے لیے دستیاب زمین",
  "cropSuitability": "مٹی اور فصل کی مناسبت",
  "numberOfFarmersNeeded": "کتنے کسان / مزدور درکار ہیں",
  "jobType": "کام کی قسم (کٹائی / بجائی)",
  "hourlyRateOffered": "فی گھنٹہ معاوضہ (روپے)",
  "workDate": "کام کی تاریخ اور وقت",
  "activeJobsPosted": "شائع شدہ ملازمتیں",
  "acceptJob": "کام قبول کریں",
  "rejectJob": "مسترد کریں",
  "jobNotificationTitle": "کام کی نئی اطلاع",
  "farmersAcceptedCount": "کسانوں نے قبول کیا",
  "transportDashboardTitle": "ٹرانسپورٹ اور ترسیل ڈیش بورڈ",
  "vehicleFleet": "گاڑیوں کی دستیابی",
  "deliveryRequests": "دستیاب ترسیلی درخواستیں",
  "assignedDeliveries": "مقرر شدہ ٹرانسپورٹ آرڈرز",
  "routeMap": "لائیو نقشہ اور جی پی ایس روٹ",
  "transportSiteGuide": "ترسیل کا تصویری گائیڈ",
  "acceptDelivery": "ٹرپ قبول کریں",
  "startTrip": "سفر شروع کریں",
  "completeDelivery": "ترسیل مکمل",
  "cargoType": "فصل / مال کی قسم",
  "quantityInTons": "وزن (ٹن میں)",
  "pickupDropLocation": "روانگی اور منزل کا مقام",
  "estimatedFare": "اندازاً کرایہ",
  "financeTitle": "زرعی مالیاتی اسکیمیں",
    "financeFarmerTool": "کسان مالیاتی ٹول",
  "financeCalculatorTitle": "مالیاتی کیلکولیٹر",
  "financeCalculatorSubtitle": "فصل کے اخراجات، متوقع منافع، بریک ایون قیمت، زرعی قرض، مشینری اور ٹرانسپورٹ کے اخراجات کا حساب کریں۔",
  "financeChooseCalculator": "آپ کیا حساب کرنا چاہتے ہیں؟",
  "financeCalculate": "حساب کریں",
  "financeClear": "صاف کریں",
  "financeResults": "حساب کا نتیجہ",

  "financeCrop": "فصل",
  "financeSelectCrop": "فصل منتخب کریں",
  "financeCustomCropPlaceholder": "اپنی فصل کا نام لکھیں",
  "financeSelectedCrop": "منتخب فصل",

  "financeRequiredFields": "حساب کرنے سے پہلے تمام مطلوبہ اعداد درج کریں۔",
  "financeSelectCropError": "براہ کرم فصل منتخب کریں۔",
  "financeCustomCropError": "براہ کرم فصل کا نام لکھیں۔",
  "financePositiveLandArea": "رقبہ صفر سے زیادہ ہونا چاہیے۔",
  "financePositiveYield": "متوقع پیداوار صفر سے زیادہ ہونی چاہیے۔",
  "financePositiveLoan": "قرض کی رقم اور مدت صفر سے زیادہ ہونی چاہیے۔",
  "financePositiveHours": "مشین کے کام کے گھنٹے صفر سے زیادہ ہونے چاہئیں۔",
  "financePositiveTransport": "فاصلہ اور ٹرپس کی تعداد صفر سے زیادہ ہونی چاہیے۔",

  "financeEmptyNotice": "اپنے اصل اعداد درج کریں۔ تمام عددی خانے خالی ہیں اور کوئی خرچہ پہلے سے فرض نہیں کیا گیا۔",

  "financeCropBudget": "فصل کا بجٹ",
  "financeCropBudgetDesc": "زمین کی تیاری سے کٹائی تک فصل اگانے کی مکمل لاگت کا اندازہ لگائیں۔",

  "financeProfitLoss": "فصل کا منافع / نقصان",
  "financeProfitLossDesc": "متوقع فصل کی آمدنی کا پیداوار کے خرچ سے موازنہ کریں۔",

  "financeBreakEven": "بریک ایون قیمت",
  "financeBreakEvenDesc": "اپنی پیداوار کی لاگت پوری کرنے کے لیے کم از کم فروخت کی قیمت معلوم کریں۔",

  "financeLoanEMI": "زرعی قرض EMI",
  "financeLoanEMIDesc": "قرض کی ماہانہ قسط، کل واپسی اور کل سود کا اندازہ لگائیں۔",

  "financeMachinery": "مشینری اور ایندھن کی لاگت",
  "financeMachineryDesc": "ٹریکٹر، ہارویسٹر، پمپ یا دوسری مشین کے کام کی لاگت معلوم کریں۔",

  "financeTransport": "زرعی ٹرانسپورٹ لاگت",
  "financeTransportDesc": "زرعی سامان یا تیار فصل منتقل کرنے کی لاگت کا اندازہ لگائیں۔",

  "financeLandArea": "رقبہ",
  "financeSeedCost": "بیج کی لاگت",
  "financeFertilizer": "کھاد اور غذائی اجزاء",
  "financePesticide": "کیڑے مار ادویات اور فصل کا تحفظ",
  "financeLabor": "مزدوری کی لاگت",
  "financeIrrigation": "آبپاشی / پانی کی لاگت",
  "financeMachineryField": "مشینری اور کھیت کا کام",
  "financeTransportField": "ٹرانسپورٹ لاگت",
  "financeOtherCosts": "دیگر زرعی اخراجات",

  "financeTotalProductionCost": "کل پیداواری لاگت",
  "financeExpectedYield": "متوقع پیداوار",
  "financeSellingPrice": "متوقع فروخت قیمت",
  "financeSaleableYield": "متوقع قابل فروخت پیداوار",

  "financeLoanAmount": "قرض کی رقم",
  "financeAnnualRate": "سالانہ شرح سود",
  "financeLoanTerm": "قرض کی مدت",

  "financeMachineHours": "مشین کے کام کے گھنٹے",
  "financeFuelPerHour": "ایندھن کا استعمال",
  "financeFuelPrice": "ایندھن کی قیمت",
  "financeOperatorCost": "آپریٹر کی لاگت",
  "financeOtherMachineCosts": "دیگر مشینری اخراجات",

  "financeDistance": "فی ٹرپ فاصلہ",
  "financeTrips": "ٹرپس کی تعداد",
  "financeVehicleCostPerKm": "گاڑی کی لاگت",
  "financeLoadingCost": "لوڈنگ / ان لوڈنگ",
  "financeOtherTransportCosts": "دیگر ٹرانسپورٹ اخراجات",

  "financeEnterAmount": "رقم درج کریں",
  "financeEnterArea": "رقبہ درج کریں",
  "financeEnterTotalCost": "کل لاگت درج کریں",
  "financeEnterYield": "متوقع پیداوار درج کریں",
  "financeEnterPricePerUnit": "فی یونٹ قیمت درج کریں",
  "financeEnterLoanAmount": "قرض کی رقم درج کریں",
  "financeEnterRate": "سالانہ شرح درج کریں",
  "financeEnterMonths": "مہینوں کی تعداد درج کریں",
  "financeEnterHours": "کام کے گھنٹے درج کریں",
  "financeEnterFuelUse": "ایندھن کا استعمال درج کریں",
  "financeEnterFuelPrice": "فی لیٹر قیمت درج کریں",
  "financeEnterHourlyCost": "فی گھنٹہ لاگت درج کریں",
  "financeEnterDistance": "فاصلہ درج کریں",
  "financeEnterTrips": "ٹرپس کی تعداد درج کریں",
  "financeEnterCostPerKm": "فی کلومیٹر لاگت درج کریں",
  "financeEnterLoadingCost": "فی ٹرپ لاگت درج کریں",

  "financeTotalCropBudget": "فصل کا کل بجٹ",
  "financeCostPerAcre": "فی ایکڑ لاگت",
  "financeExpectedRevenue": "متوقع آمدنی",
  "financeExpectedProfit": "متوقع منافع",
  "financeExpectedLoss": "متوقع نقصان",
  "financeProfitMargin": "منافع کا مارجن",
  "financeBreakEvenSellingPrice": "بریک ایون فروخت قیمت",

  "financeMonthlyEMI": "ماہانہ EMI",
  "financeTotalRepayment": "کل واپسی",
  "financeTotalInterest": "کل سود",

  "financeTotalMachineCost": "مشین کا کل خرچ",
  "financeCostPerMachineHour": "فی مشین گھنٹہ لاگت",

  "financeTotalTransportCost": "کل ٹرانسپورٹ لاگت",
  "financeCostPerTrip": "فی ٹرپ لاگت",

  "financeAcres": "ایکڑ",
  "financeUnits": "یونٹ",
  "financeMonths": "ماہ",
  "financeHours": "گھنٹے",
  "financeLitresPerHour": "لیٹر/گھنٹہ",
  "financeKm": "کلومیٹر",

  "financeCropWheat": "گندم",
  "financeCropRice": "چاول",
  "financeCropCotton": "کپاس",
  "financeCropMaize": "مکئی",
  "financeCropSugarcane": "گنا",
  "financeCropPotato": "آلو",
  "financeCropOnion": "پیاز",
  "financeCropTomato": "ٹماٹر",
  "financeCropMustard": "سرسوں",
  "financeCropChickpea": "چنا",
  "financeCropGroundnut": "مونگ پھلی",
  "financeCropCustom": "دیگر / اپنی فصل",
  "openFinanceDesc": "زرعی ترقیاتی بینک، کامیاب کسان اور سولر ٹیوب ویل کی اوپن معلومات۔",
  "ztblLoanSchemes": "زرعی ترقیاتی بینک (ZTBL) قرضہ جات",
  "kamyabKisanScheme": "کامیاب کسان سبسڈی پروگرام",
  "solarTubewellSubsidy": "سولر ٹیوب ویل فنانسنگ",
  "cropInsuranceTakaful": "فصلوں کی تکافل اور انشورنس",
  "noInvestorAccountNeeded": "کھلی عوامی معلومات: کسی خاص لاگ ان کے بغیر تمام کسان دیکھ سکتے ہیں۔",
  "communityTitle": "کمیونٹی چیٹ",
  "communitySubtitle": "اپنے شعبے کے دیگر ممبران کے ساتھ لائیو گفتگو",
  "membersOnline": "کمیونٹی ممبران",
  "typeMessagePlaceholder": "اپنا پیغام یہاں لکھیں...",
  "send": "بھیجیں",
  "voiceMessage": "آواز کے ذریعے پیغام",
  "reportMessage": "رپورٹ",
  "noMessagesYet": "ابھی کوئی پیغام نہیں ہے۔ بات چیت شروع کریں!",
  "strictlyNoPostsNotice": "براہ راست چیٹ روم۔ کوئی غیر ضروری سوشل میڈیا پوسٹس نہیں۔",
  "noSocialFeedNotice": "محفوظ گروپ چیٹ۔ بغیر کسی فالتو پوسٹس یا سوشل میڈیا فیڈ کے۔",
  "findResearchers": "زرعی محققین اور طلبہ تلاش کریں",
  "manageCompanyProfile": "کمپنی پروفائل کا انتظام",
  "agriLoansAndSubsidies": "زرعی قرضہ جات اور سرکاری سبسڈیز",
  "landRecordsTitle": "میرے زرعی رقبے",
  "signOut": "لاگ آؤٹ",
  "unauthorizedAccess": "رسائی ناممکن ہے",
  "unauthorizedRoleMessage": "آپ کو دوسرے کردار کے نجی ڈیش بورڈ دیکھنے کی اجازت نہیں ہے۔",
  "loginRequired": "ڈیش بورڈ کے لیے لاگ ان کرنا ضروری ہے۔",
  "deleteAccountTitle": "اکاؤنٹ ڈیلیٹ کریں",
  "deleteAccountDesc": "اپنا اکاؤنٹ مستقل طور پر ڈیلیٹ کریں اور اپنا پروفائل ڈیٹا ہٹا دیں۔ یہ عمل واپس نہیں کیا جا سکتا۔",
  "enterPasswordToConfirm": "تصدیق کے لیے اپنا پاس ورڈ درج کریں",
  "deleteAccountConfirmPrompt": "کیا آپ واقعی اپنا اکاؤنٹ مستقل طور پر ڈیلیٹ کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔",
  "deleteAccountBtn": "اکاؤنٹ ڈیلیٹ کریں",
  "deletingAccount": "ڈیلیٹ ہو رہا ہے...",
  "incorrectPassword": "غلط پاس ورڈ۔",
  "unableToDeleteAccount": "آپ کا اکاؤنٹ ڈیلیٹ نہیں ہو سکا۔",
  "showPassword": "پاس ورڈ دکھائیں",
  "hidePassword": "پاس ورڈ چھپائیں",
  "ccRoleFarmer": "کسان",
  "ccRoleStudent": "طالب علم / محقق",
  "ccRoleCompany": "کمپنی",
  "ccRoleLandowner": "زمیندار",
  "ccRoleTransport": "ٹرانسپورٹ",
  "ccDescFarmer": "کسانوں سے جڑیں، کھیت کا تجربہ شیئر کریں اور زرعی مسائل پر گفتگو کریں۔",
  "ccDescStudent": "تحقیق، منصوبوں، تجربات اور زرعی جدت پر تعاون کریں۔",
  "ccDescCompany": "زرعی کاروباروں، ٹیموں، شراکت داروں اور صنعتی ماہرین سے جڑیں۔",
  "ccDescLandowner": "زمینداروں سے جڑیں اور زمین، کاشتکاری کے مواقع اور تعاون پر گفتگو کریں۔",
  "ccDescTransport": "زرعی ٹرانسپورٹ فراہم کنندگان سے جڑیں اور لاجسٹکس مربوط کریں۔",
  "ccHome": "کمیونٹی ہوم",
  "ccServersLabel": "سرورز",
  "ccPrivateMessages": "نجی پیغامات",
  "ccBadge": "ایگرالیٹکس کمیونٹی",
  "ccHeroLine1": "جڑیں۔",
  "ccHeroLine2": "تعاون کریں۔",
  "ccHeroLine3": "ترقی کریں۔",
  "ccHeroParagraph": "زرعی کمیونٹیز میں شامل ہوں، علم کا تبادلہ کریں اور زرعی شعبے میں کام کرنے والے لوگوں کے ساتھ بامعنی روابط بنائیں۔",
  "ccExploreServers": "سرورز دیکھیں",
  "ccYourCommunity": "آپ کی کمیونٹی",
  "ccConversations": "گفتگوئیں",
  "ccFindServer": "سرور تلاش کریں",
  "ccFindServerDesc": "اپنے شعبے کے لیے بنائی گئی کمیونٹیز دریافت کریں۔",
  "ccCreateServerCard": "سرور بنائیں",
  "ccCreateServerCardDesc": "اپنی کمیونٹی بنائیں اور لوگوں کو اکٹھا کریں۔",
  "ccPrivateMessagesCardDesc": "کمیونٹی ممبران کے ساتھ نجی گفتگو جاری رکھیں۔",
  "ccNewCommunity": "نئی کمیونٹی",
  "ccCreateYourServer": "اپنا سرور بنائیں",
  "ccCreateServerIntro": "تصدیق شدہ {role} صارفین کے لیے مخصوص جگہ بنائیں۔",
  "ccServerNameLabel": "سرور کا نام",
  "ccServerNamePlaceholder": "مثلاً پنجاب سمارٹ فارمنگ",
  "ccDescriptionLabel": "تفصیل",
  "ccDescriptionPlaceholder": "دوسرے ممبران کو بتائیں کہ یہ کمیونٹی کس بارے میں ہے...",
  "ccWhoCanJoin": "کون شامل ہو سکتا ہے؟",
  "ccWhoCanJoinDesc": "صرف تصدیق شدہ {role} صارفین اس سرور کو دیکھ اور شامل ہو سکتے ہیں۔",
  "ccCreateServerBtn": "سرور بنائیں",
  "ccEnterServer": "سرور میں داخل ہوں",
  "ccCommunitiesAvailable": "{count} {role} کمیونٹیز دستیاب ہیں",
  "ccSearchServersPlaceholder": "{role} سرورز تلاش کریں...",
  "ccLoadingCommunities": "کمیونٹیز لوڈ ہو رہی ہیں...",
  "ccNoServersFound": "کوئی سرور نہیں ملا",
  "ccBeFirstToCreate": "{role} کمیونٹی بنانے والے پہلے شخص بنیں۔",
  "ccPrivateLabel": "نجی",
  "ccPrivateMessagesDesc": "آپ کی نجی گفتگوئیں کمیونٹی سرورز سے آزاد ہیں۔ سرور ڈیلیٹ ہونے پر بھی آپ کی نجی گفتگوئیں یہاں محفوظ رہتی ہیں۔",
  "ccLoadingPrivateMessages": "نجی پیغامات لوڈ ہو رہے ہیں...",
  "ccNoPrivateConversations": "کوئی نجی گفتگو نہیں",
  "ccNoPrivateConversationsDesc": "کسی کمیونٹی ممبر کا پروفائل کھولیں اور نجی گفتگو شروع کریں۔",
  "ccEditServer": "سرور میں ترمیم کریں",
  "ccDeleteMyChatHistory": "میری چیٹ ہسٹری ڈیلیٹ کریں",
  "ccDeleteServer": "سرور ڈیلیٹ کریں",
  "ccServerOwner": "سرور مالک",
  "ccCancel": "منسوخ کریں",
  "ccSaveChanges": "تبدیلیاں محفوظ کریں",
  "ccOneCommunityConversation": "ایک کمیونٹی گفتگو",
  "ccLoadingMessages": "پیغامات لوڈ ہو رہے ہیں...",
  "ccNoMessagesYetTitle": "ابھی تک کوئی پیغام نہیں",
  "ccStartConversation": "اپنی کمیونٹی کے ساتھ گفتگو شروع کریں۔",
  "ccSave": "محفوظ کریں",
  "ccJoinServerToChat": "چیٹ کے لیے سرور جوائن کریں",
  "ccMembers": "ممبران",
  "ccPeopleSuffix": "لوگ",
  "ccCommunityMembers": "کمیونٹی ممبران",
  "ccDeleteConversationForMe": "میرے لیے گفتگو ڈیلیٹ کریں",
  "ccPrivateConversationLabel": "نجی گفتگو",
  "ccOnlyYouAndCanSee": "صرف آپ اور {name} یہ پیغامات دیکھ سکتے ہیں۔",
  "ccGlobalPrivateConversation": "عالمی نجی گفتگو",
  "ccNoPrivateMessagesYet": "ابھی تک کوئی نجی پیغام نہیں",
  "ccSayHello": "گفتگو شروع کرنے کے لیے سلام کہیں۔",
  "ccWelcomeTo": "خوش آمدید"
},
  pa: {
  "appName": "ایگرالیٹکس اے آئی",
  "tagline": "سیانی کھیتی، سوہنا کل",
  "dashboard": "ڈیش بورڈ",
  "community": "ساتھ / کمیونٹی",
  "more": "ہور",
  "language": "بولی",
  "profile": "پروفائل",
  "settings": "سیٹنگز",
  "logout": "باہر نکلو",
  "signIn": "لاگ ان ہوؤ",
  "signUp": "نواں کھاتہ بناؤ",
  gender: "جنس",
genderMale: "مرد",
genderFemale: "عورت",
genderPreferNotToSay: "دسنا نہیں چاہندا/چاہندی",
profilePicture: "پروفائل تصویر",
uploadPicture: "تصویر اپ لوڈ کرو",
changePicture: "تصویر بدلو",
profilePictureHelp: "اپنی تصویر اپ لوڈ کرو، نئیں تے جنس دے مطابق اوتار خودکار طور تے استعمال ہو جائے گا۔",
  "createAccount": "کھاتہ بناؤ",
  "welcome": "جی آیاں نوں",
  "roles": {
    "farmer": "کسان",
    "farmerDesc": "اپنی زمین سنبھالو",
    "studentResearcher": "طالب علم",
    "studentResearcherDesc": "کھیتی باڑی دی ریسرچ",
    "company": "کمپنی",
    "companyDesc": "زرعی ماہرین لبھو",
    "landowner": "جاگیردار",
    "landownerDesc": "رقبے دا بندوبست",
    "transport": "گڈی والا",
    "transportDesc": "گڈی بکنگ کرو"
  },
  "chooseLanguage": "اپنی بولی چنو",
  "chooseRole": "اپنا کردار چنو",
  "getStarted": "شروع کرو",
  "alreadyHaveAccount": "پہلاں توں کھاتہ بنیا اے؟",
  "dontHaveAccount": "کھاتہ نہیں بنیا؟",
  "fullName": "پورا ناں",
  "emailAddress": "ای میل پتہ",
  "phoneNumber": "فون نمبر",
  "companyPhoneNumber": "کمپنی دا فون نمبر",
  "cnicNumber": "شناختی کارڈ نمبر",
  "companyEmail": "کمپنی دی ای میل",
  "requiredAccountSafety": "کھاتے دی حفاظت تے تصدیق لئی ضروری اے۔",
  "requiredIdentitySafety": "شناخت تے حفاظت دی تصدیق لئی ضروری اے۔",
  "optional": "اختیاری",
  "emailOptionalHelp": "ای میل اختیاری اے۔ تسی ایہہ خانہ خالی چھڈ سکدے او۔",
  "errorEnterCompanyName": "مہربانی کرکے کمپنی دا ناں لکھو۔",
  "errorEnterFullName": "مہربانی کرکے اپنا پورا ناں لکھو۔",
  "errorEnterCompanyPhone": "مہربانی کرکے کمپنی دا فون نمبر لکھو۔",
  "errorEnterPhone": "مہربانی کرکے اپنا فون نمبر لکھو۔",
  "errorEnterCompanyEmail": "مہربانی کرکے کمپنی دی ای میل لکھو۔",
  "errorEnterEmail": "مہربانی کرکے اپنی ای میل لکھو۔",
  "errorValidEmail": "مہربانی کرکے درست ای میل لکھو۔",
  "errorEnterCnic": "مہربانی کرکے اپنا شناختی کارڈ نمبر لکھو۔",
  "errorCnicFormat": "مہربانی کرکے شناختی کارڈ نمبر ایس طرح لکھو: 35202-1234567-1۔",
  "errorPasswordLength": "پاس ورڈ گھٹ توں گھٹ 6 حروف دا ہونا چاہیدا اے۔",
  "errorCreateAccount": "کھاتہ بناؤن وچ مسئلہ آ گیا اے۔",
  "errorEnterPassword": "مہربانی کرکے اپنا پاس ورڈ لکھو۔",
  "errorInvalidLogin": "لاگ ان دی معلومات درست نہیں نیں۔",
  "signInSubtitle": "اپنے زرعی ڈیش بورڈ تک پہنچن لئی لاگ ان کرو",
  "signUpSubtitle": "صرف 30 سیکنڈاں وچ اپنا تصدیق شدہ کھاتہ بناؤ",
  "useCnicRegistered": "اوہی شناختی کارڈ نمبر ورتو جس نال تسی رجسٹر کیتا سی۔",
  "useEmailRegistered": "اوہی ای میل ایڈریس ورتو جس نال تسی رجسٹر کیتا سی۔",
  "password": "پاس ورڈ",
  "confirmPassword": "پاس ورڈ دی تصدیق",
  "passwordMismatch": "پاس ورڈ اکو جئے نہیں نیں",
  "creatingAccount": "کھاتہ بندا پیا اے...",
  "signingIn": "لاگ ان ہندا پیا اے...",
  "save": "سانبھو",
  "cancel": "چھڈو",
  "search": "لبھو",
  "filter": "چھانٹی کرو",
  "edit": "تبدیل کرو",
  "delete": "مٹاؤ",
  "viewAll": "سارا کجھ ویکھو",
  "back": "پچھانہہ",
  "submit": "جمع کرو",
  "loading": "کم ہو رہیا اے...",
  "success": "کامیاب",
  "error": "خرابی",
  "listen": "سنو",
  "speak": "بولو",
  "listening": "سن رہیا ہاں...",
  "thinking": "سوچ رہیا اے...",
  "farmerDashboard": "کسان دا ڈیش بورڈ",
  "scanCrop": "فصل دی فوٹو کھچو",
  "scanCropDesc": "فصل دی بیماری پچھانو تے پکا علاج پاؤ",
  "marketRates": "منڈی دے بھاء",
  "marketRatesDesc": "اج دے منڈی بھاء تے ڈیزل دا ریٹ ویکھو",
  "weather": "موسم دا حال",
  "weatherDesc": "لائیو موسم، بارش تے سپرے دی صلاح",
  "aiHelp": "اے آئی کھیتی مددگار",
  "aiHelpDesc": "اپنی بولی چ بول کے فوری زرعی مشورہ لوو",
  "myFarm": "میرا کھیت / رقبہ",
  "myFarmDesc": "اپنے رقبے، کنک، چاول تے نہری پانی دا ریکارڈ رکھو",
  "farmerHourlyRate": "دیہاڑی / فی گھنٹہ ریٹ: 350 توں 500 روپے",
  "cropScannerTitle": "فصل دی بیماری لبھن آلا کیمرہ",
  "uploadImage": "فصل دی فوٹو لاؤ",
  "takePhoto": "کیمرے نال فوٹو لوو",
  "analyzeCrop": "فصل چیک کرو",
  "analyzingImage": "اے آئی فصل نوں چیک کر رہیا اے...",
  "cropProblemIdentified": "فصل دی بیماری / مسئلہ",
  "confidence": "پکی گل",
  "severity": "نقصان دا خطرہ",
  "simpleExplanation": "سوکھا ویروا",
  "suggestedNextSteps": "ہن کیہ کرنا چاہیدا اے",
  "preventiveMeasures": "اگوں لئی بچاء دی تدبیر",
  "agriculturalCaution": "زرعی احتیاط: کوئی وی دوائی سپرے کرن توں پہلاں زرعی ماہر نال وی ضرور پچھو۔",
  "scanAnotherCrop": "ہور فصل دی فوٹو لوو",
  "marketTitle": "غلہ منڈی دے اج دے بھاء",
  "todaysMandiPrices": "اج دے منڈی ریٹ",
  "selectOrSearchCrop": "فصل چنو یا لبھو",
  "searchCropPlaceholder": "کنک، جھونا، کپاہ، مکئی لبھو...",
  "allCities": "سارے شہر",
  "fuelRatesTitle": "ٹرانسپورٹ ایندھن (ڈیزل / پٹرول) دا ریٹ",
  "dieselRate": "ڈیزل بھاء (ٹرانسپورٹ)",
  "petrolRate": "پٹرول",
  "transportAdvice": "منڈی دا کرایہ طے کرن ویلے ڈیزل دا بھاء ضرور ویکھو۔",
  "historicalTrend": "پچھلے 7 دناں دے ریٹ",
  "per40kg": "فی 40 کلو (من)",
  "weatherTitle": "کھیتی باڑی موسم دی صورتحال",
  "feelsLike": "محسوس درجہ حرارت",
  "humidity": "ہوا چ نمی",
  "windSpeed": "ہوا دی رفتار",
  "rainChance": "مینھ دا امکان",
  "liveGpsLocation": "لائیو جی پی ایس لوکیشن",
  "useMyLocation": "میری لوکیشن ورتو",
  "sprayAdvisoryTitle": "سپرے کرن لئی صلاح",
  "sowingAdvisoryTitle": "پانی تے بیجائی دی صلاح",
  "forecast7Day": "آؤندے 7 دناں دا موسم",
  "aiAssistantTitle": "بول کے پچھن آلا زرعی معاون",
  "voiceFirstTitle": "پنجابی، اردو یا انگریزی چ بولو",
  "speakOrTypePrompt": "مائیک دبا کے بولو، یا تھلے سوال لکھو۔",
  "typeQuestionPlaceholder": "کھاد، بیج، پانی یا بیماری بارے سوال پچھو...",
  "suggestedQuestions": [
    "کنک نوں یوریا کھاد کیہڑے ویلے دینی چاہیدی اے؟",
    "کپاہ دے مروڑیا وائرس دا کیہ پکا علاج اے؟",
    "کیہ اج دے موسم چ سپرے کرنا ٹھیک رہے گا؟",
    "باسمتی جھونے دی پیداوار ودھاون دا ول دسو؟"
  ],
  "clearConversation": "چیٹ صاف کرو",
  "voiceInputLimitation": "کروم یا سفاری براؤزر چ آواز ساریاں نالوں ودھیا کام کردی اے۔",
  "aiWelcomeMessage": "جی آیاں نوں! میں تہاڈا کھیتی باڑی اے آئی مددگار ہاں۔ مائیک دبا کے بولو یا سوال لکھو۔",
  "micHintIdle": "آپݨی بولی چ بولن لئی مائیک دباؤ",
  "micHintListening": "تہاڈی آواز سنی جا رہی اے... صاف بولو",
  "voiceNotAvailable": "ایس بولی دی آواز ایس ڈیوائس/براؤزر تے دستیاب کائنی۔ تسی تھلے جواب پڑھ سکدے او۔",
  "farmDetailsTitle": "میرے رقبے دی تفصیل",
  "farmLocation": "رقبے دی تھاں / پنڈ",
  "farmSizeAcres": "کل رقبہ (ایکڑ چ)",
  "mainCrops": "بیجیاں گئیاں فصلاں",
  "soilType": "زمین / مٹی دی قسم",
  "waterSource": "پانی دا وسیلہ (نہر / ٹیوب ویل)",
  "noFarmDataYet": "تسیں اجے تیکر اپنے رقبے دی معلومات نہیں پائی۔",
  "addFarmInfo": "رقبے دی معلومات پاؤ",
  "editFarmInfo": "معلومات بدلو",
  "farmSavedSuccess": "رقبے دی معلومات سانبھ لئی گئی اے!",
  "studentDashboardTitle": "طالب علم تے کھوجی ڈیش بورڈ",
  "studentRepository": "طلبہ ریسرچ ریپوزٹری",
  "researchArea": "تحقیقی شعبہ",
  "university": "یونیورسٹی / ادارہ",
  "projectTitle": "پراجیکٹ دا ناں",
  "researchInterests": "ریسرچ چ دلچسپی",
  "contactCompany": "کمپنی نال رابطہ کرو",
  "companyDirectory": "کمپنی ڈائریکٹری",
  "opportunitiesAndGrants": "موقعے تے ریسرچ گرانٹس",
  "researchResources": "کھوج دے وسیلے",
  "createResearchProfile": "ریسرچ پروفائل بناؤ",
  "editResearchProfile": "پروفائل بدلو",
  "noResearchProfileYet": "تسیں اجے تیکر ریسرچ پروفائل نہیں بنائی۔",
  "contactStudent": "کھوجی نال رابطہ کرو",
  "antiSpamNotice": "فضول میسج روکن لئی صرف 1 میسج جا سکدا اے۔ اوہناں دے جواب توں بعد چیٹ کھل جاوے گی۔",
  "companyDashboardTitle": "زرعی کاروباری کمپنی پورٹل",
  "companyProfile": "کمپنی پروفائل",
  "agriculturalNeeds": "زرعی لوڑاں تے پراجیکٹ",
  "problemsAndChallenges": "موجودہ زرعی مسئلے تے چیلنج",
  "findStudents": "طلبہ تے ریسرچر لبھو",
  "postOpportunity": "نواں موقع پوسٹ کرو",
  "companyName": "کمپنی دا ناں",
  "agriculturalSpecialization": "زرعی مہارت",
  "noCompanyProfileYet": "تسیں کمپنی پروفائل نہیں بنائی۔",
  "createCompanyProfile": "کمپنی پروفائل بناؤ",
  "inbox": "ان باکس تے سنیہے",
  "replyToStudent": "جواب دیو",
  "blockConversation": "بلاک کرو",
  "landownerTitle": "زمیندار پورٹل",
  "landDetails": "رقبے دا ریکارڈ",
  "hireFarmers": "کسان / دیہاڑی دار ہائر کرو",
  "hireFarmersDesc": "وڈھی یا بیجائی لئی نیڑے دے کساناں نوں کم دی اطلاع بھیجو",
  "bookTransport": "فصل چکن لئی گڈی بک کرو",
  "bookTransportDesc": "منڈی مال لیجان لئی شہزور یا ٹرالی بک کرواؤ",
  "availableLand": "کاشت لئی خالی رقبہ",
  "cropSuitability": "مٹی تے فصل دی مناسبت",
  "numberOfFarmersNeeded": "کینے بندے درکار نیں",
  "jobType": "کم دی قسم (وڈھی / بیجائی)",
  "hourlyRateOffered": "فی گھنٹہ دیہاڑی (روپے)",
  "workDate": "کم دی تاریخ تے ویلا",
  "activeJobsPosted": "نویاں نکلیاں نوکریاں",
  "acceptJob": "کم منظور کرو",
  "rejectJob": "رد کرو",
  "jobNotificationTitle": "نویں کم دی اطلاع",
  "farmersAcceptedCount": "کساناں نے منظور کیتا",
  "transportDashboardTitle": "ٹرانسپورٹ تے گڈیاں دا ڈیش بورڈ",
  "vehicleFleet": "گڈیاں دی موجودگی",
  "deliveryRequests": "دستیاب مال چکن دیاں درخاستاں",
  "assignedDeliveries": "ملی ہوئی بکنگ",
  "routeMap": "لائیو نقشہ تے جی پی ایس روٹ",
  "transportSiteGuide": "ترسیل دا نقشہ گائیڈ",
  "acceptDelivery": "چکر منظور کرو",
  "startTrip": "سفر شروع کرو",
  "completeDelivery": "مال پہنچ گیا",
  "cargoType": "فصل / مال دی ونڈ",
  "quantityInTons": "وزن (ٹن چ)",
  "pickupDropLocation": "مال چکن تے لہاݨ دی تھاں",
  "estimatedFare": "اندازاً کرایہ",
  "financeTitle": "زرعی مالیاتی سکیماں",
    "financeFarmerTool": "کسان مالیاتی ٹول",
  "financeCalculatorTitle": "مالیاتی کیلکولیٹر",
  "financeCalculatorSubtitle": "فصل دے خرچے، متوقع منافع، بریک ایون قیمت، زرعی قرض، مشینری تے ٹرانسپورٹ دے خرچ دا حساب کرو۔",
  "financeChooseCalculator": "تسی کی حساب کرنا چاہندے او؟",
  "financeCalculate": "حساب کرو",
  "financeClear": "صاف کرو",
  "financeResults": "حساب دا نتیجہ",

  "financeCrop": "فصل",
  "financeSelectCrop": "فصل چنو",
  "financeCustomCropPlaceholder": "اپنی فصل دا ناں لکھو",
  "financeSelectedCrop": "چنی ہوئی فصل",

  "financeRequiredFields": "حساب کرن توں پہلاں سارے مطلوبہ اعداد درج کرو۔",
  "financeSelectCropError": "مہربانی کرکے فصل چنو۔",
  "financeCustomCropError": "مہربانی کرکے فصل دا ناں لکھو۔",
  "financePositiveLandArea": "رقبہ صفر توں ودھ ہونا چاہیدا اے۔",
  "financePositiveYield": "متوقع پیداوار صفر توں ودھ ہونی چاہیدی اے۔",
  "financePositiveLoan": "قرض دی رقم تے مدت صفر توں ودھ ہونی چاہیدی اے۔",
  "financePositiveHours": "مشین دے کم دے گھنٹے صفر توں ودھ ہونے چاہیدے نیں۔",
  "financePositiveTransport": "فاصلہ تے ٹرپاں دی گنتی صفر توں ودھ ہونی چاہیدی اے۔",

  "financeEmptyNotice": "اپنے اصل اعداد درج کرو۔ سارے عددی خانے خالی نیں تے کوئی خرچہ پہلے توں فرض نہیں کیتا گیا۔",

  "financeCropBudget": "فصل دا بجٹ",
  "financeCropBudgetDesc": "زمین دی تیاری توں کٹائی تک فصل اگاؤن دے پورے خرچے دا اندازہ لاؤ۔",

  "financeProfitLoss": "فصل دا منافع / نقصان",
  "financeProfitLossDesc": "متوقع فصل دی آمدنی دا پیداوار دے خرچے نال موازنہ کرو۔",

  "financeBreakEven": "بریک ایون قیمت",
  "financeBreakEvenDesc": "پیداوار دا خرچہ پورا کرن لئی گھٹ توں گھٹ فروخت قیمت معلوم کرو۔",

  "financeLoanEMI": "زرعی قرض EMI",
  "financeLoanEMIDesc": "قرض دی ماہانہ قسط، کل واپسی تے کل سود دا اندازہ لاؤ۔",

  "financeMachinery": "مشینری تے ایندھن دا خرچہ",
  "financeMachineryDesc": "ٹریکٹر، ہارویسٹر، پمپ یا ہور مشین دے کم دا خرچہ معلوم کرو۔",

  "financeTransport": "زرعی ٹرانسپورٹ دا خرچہ",
  "financeTransportDesc": "زرعی سامان یا تیار فصل منتقل کرن دے خرچے دا اندازہ لاؤ۔",

  "financeLandArea": "رقبہ",
  "financeSeedCost": "بیج دا خرچہ",
  "financeFertilizer": "کھاد تے غذائی اجزاء",
  "financePesticide": "کیڑے مار دوا تے فصل دی حفاظت",
  "financeLabor": "مزدوری دا خرچہ",
  "financeIrrigation": "آبپاشی / پانی دا خرچہ",
  "financeMachineryField": "مشینری تے کھیت دا کم",
  "financeTransportField": "ٹرانسپورٹ دا خرچہ",
  "financeOtherCosts": "ہور زرعی خرچے",

  "financeTotalProductionCost": "کل پیداواری خرچہ",
  "financeExpectedYield": "متوقع پیداوار",
  "financeSellingPrice": "متوقع فروخت قیمت",
  "financeSaleableYield": "متوقع فروخت لائق پیداوار",

  "financeLoanAmount": "قرض دی رقم",
  "financeAnnualRate": "سالانہ شرح سود",
  "financeLoanTerm": "قرض دی مدت",

  "financeMachineHours": "مشین دے کم دے گھنٹے",
  "financeFuelPerHour": "ایندھن دی کھپت",
  "financeFuelPrice": "ایندھن دی قیمت",
  "financeOperatorCost": "آپریٹر دا خرچہ",
  "financeOtherMachineCosts": "ہور مشینری دے خرچے",

  "financeDistance": "فی ٹرپ فاصلہ",
  "financeTrips": "ٹرپاں دی گنتی",
  "financeVehicleCostPerKm": "گاڑی دا خرچہ",
  "financeLoadingCost": "لوڈنگ / ان لوڈنگ",
  "financeOtherTransportCosts": "ہور ٹرانسپورٹ خرچے",

  "financeEnterAmount": "رقم درج کرو",
  "financeEnterArea": "رقبہ درج کرو",
  "financeEnterTotalCost": "کل خرچہ درج کرو",
  "financeEnterYield": "متوقع پیداوار درج کرو",
  "financeEnterPricePerUnit": "فی یونٹ قیمت درج کرو",
  "financeEnterLoanAmount": "قرض دی رقم درج کرو",
  "financeEnterRate": "سالانہ شرح درج کرو",
  "financeEnterMonths": "مہینیاں دی گنتی درج کرو",
  "financeEnterHours": "کم دے گھنٹے درج کرو",
  "financeEnterFuelUse": "ایندھن دی کھپت درج کرو",
  "financeEnterFuelPrice": "فی لیٹر قیمت درج کرو",
  "financeEnterHourlyCost": "فی گھنٹہ خرچہ درج کرو",
  "financeEnterDistance": "فاصلہ درج کرو",
  "financeEnterTrips": "ٹرپاں دی گنتی درج کرو",
  "financeEnterCostPerKm": "فی کلومیٹر خرچہ درج کرو",
  "financeEnterLoadingCost": "فی ٹرپ خرچہ درج کرو",

  "financeTotalCropBudget": "فصل دا کل بجٹ",
  "financeCostPerAcre": "فی ایکڑ خرچہ",
  "financeExpectedRevenue": "متوقع آمدنی",
  "financeExpectedProfit": "متوقع منافع",
  "financeExpectedLoss": "متوقع نقصان",
  "financeProfitMargin": "منافع دا مارجن",
  "financeBreakEvenSellingPrice": "بریک ایون فروخت قیمت",

  "financeMonthlyEMI": "ماہانہ EMI",
  "financeTotalRepayment": "کل واپسی",
  "financeTotalInterest": "کل سود",

  "financeTotalMachineCost": "مشین دا کل خرچہ",
  "financeCostPerMachineHour": "فی مشین گھنٹہ خرچہ",

  "financeTotalTransportCost": "کل ٹرانسپورٹ خرچہ",
  "financeCostPerTrip": "فی ٹرپ خرچہ",

  "financeAcres": "ایکڑ",
  "financeUnits": "یونٹ",
  "financeMonths": "مہینے",
  "financeHours": "گھنٹے",
  "financeLitresPerHour": "لیٹر/گھنٹہ",
  "financeKm": "کلومیٹر",

  "financeCropWheat": "گندم",
  "financeCropRice": "چاول",
  "financeCropCotton": "کپاس",
  "financeCropMaize": "مکئی",
  "financeCropSugarcane": "گنا",
  "financeCropPotato": "آلو",
  "financeCropOnion": "پیاز",
  "financeCropTomato": "ٹماٹر",
  "financeCropMustard": "سرسوں",
  "financeCropChickpea": "چنا",
  "financeCropGroundnut": "مونگ پھلی",
  "financeCropCustom": "ہور / اپنی فصل",
  "openFinanceDesc": "زرعی ترقیاتی بینک، کامیاب کسان تے سولر ٹیوب ویل دی کھلی معلومات۔",
  "ztblLoanSchemes": "زرعی بینک (ZTBL) دے قرضے",
  "kamyabKisanScheme": "کامیاب کسان سبسڈی پروگرام",
  "solarTubewellSubsidy": "سولر ٹیوب ویل سبسڈی",
  "cropInsuranceTakaful": "فصل تکافل تے انشورنس",
  "noInvestorAccountNeeded": "کھلی سرکاری معلومات: سارے کسان بغیر لاگ ان ویکھ سکدے نیں۔",
  "communityTitle": "ساتھ / کمیونٹی چیٹ",
  "communitySubtitle": "اپنے شعبے دے سجناں نال لائیو گپ شپ",
  "membersOnline": "کمیونٹی ممبر",
  "typeMessagePlaceholder": "اپنا سنیہا ایتھے لکھو...",
  "send": "ٹورو",
  "voiceMessage": "آواز نال سنیہا",
  "reportMessage": "رپورٹ",
  "noMessagesYet": "اجے کوئی سنیہا نہیں آیا۔ گپ شپ شروع کرو!",
  "strictlyNoPostsNotice": "سدھی گل بات دا گروپ۔ کوئی فالتو پوسٹاں نہیں۔",
  "noSocialFeedNotice": "محفوظ گروپ چیٹ۔ بغیر کسے فالتو پوسٹس یا سوشل میڈیا فیڈ توں۔",
  "findResearchers": "زرعی کھوجی تے طالب علم لبھو",
  "manageCompanyProfile": "کمپنی پروفائل دا بندوبست",
  "agriLoansAndSubsidies": "زرعی قرضے تے سرکاری امداد",
  "landRecordsTitle": "میرے رقبے",
  "signOut": "باہر نکلو",
  "unauthorizedAccess": "پہنچ بند اے",
  "unauthorizedRoleMessage": "تہاڈے کول ایس ڈیش بورڈ دی اجازت نہیں اے۔",
  "loginRequired": "ڈیش بورڈ ویکھن لئی لاگ ان کرو۔",
  "deleteAccountTitle": "اکاؤنٹ ڈیلیٹ کرو",
  "deleteAccountDesc": "اپنا اکاؤنٹ ہمیشہ لئی ڈیلیٹ کرو تے اپنا پروفائل ڈیٹا ہٹاؤ۔ ایہ کم واپس نہیں ہو سکدا۔",
  "enterPasswordToConfirm": "تصدیق لئی اپنا پاس ورڈ لکھو",
  "deleteAccountConfirmPrompt": "کیا تہانوں یقین اے کہ تسیں اپنا اکاؤنٹ ہمیشہ لئی ڈیلیٹ کرنا چاہندے او؟ ایہ کم واپس نہیں ہو سکدا۔",
  "deleteAccountBtn": "اکاؤنٹ ڈیلیٹ کرو",
  "deletingAccount": "ڈیلیٹ ہو ریا اے...",
  "incorrectPassword": "غلط پاس ورڈ۔",
  "unableToDeleteAccount": "تہاڈا اکاؤنٹ ڈیلیٹ نہیں ہو سکیا۔",
  "showPassword": "پاس ورڈ ویکھاؤ",
  "hidePassword": "پاس ورڈ لکاؤ",
  "ccRoleFarmer": "کسان",
  "ccRoleStudent": "طالب علم / خوجی",
  "ccRoleCompany": "کمپنی",
  "ccRoleLandowner": "زمیندار",
  "ccRoleTransport": "ٹرانسپورٹ",
  "ccDescFarmer": "کساناں نال جڑو، کھیت دا تجربہ شیئر کرو تے زرعی مسئلیاں تے گل بات کرو۔",
  "ccDescStudent": "تحقیق، پراجیکٹاں، تجربیاں تے زرعی جدت تے رل کے کم کرو۔",
  "ccDescCompany": "زرعی کاروباراں، ٹیماں، شراکت داراں تے صنعتی ماہراں نال جڑو۔",
  "ccDescLandowner": "زمینداراں نال جڑو تے زمین، کاشتکاری دے موقعیاں تے تعاون تے گل بات کرو۔",
  "ccDescTransport": "زرعی ٹرانسپورٹ دین والیاں نال جڑو تے لاجسٹکس سنبھالو۔",
  "ccHome": "کمیونٹی ہوم",
  "ccServersLabel": "سرور",
  "ccPrivateMessages": "نجی پیغام",
  "ccBadge": "ایگرالیٹکس کمیونٹی",
  "ccHeroLine1": "جڑو۔",
  "ccHeroLine2": "رل کے کم کرو۔",
  "ccHeroLine3": "اگے ودھو۔",
  "ccHeroParagraph": "زرعی کمیونٹیاں وچ شامل تھیوو، علم ونڈو تے زرعی شعبے وچ کم کرن والے لوکاں نال رشتہ بناؤ۔",
  "ccExploreServers": "سرور ویکھو",
  "ccYourCommunity": "تہاڈی کمیونٹی",
  "ccConversations": "گل بات",
  "ccFindServer": "سرور لبھو",
  "ccFindServerDesc": "تہاڈے شعبے لئی بنائیاں گئیاں کمیونٹیاں لبھو۔",
  "ccCreateServerCard": "سرور بناؤ",
  "ccCreateServerCardDesc": "اپنی کمیونٹی بناؤ تے لوکاں نوں اکٹھا کرو۔",
  "ccPrivateMessagesCardDesc": "کمیونٹی دے سجناں نال نجی گل بات جاری رکھو۔",
  "ccNewCommunity": "نویں کمیونٹی",
  "ccCreateYourServer": "اپنا سرور بناؤ",
  "ccCreateServerIntro": "تصدیق شدہ {role} صارفاں لئی خاص تھاں بناؤ۔",
  "ccServerNameLabel": "سرور دا ناں",
  "ccServerNamePlaceholder": "مثلاً پنجاب سمارٹ فارمنگ",
  "ccDescriptionLabel": "تفصیل",
  "ccDescriptionPlaceholder": "دوجے سجناں نوں دسو جے ایہہ کمیونٹی کیس بارے ہے...",
  "ccWhoCanJoin": "کون شامل تھی سکدا ہے؟",
  "ccWhoCanJoinDesc": "صرف تصدیق شدہ {role} صارف ایہہ سرور ویکھ تے شامل تھی سکدے نیں۔",
  "ccCreateServerBtn": "سرور بناؤ",
  "ccEnterServer": "سرور وچ جاؤ",
  "ccCommunitiesAvailable": "{count} {role} کمیونٹیاں موجود نیں",
  "ccSearchServersPlaceholder": "{role} سرور لبھو...",
  "ccLoadingCommunities": "کمیونٹیاں لوڈ تھی رہیاں نیں...",
  "ccNoServersFound": "کوئی سرور نئیں لبھیا",
  "ccBeFirstToCreate": "{role} کمیونٹی بنان والے پہلے بنو۔",
  "ccPrivateLabel": "نجی",
  "ccPrivateMessagesDesc": "تہاڈیاں نجی گل باتاں کمیونٹی سرور توں الگ نیں۔ سرور مٹن تے وی تہاڈیاں نجی گل باتاں ایتھے محفوظ رہندیاں نیں۔",
  "ccLoadingPrivateMessages": "نجی پیغام لوڈ تھی رہے نیں...",
  "ccNoPrivateConversations": "کوئی نجی گل بات نئیں",
  "ccNoPrivateConversationsDesc": "کسے کمیونٹی سجن دا پروفائل کھولو تے نجی گل بات شروع کرو۔",
  "ccEditServer": "سرور وچ تبدیلی کرو",
  "ccDeleteMyChatHistory": "میری چیٹ ہسٹری مٹاؤ",
  "ccDeleteServer": "سرور مٹاؤ",
  "ccServerOwner": "سرور دا مالک",
  "ccCancel": "منسوخ کرو",
  "ccSaveChanges": "تبدیلیاں محفوظ کرو",
  "ccOneCommunityConversation": "اک کمیونٹی گل بات",
  "ccLoadingMessages": "پیغام لوڈ تھی رہے نیں...",
  "ccNoMessagesYetTitle": "ہالے کوئی پیغام نئیں",
  "ccStartConversation": "اپنی کمیونٹی نال گل بات شروع کرو۔",
  "ccSave": "محفوظ کرو",
  "ccJoinServerToChat": "چیٹ لئی سرور جوائن کرو",
  "ccMembers": "سجن",
  "ccPeopleSuffix": "لوک",
  "ccCommunityMembers": "کمیونٹی سجن",
  "ccDeleteConversationForMe": "میرے لئی گل بات مٹاؤ",
  "ccPrivateConversationLabel": "نجی گل بات",
  "ccOnlyYouAndCanSee": "صرف توں تے {name} ایہہ پیغام ویکھ سکدے او۔",
  "ccGlobalPrivateConversation": "عالمی نجی گل بات",
  "ccNoPrivateMessagesYet": "ہالے کوئی نجی پیغام نئیں",
  "ccSayHello": "گل بات شروع کرن لئی سلام کہو۔",
  "ccWelcomeTo": "خوش آمدید"
}
};