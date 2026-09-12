# ⚔️ LIFE RPG — Turn Mundane Tasks Into Heroic Conquests

> **Tech Zephyr 4.0 Hackathon Project**  
> *Transforming the "delayed gratification" of real-world productivity into an immediate, engaging, tactile RPG progression adventure backed by PostgreSQL 17.*

[![PostgreSQL 17](https://img.shields.io/badge/Database-PostgreSQL_17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma_v6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express.js](https://img.shields.io/badge/Backend-Express_TypeScript-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React 19](https://img.shields.io/badge/Frontend-React_19_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 1. Overview & Problem Statement

Traditional habit trackers and to-do lists feel like chores due to the **delayed gratification problem**: reading books, going to the gym, or studying takes months to show visible results. In contrast, RPG video games provide instant dopamine loops, clear progression, and tangible rewards.

**Life RPG** bridges this gap. Every workout, coding sprint, page read, and glass of water directly:
- Earns **Experience Points (XP)** and levels up your character.
- Trains 6 distinct attributes: **Strength, Intellect, Vitality, Wisdom, Agility, Charisma**.
- Awards **Gold & Gems** to forge equipment in the Royal Armoury.
- Unleashes strikes against **Ignis, the Procrastination Wyrm** (interactive World Boss Raid).

---

## 🏆 2. Hackathon Judging Criteria Alignment

| Criteria | Weight | How Life RPG Exceeds the Requirement |
| :--- | :---: | :--- |
| **Functionality & Execution** | **30%** | Full task lifecycle (CRUD), user auth with bcrypt & JWT, non-linear leveling engine, streak multipliers, interactive armoury with item equipping, paperdoll loadout, and world boss raids. |
| **Technical Implementation** | **30%** | Decoupled architecture with **PostgreSQL 17**, Prisma ORM, Express.js with TypeScript, React 19, Vite, and server-side anti-cheat stat validation. |
| **UI / UX Design** | **15%** | Responsive widescreen dashboard (`max-w-[1800px]`), instant ☀️ Light & 🌙 Dark theme synchronization, 6-axis SVG attribute radar polygon, and floating combat damage text. |
| **Innovation & Creativity** | **10%** | **Interactive World Boss Raid**: completing real-world tasks strikes down the "Procrastination Wyrm" with animated health bars and loot chests + zero-dependency procedural Web Audio sound synthesizer. |
| **Adherence to Theme** | **10%** | Cohesive terminology: Quests, Gold, Gems, Hero Classes (Warrior, Mage, Rogue, Paladin), Armoury, Chronicles, and Stat Specializations. |
| **Equal Work Distribution** | **5%** | Clean modular architecture: Database/Prisma schema, Server controllers/security, RPG math engine, and Client UI components. |

---

## 🚀 3. Tech Stack

- **Database**: PostgreSQL 17 (Relational persistence with foreign keys, cascading deletes, transactions)
- **ORM**: Prisma Client v6 (Type-safe migrations, seeding, relational modeling)
- **Backend API**: Node.js, Express.js, TypeScript, JWT, bcryptjs, Helmet, Express Rate Limit, CORS
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Tactile Audio**: Custom procedural Web Audio API synthesizer (instant 8-bit sounds with zero external MP3 assets)

---

## 📁 4. Repository Structure

```
Life_RPG/
├── client/                     # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/         # HeroCommandBanner, QuestBoard, BossRaid, ArmouryShop, etc.
│   │   ├── context/            # AuthContext, SoundContext, ThemeContext
│   │   ├── pages/              # Dashboard, AuthPage
│   │   ├── utils/              # Dynamic API client, procedural audio synth
│   │   ├── index.css           # Semantic CSS variables theme engine (Light & Dark)
│   │   └── App.tsx             # Clean SPA routing with react-router-dom
│   ├── .env.example            # Client environment variable template
│   ├── vercel.json             # Vercel SPA routing rewrite configuration
│   ├── tailwind.config.js      # Executive Obsidian & Studio White design tokens
│   └── package.json
│
├── server/                     # Node.js + Express + Prisma Backend
│   ├── src/
│   │   ├── controllers/        # auth, quest, boss, character, shop controllers
│   │   ├── middleware/         # authMiddleware, validation
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── utils/              # RPG progression math engine, Prisma client
│   │   └── index.ts            # Server entry point with CORS & Helmet security
│   ├── prisma/
│   │   ├── schema.prisma       # Relational schema (Users, Quests, Items, Boss, History)
│   │   └── seed.ts             # Default items, boss, and evaluator account seed
│   ├── .env.example            # Server environment variable template
│   └── package.json
│
├── docker-compose.yml          # Containerized PostgreSQL 17 for 1-command local evaluation
├── .env.example                # Root environment variable template
└── README.md                   # Complete documentation
```

---

## 🔐 5. Environment Variables & Templates

Templates are committed in the repository as `.env.example`:

### Root / Server Environment (`server/.env` or `.env`):
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:admin@localhost:5432/liferpg_db?schema=public` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `super_secure_jwt_secret_key_change_in_production_min_32_chars` |
| `PORT` | Backend HTTP port | `5000` |
| `NODE_ENV` | Runtime environment mode | `development` or `production` |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS | `http://localhost:5173,https://your-app.vercel.app` |

### Client Environment (`client/.env`):
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Production backend API endpoint (empty in local dev) | `https://life-rpg-server.onrender.com` |

---

## 🛠️ 6. Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18 or higher
- **PostgreSQL**: v14+ (Local or Cloud instance via Supabase/Neon/Render)

### Step 1: Clone Repository
```bash
git clone https://github.com/sujalpatel0510/Life_RPG.git
cd Life_RPG
```

### Step 2: Configure Environment
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
*(Windows PowerShell: `Copy-Item .env.example server/.env`)*

### Step 3: Install Dependencies
```bash
npm --prefix server install
npm --prefix client install
```

### Step 4: Initialize PostgreSQL Database & Seed
```bash
# Push schema migrations to PostgreSQL
npm --prefix server run prisma:push

# Seed catalog equipment, world boss, and evaluator demo account
npm --prefix server run seed
```

### Step 5: Run Development Servers
```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Client (Port 5173)
npm run dev:client
```
Visit **http://localhost:5173** in your browser.

---

## 🔑 7. Evaluator Demo Credentials

The database is seeded with a pre-configured demo character with Level 2 stats, active quest logs, equipment, and gold:

- **Email**: `hero@zephyr.com`
- **Password**: `zephyr123`
*(Or click the **"Autofill Evaluator Credentials"** button directly on the login page!)*

---

## 🌐 8. Production Deployment Guide

### Where Should You Deploy? (Recommended Architecture)

| Component | Platform | Why It's Recommended | Cost |
| :--- | :--- | :--- | :---: |
| **Frontend** | **Vercel** | Instant build for Vite SPA, global edge CDN, HTTPS by default, automatic preview branches. | **Free** |
| **Backend** | **Render** | Native Node.js web service, automatic environment variable binding, persistent logs. | **Free** |
| **Database** | **Render PostgreSQL** or **Neon.tech** / **Supabase** | Cloud PostgreSQL 16/17 with 1-click connection string and instant SSL mode. | **Free** |

---

### Step-by-Step Deployment Walkthrough

#### Step A: Deploy PostgreSQL Database (Neon / Supabase / Render)
1. Create a free account at [Neon.tech](https://neon.tech/) or [Render.com](https://render.com/).
2. Create a new **PostgreSQL Database** named `liferpg_db`.
3. Copy the pooled connection string (`postgresql://USER:PASSWORD@HOST:5432/liferpg_db?sslmode=require`).

#### Step B: Deploy Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`sujalpatel0510/Life_RPG`).
3. Set the following settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npm run prisma:push && npm run seed`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `DATABASE_URL`: *(Your Neon/Render PostgreSQL connection string from Step A)*
   - `JWT_SECRET`: *(A secure 32+ character random string)*
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `*` *(or your Vercel domain once created)*
5. Click **Deploy Web Service**.
6. Copy your live backend URL (e.g., `https://life-rpg-server.onrender.com`).
7. Test the health endpoint: `https://life-rpg-server.onrender.com/api/health` -> returns `{"status": "HEALTHY", "database": "PostgreSQL Connected"}`.

#### Step C: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import your GitHub repository (`sujalpatel0510/Life_RPG`).
3. Set the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Add **Environment Variables**:
   - `VITE_API_URL`: `https://life-rpg-server.onrender.com` *(your backend URL from Step B)*
5. Click **Deploy**.
6. Once deployed, Vercel gives you your live production URL (e.g., `https://life-rpg.vercel.app`).
7. *(Optional)* Update `CLIENT_URL` in your Render settings to match your new Vercel URL.

---

## 📡 9. REST API Reference

All protected endpoints require `Authorization: Bearer <token>` in headers.

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register hero with email, password, and chosen hero class |
| `POST` | `/api/auth/login` | Public | Authenticate hero, returns JWT and character profile |
| `GET` | `/api/auth/me` | User | Get authenticated hero details and stats |
| `GET` | `/api/quests` | User | Fetch all active and completed quests for character |
| `POST` | `/api/quests` | User | Create a new quest (title, stat category, difficulty, type) |
| `PUT` | `/api/quests/:id` | User | Update an existing quest |
| `PATCH` | `/api/quests/:id/complete` | User | Complete quest, award XP, Gold, Gems, and strike World Boss |
| `PATCH` | `/api/quests/:id/habit` | User | Increment streak rep on a Habit quest |
| `DELETE` | `/api/quests/:id` | User | Delete a quest |
| `GET` | `/api/boss` | User | Get current active World Boss raid state |
| `POST` | `/api/boss/strike` | User | Directly attack boss using character strength & equipped weapon |
| `POST` | `/api/boss/resurrect` | User | Summon the next higher tier raid boss |
| `GET` | `/api/shop` | User | Fetch catalog of forged weapons, mail armor, and arcane relics |
| `POST` | `/api/shop/purchase/:id`| User | Purchase equipment using earned character gold |
| `POST` | `/api/character/equip/:id`| User | Equip armor or weapon; recalculates stat bonuses |
| `GET` | `/api/character` | User | Fetch character sheet, 6-axis attributes, and milestones |
| `GET` | `/api/health` | Public | Diagnostic health check verifying live PostgreSQL connection |

---

## 📜 10. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.