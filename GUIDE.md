# Agralyticx — Setup & Contributor Guide

This is the technical setup and contributor guide for the current Agralyticx repository.

For the project pitch, problem statement, feature overview, MVP status, roadmap, and team credits, see [`README.md`](./README.md).

Agralyticx is a React/TypeScript web application backed by an Express/Node.js API and MongoDB. The repository also contains the agricultural AI service, crop-image analysis flow, browser speech input/output, role-based dashboards, community features, finance/market features, and logistics-related modules.

---

## 1. Current repository structure

The current GitHub repository keeps the frontend and backend source files at the repository root rather than in separate `ai/` and `server/` directories.

```text
Agralyticx/
├── assets/                     # Images and visual assets
│
├── App.tsx                     # Main React application
├── main.tsx                    # React entry point
├── App.css
├── index.css
├── index.html
│
├── AiAssistant.tsx             # AI assistant UI
├── ai.ts                       # Frontend AI service
├── ai.js                       # Backend AI routes/service
├── speech.ts                   # Browser speech input/output
│
├── AuthContext.tsx
├── LanguageContext.tsx
├── translations.ts
├── ProtectedRoute.tsx
│
├── FarmerDashboard.tsx
├── LandownerHub.tsx
├── TransportDashboard.tsx
├── StudentDashboard.tsx
├── CompanyDashboard.tsx
├── CommunityChat.tsx
├── FinanceDirectory.tsx
├── MarketRates.tsx
├── WeatherPage.tsx
├── CropScan.tsx
└── ...                         # Other role-specific pages/components
│
├── index.js                    # Express backend entry point
├── db.js                       # MongoDB connection
├── auth.js
├── companies.js
├── students.js
├── community.js
├── conversations.js
├── cropScans.js
├── farmData.js
├── farmerJobs.js
├── landRecords.js
├── students.js
├── ...                         # Other backend models/routes
│
├── build_all.cjs               # Build/generation utilities
├── build_*.cjs                 # Additional build utilities
│
├── package.json
├── package-lock.json
├── .gitignore
├── .oxlintrc.json
├── README.md
└── GUIDE.md
```

The repository is currently organized as a single root-level codebase. Do not use the older `ai/` + `server/` folder instructions from previous versions of this guide.

---

## 2. Technology stack

### Frontend

- React
- TypeScript
- Vite-based frontend structure
- React components and role-specific dashboards

### Backend

- Node.js
- Express
- CommonJS modules
- REST API routes

### Database

- MongoDB
- Mongoose

### AI

- Google Gemini API
- The backend exposes:
  - `POST /api/ai/ask`
  - `POST /api/ai/analyze-image`

The AI route currently uses `GOOGLE_API_KEY` to call Google's Generative Language API.

### Voice

Agralyticx uses browser-native Web Speech APIs:

- `SpeechRecognition` / `webkitSpeechRecognition` for speech-to-text
- `SpeechSynthesis` / `SpeechSynthesisUtterance` for text-to-speech

The implementation supports the application's English, Urdu, and Pothwari/Punjabi language codes.

### Other integrations

The application includes weather and map functionality as described in the project README. Keep the exact provider/configuration documentation synchronized with the implementation whenever those integrations are changed.

---

## 3. Prerequisites

Install the following before running the project locally:

- Node.js
- npm
- MongoDB access (local MongoDB or a hosted MongoDB deployment)
- A Google/Gemini API key for the AI features

The backend `package.json` currently uses:

- Express
- Mongoose
- dotenv
- CORS
- bcrypt
- nodemon

The repository's package configuration currently defines the development server as `nodemon index.js`.

---

## 4. Environment variables

The backend loads environment variables through `dotenv`.

### Required

Create a local `.env` file in the repository root:

```env
MONGODB_URI=
GOOGLE_API_KEY=
```

### Optional

```env
PORT=5000
```

If `PORT` is not provided, the backend defaults to port `5000`.

### Important

Never commit the real `.env` file or any credentials.

Commit only a safe environment template such as:

```env
MONGODB_URI=
GOOGLE_API_KEY=
PORT=5000
```

Do not put actual API keys, database credentials, passwords, tokens, or private user information in GitHub.

---

## 5. Installation

Clone the repository:

```bash
git clone https://github.com/EmanMaqsood190/Agralyticx.git
cd Agralyticx
```

Install the repository dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

If the repository does not yet contain `.env.example`, create it from the safe template in Section 4 before asking another contributor to run the project.

Then add your real local values to `.env`.

---

## 6. Running the backend

The Express server starts from:

```text
index.js
```

Run:

```bash
npm run dev
```

The development script uses:

```text
nodemon index.js
```

The backend defaults to:

```text
http://localhost:5000
```

A health-check endpoint is available at:

```text
GET /api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

The server connects to MongoDB using `MONGODB_URI`.

---

## 7. Backend API structure

The current Express entry point registers API routes for:

```text
/api/users
/api/farm-data
/api/students
/api/companies
/api/conversations
/api/land-records
/api/farmer-jobs
/api/transport-bookings
/api/community
/api/crop-scans
/api/auth
/api/ai
```

The exact route implementation should be treated as the source of truth when adding or modifying features.

---

## 8. AI Agricultural Guide

Agralyticx provides two main AI interactions.

### Text/voice agricultural questions

Frontend:

```text
ai.ts
```

Backend:

```text
ai.js
```

Endpoint:

```text
POST /api/ai/ask
```

Request structure:

```json
{
  "question": "How should I manage this crop problem?",
  "language": "en"
}
```

Supported language codes used by the AI service include:

```text
en
ur
pa
```

The backend sends the request to the Google Generative Language API using `GOOGLE_API_KEY`.

The AI prompt is designed for agricultural assistance in Pakistan and instructs the model to respond in the selected language using concise, practical guidance.

### Crop image analysis

Endpoint:

```text
POST /api/ai/analyze-image
```

The frontend sends an image data URL together with the selected language.

The AI service returns crop-analysis information used by the crop-scan interface.

---

## 9. Voice interaction

Voice functionality is implemented in:

```text
speech.ts
```

Speech recognition uses:

```text
window.SpeechRecognition
window.webkitSpeechRecognition
```

Text-to-speech uses:

```text
window.speechSynthesis
SpeechSynthesisUtterance
```

The implementation maps the application's language codes to browser speech languages.

If speech recognition is unavailable, the application provides an error message and users can continue by typing.

Browser microphone permission may be required.

---

## 10. Authentication and roles

The application contains role-based experiences for:

- Farmer
- Transport Agent
- Landowner
- Student/Researcher
- Company/Investor

Authentication and protected access are handled through the existing authentication context and protected-route components.

Relevant frontend files include:

```text
AuthContext.tsx
ProtectedRoute.tsx
SignIn.tsx
SignUp.tsx
RoleSelection.tsx
ProfileSettings.tsx
```

Role-specific dashboards include:

```text
FarmerDashboard.tsx
TransportDashboard.tsx
LandownerHub.tsx
StudentDashboard.tsx
CompanyDashboard.tsx
```

---

## 11. MongoDB

MongoDB is connected through:

```text
db.js
```

The connection uses:

```text
process.env.MONGODB_URI
```

The backend contains MongoDB/Mongoose models for areas including:

- Users
- Farm data
- Students
- Companies
- Conversations
- Land records
- Farmer jobs
- Transport bookings
- Community data
- Crop scans

If MongoDB cannot be reached, verify:

1. `MONGODB_URI` is correct.
2. The MongoDB server/cluster is running.
3. Network access is allowed.
4. Credentials are valid.

---

## 12. Student/Researcher ↔ Company contact flow

The repository contains dedicated student/research and company interfaces.

The frontend includes:

```text
StudentDirectory.tsx
StudentRepository.tsx
CompanyDirectory.tsx
CompanyDashboard.tsx
```

These features use backend API routes to retrieve the relevant records.

Where email contact is available, the UI can open a Gmail compose window for direct contact.

---

## 13. Development workflow

Before committing changes:

### Check the frontend/build

Use the project's available build tooling and confirm the application compiles successfully.

### Run linting

The repository includes:

```text
.oxlintrc.json
```

and uses Oxlint-related tooling.

### Check the backend

Start the backend with:

```bash
npm run dev
```

Then verify:

```text
GET /api/health
```

returns:

```json
{
  "status": "ok"
}
```

### Check secrets

Before pushing to GitHub, make sure there are no:

- API keys
- `.env` files
- MongoDB credentials
- authentication secrets
- tokens
- passwords
- private user data

---

## 14. Git workflow

Keep environment secrets local.

Good:

```text
.env.example
```

Bad:

```text
.env
```

If you add a new environment variable:

1. Add its name to `.env.example`.
2. Never add the real value.
3. Update this guide if the variable is required.
4. Update the README if contributors need to know about it.

Use short, descriptive commit messages, for example:

```text
Add crop image analysis flow
Fix Urdu AI response handling
Add farmer transport booking API
Update contributor guide
```

---

## 15. Troubleshooting

| Problem | Likely cause | What to check |
|---|---|---|
| `MongooseError` / MongoDB connection failure | Invalid or unreachable MongoDB connection | Check `MONGODB_URI` and MongoDB network access |
| AI request fails | Missing/invalid Google API key | Check `GOOGLE_API_KEY` |
| Backend does not start | Missing dependency or environment configuration | Run `npm install` and check `.env` |
| Port already in use | Another process is using port 5000 | Set another `PORT` value or stop the existing process |
| Frontend cannot reach API | Backend is not running or API URL is incorrect | Start the backend and verify its port |
| Voice input unavailable | Browser does not support the required speech API or microphone permission is blocked | Try a supported browser and allow microphone access |
| Crop image analysis fails | Backend/AI service unavailable or invalid image payload | Check backend logs and AI configuration |

---

## 16. Security checklist

Before pushing to the public repository:

- [ ] `.env` is not committed
- [ ] No API keys are present in source files
- [ ] No MongoDB passwords are present
- [ ] No authentication secrets are exposed
- [ ] No private user information is committed
- [ ] `.env.example` contains placeholders only
- [ ] Any previously exposed credentials have been revoked/rotated
- [ ] README environment-variable instructions match the actual code

---

## 17. Documentation source of truth

Keep these files synchronized:

```text
README.md
GUIDE.md
package.json
.env.example
```

When the implementation changes, update the relevant documentation rather than leaving old setup instructions in place.

For the project pitch, feature summary, MVP status, roadmap, screenshots, and team information, refer to [`README.md`](./README.md).
