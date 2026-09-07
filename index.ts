export type UserRole =
  | 'farmer'
  | 'student_researcher'
  | 'company'
  | 'landowner'
  | 'transport';

export type LanguageCode = 'en' | 'ur' | 'pa';

export type Gender =
  | 'male'
  | 'female'
  | 'prefer_not_to_say';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  language: LanguageCode;
  gender?: Gender;
  createdAt: string;
  phone?: string;
  cnic?: string;
  location?: string;
  avatar?: string;
}

/* ============================================================
   FARMER
   ============================================================ */

export interface FarmData {
  userId: string;
  farmName?: string;
  farmSize?: number;
  farmSizeUnit?: string;
  location?: string;
  soilType?: string;
  irrigationType?: string;
  crops?: string[];
  livestock?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CropDiagnosisResult {
  id: string;
  userId: string;
  imageUrl?: string;
  crop?: string;
  disease?: string;
  confidence?: number;
  treatment?: string;
  prevention?: string;
  createdAt: string;
}

/* ============================================================
   MARKET / FUEL / WEATHER
   ============================================================ */

export interface MarketRateItem {
  crop: string;
  market: string;
  unit: string;
  price: number;
  change?: number;
  changePercent?: number;
  date?: string;
}

export interface FuelRateData {
  petrol?: number;
  diesel?: number;
  highSpeedDiesel?: number;
  kerosene?: number;
  date?: string;
  updatedAt?: string;
}

export interface WeatherData {
  location?: string;
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  condition?: string;
  description?: string;
  icon?: string;
  date?: string;
  forecast?: Array<{
    date: string;
    temperature?: number;
    minTemperature?: number;
    maxTemperature?: number;
    condition?: string;
    description?: string;
    icon?: string;
  }>;
}

/* ============================================================
   STUDENT / RESEARCHER
   ============================================================ */

export interface StudentProfile {
  userId: string;
  university?: string;
  degree?: string;
  fieldOfStudy?: string;
  semester?: string;
  skills?: string[];
  interests?: string[];
  researchInterests?: string[];
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   COMPANY
   ============================================================ */

export interface CompanyProfile {
  profileId: string;
  userId: string;

  companyName: string;
  location: string;
  industry: string;

  researchTopic: string;
  researchDescription: string;
  companyDescription: string;

  researchOffer: 'free' | 'stipend' | 'both';

  workEmail: string;

  createdAt: string;
  updatedAt: string;

  // Legacy fields kept for existing matching compatibility
  email?: string;
  phone?: string;
  specialization?: string;
  city?: string;
  description?: string;
  currentNeeds?: string[];
  problemsChallenges?: string[];
  opportunities?: string[];
  researchKeywords?: string[];
  collaborationPreference?: 'free' | 'stipend' | 'either';
}

/* ============================================================
   CONVERSATIONS
   ============================================================ */

export interface ConversationMessage {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  createdAt: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames?: Record<string, string>;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt?: string;
}

/* ============================================================
   LAND RECORDS
   ============================================================ */

export interface LandRecord {
  id: string;
  userId: string;
  ownerName?: string;
  landLocation?: string;
  area?: number;
  areaUnit?: string;
  landType?: string;
  soilType?: string;
  irrigationType?: string;
  documents?: string[];
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

/* ============================================================
   FARMER JOBS
   ============================================================ */

export interface FarmerJobTranslatedContent {
  title?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  location?: string;
  [key: string]: unknown;
}

export interface FarmerJob {
  id: string;
  companyId?: string;
  companyName?: string;
  title: string;
  description: string;
  location?: string;
  jobType?: string;
  salary?: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  status?: string;
  createdAt: string;
  updatedAt?: string;
  translatedContent?: Record<
    LanguageCode,
    FarmerJobTranslatedContent
  >;
}

/* ============================================================
   TRANSPORT
   ============================================================ */

export interface TransportBooking {
  id: string;
  farmerId?: string;
  farmerName?: string;
  transporterId?: string;
  transporterName?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  vehicleType?: string;
  loadType?: string;
  loadWeight?: number;
  status?: string;
  price?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

/* ============================================================
   COMMUNITY
   ============================================================
   
   New Community architecture:
   
   Community
      ↓
   Create Server / Enter Server
      ↓
   Role-specific Server List
      ↓
   Server Details
      ↓
   Join Server
      ↓
   Server Chat
   
   Private DM:
   
   Server Member
      ↓
   Click Member
      ↓
   Private DM
      ↓
   Only sender + receiver can see messages
   ============================================================ */

/**
 * A member inside a specific Community Server.
 */
export interface CommunityMember {
  userId: string;
  name: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
  status: 'online' | 'offline';
}

/**
 * Persistent Community Server.
 *
 * Every server belongs to exactly one role.
 * Example:
 * - Farmer server → only farmers can join
 * - Company server → only companies can join
 * - Student/Researcher server → only student_researcher users can join
 */
export interface CommunityServer {
  serverId: string;
  name: string;
  description: string;
  role: UserRole;

  ownerId: string;
  ownerName: string;

  createdAt: string;

  members: CommunityMember[];

  /**
   * Optional count so UI does not always have to calculate
   * members.length.
   */
  memberCount?: number;
}

/**
 * Message posted inside a Community Server.
 *
 * serverId is the important new field.
 */
export interface CommunityMessage {
  id: string;

  /**
   * New server-based community architecture.
   */
  serverId?: string;

  /**
   * Kept optional for compatibility with the old
   * community-based implementation/data.
   */
  communityId?: UserRole;

  senderId: string;
  senderName: string;
  senderRole: UserRole;

  text: string;
  createdAt: string;

  avatar?: string;

  reported?: boolean;
}

/**
 * Private direct message between two members of
 * the SAME Community Server.
 *
 * serverId ensures the DM belongs to that server.
 * senderId + receiverId ensure that only those two
 * participants are involved in the conversation.
 */
export interface CommunityDM {
  id: string;

  serverId: string;

  senderId: string;
  senderName: string;
  senderRole: UserRole;

  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;

  text: string;
  createdAt: string;
}

/**
 * Optional helper type for the currently selected
 * private conversation in the Community UI.
 */
export interface CommunityDMParticipant {
  userId: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

/**
 * Server details returned by the backend.
 */
export interface CommunityServerDetails {
  server: CommunityServer;
  isMember: boolean;
  isOwner: boolean;
}

/* ============================================================
   COMMON API RESPONSE TYPES
   ============================================================ */

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}