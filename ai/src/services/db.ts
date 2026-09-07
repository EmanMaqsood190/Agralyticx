import {
  UserProfile,
  FarmData,
  CropDiagnosisResult,
  StudentProfile,
  CompanyProfile,
  Conversation,
  ConversationMessage,
  LandRecord,
  FarmerJob,
  FarmerJobTranslatedContent,
  LanguageCode,
  TransportBooking,
  CommunityMessage,
  CommunityMember,
  UserRole
} from '../types';

type Listener<T> = (data: T) => void;

type StoredFarmData = FarmData & {
  farmId: string;
};

class DatabaseService {
  private listeners: Map<
    string,
    Set<Listener<any>>
  > = new Map();

  constructor() {
    this.initDefaultData();

    window.addEventListener(
      'storage',
      (e) => {
        if (
          e.key?.startsWith(
            'agralyticx_'
          )
        ) {
          this.notifyListeners(
            e.key
          );
        }
      }
    );
  }

  private emit(
    key: string,
    data: any
  ) {
    const subs =
      this.listeners.get(key);

    if (subs) {
      subs.forEach((cb) =>
        cb(data)
      );
    }
  }

  private notifyListeners(
    storageKey: string
  ) {
    const raw =
      localStorage.getItem(
        storageKey
      );

    if (raw) {
      try {
        const parsed =
          JSON.parse(raw);

        this.emit(
          storageKey,
          parsed
        );
      } catch (err) {
        console.error(
          'Storage sync error:',
          err
        );
      }
    }
  }

  public subscribe<T>(
    key: string,
    callback: Listener<T>
  ): () => void {
    if (
      !this.listeners.has(key)
    ) {
      this.listeners.set(
        key,
        new Set()
      );
    }

    this.listeners
      .get(key)!
      .add(callback);

    return () => {
      this.listeners
        .get(key)
        ?.delete(callback);
    };
  }

  // ============================================================
  // INITIAL DATA
  // ============================================================

  private initDefaultData() {
    /*
     * IMPORTANT:
     * No dummy Company Profiles or Student Profiles
     * are created here.
     *
     * Company profiles are now handled through MongoDB.
     * Student profiles are handled through the real user flow.
     */

    /*
     * ============================================================
     * REMOVE OLD DUMMY COMPANY/STUDENT DATA
     * ============================================================
     */

    localStorage.removeItem(
      'agralyticx_companies'
    );

    localStorage.removeItem(
      'agralyticx_students'
    );

    /*
     * ============================================================
     * FARMER JOBS
     * ============================================================
     *
     * No dummy jobs are created.
     */

    if (
      !localStorage.getItem(
        'agralyticx_farmer_jobs'
      )
    ) {
      localStorage.setItem(
        'agralyticx_farmer_jobs',
        JSON.stringify([])
      );
    }

    /*
     * ============================================================
     * TRANSPORT BOOKINGS
     * ============================================================
     *
     * No dummy transport bookings are created.
     */

    if (
      !localStorage.getItem(
        'agralyticx_transport_bookings'
      )
    ) {
      localStorage.setItem(
        'agralyticx_transport_bookings',
        JSON.stringify([])
      );
    }

    /*
     * ============================================================
     * OLD DEMO JOB CLEANUP
     * ============================================================
     */

    const existingJobsRaw =
      localStorage.getItem(
        'agralyticx_farmer_jobs'
      );

    if (existingJobsRaw) {
      try {
        const existingJobs:
          FarmerJob[] =
          JSON.parse(
            existingJobsRaw
          );

        const realJobs =
          existingJobs.filter(
            (job) =>
              job.id !==
                'job_harvest_101' &&
              job.id !==
                'job_sowing_102'
          );

        if (
          realJobs.length !==
          existingJobs.length
        ) {
          localStorage.setItem(
            'agralyticx_farmer_jobs',
            JSON.stringify(
              realJobs
            )
          );
        }
      } catch (error) {
        console.error(
          'Farmer jobs cleanup failed:',
          error
        );
      }
    }

    /*
     * Remove the old seeded flag so the old
     * demo initialization cannot be reused.
     */
    localStorage.removeItem(
      'agralyticx_seeded'
    );
  }

  // ============================================================
  // USER PROFILES
  // ============================================================

  public getUserProfile(
    userId: string
  ): UserProfile | null {
    const raw =
      localStorage.getItem(
        `agralyticx_user_${userId}`
      );

    return raw
      ? JSON.parse(raw)
      : null;
  }

  public saveUserProfile(
    profile: UserProfile
  ): void {
    const userKey =
      `agralyticx_user_${profile.userId}`;

    const existingRaw =
      localStorage.getItem(
        userKey
      );

    const existing =
      existingRaw
        ? JSON.parse(
            existingRaw
          )
        : null;

    const mergedProfile =
      existing
        ? {
            ...existing,
            ...profile
          }
        : profile;

    localStorage.setItem(
      userKey,
      JSON.stringify(
        mergedProfile
      )
    );

    const allUsersRaw =
      localStorage.getItem(
        'agralyticx_all_users'
      ) || '[]';

    const allUsers:
      UserProfile[] =
      JSON.parse(
        allUsersRaw
      );

    const existingIdx =
      allUsers.findIndex(
        (u) =>
          u.userId ===
          profile.userId
      );

    if (existingIdx >= 0) {
      allUsers[
        existingIdx
      ] = {
        ...allUsers[
          existingIdx
        ],
        ...profile
      };
    } else {
      allUsers.push(
        mergedProfile
      );
    }

    localStorage.setItem(
      'agralyticx_all_users',
      JSON.stringify(
        allUsers
      )
    );

    this.emit(
      userKey,
      mergedProfile
    );
  }

  // ============================================================
  // FARM DATA
  // ============================================================

  // A user can have multiple farms/parcels.
  // Older versions stored only one farm under
  // agralyticx_farm_<userId>. We keep that format readable
  // and automatically migrate it to the new multi-farm format.
  public getAllFarmData(
    userId: string
  ): StoredFarmData[] {
    const farmsKey =
      `agralyticx_farms_${userId}`;

    const farmsRaw =
      localStorage.getItem(farmsKey);

    if (farmsRaw) {
      try {
        const parsed =
          JSON.parse(farmsRaw);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error(
          'Farm data read error:',
          error
        );
      }
    }

    // ----------------------------------------------------------
    // MIGRATE OLD SINGLE-FARM DATA
    // ----------------------------------------------------------

    const oldKey =
      `agralyticx_farm_${userId}`;

    const oldRaw =
      localStorage.getItem(oldKey);

    if (!oldRaw) {
      return [];
    }

    try {
      const oldFarm =
        JSON.parse(oldRaw);

      if (!oldFarm) {
        return [];
      }

      const migratedFarm:
        StoredFarmData = {
        ...oldFarm,
        farmId:
          oldFarm.farmId ||
          `farm_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`
      };

      const migrated =
        [migratedFarm];

      localStorage.setItem(
        farmsKey,
        JSON.stringify(migrated)
      );

      // Remove the old single-farm key only after
      // the migration has been successfully written.
      localStorage.removeItem(oldKey);

      this.emit(
        farmsKey,
        migrated
      );

      return migrated;
    } catch (error) {
      console.error(
        'Farm data migration error:',
        error
      );

      return [];
    }
  }

  // Kept for compatibility with existing code that expects
  // one farm. It returns the first saved farm.
  public getFarmData(
    userId: string
  ): StoredFarmData | null {
    const farms =
      this.getAllFarmData(userId);

    return farms.length > 0
      ? farms[0]
      : null;
  }

  // Creates a new farm when farmId is missing.
  // Updates the existing farm when farmId is supplied.
  public saveFarmData(
    farm: FarmData & {
      farmId?: string;
    }
  ): StoredFarmData {
    const farms =
      this.getAllFarmData(
        farm.userId
      );

    const farmId =
      farm.farmId ||
      `farm_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;

    const savedFarm:
      StoredFarmData = {
      ...farm,
      farmId
    };

    const existingIndex =
      farms.findIndex(
        (item) =>
          item.farmId ===
          farmId
      );

    if (existingIndex >= 0) {
      farms[existingIndex] =
        savedFarm;
    } else {
      farms.push(
        savedFarm
      );
    }

    localStorage.setItem(
      `agralyticx_farms_${farm.userId}`,
      JSON.stringify(farms)
    );

    this.emit(
      `agralyticx_farms_${farm.userId}`,
      farms
    );

    return savedFarm;
  }

  // Deletes only the selected farm/parcels.
  public deleteFarmDataById(
    userId: string,
    farmId: string
  ): void {
    const farms =
      this.getAllFarmData(userId);

    const updatedFarms =
      farms.filter(
        (farm) =>
          farm.farmId !==
          farmId
      );

    localStorage.setItem(
      `agralyticx_farms_${userId}`,
      JSON.stringify(updatedFarms)
    );

    this.emit(
      `agralyticx_farms_${userId}`,
      updatedFarms
    );
  }

  // Deletes every farm belonging to the current user.
  // Kept for compatibility with older MyFarm code.
  public deleteFarmData(
    userId: string
  ): void {
    localStorage.removeItem(
      `agralyticx_farms_${userId}`
    );

    localStorage.removeItem(
      `agralyticx_farm_${userId}`
    );

    this.emit(
      `agralyticx_farms_${userId}`,
      []
    );
  }

  // ============================================================
  // STUDENT PROFILE
  // ============================================================

  public getStudentProfile(
    userId: string
  ): StudentProfile | null {
    const all =
      this.getAllStudents();

    return (
      all.find(
        (s) =>
          s.userId ===
          userId
      ) || null
    );
  }

  public getAllStudents():
    StudentProfile[] {
    const raw =
      localStorage.getItem(
        'agralyticx_students'
      ) || '[]';

    try {
      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  public saveStudentProfile(
    profile: StudentProfile
  ): void {
    const all =
      this.getAllStudents();

    const idx =
      all.findIndex(
        (s) =>
          s.userId ===
          profile.userId
      );

    if (idx >= 0) {
      all[idx] = profile;
    } else {
      all.push(profile);
    }

    localStorage.setItem(
      'agralyticx_students',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_students',
      all
    );
  }

  // ============================================================
  // COMPANY PROFILE
  // ============================================================

  /*
   * IMPORTANT:
   *
   * Company profiles are now stored in MongoDB.
   *
   * These methods are kept only for compatibility
   * with older parts of the application.
   */

  public getCompanyProfile(
    userId: string
  ): CompanyProfile | null {
    const all =
      this.getAllCompanies();

    return (
      all.find(
        (c) =>
          c.userId ===
          userId
      ) || null
    );
  }

  public getAllCompanies():
    CompanyProfile[] {
    const raw =
      localStorage.getItem(
        'agralyticx_companies'
      ) || '[]';

    try {
      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  public saveCompanyProfile(
    profile: CompanyProfile
  ): void {
    const all =
      this.getAllCompanies();

    const idx =
      all.findIndex(
        (c) =>
          c.userId ===
          profile.userId
      );

    if (idx >= 0) {
      all[idx] = profile;
    } else {
      all.push(profile);
    }

    localStorage.setItem(
      'agralyticx_companies',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_companies',
      all
    );
  }

  // ============================================================
  // CONVERSATIONS
  // ============================================================

  public getConversationsForUser(
    userId: string
  ): Conversation[] {
    const raw =
      localStorage.getItem(
        'agralyticx_conversations'
      ) || '[]';

    const all:
      Conversation[] =
      JSON.parse(raw);

    return all.filter(
      (c) =>
        c.studentId ===
          userId ||
        c.companyId ===
          userId
    );
  }

  public getConversationById(
    id: string
  ): Conversation | null {
    const raw =
      localStorage.getItem(
        'agralyticx_conversations'
      ) || '[]';

    const all:
      Conversation[] =
      JSON.parse(raw);

    return (
      all.find(
        (c) =>
          c.id === id
      ) || null
    );
  }

  public startOrSendMessage(
    conversationId: string,
    sender: {
      id: string;
      name: string;
      role: UserRole;
    },
    recipient: {
      id: string;
      name: string;
      role: UserRole;
    },
    text: string,
    subject: string =
      'Agri Research Collaboration'
  ): {
    success: boolean;
    error?: string;
    conversation?: Conversation;
  } {
    const raw =
      localStorage.getItem(
        'agralyticx_conversations'
      ) || '[]';

    const all:
      Conversation[] =
      JSON.parse(raw);

    let conv =
      all.find(
        (c) =>
          c.id ===
          conversationId
      );

    const isStudentSender =
      sender.role ===
      'student_researcher';

    if (!conv) {
      const newMsg:
        ConversationMessage = {
        id:
          'msg_' +
          Date.now() +
          '_' +
          Math.random()
            .toString(36)
            .substr(2, 5),

        conversationId,

        senderId:
          sender.id,

        senderName:
          sender.name,

        senderRole:
          sender.role,

        text,

        createdAt:
          new Date().toISOString()
      };

      conv = {
        id:
          conversationId,

        studentId:
          isStudentSender
            ? sender.id
            : recipient.id,

        studentName:
          isStudentSender
            ? sender.name
            : recipient.name,

        companyId:
          isStudentSender
            ? recipient.id
            : sender.id,

        companyName:
          isStudentSender
            ? recipient.name
            : sender.name,

        subject,

        status:
          isStudentSender
            ? 'pending_company_reply'
            : 'pending_student_reply',

        lastMessage:
          text,

        lastMessageAt:
          new Date().toISOString(),

        createdAt:
          new Date().toISOString(),

        messages: [newMsg]
      };

      all.push(conv);
    } else {
      if (
        conv.status ===
        'blocked'
      ) {
        return {
          success: false,
          error:
            'This conversation has been blocked.'
        };
      }

      if (
        conv.status ===
          'pending_company_reply' &&
        isStudentSender
      ) {
        return {
          success: false,
          error:
            'To prevent spam, you cannot send another message until the company replies.'
        };
      }

      if (
        conv.status ===
          'pending_student_reply' &&
        !isStudentSender
      ) {
        return {
          success: false,
          error:
            'To prevent spam, you cannot send another message until the researcher replies.'
        };
      }

      const newMsg:
        ConversationMessage = {
        id:
          'msg_' +
          Date.now() +
          '_' +
          Math.random()
            .toString(36)
            .substr(2, 5),

        conversationId,

        senderId:
          sender.id,

        senderName:
          sender.name,

        senderRole:
          sender.role,

        text,

        createdAt:
          new Date().toISOString()
      };

      conv.messages.push(
        newMsg
      );

      conv.lastMessage =
        text;

      conv.lastMessageAt =
        new Date().toISOString();

      conv.status =
        'active';
    }

    localStorage.setItem(
      'agralyticx_conversations',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_conversations',
      all
    );

    return {
      success: true,
      conversation: conv
    };
  }

  public blockConversation(
    conversationId: string,
    blockerUserId: string
  ): void {
    const raw =
      localStorage.getItem(
        'agralyticx_conversations'
      ) || '[]';

    const all:
      Conversation[] =
      JSON.parse(raw);

    const conv =
      all.find(
        (c) =>
          c.id ===
          conversationId
      );

    if (conv) {
      conv.status =
        'blocked';

      conv.blockedBy =
        blockerUserId;

      localStorage.setItem(
        'agralyticx_conversations',
        JSON.stringify(all)
      );

      this.emit(
        'agralyticx_conversations',
        all
      );
    }
  }

  // ============================================================
  // LANDOWNER / LAND RECORDS
  // ============================================================

  public getLandRecords(
    userId: string
  ): LandRecord[] {
    const raw =
      localStorage.getItem(
        `agralyticx_lands_${userId}`
      ) || '[]';

    return JSON.parse(raw);
  }

  public saveLandRecord(
    record: LandRecord
  ): void {
    const lands =
      this.getLandRecords(
        record.userId
      );

    const idx =
      lands.findIndex(
        (l) =>
          l.id ===
          record.id
      );

    if (idx >= 0) {
      lands[idx] =
        record;
    } else {
      lands.push(record);
    }

    localStorage.setItem(
      `agralyticx_lands_${record.userId}`,
      JSON.stringify(lands)
    );

    this.emit(
      `agralyticx_lands_${record.userId}`,
      lands
    );
  }

  // ============================================================
  // FARMER JOBS
  // ============================================================

  private getAcceptedFarmerCount(
    job: FarmerJob
  ): number {
    if (
      !Array.isArray(
        job.applicants
      )
    ) {
      return 0;
    }

    return job.applicants.filter(
      (applicant) =>
        applicant?.status ===
        'accepted'
    ).length;
  }

  private syncFarmerJobStatus(
    job: FarmerJob
  ): boolean {
    const needed =
      Number(
        job.farmersNeeded
      );

    if (
      !Number.isFinite(needed) ||
      needed <= 0
    ) {
      return false;
    }

    const acceptedCount =
      this.getAcceptedFarmerCount(
        job
      );

    const nextStatus =
      acceptedCount >= needed
        ? ('Closed' as FarmerJob['status'])
        : ('Open' as FarmerJob['status']);

    if (
      String(job.status) !==
      String(nextStatus)
    ) {
      job.status =
        nextStatus;

      return true;
    }

    return false;
  }

  public getAllFarmerJobs():
    FarmerJob[] {
    const raw =
      localStorage.getItem(
        'agralyticx_farmer_jobs'
      ) || '[]';

    try {
      const parsed =
        JSON.parse(raw);

      if (
        !Array.isArray(parsed)
      ) {
        return [];
      }

      let changed = false;

      const normalized:
        FarmerJob[] =
        parsed.map(
          (job) => {
            if (
              !Array.isArray(
                job.applicants
              )
            ) {
              job.applicants =
                [];

              changed = true;
            }

            if (
              this.syncFarmerJobStatus(
                job
              )
            ) {
              changed = true;
            }

            return job;
          }
        );

      if (changed) {
        localStorage.setItem(
          'agralyticx_farmer_jobs',
          JSON.stringify(
            normalized
          )
        );
      }

      return normalized;
    } catch {
      return [];
    }
  }

  public createFarmerJob(
    job: FarmerJob
  ): void {
    const all =
      this.getAllFarmerJobs();

    const safeJob:
      FarmerJob = {
      ...job,

      applicants:
        Array.isArray(
          job.applicants
        )
          ? job.applicants
          : [],

      originalLanguage:
        job.originalLanguage ||
        'en',

      translatedContent:
        job.translatedContent ||
        {}
    };

    this.syncFarmerJobStatus(
      safeJob
    );

    all.unshift(
      safeJob
    );

    localStorage.setItem(
      'agralyticx_farmer_jobs',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_farmer_jobs',
      all
    );
  }

  public updateFarmerJob(
    updatedJob: FarmerJob
  ): {
    success: boolean;
    error?: string;
    job?: FarmerJob;
  } {
    const all =
      this.getAllFarmerJobs();

    const index =
      all.findIndex(
        (job) =>
          job.id ===
          updatedJob.id
      );

    if (index === -1) {
      return {
        success: false,
        error:
          'JOB_NOT_FOUND'
      };
    }

    const existingJob =
      all[index];

    if (
      existingJob.landownerId !==
      updatedJob.landownerId
    ) {
      return {
        success: false,
        error:
          'UNAUTHORIZED_JOB_UPDATE'
      };
    }

    const safeUpdatedJob:
      FarmerJob = {
      ...existingJob,
      ...updatedJob,

      id:
        existingJob.id,

      landownerId:
        existingJob.landownerId,

      landownerName:
        existingJob.landownerName,

      phone:
        updatedJob.phone ??
        existingJob.phone ??
        '',

      createdAt:
        existingJob.createdAt,

      applicants:
        Array.isArray(
          existingJob.applicants
        )
          ? existingJob.applicants
          : [],

      originalLanguage:
        updatedJob.originalLanguage ||
        existingJob.originalLanguage ||
        'en',

      translatedContent:
        {}
    };

    const farmersNeeded =
      Number(
        safeUpdatedJob.farmersNeeded
      );

    if (
      !Number.isFinite(
        farmersNeeded
      ) ||
      farmersNeeded <= 0
    ) {
      return {
        success: false,
        error:
          'INVALID_FARMER_LIMIT'
      };
    }

    safeUpdatedJob.farmersNeeded =
      farmersNeeded;

    this.syncFarmerJobStatus(
      safeUpdatedJob
    );

    all[index] =
      safeUpdatedJob;

    localStorage.setItem(
      'agralyticx_farmer_jobs',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_farmer_jobs',
      all
    );

    return {
      success: true,
      job:
        safeUpdatedJob
    };
  }

  public deleteFarmerJob(
    jobId: string,
    landownerId: string
  ): {
    success: boolean;
    error?: string;
    job?: FarmerJob;
  } {
    const all =
      this.getAllFarmerJobs();

    const index =
      all.findIndex(
        (job) =>
          job.id ===
          jobId
      );

    if (index === -1) {
      return {
        success: false,
        error:
          'JOB_NOT_FOUND'
      };
    }

    const job =
      all[index];

    if (
      job.landownerId !==
      landownerId
    ) {
      return {
        success: false,
        error:
          'UNAUTHORIZED_JOB_DELETE'
      };
    }

    all.splice(
      index,
      1
    );

    localStorage.setItem(
      'agralyticx_farmer_jobs',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_farmer_jobs',
      all
    );

    return {
      success: true,
      job
    };
  }

  public respondToJob(
    jobId: string,
    farmerId: string,
    farmerName: string,
    action:
      | 'accepted'
      | 'rejected',
    phone?: string
  ): {
    success: boolean;
    error?: string;
    job?: FarmerJob;
  } {
    const all =
      this.getAllFarmerJobs();

    const job =
      all.find(
        (j) =>
          j.id ===
          jobId
      );

    if (!job) {
      return {
        success: false,
        error:
          'JOB_NOT_FOUND'
      };
    }

    if (
      !Array.isArray(
        job.applicants
      )
    ) {
      job.applicants =
        [];
    }

    const existing =
      job.applicants.find(
        (a) =>
          a.farmerId ===
          farmerId
      );

    this.syncFarmerJobStatus(
      job
    );

    if (
      action ===
        'accepted' &&
      String(job.status) ===
        'Closed' &&
      existing?.status !==
        'accepted'
    ) {
      return {
        success: false,
        error:
          'JOB_CLOSED',
        job
      };
    }

    if (existing) {
      existing.status =
        action;

      existing.appliedAt =
        new Date().toISOString();

      existing.farmerName =
        farmerName;

      if (
        phone !==
        undefined
      ) {
        existing.phone =
          phone;
      }
    } else {
      job.applicants.push({
        farmerId,
        farmerName,
        phone,

        appliedAt:
          new Date().toISOString(),

        status:
          action
      });
    }

    if (
      action ===
      'accepted'
    ) {
      this.syncFarmerJobStatus(
        job
      );
    }

    localStorage.setItem(
      'agralyticx_farmer_jobs',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_farmer_jobs',
      all
    );

    return {
      success: true,
      job
    };
  }

  // ============================================================
  // SEEN JOBS
  // ============================================================

  public getSeenFarmerJobIds(
    farmerId: string
  ): string[] {
    const raw =
      localStorage.getItem(
        `agralyticx_farmer_seen_jobs_${farmerId}`
      );

    if (!raw) return [];

    try {
      const parsed =
        JSON.parse(raw);

      return Array.isArray(
        parsed
      )
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  public markFarmerJobSeen(
    farmerId: string,
    jobId: string
  ): void {
    const seenIds =
      this.getSeenFarmerJobIds(
        farmerId
      );

    if (
      seenIds.includes(
        jobId
      )
    ) {
      return;
    }

    seenIds.push(
      jobId
    );

    localStorage.setItem(
      `agralyticx_farmer_seen_jobs_${farmerId}`,
      JSON.stringify(seenIds)
    );

    this.emit(
      `agralyticx_farmer_seen_jobs_${farmerId}`,
      seenIds
    );
  }

  // ============================================================
  // FARMER PERSONAL JOB REMOVAL
  // ============================================================

  public getDeletedFarmerJobIds(
    farmerId: string
  ): string[] {
    const raw =
      localStorage.getItem(
        `agralyticx_farmer_deleted_jobs_${farmerId}`
      );

    if (!raw) return [];

    try {
      const parsed =
        JSON.parse(raw);

      return Array.isArray(
        parsed
      )
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  public deleteFarmerJobForUser(
    farmerId: string,
    jobId: string
  ): void {
    const deletedIds =
      this.getDeletedFarmerJobIds(
        farmerId
      );

    if (
      !deletedIds.includes(
        jobId
      )
    ) {
      deletedIds.push(
        jobId
      );
    }

    localStorage.setItem(
      `agralyticx_farmer_deleted_jobs_${farmerId}`,
      JSON.stringify(
        deletedIds
      )
    );

    this.emit(
      `agralyticx_farmer_deleted_jobs_${farmerId}`,
      deletedIds
    );
  }

  // ============================================================
  // JOBS AVAILABLE TO FARMER
  // ============================================================

  public getJobsForFarmer(
    farmerId: string
  ): FarmerJob[] {
    const jobs =
      this.getAllFarmerJobs();

    const deletedIds =
      this.getDeletedFarmerJobIds(
        farmerId
      );

    return jobs
      .filter(
        (job) => {
          const status =
            String(
              job.status
            );

          return (
            status ===
              'Open' ||
            status ===
              'Closed'
          );
        }
      )
      .filter(
        (job) =>
          job.landownerId !==
          farmerId
      )
      .filter(
        (job) =>
          !deletedIds.includes(
            job.id
          )
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );
  }

  // ============================================================
  // JOB TRANSLATION CACHE
  // ============================================================

  public getFarmerJobTranslation(
    jobId: string,
    language: LanguageCode
  ): FarmerJobTranslatedContent | null {
    const job =
      this.getAllFarmerJobs().find(
        (item) =>
          item.id ===
          jobId
      );

    if (!job) return null;

    return (
      job.translatedContent?.[
        language
      ] || null
    );
  }

  public saveFarmerJobTranslation(
    jobId: string,
    language: LanguageCode,
    translation:
      FarmerJobTranslatedContent
  ): void {
    const all =
      this.getAllFarmerJobs();

    const job =
      all.find(
        (item) =>
          item.id ===
          jobId
      );

    if (!job) return;

    job.translatedContent =
      {
        ...(job.translatedContent ||
          {}),
        [language]:
          translation
      };

    localStorage.setItem(
      'agralyticx_farmer_jobs',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_farmer_jobs',
      all
    );
  }

  // ============================================================
  // TRANSPORT BOOKINGS
  // ============================================================

  public getAllTransportBookings():
    TransportBooking[] {
    const raw =
      localStorage.getItem(
        'agralyticx_transport_bookings'
      ) || '[]';

    try {
      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  public createTransportBooking(
    booking: TransportBooking
  ): void {
    const all =
      this.getAllTransportBookings();

    all.unshift(
      booking
    );

    localStorage.setItem(
      'agralyticx_transport_bookings',
      JSON.stringify(all)
    );

    this.emit(
      'agralyticx_transport_bookings',
      all
    );
  }

  public updateTransportStatus(
    bookingId: string,
    status:
      TransportBooking['status'],
    transporterId?: string,
    transporterName?: string
  ): void {
    const all =
      this.getAllTransportBookings();

    const b =
      all.find(
        (item) =>
          item.id ===
          bookingId
      );

    if (b) {
      b.status =
        status;

      if (transporterId) {
        b.assignedTransporterId =
          transporterId;
      }

      if (transporterName) {
        b.assignedTransporterName =
          transporterName;
      }

      localStorage.setItem(
        'agralyticx_transport_bookings',
        JSON.stringify(all)
      );

      this.emit(
        'agralyticx_transport_bookings',
        all
      );
    }
  }

  // ============================================================
  // COMMUNITY
  // ============================================================

  public getCommunityMessages(
    communityId: UserRole
  ): CommunityMessage[] {
    const raw =
      localStorage.getItem(
        `agralyticx_chat_${communityId}`
      );

    if (raw) {
      try {
        const parsed =
          JSON.parse(raw);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    }

    /*
     * No dummy community messages.
     */
    const initial:
      CommunityMessage[] = [];

    localStorage.setItem(
      `agralyticx_chat_${communityId}`,
      JSON.stringify(
        initial
      )
    );

    return initial;
  }

  public sendCommunityMessage(
    communityId: UserRole,
    sender: {
      id: string;
      name: string;
      role: UserRole;
    },
    text: string
  ): CommunityMessage {
    const current =
      this.getCommunityMessages(
        communityId
      );

    const msg:
      CommunityMessage = {
      id:
        'cm_' +
        Date.now() +
        '_' +
        Math.random()
          .toString(36)
          .substr(2, 5),

      communityId,

      senderId:
        sender.id,

      senderName:
        sender.name,

      senderRole:
        sender.role,

      text,

      createdAt:
        new Date().toISOString()
    };

    current.push(
      msg
    );

    localStorage.setItem(
      `agralyticx_chat_${communityId}`,
      JSON.stringify(
        current
      )
    );

    this.emit(
      `agralyticx_chat_${communityId}`,
      current
    );

    return msg;
  }

  public getCommunityMembers(
    communityId: UserRole
  ): CommunityMember[] {
    const allUsersRaw =
      localStorage.getItem(
        'agralyticx_all_users'
      ) || '[]';

    const allUsers:
      UserProfile[] =
      JSON.parse(
        allUsersRaw
      );

    const matching =
      allUsers.filter(
        (u) =>
          u.role ===
          communityId
      );

    return matching.map(
      (u) => ({
        userId:
          u.userId,
        name:
          u.name,
        role:
          u.role,
        joinedAt:
          u.createdAt,
        status:
          'online'
      })
    );
  }

  // ============================================================
  // CROP ANALYSIS HISTORY
  // ============================================================

  public getCropScanHistory(
    userId: string
  ): CropDiagnosisResult[] {
    const raw =
      localStorage.getItem(
        `agralyticx_scans_${userId}`
      ) || '[]';

    try {
      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  public saveCropScan(
    userId: string,
    scan: CropDiagnosisResult
  ): void {
    const history =
      this.getCropScanHistory(
        userId
      );

    history.unshift(
      scan
    );

    localStorage.setItem(
      `agralyticx_scans_${userId}`,
      JSON.stringify(
        history
      )
    );

    this.emit(
      `agralyticx_scans_${userId}`,
      history
    );
  }
}

export const db =
  new DatabaseService();