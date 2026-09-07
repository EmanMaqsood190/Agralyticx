const API_BASE = 'http://localhost:5000/api';

/*
|--------------------------------------------------------------------------
| FUNDING
|--------------------------------------------------------------------------
*/

export type FundingOption =
  | 'free'
  | 'stipend'
  | 'either'
  | 'both';

/*
|--------------------------------------------------------------------------
| STUDENT
|--------------------------------------------------------------------------
*/

export interface ResearchStudent {
  userId: string;

  name?: string;

  email?: string;
  workEmail?: string;
  phone?: string;

  university?: string;
  degree?: string;
  fieldOfStudy?: string;
  semester?: string;

  researchArea?: string;
  researchTopic?: string;
  projectTitle?: string;

  skills?: string[];

  researchInterests?: string | string[];

  researchNiches?: string[];

  customResearchNiche?: string;

  researchKeywords?: string[];

  fundingPreference?: FundingOption;

  description?: string;
  bio?: string;

  portfolioUrl?: string;

  availableForCollaboration?: boolean;

  createdAt?: string;
  updatedAt?: string;

  matchScore?: number;
}

/*
|--------------------------------------------------------------------------
| COMPANY
|--------------------------------------------------------------------------
*/

export interface ResearchCompany {
  userId: string;

  profileId?: string;

  companyName: string;

  email?: string;
  workEmail?: string;
  phone?: string;

  specialization?: string;
  industry?: string;

  city?: string;
  location?: string;

  description?: string;
  companyDescription?: string;

  currentNeeds?: string[];

  problemsChallenges?: string[];

  opportunities?: string[];

  researchNiches?: string[];

  customResearchNiche?: string;

  researchKeywords?: string[];

  researchTopic?: string;

  researchDescription?: string;

  researchOffer?: FundingOption;

  fundingOffer?: FundingOption;

  website?: string;

  services?: string[];

  products?: string[];

  createdAt?: string;
  updatedAt?: string;

  matchScore?: number;
}

/*
|--------------------------------------------------------------------------
| SEARCH FILTERS
|--------------------------------------------------------------------------
*/

export interface ResearchMatchFilters {
  keywords?: string[];

  funding?: FundingOption;

  specific?: string;

  topic?: string;

  keyword?: string;

  researchTopic?: string;
}

/*
|--------------------------------------------------------------------------
| HTTP REQUEST HELPER
|--------------------------------------------------------------------------
*/

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,

    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}.`
    );
  }

  return data as T;
}

/*
|--------------------------------------------------------------------------
| GET COMPANIES
|--------------------------------------------------------------------------
|
| Student → Find Companies
|
*/

export async function getCompanies(
  filters?: ResearchMatchFilters
): Promise<ResearchCompany[]> {
  const params = new URLSearchParams();

  if (filters?.keywords?.length) {
    params.set(
      'keywords',
      filters.keywords
        .filter(Boolean)
        .join(',')
    );
  }

  if (filters?.funding) {
    params.set(
      'funding',
      filters.funding
    );
  }

  if (filters?.specific?.trim()) {
    params.set(
      'specific',
      filters.specific.trim()
    );
  }

  if (filters?.topic?.trim()) {
    params.set(
      'topic',
      filters.topic.trim()
    );
  }

  if (filters?.keyword?.trim()) {
    params.set(
      'keyword',
      filters.keyword.trim()
    );
  }

  if (filters?.researchTopic?.trim()) {
    params.set(
      'researchTopic',
      filters.researchTopic.trim()
    );
  }

  const query = params.toString();

  const url =
    `${API_BASE}/companies` +
    (query ? `?${query}` : '');

  console.log(
    '[Research API] GET companies:',
    url
  );

  const result =
    await request<ResearchCompany[]>(url);

  console.log(
    '[Research API] Company results:',
    result
  );

  return Array.isArray(result)
    ? result
    : [];
}

/*
|--------------------------------------------------------------------------
| GET STUDENTS
|--------------------------------------------------------------------------
|
| Company → Find Researchers
|
| IMPORTANT:
|
| topic
| keyword
| researchTopic
| funding
|
| are sent separately so the backend can
| calculate the MongoDB match score correctly.
|
*/

export async function getStudents(
  filters?: ResearchMatchFilters
): Promise<ResearchStudent[]> {
  const params = new URLSearchParams();

  /*
  |--------------------------------------------------------------------------
  | TOPIC
  |--------------------------------------------------------------------------
  */

  if (filters?.topic?.trim()) {
    params.set(
      'topic',
      filters.topic.trim()
    );
  }

  /*
  |--------------------------------------------------------------------------
  | KEYWORD
  |--------------------------------------------------------------------------
  */

  if (filters?.keyword?.trim()) {
    params.set(
      'keyword',
      filters.keyword.trim()
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RESEARCH TOPIC
  |--------------------------------------------------------------------------
  */

  if (filters?.researchTopic?.trim()) {
    params.set(
      'researchTopic',
      filters.researchTopic.trim()
    );
  }

  /*
  |--------------------------------------------------------------------------
  | FUNDING
  |--------------------------------------------------------------------------
  */

  if (filters?.funding) {
    params.set(
      'funding',
      filters.funding
    );
  }

  /*
  |--------------------------------------------------------------------------
  | LEGACY KEYWORDS
  |--------------------------------------------------------------------------
  |
  | Kept so older parts of the website continue working.
  |
  */

  if (filters?.keywords?.length) {
    params.set(
      'keywords',
      filters.keywords
        .filter(Boolean)
        .join(',')
    );
  }

  /*
  |--------------------------------------------------------------------------
  | LEGACY SPECIFIC SEARCH
  |--------------------------------------------------------------------------
  */

  if (filters?.specific?.trim()) {
    params.set(
      'specific',
      filters.specific.trim()
    );
  }

  const query = params.toString();

  const url =
    `${API_BASE}/students` +
    (query ? `?${query}` : '');

  /*
  |--------------------------------------------------------------------------
  | DEBUG
  |--------------------------------------------------------------------------
  |
  | This lets us verify exactly what the Company page is
  | sending to the MongoDB matching route.
  |
  */

  console.log(
    '[Research API] GET students:',
    url
  );

  const result =
    await request<ResearchStudent[]>(url);

  console.log(
    '[Research API] Student match results:',
    result
  );

  /*
  |--------------------------------------------------------------------------
  | SAFETY
  |--------------------------------------------------------------------------
  */

  if (!Array.isArray(result)) {
    console.error(
      '[Research API] Expected an array of students but received:',
      result
    );

    return [];
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| GET MY STUDENT PROFILE
|--------------------------------------------------------------------------
*/

export async function getMyStudentProfile(
  userId: string
): Promise<ResearchStudent | null> {
  try {
    return await request<ResearchStudent>(
      `${API_BASE}/students/${encodeURIComponent(
        userId
      )}`
    );
  } catch (error) {
    console.error(
      '[Research API] Could not load student profile:',
      error
    );

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| SAVE STUDENT PROFILE
|--------------------------------------------------------------------------
*/

export async function saveStudentProfile(
  profile: ResearchStudent
): Promise<ResearchStudent> {
  return request<ResearchStudent>(
    `${API_BASE}/students`,
    {
      method: 'POST',

      body: JSON.stringify(profile)
    }
  );
}

/*
|--------------------------------------------------------------------------
| GET MY COMPANY PROFILES
|--------------------------------------------------------------------------
|
| A company can have multiple research profiles.
|
*/

export async function getMyCompanyProfiles(
  userId: string
): Promise<ResearchCompany[]> {
  try {
    const result =
      await request<ResearchCompany[]>(
        `${API_BASE}/companies/user/${encodeURIComponent(
          userId
        )}`
      );

    return Array.isArray(result)
      ? result
      : [];
  } catch (error) {
    console.error(
      '[Research API] Could not load company profiles:',
      error
    );

    return [];
  }
}

/*
|--------------------------------------------------------------------------
| GET MY COMPANY PROFILE
|--------------------------------------------------------------------------
|
| Kept for compatibility with older code.
|
| Returns the first company research profile.
|
*/

export async function getMyCompanyProfile(
  userId: string
): Promise<ResearchCompany | null> {
  try {
    const profiles =
      await getMyCompanyProfiles(userId);

    return profiles.length > 0
      ? profiles[0]
      : null;
  } catch {
    return null;
  }
}

/*
|--------------------------------------------------------------------------
| SAVE COMPANY PROFILE
|--------------------------------------------------------------------------
*/

export async function saveCompanyProfile(
  profile: ResearchCompany
): Promise<ResearchCompany> {
  return request<ResearchCompany>(
    `${API_BASE}/companies`,
    {
      method: 'POST',

      body: JSON.stringify(profile)
    }
  );
}

/*
|--------------------------------------------------------------------------
| UPDATE COMPANY PROFILE
|--------------------------------------------------------------------------
*/

export async function updateCompanyProfile(
  profileId: string,
  profile: Partial<ResearchCompany>
): Promise<ResearchCompany> {
  return request<ResearchCompany>(
    `${API_BASE}/companies/${encodeURIComponent(
      profileId
    )}`,
    {
      method: 'PUT',

      body: JSON.stringify(profile)
    }
  );
}

/*
|--------------------------------------------------------------------------
| DELETE COMPANY RESEARCH PROFILE
|--------------------------------------------------------------------------
|
| Deletes only one research profile.
| It does NOT delete the company account.
|
*/

export async function deleteCompanyProfile(
  profileId: string
): Promise<{
  success: boolean;
  message?: string;
}> {
  return request<{
    success: boolean;
    message?: string;
  }>(
    `${API_BASE}/companies/${encodeURIComponent(
      profileId
    )}`,
    {
      method: 'DELETE'
    }
  );
}

/*
|--------------------------------------------------------------------------
| SEND RESEARCH MESSAGE
|--------------------------------------------------------------------------
*/

export async function sendResearchMessage(
  conversationId: string,

  sender: {
    id: string;
    name: string;
    role: string;
  },

  recipient: {
    id: string;
    name: string;
    role: string;
  },

  text: string
) {
  return request<{
    success: boolean;
    error?: string;
    conversation?: unknown;
  }>(
    `${API_BASE}/conversations/message`,
    {
      method: 'POST',

      body: JSON.stringify({
        conversationId,
        sender,
        recipient,
        text,
        subject:
          'Agri Research Collaboration'
      })
    }
  );
}

/*
|--------------------------------------------------------------------------
| GET RESEARCH CONVERSATIONS
|--------------------------------------------------------------------------
*/

export async function getResearchConversations(
  userId: string
) {
  return request<any[]>(
    `${API_BASE}/conversations/user/${encodeURIComponent(
      userId
    )}`
  );
}
