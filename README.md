<div align="center">

# 🌾 AGRALYTICX

### *AI-powered agriculture, connected.*

Agralyticx is an AI-powered agricultural ecosystem that helps Pakistani farmers make better crop, market, finance, and logistics decisions through localized, voice-enabled assistance.

A digital guide and interconnected ecosystem for Pakistan's agriculture sector, built for the **Alibaba AI Cloud Hackathon**.

![Status](https://img.shields.io/badge/status-MVP-orange?style=for-the-badge)
![Roles](https://img.shields.io/badge/roles-5-2ea44f?style=for-the-badge)
![Languages](https://img.shields.io/badge/languages-EN%20%7C%20UR%20%7C%20PA-blueviolet?style=for-the-badge)
![Stack](https://img.shields.io/badge/stack-MERN%20%2B%20Gemini-1abc9c?style=for-the-badge)

</div>

---

## 🌱 The Problem

> Pakistan's agriculture sector doesn't lack technology. It lacks a **connection** between the technology, the knowledge to use it, and the people who need it.

Farmers today face:

| 🧩 Fragmentation | 📵 Digital Literacy Gap | 🔗 Middleman Dependency |
|:---:|:---:|:---:|
| One app for crops, one for weather, one for market prices, nothing talks to each other | Access to tech ≠ knowing how to use it | No alternatives means accepting whatever deal you're given |

The gap extends beyond farmers, **students** can't find real projects, **researchers** can't find collaborators, **landowners** have idle land, and **companies** can't discover agri-talent. Everyone's in the same ecosystem, operating alone.

<div align="center">

| 📈 23.5% | 👥 37%+ | 🌾 ~50% |
|:---:|:---:|:---:|
| of Pakistan's GDP comes from agriculture | of Pakistan's labour force works in agriculture | of employed labour depends on the sector |

*Source: Pakistan Economic Survey 2024–25 / Pakistan Bureau of Statistics*

</div>

> **"What if 8 out of 10 farmers went bankrupt this year, and nobody noticed?"**

---

## 🚜 The Solution

**Agralyticx** is a single, connected platform, not another single-purpose app.

```
Before Agralyticx                          With Agralyticx
─────────────────                          ────────────────
Limited access → limited knowledge         Accessible tech + guidance
      → dependency on middlemen      →           → better information
      → expensive inputs                          → direct connections
      → fewer choices                             → informed decisions
```

Farmers ask the AI what they need, or browse crop guidance directly, with **voice, visuals, and local-language support** meeting every literacy level.

### 🧑‍🌾 Five Connected Roles

<div align="center">

| 👨‍🌾 Farmer | 🚚 Transport Agent | 🏞️ Landowner | 🎓 Student/Researcher | 🏢 Investor/Company |
|:---:|:---:|:---:|:---:|:---:|
| Grow smarter | Move produce | Lease land | Publish research | Discover talent |

</div>

---

## ✨ Core Features

- 🌐 **Language Selection**, choose your preferred language at entry
- 🧭 **Built-in Platform Guide**, onboarding for first-time digital users
- 🔐 **Role-Based Access**, dedicated dashboards per role
- 📍 **Region-Based Agri Info**, currently Punjab & Sindh
- 🌿 **Crop Knowledge Library**, browsable issues (yellowing, pests, fungal symptoms) with guidance
- 🤖 **AI Agricultural Guide**, describe a problem in plain language, get guidance back, by text or voice
- 💰 **Budget Buddy**, production budgeting & affordable financing options
- 🏦 **Agricultural Finance Directory**, subsidies & bank loans farmers can browse and apply to
- 📊 **Mandi Rate Info**, real market-price visibility
- ⛈️ **Weather & Disaster Alerts**, timely, farming-relevant warnings
- 💬 **Agricultural Community**, role-specific spaces to connect and discuss

---

## 🛠️ Tech Stack

<div align="center">

![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js-3C873A?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-Role--Based-F7B93E?style=flat-square)
![Gemini](https://img.shields.io/badge/AI-Gemini%20API%20(Live)-4285F4?style=flat-square&logo=google&logoColor=white)
![Voice](https://img.shields.io/badge/Voice-STT%20%2F%20TTS%20(Live)-9C27B0?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20UR%20%7C%20PA-E91E63?style=flat-square)

</div>

The architecture is fully **modular**, auth, database, AI, speech, translation, and permissions all live as independent modules, so live services can be connected incrementally without restructuring the core experience.

**Built with:** Claude Sonnet 5, Claude Sonnet 4.6, ChatGPT, and Antigravity.

---

## 📍 Where We Are: MVP Status

> The MVP proves the **full product experience and role-based workflows** end-to-end, with a live backend and AI. Some external services still run on mock/demo data while their live integrations are completed.

<div align="center">

| ✅ Live Today | 🚧 On the Roadmap |
|:---|:---|
| UI/UX for all 5 roles | Real-time messaging & notifications |
| Backend & Database (Node.js + MongoDB) | Better transport-tracking map integration |
| AI Agricultural Guide (Gemini API) | Real datasets for Finance Directory |
| Voice Input/Output (STT/TTS) | Nationwide region expansion |
| Agricultural Finance Directory | |
| Weather & Map Integration | |
| Language selection & onboarding guide | |
| Crop knowledge library | |
| Community spaces (per role) | |
| Modular architecture, ready to connect | |

</div>

---

## 🗺️ Roadmap

- [ ] **Messaging & Notifications**, real-time, cross-role communication
- [ ] **Transport Tracking**, improved map integration to properly track goods in transit
- [ ] **Real Finance Data**, replace mock data in the Finance Directory with real subsidy/loan datasets
- [ ] **Testing & Refinement**, full QA across roles, auth, and features
- [ ] **Nationwide Expansion**, beyond Punjab & Sindh to all of Pakistan
- [ ] **Final Polish & Deployment**

---

---

## 🏗️ Architecture & System Workflow

<div align="center">

![Agralyticx System Architecture](assets/WhatsApp%20Image%202026-09-07%20at%2002.47.30.jpeg)

</div>

**Users / Roles** : Farmer, Transport Agent, Student/Researcher, Landowner, and Investor/Company each get a dedicated dashboard tailored to their needs (crop guidance, logistics, research/community, land listings, and partnership discovery, respectively).

**Frontend (Web Application)** : role-based dashboards, multilingual support (English, Urdu, Punjabi, Sindhi), voice + text + image interaction, and a fully responsive design.

**Backend Services (Node.js + Express)** : REST APIs split into Authentication & Authorization (JWT, role-based access), User Management, Agriculture Services (crop info, mandi rates, weather), Logistics Services (transport requests, live tracking, fuel rates), Community Services (forums, chat, notifications), and an AI Service Layer (Gemini API, agricultural assistant, smart recommendations).

**External Integrations** : Gemini API for generative AI, a Weather API for forecasts, TTS/STT for voice interaction, and other APIs for mandi and fuel rates.

**Database (MongoDB)** : flexible, scalable NoSQL storage for user data, crop & land data, transactions, community posts, and analytics.

**AI Layer (Gemini)** : powers crop & soil recommendations, disease detection from image/text, personalized farming advice, and multilingual support.

A high-level flow: **User (5 roles) → Frontend (React) → Backend (Node.js) → MongoDB + Gemini API → Response (text/voice, localized)**

---

## 🖼️ Screenshots

<div align="center">

## Screenshots
### Landing Page
![Agralyticx Screenshot 8](assets/Screenshot%202026-09-06%20215023.png)
### Languages
![Agralyticx Screenshot 7](assets/Screenshot%202026-09-06%20214935.png)
### Roles
![Agralyticx Screenshot 6](assets/Screenshot%202026-09-06%20214848.png)
### Screenshot 1
![Agralyticx Screenshot 1](assets/Screenshot%202026-09-06%20140806.png)

### Screenshot 2
![Agralyticx Screenshot 2](assets/Screenshot%202026-09-06%20141725.png)

### Screenshot 3
![Agralyticx Screenshot 3](assets/Screenshot%202026-09-06%20144806.png)

### Screenshot 4
![Agralyticx Screenshot 4](assets/Screenshot%202026-09-06%20145220.png)

### Screenshot 5
![Agralyticx Screenshot 5](assets/Screenshot%202026-09-06%20214738.png)

### Screenshot 6
![Agralyticx Screenshot 9](assets/Screenshot%202026-09-06%20215955.png)



</div>

---

## 🔑 Environment Variables

This repo is public, no real keys are committed. Create a `.env` file locally using this template:

```
GEMINI_API_KEY=
MONGODB_URI=
```


---

## 👥 Team

<div align="center">

**Team Agralyticx**

Amna Bibi · Eman Maqsood · Abeera Zainab

*Built for the Alibaba AI Cloud Hackathon* 🐫

</div>

---

<div align="center">

*"We built the future of agriculture. Now we're bringing the farmer in."*

</div>
