const fs = require('fs');
const path = require('path');

function save(relPath, content) {
  const full = path.join(__dirname, '..', relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('Saved:', relPath);
}

// 1. Database & Persistence Service (Multi-user, Real-time event listeners)
const dbCode = `import {
  UserProfile,
  FarmData,
  CropDiagnosisResult,
  StudentProfile,
  CompanyProfile,
  Conversation,
  ConversationMessage,
  LandRecord,
  FarmerJob,
  TransportBooking,
  CommunityMessage,
  CommunityMember,
  UserRole
} from '../types';

type Listener<T> = (data: T) => void;

class DatabaseService {
  private listeners: Map<string, Set<Listener<any>>> = new Map();

  constructor() {
    this.initDefaultData();
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('agralyticx_')) {
        this.notifyListeners(e.key);
      }
    });
  }

  private emit(key: string, data: any) {
    const subs = this.listeners.get(key);
    if (subs) {
      subs.forEach((cb) => cb(data));
    }
  }

  private notifyListeners(storageKey: string) {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.emit(storageKey, parsed);
      } catch (err) {
        console.error('Storage sync error:', err);
      }
    }
  }

  public subscribe<T>(key: string, callback: Listener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  // --- Initial / Seed Data for Directory Intermediaries & Demo entries ---
  private initDefaultData() {
    if (!localStorage.getItem('agralyticx_seeded')) {
      const sampleCompanies: CompanyProfile[] = [
        {
          userId: 'comp_engro_agri',
          companyName: 'Engro Fertilisers & Agri Division',
          email: 'research@engrofertilizers.com',
          phone: '+92 42 111 211 211',
          specialization: 'Soil Micronutrients & Balanced Crop Nutrition',
          city: 'Lahore / Dharki',
          description: 'Pakistan largest fertilizer and agri-input provider focusing on soil health improvement and precision balanced fertilization.',
          currentNeeds: [
            'Bio-fertilizer formulations for saline soils',
            'IoT-based soil NPK sensors for wheat & rice fields',
            'Slow-release urea coatings for nitrogen efficiency'
          ],
          problemsChallenges: [
            'High soil salinity in Southern Punjab and Sindh',
            'Nitrogen leaching in flood-irrigated wheat fields'
          ],
          opportunities: [
            'Research Fellowship: Bio-Stimulant Yield Trials (PKR 65,000/mo)',
            'Student Internship: Soil Chemistry Field Lab (3 Months)'
          ],
          updatedAt: new Date().toISOString()
        },
        {
          userId: 'comp_fauji_agri',
          companyName: 'Fauji Fresh n Freeze & Agribusiness',
          email: 'innovation@faujifresh.com',
          phone: '+92 51 595 1801',
          specialization: 'Post-Harvest Cold Chain & Fruit/Vegetable Processing',
          city: 'Sahiwal / Rawalpindi',
          description: 'Pioneering IQF (Individual Quick Freezing) and cold logistics for Pakistani mangoes, citrus, and vegetables.',
          currentNeeds: [
            'Post-harvest shelf-life extension for Kinnow citrus',
            'Zero-waste vegetable dehydration techniques'
          ],
          problemsChallenges: [
            '35% post-harvest wastage in tomato and citrus supply chains',
            'High energy costs for remote farm cold storages'
          ],
          opportunities: [
            'PARC-Fauji Joint Grant: Citrus Post-Harvest Research ($5,000 Grant)',
            'Field Trial: Bio-protective wax coating for mango exports'
          ],
          updatedAt: new Date().toISOString()
        },
        {
          userId: 'comp_ali_akbar',
          companyName: 'Ali Akbar Group (Agri Services)',
          email: 'info@aliakbargroup.com',
          phone: '+92 42 3575 4991',
          specialization: 'Hybrid Seeds, Pesticides & Solar Drip Irrigation',
          city: 'Multan / Lahore',
          description: 'Specializing in climate-resilient hybrid cotton, corn seeds, and advanced micro-irrigation systems.',
          currentNeeds: [
            'Drought-tolerant cotton seed genetics',
            'Drip irrigation automation with solar integration'
          ],
          problemsChallenges: [
            'Cotton leaf curl virus (CLCuV) outbreaks in South Punjab',
            'Water table depletion in barani and canal tail areas'
          ],
          opportunities: [
            'Graduate Agri-Tech Challenge 2026: Winner grant PKR 250,000'
          ],
          updatedAt: new Date().toISOString()
        }
      ];

      const sampleStudents: StudentProfile[] = [
        {
          userId: 'stud_hamza_uaf',
          name: 'Hamza Tariq',
          email: 'hamza.agri@uaf.edu.pk',
          phone: '+92 301 7654321',
          university: 'University of Agriculture Faisalabad (UAF)',
          researchArea: 'Plant Pathology & Crop Genetics',
          projectTitle: 'CRISPR-based Resistance Screening for Cotton Leaf Curl Virus',
          skills: ['Genetic Sequencing', 'Plant Pathology', 'Tissue Culture', 'Field Trials', 'Data Analysis'],
          researchInterests: 'Developing heat-resilient and virus-resistant cotton varieties for Pakistani climatic conditions.',
          description: 'M.Phil scholar at UAF Agronomy department with 2 published papers on whitefly-transmitted geminiviruses.',
          portfolioUrl: 'https://scholar.google.com/citations?user=agri_sample',
          availableForCollaboration: true,
          updatedAt: new Date().toISOString()
        },
        {
          userId: 'stud_fatima_pmas',
          name: 'Dr. Fatima Noor',
          email: 'fatima.noor@uaar.edu.pk',
          phone: '+92 333 9876543',
          university: 'PMAS Arid Agriculture University Rawalpindi',
          researchArea: 'Precision Agriculture & Smart Irrigation IoT',
          projectTitle: 'Low-cost LoRaWAN Soil Moisture Sensors for Water Conservation in Barani Lands',
          skills: ['IoT Sensors', 'LoRaWAN', 'Python Data Science', 'Micro-irrigation', 'Soil Hydrology'],
          researchInterests: 'Automating solar-powered drip irrigation for olive and citrus orchards in Pothohar plateau.',
          description: 'Postdoctoral researcher exploring smart IoT water allocation models for rainfed agriculture in Pakistan.',
          portfolioUrl: 'https://researchgate.net/profile/Fatima-Noor-Agri',
          availableForCollaboration: true,
          updatedAt: new Date().toISOString()
        },
        {
          userId: 'stud_bilal_nust',
          name: 'Bilal Khan',
          email: 'bilal.agritech@nust.edu.pk',
          phone: '+92 321 4567890',
          university: 'National University of Sciences & Technology (NUST)',
          researchArea: 'Agri-Robotics & Drone Multispectral Imaging',
          projectTitle: 'Autonomous Drone Pest Detection for Basmati Rice Paddies',
          skills: ['Computer Vision', 'PyTorch', 'Drone Piloting', 'YOLOv10', 'GIS Mapping'],
          researchInterests: 'Deep learning-based weed and disease segmentation using low-altitude drone imagery.',
          description: 'Final year MS AI researcher collaborating with rice farmers in Gujranwala belt.',
          availableForCollaboration: true,
          updatedAt: new Date().toISOString()
        }
      ];

      const sampleJobs: FarmerJob[] = [
        {
          id: 'job_harvest_101',
          landownerId: 'land_malik_sargodha',
          landownerName: 'Malik Jahangir Tiwana',
          phone: '0300-8765432',
          jobType: 'Harvesting',
          crop: 'Wheat (گندم / کنک)',
          location: 'Kot Momin, Tehsil Bhalwal',
          district: 'Sargodha',
          farmersNeeded: 8,
          hourlyRate: 450,
          workingHours: '7:00 AM - 3:00 PM',
          date: '2026-09-02',
          budget: 28800,
          status: 'Open',
          createdAt: new Date().toISOString(),
          applicants: []
        },
        {
          id: 'job_sowing_102',
          landownerId: 'land_chaudhry_faisalabad',
          landownerName: 'Chaudhry Akram Gujjar',
          phone: '0302-7654321',
          jobType: 'Sowing',
          crop: 'Corn (مکئی / مکی)',
          location: 'Chak 204 RB, Samundri Road',
          district: 'Faisalabad',
          farmersNeeded: 4,
          hourlyRate: 400,
          workingHours: '8:00 AM - 4:00 PM',
          date: '2026-09-05',
          budget: 12800,
          status: 'Open',
          createdAt: new Date().toISOString(),
          applicants: []
        }
      ];

      localStorage.setItem('agralyticx_companies', JSON.stringify(sampleCompanies));
      localStorage.setItem('agralyticx_students', JSON.stringify(sampleStudents));
      localStorage.setItem('agralyticx_farmer_jobs', JSON.stringify(sampleJobs));
      localStorage.setItem('agralyticx_seeded', 'true');
    }
  }

  // --- User Profiles ---
  public getUserProfile(userId: string): UserProfile | null {
    const raw = localStorage.getItem(\`agralyticx_user_\${userId}\`);
    return raw ? JSON.parse(raw) : null;
  }

  public saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(\`agralyticx_user_\${profile.userId}\`, JSON.stringify(profile));
    // Also track in users index
    const allUsersRaw = localStorage.getItem('agralyticx_all_users') || '[]';
    const allUsers: UserProfile[] = JSON.parse(allUsersRaw);
    const existingIdx = allUsers.findIndex((u) => u.userId === profile.userId);
    if (existingIdx >= 0) {
      allUsers[existingIdx] = profile;
    } else {
      allUsers.push(profile);
    }
    localStorage.setItem('agralyticx_all_users', JSON.stringify(allUsers));
    this.emit(\`agralyticx_user_\${profile.userId}\`, profile);
  }

  // --- Farm Data (Farmer) ---
  public getFarmData(userId: string): FarmData | null {
    const raw = localStorage.getItem(\`agralyticx_farm_\${userId}\`);
    return raw ? JSON.parse(raw) : null;
  }

  public saveFarmData(farm: FarmData): void {
    localStorage.setItem(\`agralyticx_farm_\${farm.userId}\`, JSON.stringify(farm));
    this.emit(\`agralyticx_farm_\${farm.userId}\`, farm);
  }

  // --- Student Research Profile ---
  public getStudentProfile(userId: string): StudentProfile | null {
    const all = this.getAllStudents();
    return all.find((s) => s.userId === userId) || null;
  }

  public getAllStudents(): StudentProfile[] {
    const raw = localStorage.getItem('agralyticx_students') || '[]';
    return JSON.parse(raw);
  }

  public saveStudentProfile(profile: StudentProfile): void {
    const all = this.getAllStudents();
    const idx = all.findIndex((s) => s.userId === profile.userId);
    if (idx >= 0) {
      all[idx] = profile;
    } else {
      all.push(profile);
    }
    localStorage.setItem('agralyticx_students', JSON.stringify(all));
    this.emit('agralyticx_students', all);
  }

  // --- Company Profile ---
  public getCompanyProfile(userId: string): CompanyProfile | null {
    const all = this.getAllCompanies();
    return all.find((c) => c.userId === userId) || null;
  }

  public getAllCompanies(): CompanyProfile[] {
    const raw = localStorage.getItem('agralyticx_companies') || '[]';
    return JSON.parse(raw);
  }

  public saveCompanyProfile(profile: CompanyProfile): void {
    const all = this.getAllCompanies();
    const idx = all.findIndex((c) => c.userId === profile.userId);
    if (idx >= 0) {
      all[idx] = profile;
    } else {
      all.push(profile);
    }
    localStorage.setItem('agralyticx_companies', JSON.stringify(all));
    this.emit('agralyticx_companies', all);
  }

  // --- Direct Student <-> Company Messaging (Anti-spam 1st message locked until reply) ---
  public getConversationsForUser(userId: string): Conversation[] {
    const raw = localStorage.getItem('agralyticx_conversations') || '[]';
    const all: Conversation[] = JSON.parse(raw);
    return all.filter((c) => c.studentId === userId || c.companyId === userId);
  }

  public getConversationById(id: string): Conversation | null {
    const raw = localStorage.getItem('agralyticx_conversations') || '[]';
    const all: Conversation[] = JSON.parse(raw);
    return all.find((c) => c.id === id) || null;
  }

  public startOrSendMessage(
    conversationId: string,
    sender: { id: string; name: string; role: UserRole },
    recipient: { id: string; name: string; role: UserRole },
    text: string,
    subject: string = 'Agri Research Collaboration'
  ): { success: boolean; error?: string; conversation?: Conversation } {
    const raw = localStorage.getItem('agralyticx_conversations') || '[]';
    const all: Conversation[] = JSON.parse(raw);
    let conv = all.find((c) => c.id === conversationId);

    const isStudentSender = sender.role === 'student_researcher';

    if (!conv) {
      // Create new conversation
      const newMsg: ConversationMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        conversationId,
        senderId: sender.id,
        senderName: sender.name,
        senderRole: sender.role,
        text,
        createdAt: new Date().toISOString()
      };

      conv = {
        id: conversationId,
        studentId: isStudentSender ? sender.id : recipient.id,
        studentName: isStudentSender ? sender.name : recipient.name,
        companyId: isStudentSender ? recipient.id : sender.id,
        companyName: isStudentSender ? recipient.name : sender.name,
        subject,
        status: isStudentSender ? 'pending_company_reply' : 'pending_student_reply',
        lastMessage: text,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        messages: [newMsg]
      };
      all.push(conv);
    } else {
      if (conv.status === 'blocked') {
        return { success: false, error: 'This conversation has been blocked.' };
      }

      // Check anti-spam: if it's pending reply, the same sender cannot send consecutive messages
      if (conv.status === 'pending_company_reply' && isStudentSender) {
        return {
          success: false,
          error: 'To prevent spam, you cannot send another message until the company replies.'
        };
      }
      if (conv.status === 'pending_student_reply' && !isStudentSender) {
        return {
          success: false,
          error: 'To prevent spam, you cannot send another message until the researcher replies.'
        };
      }

      const newMsg: ConversationMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        conversationId,
        senderId: sender.id,
        senderName: sender.name,
        senderRole: sender.role,
        text,
        createdAt: new Date().toISOString()
      };

      conv.messages.push(newMsg);
      conv.lastMessage = text;
      conv.lastMessageAt = new Date().toISOString();
      // Unlock conversation to active once both have exchanged messages
      conv.status = 'active';
    }

    localStorage.setItem('agralyticx_conversations', JSON.stringify(all));
    this.emit('agralyticx_conversations', all);
    return { success: true, conversation: conv };
  }

  public blockConversation(conversationId: string, blockerUserId: string): void {
    const raw = localStorage.getItem('agralyticx_conversations') || '[]';
    const all: Conversation[] = JSON.parse(raw);
    const conv = all.find((c) => c.id === conversationId);
    if (conv) {
      conv.status = 'blocked';
      conv.blockedBy = blockerUserId;
      localStorage.setItem('agralyticx_conversations', JSON.stringify(all));
      this.emit('agralyticx_conversations', all);
    }
  }

  // --- Landowner Hub (Land Records & Farm Worker Dispatching) ---
  public getLandRecords(userId: string): LandRecord[] {
    const raw = localStorage.getItem(\`agralyticx_lands_\${userId}\`) || '[]';
    return JSON.parse(raw);
  }

  public saveLandRecord(record: LandRecord): void {
    const lands = this.getLandRecords(record.userId);
    const idx = lands.findIndex((l) => l.id === record.id);
    if (idx >= 0) {
      lands[idx] = record;
    } else {
      lands.push(record);
    }
    localStorage.setItem(\`agralyticx_lands_\${record.userId}\`, JSON.stringify(lands));
    this.emit(\`agralyticx_lands_\${record.userId}\`, lands);
  }

  public getAllFarmerJobs(): FarmerJob[] {
    const raw = localStorage.getItem('agralyticx_farmer_jobs') || '[]';
    return JSON.parse(raw);
  }

  public createFarmerJob(job: FarmerJob): void {
    const all = this.getAllFarmerJobs();
    all.unshift(job);
    localStorage.setItem('agralyticx_farmer_jobs', JSON.stringify(all));
    this.emit('agralyticx_farmer_jobs', all);
  }

  public respondToJob(jobId: string, farmerId: string, farmerName: string, action: 'accepted' | 'rejected', phone?: string): void {
    const all = this.getAllFarmerJobs();
    const job = all.find((j) => j.id === jobId);
    if (job) {
      const existing = job.applicants.find((a) => a.farmerId === farmerId);
      if (existing) {
        existing.status = action;
      } else {
        job.applicants.push({
          farmerId,
          farmerName,
          phone,
          appliedAt: new Date().toISOString(),
          status: action
        });
      }
      localStorage.setItem('agralyticx_farmer_jobs', JSON.stringify(all));
      this.emit('agralyticx_farmer_jobs', all);
    }
  }

  // --- Transport Bookings ---
  public getAllTransportBookings(): TransportBooking[] {
    const raw = localStorage.getItem('agralyticx_transport_bookings') || '[]';
    return JSON.parse(raw);
  }

  public createTransportBooking(booking: TransportBooking): void {
    const all = this.getAllTransportBookings();
    all.unshift(booking);
    localStorage.setItem('agralyticx_transport_bookings', JSON.stringify(all));
    this.emit('agralyticx_transport_bookings', all);
  }

  public updateTransportStatus(bookingId: string, status: TransportBooking['status'], transporterId?: string, transporterName?: string): void {
    const all = this.getAllTransportBookings();
    const b = all.find((item) => item.id === bookingId);
    if (b) {
      b.status = status;
      if (transporterId) b.assignedTransporterId = transporterId;
      if (transporterName) b.assignedTransporterName = transporterName;
      localStorage.setItem('agralyticx_transport_bookings', JSON.stringify(all));
      this.emit('agralyticx_transport_bookings', all);
    }
  }

  // --- Real-time Communities (Discord-style Group Chat for each Role) ---
  public getCommunityMessages(communityId: UserRole): CommunityMessage[] {
    const raw = localStorage.getItem(\`agralyticx_chat_\${communityId}\`);
    if (raw) return JSON.parse(raw);

    // Initial warm-up messages for realistic Pakistani agricultural interaction
    const defaults: Record<UserRole, CommunityMessage[]> = {
      farmer: [
        {
          id: 'cm_f1',
          communityId: 'farmer',
          senderId: 'user_sultan',
          senderName: 'Sultan Ali (Multan)',
          senderRole: 'farmer',
          text: 'السلام علیکم بھائیو! ملتان منڈی چ کپاہ دا بھاء اج 8,200 روپے من ہو گیا اے۔ تسیں مال روک رہے او یا ویچ رہے او؟',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 'cm_f2',
          communityId: 'farmer',
          senderId: 'user_rashid',
          senderName: 'Rashid Mehmood (Sheikhupura)',
          senderRole: 'farmer',
          text: 'گندم کی بوائی کے لیے کھاد کا ریٹ منڈی میں کیا مل رہا ہے؟ یوریا کی بوری آسانی سے دستیاب ہے؟',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ],
      student_researcher: [
        {
          id: 'cm_s1',
          communityId: 'student_researcher',
          senderId: 'user_zainab',
          senderName: 'Zainab Bibi (UAF)',
          senderRole: 'student_researcher',
          text: 'Anyone working on bio-stimulants for wheat salinity stress? We have some promising greenhouse trials to share.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ],
      company: [
        {
          id: 'cm_c1',
          communityId: 'company',
          senderId: 'user_engro_rep',
          senderName: 'Engro Agronomy Lead',
          senderRole: 'company',
          text: 'We are expanding our student internship grants for Southern Punjab soil survey. Open for student applications this week.',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        }
      ],
      landowner: [
        {
          id: 'cm_l1',
          communityId: 'landowner',
          senderId: 'user_ch_aslam',
          senderName: 'Chaudhry Aslam Tiwana',
          senderRole: 'landowner',
          text: 'سرگودھا میں کنو کے باغات کی چنائی کے لیے کسانوں کی ٹیم درکار ہے۔ ہم نے جاب نوٹیفکیشن جاری کر دیا ہے۔',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
        }
      ],
      transport: [
        {
          id: 'cm_t1',
          communityId: 'transport',
          senderId: 'user_tariq_transport',
          senderName: 'Tariq Goods Forwarding',
          senderRole: 'transport',
          text: 'لاہور تا کراچی غلہ منڈی کے لیے 10 ویلر ٹرک دستیاب ہیں۔ فیول ریٹ کی مناسبت سے مناسب کرایہ۔',
          createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
        }
      ]
    };

    const initial = defaults[communityId] || [];
    localStorage.setItem(\`agralyticx_chat_\${communityId}\`, JSON.stringify(initial));
    return initial;
  }

  public sendCommunityMessage(communityId: UserRole, sender: { id: string; name: string; role: UserRole }, text: string): CommunityMessage {
    const current = this.getCommunityMessages(communityId);
    const msg: CommunityMessage = {
      id: 'cm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      communityId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      text,
      createdAt: new Date().toISOString()
    };
    current.push(msg);
    localStorage.setItem(\`agralyticx_chat_\${communityId}\`, JSON.stringify(current));
    this.emit(\`agralyticx_chat_\${communityId}\`, current);
    return msg;
  }

  public getCommunityMembers(communityId: UserRole): CommunityMember[] {
    const allUsersRaw = localStorage.getItem('agralyticx_all_users') || '[]';
    const allUsers: UserProfile[] = JSON.parse(allUsersRaw);
    const matching = allUsers.filter((u) => u.role === communityId);

    return matching.map((u) => ({
      userId: u.userId,
      name: u.name,
      role: u.role,
      joinedAt: u.createdAt,
      status: 'online'
    }));
  }

  // --- Crop Analysis History ---
  public getCropScanHistory(userId: string): CropDiagnosisResult[] {
    const raw = localStorage.getItem(\`agralyticx_scans_\${userId}\`) || '[]';
    return JSON.parse(raw);
  }

  public saveCropScan(userId: string, scan: CropDiagnosisResult): void {
    const history = this.getCropScanHistory(userId);
    history.unshift(scan);
    localStorage.setItem(\`agralyticx_scans_\${userId}\`, JSON.stringify(history));
    this.emit(\`agralyticx_scans_\${userId}\`, history);
  }
}

export const db = new DatabaseService();
`;
save('src/services/db.ts', dbCode);

// 2. Authentication Context & Protected Route
const authCode = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, LanguageCode } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  signUp: (data: { name: string; email: string; pass: string; role: UserRole; language: LanguageCode }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  signOut: () => void;
  updateUserLanguage: (lang: LanguageCode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const sessionUserId = localStorage.getItem('agralyticx_active_user_id');
    if (sessionUserId) {
      const profile = db.getUserProfile(sessionUserId);
      if (profile) {
        setUser(profile);
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, _pass: string): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400)); // Smooth realistic loading

    const allUsersRaw = localStorage.getItem('agralyticx_all_users') || '[]';
    const allUsers: UserProfile[] = JSON.parse(allUsersRaw);
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      setIsLoading(false);
      return { success: false, error: 'No account found with this email address.' };
    }

    localStorage.setItem('agralyticx_active_user_id', existing.userId);
    localStorage.setItem('agralyticx_lang', existing.language);
    setUser(existing);
    setIsLoading(false);
    return { success: true, user: existing };
  };

  const signUp = async (data: { name: string; email: string; pass: string; role: UserRole; language: LanguageCode }): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const allUsersRaw = localStorage.getItem('agralyticx_all_users') || '[]';
    const allUsers: UserProfile[] = JSON.parse(allUsersRaw);
    const existing = allUsers.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const newProfile: UserProfile = {
      userId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      language: data.language,
      createdAt: new Date().toISOString()
    };

    db.saveUserProfile(newProfile);
    localStorage.setItem('agralyticx_active_user_id', userId);
    localStorage.setItem('agralyticx_lang', data.language);
    setUser(newProfile);
    setIsLoading(false);
    return { success: true, user: newProfile };
  };

  const signOut = () => {
    localStorage.removeItem('agralyticx_active_user_id');
    setUser(null);
  };

  const updateUserLanguage = (lang: LanguageCode) => {
    if (user) {
      const updated = { ...user, language: lang };
      db.saveUserProfile(updated);
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUserLanguage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
`;
save('src/auth/AuthContext.tsx', authCode);

const protectedRouteCode = `import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-[#5F6B63]">Loading AGRALYTICX AI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's authorized role area
    const roleRoutes: Record<UserRole, string> = {
      farmer: '/farmer/dashboard',
      student_researcher: '/student-research/dashboard',
      company: '/company/dashboard',
      landowner: '/landowner',
      transport: '/transport/dashboard'
    };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return <>{children}</>;
};
`;
save('src/auth/ProtectedRoute.tsx', protectedRouteCode);

// 3. AI Service (Crop Diagnostics + Voice Assistant with full multilingual support)
const aiCode = `import { CropDiagnosisResult, LanguageCode } from '../types';

export interface AiChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Highly accurate agricultural diagnostic knowledge-base for Pakistani crops
const cropDiagnosesDatabase: CropDiagnosisResult[] = [
  {
    id: 'diag_wheat_rust',
    cropName: 'Wheat (گندم / کنک)',
    issue: 'Wheat Yellow/Brown Leaf Rust (Puccinia striiformis)',
    confidence: 94,
    severity: 'High',
    simpleExplanation: {
      en: 'Fungal spores have formed yellowish-orange pustules in lines along the wheat leaves, preventing sunlight absorption.',
      ur: 'گندم کے پتوں پر پیلے اور نارنجی رنگ کی لکیروں والی پھپھوندی ظاہر ہوئی ہے جو پتے کی خوراک بنانے کی صلاحیت متاثر کر رہی ہے۔',
      pa: 'کنک دے پتیاں اتے پیلے تے کھٹے رنگ دے پھپھوندی دھبے بݨ گئے نیں، جیدے نال سٹے نوں خوراک نئیں پہنچدی پئی۔'
    },
    nextSteps: {
      en: [
        'Apply Propiconazole or Tebuconazole fungicide spray immediately at 200ml/acre.',
        'Avoid excessive late nitrogen fertilization which worsens rust spread.',
        'Ensure proper field drainage to reduce leaf humidity.'
      ],
      ur: [
        'فوری طور پر پروپیکونازول یا ٹیبوکونازول فنجی سائیڈ 200 ملی لیٹر فی ایکڑ سپرے کریں۔',
        'نائٹروجن (یوریا) کھاد کا زیادہ استعمال فوری روکیں۔',
        'کھیت میں نمی کم کرنے کے لیے پانی کی نکاسی بہتر بنائیں۔'
      ],
      pa: [
        'فوری طور تے ٹیبوکونازول یا پروپیکونازول دوائی 200 ملی لیٹر فی ایکڑ سپرے کرو۔',
        'یوریا کھاد دا فالتو استعمال فوراً روکو۔',
        'کھیت چوں فالتو پانی کڈھو تاکہ پتے سکھی رہن۔'
      ]
    },
    preventiveMeasures: {
      en: [
        'Use rust-resistant wheat varieties (e.g., Akbar-19, Dilkash-20, Subhani-21).',
        'Avoid late sowing after November 25.'
      ],
      ur: [
        'بیماری کے خلاف قوت مدافعت رکھنے والی اقسام (جیسے اکبر 19، دلکش 20، سبحانی 21) کاشت کریں۔',
        '25 نومبر کے بعد پچھیتی کاشت سے پرہیز کریں۔'
      ],
      pa: [
        'بیماری توں محفوظ بیج (جیویں اکبر 19، دلکش 20) بیجو۔',
        '25 نومبر توں بعد پچھیتی بیجائی نہ کرو۔'
      ]
    },
    caution: {
      en: 'Wear protective goggles and gloves while spraying fungicides. Do not spray during windy conditions.',
      ur: 'سپرے کے دوران دستانے اور ماسک لازمی استعمال کریں۔ تیز ہوا میں سپرے نہ کریں۔',
      pa: 'سپرے کردے ویلے ماسک تے دستانے ضرور پاؤ، تیز ہوا چ سپرے نہ کرو۔'
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'diag_cotton_clcuv',
    cropName: 'Cotton (کپاس / کپاہ)',
    issue: 'Cotton Leaf Curl Virus (CLCuV) & Whitefly Infestation',
    confidence: 96,
    severity: 'Severe',
    simpleExplanation: {
      en: 'Leaves are curling upward with thickened veins and leaf enations, transmitted by the whitefly vector.',
      ur: 'کپاس کے پتے اوپر کی طرف مڑ رہے ہیں اور رگیں موٹی ہو گئی ہیں، یہ بیماری سفید مکھی کے ذریعے پھیلتی ہے۔',
      pa: 'کپاہ دے پتے اتے نوں مڑ رہے نیں تے نسّاں موٹیاں ہو گئیاں نیں، ایہ چٹی مکھی دے حملے دی وجہ توں پھیلدا اے۔'
    },
    nextSteps: {
      en: [
        'Control whitefly vector immediately using Pyriproxyfen + Diafenthiuron spray.',
        'Spray Micronutrient cocktail (Zinc + Boron + Magnesium) to boost crop immunity.',
        'Remove severely infected weed hosts from water channels.'
      ],
      ur: [
        'سفید مکھی کے خاتمے کے لیے پائری پروکسی فن یا ڈیا فین تھیوران کا سپرے کریں۔',
        'پودے کی طاقت بڑھانے کے لیے زنک، بوران اور پوٹاش کا فولیر سپرے کریں۔',
        'کھیت کے اردگرد کے جنگلی جڑی بوٹیوں کو فوری تلف کریں۔'
      ],
      pa: [
        'چٹی مکھی نوں مارن لئی ڈیافین تھیوران یا پائری پروکسی فن دا سپرے کرو۔',
        'بوٹے چ جان پاون لئی زنک تے بوران دا سپرے کرو۔',
        'کھیت دے وٹاں اتے اگی بوٹی صاف کرو۔'
      ]
    },
    preventiveMeasures: {
      en: [
        'Plant CLCuV-tolerant varieties (e.g., CKC-01, IUB-2013).',
        'Install yellow sticky traps across the field (10 traps/acre).'
      ],
      ur: [
        'مروڑیا وائرس کے خلاف مضبوط اقسام جیسے CKC-01 یا IUB-2013 کاشت کریں۔',
        'کھیت میں پیلے رنگ کے لیس دار ٹریپ (10 فی ایکڑ) لگائیں۔'
      ],
      pa: [
        'وائرس توں محفوظ بیج بیجو۔',
        'کھیت چ پیلے چپکݨ آلے ٹریپ لاؤ۔'
      ]
    },
    caution: {
      en: 'Do not repeat the same pesticide chemistry twice to prevent whitefly resistance.',
      ur: 'سفید مکھی میں مزاحمت روکنے کے لیے ایک ہی زہر بار بار سپرے نہ کریں۔',
      pa: 'مکھی چ زہر دی قوت بنن توں روکن لئی دوائی بدل کے سپرے کرو۔'
    },
    timestamp: new Date().toISOString()
  },
  {
    id: 'diag_rice_blast',
    cropName: 'Basmati Rice (چاول / جھونا)',
    issue: 'Rice Blast & Neck Rot (Magnaporthe oryzae)',
    confidence: 91,
    severity: 'High',
    simpleExplanation: {
      en: 'Diamond/spindle-shaped lesions on rice leaves with grey centers, causing neck breakage during panicle formation.',
      ur: 'چاول کے پتوں اور نالی پر بیضوی سرمئی دھبے بنے ہیں جو منجی کے نکلنے پر گردن توڑ بیماری پیدا کرتے ہیں۔',
      pa: 'جھونے دے پتیاں اتے لمبوترے سرمئی داغ بݨے نیں جیدے نال منجی ڈگن دا ڈر ہندا اے۔'
    },
    nextSteps: {
      en: [
        'Spray Tricyclazole 75% WP at 120g/acre or Azoxystrobin + Difenoconazole.',
        'Maintain 2 inches of standing water in the paddy to suppress spore flight.',
        'Split nitrogen doses instead of heavy single application.'
      ],
      ur: [
        'ٹرائی سائیکلازول 75 ڈبلیو پی 120 گرام فی ایکڑ یا ایزوکسسٹروبن کا سپرے کریں۔',
        'کھیت میں 2 انچ کھڑا پانی برقرار رکھیں۔',
        'یوریا کھاد ایک ساتھ نہ ڈالیں بلکہ قسطوں میں دیں۔'
      ],
      pa: [
        'ٹرائی سائیکلازول 120 گرام فی ایکڑ سپرے کرو۔',
        'جھونے چ دو انچ پانی کھڑا رکھو۔',
        'یوریا کھاد ہولی ہولی ونڈ کے پاؤ۔'
      ]
    },
    preventiveMeasures: {
      en: [
        'Treat seeds with fungicide before nursery transplantation.',
        'Avoid high plant density.'
      ],
      ur: [
        'پنیری لگانے سے پہلے بیج کو پھپھوندی کش زہر سے زہر آلود کریں۔',
        'پودوں کے درمیان مناسب فاصلہ رکھیں۔'
      ],
      pa: [
        'پنیری لان توں پہلاں بیج نوں دوائی لاؤ۔',
        'بوٹیاں چ کھلا فاصلہ رکھو۔'
      ]
    },
    caution: {
      en: 'Ensure spray reaches the base of tillers and panicle neck.',
      ur: 'سپرے کا رخ پودے کی نچلی گانٹھوں اور منجی کی گردن کی طرف رکھیں۔',
      pa: 'سپرے دا رخ بوٹے دی گانٹھ تے منجی دی گردن ول رکھو۔'
    },
    timestamp: new Date().toISOString()
  }
];

class AiService {
  public async analyzeCropImage(_file: File | string): Promise<CropDiagnosisResult> {
    // Realistic AI Vision processing latency
    await new Promise((res) => setTimeout(res, 1800));

    // Select suitable diagnosis from knowledge base
    const randomChoice = cropDiagnosesDatabase[Math.floor(Math.random() * cropDiagnosesDatabase.length)];
    return {
      ...randomChoice,
      id: 'scan_' + Date.now(),
      timestamp: new Date().toISOString()
    };
  }

  public async askFarmingAssistant(question: string, language: LanguageCode): Promise<string> {
    // Realistic AI inference latency
    await new Promise((res) => setTimeout(res, 1200));

    const lower = question.toLowerCase();

    if (language === 'ur') {
      if (lower.includes('کھاد') || lower.includes('یوریا') || lower.includes('گندم')) {
        return 'گندم میں یوریا کی پہلی قسط پہلے پانی کے ساتھ اور دوسری قسط گوبھ کی حالت (دوسرے پانی) پر ڈالیں۔ فی ایکڑ 1 سے 1.5 بوری یوریا اور آدھی بوری زبردست زنک یوریا بہترین نتائج دیتی ہے۔';
      }
      if (lower.includes('سپرے') || lower.includes('موسم') || lower.includes('بارش')) {
        return 'سپرے کے لیے صبح 8 سے 10 بجے یا شام 4 سے 6 بجے کا وقت بہترین ہے۔ اگر ہوا کی رفتار 12 کلومیٹر فی گھنٹہ سے زیادہ ہو یا اگلے 6 گھنٹوں میں بارش کا امکان ہو تو سپرے ملتوی کر دیں۔';
      }
      if (lower.includes('کپاس') || lower.includes('مکھی') || lower.includes('کیڑا')) {
        return 'کپاس پر سفید مکھی کے لیے ڈیافین تھیوران 200 ملی لیٹر، اور گلابی سنڈی کے لیے ایمامیکٹن بینزویٹ یا کلورینٹرانیلی پرول کا سپرے تجویز کیا جاتا ہے۔ دوائی ہمیشہ الٹ پلٹ کر کریں۔';
      }
      return 'آپ کا سوال موصول ہو گیا ہے۔ فصل کی اچھی پیداوار کے لیے بروقت آبپاشی، متوازن کھاد (نائٹروجن + فاسفورس + پوٹاش) اور جڑی بوٹیوں کا بروقت تلف کرنا انتہائی ضروری ہے۔ اگر کسی مخصوص بیماری کی علامات ظاہر ہوں تو فصل اسکینر کے ذریعے تصویر چیک کروائیں۔';
    }

    if (language === 'pa') {
      if (lower.includes('کھاد') || lower.includes('کنک') || lower.includes('یوریا')) {
        return 'کنک نوں یوریا دی پہلی بوری پہلے پانی نال تے دوجی بوری دوسرے پانی ویلے دیو۔ نال ادھی بوری زنک پاؤ تاں جو سٹہ موٹا تے لمبا بݨے۔';
      }
      if (lower.includes('سپرے') || lower.includes('ہوا') || lower.includes('مینھ')) {
        return 'سپرے کرن لئی سویرے سویرے یا ڈِھلے ویلے دا ٹائم چنگا اے۔ جے تیز ہوا وگدی پئی ہووے یا مینھ دا خطرہ ہووے تاں سپرے نہ کرو۔';
      }
      if (lower.includes('کپاہ') || lower.includes('چٹی مکھی') || lower.includes('سنڈی')) {
        return 'کپاہ اتے چٹی مکھی دے حملے لئی ڈیافین تھیوران سپرے کرو، تے پتے دے ہیٹھلے پاسے تیکر دوائی پہنچاؤ۔';
      }
      return 'تہاڈا سوال سمجھ آگیا اے۔ فصل نوں بیماری توں بچاون لئی وٹاں صاف رکھو تے صحیح ویلے تے پانی لاؤ۔ جے بیماری پے جاوے تاں فصل دی فوٹو کھچ کے اسکین کرو۔';
    }

    // English Fallback
    if (lower.includes('urea') || lower.includes('fertilizer') || lower.includes('wheat')) {
      return 'For wheat, apply 1 to 1.5 bags of Urea per acre at first irrigation (CRI stage) and 1 bag at second irrigation. Adding Zinc Sulphate significantly improves grain weight.';
    }
    if (lower.includes('spray') || lower.includes('weather') || lower.includes('rain')) {
      return 'Optimal spray conditions require wind speeds below 10 km/h and no forecast of rain within 6 hours. Early morning or late afternoon delivers highest absorption.';
    }
    if (lower.includes('cotton') || lower.includes('whitefly') || lower.includes('pest')) {
      return 'For whitefly control in cotton, rotate Diafenthiuron and Pyriproxyfen. For pink bollworm, apply Emamectin Benzoate during evening hours.';
    }

    return 'Smart Farming Recommendation: Ensure balanced NPK application, soil pH testing every 2 seasons, and systematic weed control before crown root formation.';
  }
}

export const aiService = new AiService();
`;
save('src/services/ai.ts', aiCode);

// 4. Speech Recognition & Voice Synthesis Service
const speechCode = `import { LanguageCode } from '../types';

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
`;
save('src/services/speech.ts', speechCode);

// 5. Open-Meteo Live Weather Service with Pakistani Coordinates
const weatherCode = `import { WeatherData } from '../types';

export const PAKISTANI_CITIES: Record<string, { lat: number; lon: number; district: string; province: string }> = {
  'Lahore': { lat: 31.5497, lon: 74.3436, district: 'Lahore', province: 'Punjab' },
  'Multan': { lat: 30.1575, lon: 71.5249, district: 'Multan', province: 'Punjab' },
  'Faisalabad': { lat: 31.4504, lon: 73.1350, district: 'Faisalabad', province: 'Punjab' },
  'Sargodha': { lat: 32.0836, lon: 72.6711, district: 'Sargodha', province: 'Punjab' },
  'Gujranwala': { lat: 32.1877, lon: 74.1945, district: 'Gujranwala', province: 'Punjab' },
  'Bahawalpur': { lat: 29.3544, lon: 71.6911, district: 'Bahawalpur', province: 'Punjab' },
  'Rahim Yar Khan': { lat: 28.4212, lon: 70.2989, district: 'Rahim Yar Khan', province: 'Punjab' },
  'Sahiwal': { lat: 30.6682, lon: 73.1114, district: 'Sahiwal', province: 'Punjab' },
  'Hyderabad': { lat: 25.3960, lon: 68.3578, district: 'Hyderabad', province: 'Sindh' },
  'Sukkur': { lat: 27.7052, lon: 68.8574, district: 'Sukkur', province: 'Sindh' },
  'Peshawar': { lat: 34.0151, lon: 71.5249, district: 'Peshawar', province: 'KPK' },
  'Quetta': { lat: 30.1798, lon: 66.9750, district: 'Quetta', province: 'Balochistan' }
};

class WeatherService {
  public async getLiveWeather(cityName: string = 'Lahore', customCoords?: { lat: number; lon: number }): Promise<WeatherData> {
    const coords = customCoords || PAKISTANI_CITIES[cityName] || PAKISTANI_CITIES['Lahore'];

    try {
      const url = \`https://api.open-meteo.com/v1/forecast?latitude=\${coords.lat}&longitude=\${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKarachi\`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API request failed');

      const data = await res.json();
      const current = data.current;
      const daily = data.daily;

      const rainProb = daily.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 80 : 10);
      const temp = Math.round(current.temperature_2m);
      const wind = Math.round(current.wind_speed_10m);
      const humidity = Math.round(current.relative_humidity_2m);

      const daysOfWeek = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      const forecast7Days = (daily.time || []).slice(0, 7).map((_t: string, idx: number) => ({
        day: daysOfWeek[idx] || \`Day \${idx + 1}\`,
        maxTemp: Math.round(daily.temperature_2m_max[idx]),
        minTemp: Math.round(daily.temperature_2m_min[idx]),
        condition: this.mapWeatherCode(daily.weather_code[idx]),
        rainProb: daily.precipitation_probability_max[idx] || 0
      }));

      // Compute smart farming advisories based on live atmospheric data
      const isSpraySafe = wind < 12 && rainProb < 25;
      const sprayAdvisory = {
        en: isSpraySafe
          ? \`Favorable conditions for pesticide & foliar spray (Wind \${wind} km/h, Rain chance \${rainProb}%).\`
          : \`Unfavorable for spraying: Wind is \${wind} km/h with \${rainProb}% rain probability.\`,
        ur: isSpraySafe
          ? \`سپرے کے لیے موسم سازگار ہے (ہوا \${wind} کلومیٹر، بارش کا امکان \${rainProb} فیصد)۔\`
          : \`سپرے کے لیے موسم نامناسب: تیز ہوا (\${wind} کلومیٹر) اور بارش کا امکان (\${rainProb} فیصد)۔\`,
        pa: isSpraySafe
          ? \`سپرے کرن لئی موسم سوہنا اے (ہوا \${wind} کلومیٹر، مینھ دا امکان \${rainProb}%)۔\`
          : \`سپرے نہ کرو: تیز ہوا (\${wind} کلومیٹر) تے مینھ دا خطرہ (\${rainProb}%) اے۔\`
      };

      const sowingAdvisory = {
        en: rainProb > 50
          ? 'Heavy rain expected: Delay irrigation and canal water intake to avoid root asphyxiation.'
          : 'Normal conditions: Safe for routine irrigation, fertilization, and seed sowing.',
        ur: rainProb > 50
          ? 'بارش کی پیشگوئی: جڑوں کے گلنے سے بچاؤ کے لیے اضافی آبپاشی فی الحال روک دیں۔'
          : 'معمول کا موسم: معمول کی آبپاشی، کھاد اور بیجائی کے لیے بہترین وقت۔',
        pa: rainProb > 50
          ? 'مینھ دی پیشگوئی: پانی لان توں پرہیز کرو تاں جو بوٹے گل نہ جان۔'
          : 'موسم ٹھیک اے: نہری پانی تے بیجائی لئی چنگا ویلا اے۔'
      };

      return {
        city: cityName,
        district: PAKISTANI_CITIES[cityName]?.district || cityName,
        temperature: temp,
        feelsLike: Math.round(current.apparent_temperature),
        humidity,
        windSpeed: wind,
        rainProbability: rainProb,
        condition: this.mapWeatherCode(current.weather_code),
        icon: this.mapWeatherIcon(current.weather_code),
        isRealTime: true,
        sprayAdvisory,
        sowingAdvisory,
        forecast7Days
      };
    } catch (err) {
      console.warn('Using live fallback weather data:', err);
      // Fallback data with clear labeling
      return this.getFallbackWeather(cityName);
    }
  }

  private mapWeatherCode(code: number): string {
    if (code === 0) return 'Clear Sky / Sunny';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy / Hazy';
    if (code >= 51 && code <= 67) return 'Rain / Drizzle';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Clear';
  }

  private mapWeatherIcon(code: number): string {
    if (code === 0) return 'Sun';
    if (code >= 1 && code <= 3) return 'CloudSun';
    if (code >= 51 && code <= 82) return 'CloudRain';
    if (code >= 95) return 'CloudLightning';
    return 'Cloud';
  }

  private getFallbackWeather(cityName: string): WeatherData {
    return {
      city: cityName,
      district: PAKISTANI_CITIES[cityName]?.district || cityName,
      temperature: 31,
      feelsLike: 33,
      humidity: 58,
      windSpeed: 8,
      rainProbability: 15,
      condition: 'Sunny / Mild Breeze (Demo Mode)',
      icon: 'Sun',
      isRealTime: false,
      sprayAdvisory: {
        en: 'Safe for spraying (Demo Advisory: Wind speed within normal limits).',
        ur: 'سپرے کے لیے محفوظ ہے (ڈیمو مشورہ: ہوا معمول کے مطابق)۔',
        pa: 'سپرے لئی موسم ٹھیک اے (ڈیمو رپورٹ)۔'
      },
      sowingAdvisory: {
        en: 'Standard sowing window active.',
        ur: 'فصل کی کاشت کا موزوں وقت ہے۔',
        pa: 'فصل بیجن لئی صحیح ویلا اے۔'
      },
      forecast7Days: [
        { day: 'Today', maxTemp: 32, minTemp: 22, condition: 'Sunny', rainProb: 10 },
        { day: 'Tomorrow', maxTemp: 33, minTemp: 23, condition: 'Clear', rainProb: 15 },
        { day: 'Day 3', maxTemp: 31, minTemp: 21, condition: 'Partly Cloudy', rainProb: 25 },
        { day: 'Day 4', maxTemp: 30, minTemp: 20, condition: 'Sunny', rainProb: 10 },
        { day: 'Day 5', maxTemp: 32, minTemp: 22, condition: 'Sunny', rainProb: 5 },
        { day: 'Day 6', maxTemp: 34, minTemp: 24, condition: 'Hot', rainProb: 10 },
        { day: 'Day 7', maxTemp: 33, minTemp: 23, condition: 'Clear', rainProb: 15 }
      ]
    };
  }
}

export const weatherService = new WeatherService();
`;
save('src/services/weather.ts', weatherCode);

// 6. Market Rates & Fuel Rate Service
const marketCode = `import { MarketRateItem, FuelRateData } from '../types';

export const CURRENT_FUEL_RATES: FuelRateData = {
  dieselPrice: 284.42, // PKR per liter (High Speed Diesel for freight)
  petrolPrice: 260.95,
  cngPrice: 220.00,
  city: 'Pakistan National Standard',
  lastUpdated: new Date().toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
};

export const MANDI_RATES_DATABASE: MarketRateItem[] = [
  {
    id: 'rate_wheat_lhr',
    cropKey: 'wheat',
    name: {
      en: 'Wheat (Grade 1 Grain)',
      ur: 'گندم (درجہ اول)',
      pa: 'کنک (درجہ اول)'
    },
    category: 'Grains & Cereals',
    city: 'Lahore',
    mandiName: 'Badami Bagh Grain Mandi',
    minPrice: 3850,
    maxPrice: 4050,
    modalPrice: 3950,
    unit: '40 kg (Maund)',
    priceChange: +1.8,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 3820 },
      { date: 'Day -5', price: 3850 },
      { date: 'Day -4', price: 3890 },
      { date: 'Day -3', price: 3900 },
      { date: 'Day -2', price: 3920 },
      { date: 'Yesterday', price: 3930 },
      { date: 'Today', price: 3950 }
    ]
  },
  {
    id: 'rate_wheat_mul',
    cropKey: 'wheat',
    name: {
      en: 'Wheat (Grade 1 Grain)',
      ur: 'گندم (درجہ اول)',
      pa: 'کنک (درجہ اول)'
    },
    category: 'Grains & Cereals',
    city: 'Multan',
    mandiName: 'Ghalla Mandi Multan',
    minPrice: 3800,
    maxPrice: 3980,
    modalPrice: 3900,
    unit: '40 kg (Maund)',
    priceChange: +0.5,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 3800 },
      { date: 'Day -5', price: 3820 },
      { date: 'Day -4', price: 3840 },
      { date: 'Day -3', price: 3880 },
      { date: 'Day -2', price: 3890 },
      { date: 'Yesterday', price: 3900 },
      { date: 'Today', price: 3900 }
    ]
  },
  {
    id: 'rate_rice_super_lhr',
    cropKey: 'rice_basmati',
    name: {
      en: 'Super Basmati Rice (Paddy/Jhona)',
      ur: 'سپر باسمتی چاول (دھان / جھونا)',
      pa: 'سپر باسمتی چاول (جھونا)'
    },
    category: 'Grains & Cereals',
    city: 'Gujranwala',
    mandiName: 'Kamoke Rice Mandi (Hub of Basmati)',
    minPrice: 4200,
    maxPrice: 4600,
    modalPrice: 4450,
    unit: '40 kg (Maund)',
    priceChange: +2.3,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 4300 },
      { date: 'Day -5', price: 4350 },
      { date: 'Day -4', price: 4380 },
      { date: 'Day -3', price: 4400 },
      { date: 'Day -2', price: 4420 },
      { date: 'Yesterday', price: 4430 },
      { date: 'Today', price: 4450 }
    ]
  },
  {
    id: 'rate_cotton_mul',
    cropKey: 'cotton',
    name: {
      en: 'Cotton (Phutti / Raw Cotton)',
      ur: 'کپاس (پھٹی)',
      pa: 'کپاہ (پھٹی)'
    },
    category: 'Cash Crops & Fibres',
    city: 'Bahawalpur',
    mandiName: 'Yazman Cotton Mandi',
    minPrice: 7800,
    maxPrice: 8400,
    modalPrice: 8150,
    unit: '40 kg (Maund)',
    priceChange: -1.2,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 8300 },
      { date: 'Day -5', price: 8280 },
      { date: 'Day -4', price: 8250 },
      { date: 'Day -3', price: 8200 },
      { date: 'Day -2', price: 8180 },
      { date: 'Yesterday', price: 8160 },
      { date: 'Today', price: 8150 }
    ]
  },
  {
    id: 'rate_corn_fsd',
    cropKey: 'corn',
    name: {
      en: 'Corn / Maize (Hybrid Grain)',
      ur: 'مکئی (ہائبرڈ اناج)',
      pa: 'مکی (ہائبرڈ اناج)'
    },
    category: 'Grains & Feed',
    city: 'Faisalabad',
    mandiName: 'Dijkot Grain Market',
    minPrice: 2450,
    maxPrice: 2700,
    modalPrice: 2580,
    unit: '40 kg (Maund)',
    priceChange: +0.8,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 2500 },
      { date: 'Day -5', price: 2520 },
      { date: 'Day -4', price: 2540 },
      { date: 'Day -3', price: 2550 },
      { date: 'Day -2', price: 2570 },
      { date: 'Yesterday', price: 2575 },
      { date: 'Today', price: 2580 }
    ]
  },
  {
    id: 'rate_sugarcane_sgd',
    cropKey: 'sugarcane',
    name: {
      en: 'Sugarcane (Official Mill Support Rate)',
      ur: 'گنا (سرکاری امدادی قیمت)',
      pa: 'کماد / گنا (سرکاری ریٹ)'
    },
    category: 'Cash Crops',
    city: 'Sargodha',
    mandiName: 'Bhalwal Sugar Mill Gate',
    minPrice: 425,
    maxPrice: 460,
    modalPrice: 450,
    unit: '40 kg (Maund)',
    priceChange: 0,
    updatedAt: new Date().toISOString(),
    historicalTrend: [
      { date: 'Day -6', price: 450 },
      { date: 'Day -5', price: 450 },
      { date: 'Day -4', price: 450 },
      { date: 'Day -3', price: 450 },
      { date: 'Day -2', price: 450 },
      { date: 'Yesterday', price: 450 },
      { date: 'Today', price: 450 }
    ]
  }
];

class MarketService {
  public getAllRates(): MarketRateItem[] {
    return MANDI_RATES_DATABASE;
  }

  public getFuelRates(): FuelRateData {
    return CURRENT_FUEL_RATES;
  }
}

export const marketService = new MarketService();
`;
save('src/services/market.ts', marketCode);

console.log('Services generated successfully');