# ⚔️ LIFE RPG — Turn Mundane Tasks Into Heroic Conquests

> **Tech Zephyr 4.0 Hackathon Project**  
> *Transforming the "delayed gratification" of real-world productivity into an immediate, engaging, tactile RPG progression adventure backed by PostgreSQL 17.*

[![Live Web Application](https://img.shields.io/badge/🌐_Live_Demo-life--rpg--weld.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://life-rpg-weld.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-sujalpatel0510%2FLife__RPG-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sujalpatel0510/Life_RPG)
[![PostgreSQL 17](https://img.shields.io/badge/Database-PostgreSQL_17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma_v6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express.js](https://img.shields.io/badge/Backend-Express_TypeScript-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React 19](https://img.shields.io/badge/Frontend-React_19_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🔗 Live URLs & Quick Access

| Resource | URL | Status |
| :--- | :--- | :---: |
| **Live Web App (Frontend)** | **[https://life-rpg-weld.vercel.app](https://life-rpg-weld.vercel.app)** | 🟢 Online |
| **Public GitHub Repository** | **[https://github.com/sujalpatel0510/Life_RPG](https://github.com/sujalpatel0510/Life_RPG)** | 🟢 Public |
| **Evaluator Account** | `hero@zephyr.com` / `zephyr123` *(or click "Autofill" on Login)* | 🟢 Seeded |

---

## 🌟 1. Overview & Problem Statement

Traditional habit trackers and to-do lists feel like chores due to the **delayed gratification problem**: reading books, going to the gym, or studying takes months to show tangible results. In contrast, RPG video games provide instant dopamine loops, clear progression, and tangible rewards.

**Life RPG** bridges this gap. Every workout, coding sprint, page read, and glass of water directly:
- **Earns Experience Points (XP)** and levels up your character.
- **Trains 6 Core Attributes**: **Strength**, **Intellect**, **Vitality**, **Wisdom**, **Agility**, and **Charisma**.
- **Awards Gold & Gems** to forge weapons, armor, and arcane relics in the Royal Armoury.
- **Strikes the Collaborative World Boss**: completing real-world tasks damages *Ignis, the Procrastination Wyrm* with screen shakes, floating combat text, and animated loot chests.
- **Synchronizes with PostgreSQL 17**: zero fake localStorage persistence; 100% of character states, transactions, equipped gear, and history logs are securely stored in a relational database.

---

## 🏆 2. Hackathon Rubric Alignment

| Criteria | Weight | How Life RPG Exceeds the Requirement |
| :--- | :---: | :--- |
| **Functionality & Execution** | **30%** | Full task lifecycle (CRUD), user auth with bcrypt & JWT, non-linear leveling engine, streak multipliers, interactive armoury with item equipping, paperdoll loadout, and world boss raids. |
| **Technical Implementation** | **30%** | Fully decoupled architecture with **PostgreSQL 17**, Prisma ORM, Express.js with TypeScript, React 19, Vite, and server-side anti-cheat stat validation. |
| **UI / UX Design** | **15%** | Responsive widescreen dashboard (`max-w-[1800px]`), instant ☀️ Light & 🌙 Dark theme synchronization via CSS variables, 6-axis SVG attribute radar polygon, and tactile animations. |
| **Innovation & Creativity** | **10%** | **Interactive World Boss Raid**: completing real-world tasks strikes down the "Procrastination Wyrm" with animated health bars and loot chests + zero-dependency procedural Web Audio sound synthesizer. |
| **Adherence to Theme** | **10%** | Seamlessly cohesive RPG terminology: Quests, Gold, Gems, Hero Classes (Warrior, Mage, Rogue, Paladin), Armoury, Chronicles, and Stat Specializations. |
| **Equal Work Distribution** | **5%** | Modular full-stack division: Database/Prisma schema, Server controllers/security, RPG math engine, and Client UI components. |

---

## 🚀 3. Tech Stack Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React 19 SPA)                    │
│   Vite • TypeScript • Tailwind CSS • Lucide • Canvas Confetti│
│  Dual-Pill Theme Engine (Studio White / Executive Obsidian) │
│       Procedural Web Audio Synthesizer (Zero MP3 Assets)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    BACKEND (Node.js API)                    │
│      Express.js • TypeScript • JWT Auth • bcryptjs Security │
│        Helmet Headers • Rate Limiting • CORS Protection     │
│             RPG Formula Engine (Math & Anti-Cheat)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ Type-Safe Queries
┌──────────────────────────────▼──────────────────────────────┐
│                  DATABASE (PostgreSQL 17)                   │
│         Prisma ORM v6 • Relational Tables with FKs          │
│       Users • Characters • Quests • Items • Boss • Logs      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 4. Core RPG Game Mechanics

### Non-Linear Leveling Curve
To prevent trivial grinding, each subsequent level requires strictly more XP than the last:
$$\text{XP Required}(L) = \lfloor 100 \times L^{1.5} \rfloor$$
- **Level 1**: 100 XP
- **Level 2**: 282 XP
- **Level 3**: 519 XP
- **Level 4**: 800 XP
- **Level 5**: 1,118 XP

### Six Core Attributes
1. **Strength (STR)**: Physical fitness, gym workouts, resistance training.
2. **Intellect (INT)**: Coding sprints, system design study, technical tasks.
3. **Vitality (VIT)**: Sleep hygiene, hydration, nutrition, and max health pool.
4. **Wisdom (WIS)**: Book reading, mindfulness, philosophy, reflection.
5. **Agility (AGI)**: Punctuality, time-blocking, habit streaks.
6. **Charisma (CHA)**: Networking, team collaboration, presentations.

### Economy & The Royal Armoury
- Quests grant **Gold** and **Gems** based on difficulty tier (*Trivial, Easy, Medium, Hard, Epic*).
- Players buy weapons, armor, relics, and potions. Equipping items applies immediate bonus multipliers to character stats and boss strike damage.

### World Boss Raid System
- Active raid monster (*Ignis, the Procrastination Wyrm*) sits in the dungeon chamber.
- Completing real-world quests calculates damage based on quest XP, character strength, and equipped weapon multipliers.
- Slaying the boss yields massive gold bounties and the exclusive title: *"Wyrm Slayer"*.

---

## 📁 5. Repository Structure

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
└── README.md                   # Comprehensive project documentation
```

---

## 🔐 6. Environment Variables & Templates

Templates are committed in the repository as `.env.example`:

### Root / Server Environment (`server/.env` or `.env`):
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:admin@localhost:5432/liferpg_db?schema=public` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `super_secure_jwt_secret_key_change_in_production_min_32_chars` |
| `PORT` | Backend HTTP port | `5000` |
| `NODE_ENV` | Runtime environment mode | `development` or `production` |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS | `http://localhost:5173,https://life-rpg-weld.vercel.app` |

### Client Environment (`client/.env`):
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Production backend API endpoint (empty in local dev) | `https://life-rpg-server.onrender.com` |

---

## 🛠️ 7. Quick Start & Local Setup

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
Open **http://localhost:5173** in your browser.

---

## 🐳 8. Docker Compose (One-Command Evaluation)

For evaluators wanting to run a clean local PostgreSQL 17 database in Docker:
```bash
# Launch PostgreSQL 17 container
docker-compose up -d

# Migrate & Seed
npm --prefix server run prisma:push
npm --prefix server run seed

# Run app
npm run dev:server
npm run dev:client
```

---

## 🔑 9. Evaluator Demo Credentials

The database is seeded with a pre-configured demo character with Level 2 stats, active quest logs, equipment, and gold:

- **Email**: `hero@zephyr.com`
- **Password**: `zephyr123`
*(Or click the **"Autofill Evaluator Credentials"** button directly on the login page!)*

---

## 📡 10. REST API Reference

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

## 🎬 11. Evaluator Video Demonstration Script (90–180 Seconds)

1. **0:00 - 0:25 | Authentication & Hero Selection**:
   - Open app at **[https://life-rpg-weld.vercel.app](https://life-rpg-weld.vercel.app)**.
   - Show instantaneous load with dark fantasy Ambient Embers.
   - Use the one-click demo login (`hero@zephyr.com` / `zephyr123`) or register with class selection (Warrior, Mage, Rogue, Paladin).
2. **0:25 - 0:50 | Command Center & Dual-Theme Switcher**:
   - Point out the widescreen Command Center layout (`max-w-[1800px]`): left side displays the active Quest Board; right side showcases the live World Boss Raid encounter and the equipped Paperdoll Loadout Card.
   - Toggle theme using the top-right dual-pill (☀️ Light / 🌙 Dark or press <kbd>T</kbd>): observe instant, zero-lag synchronization across all cards and text.
3. **0:50 - 1:20 | Tactile Feedback & Boss Strikes**:
   - Use the **1-Click Quick-Add Bar** or press <kbd>N</kbd> to summon a task with dynamic bounties (+XP, +Gold, +Gems).
   - Check off a quest: hear the procedural audio chime, watch the Floating Combat Text (`+XP`, `+Gold`, `⚔️ -Boss DMG`), and see the boss take screen-shake damage in real-time!
   - Review the collapsible **Conquered Chronicles** accordion keeping the active board organized.
4. **1:20 - 1:45 | Armoury, Loadout Paperdoll & Character Sheet**:
   - Navigate to **"Armoury"** (<kbd>3</kbd>) or click the loadout card.
   - Buy and equip forged gear; watch the loadout card update immediately with weapon and armor badges.
   - Visit **"Character Sheet"** (<kbd>4</kbd>): demonstrate the 6-axis SVG attribute radar polygon, milestone progression roadmap, and active Title selector dropdown.
5. **1:45 - 2:10 | Proof of PostgreSQL 17 Persistence**:
   - Navigate to **"Chronicles"** (<kbd>5</kbd>) showing the audit activity log.
   - Perform a hard browser refresh (`Ctrl + F5` / `Cmd + R`).
   - Demonstrate that 100% of character stats, loadout gear, completed quests, and boss health remain strictly persisted in PostgreSQL 17.

---

## 🛡️ 12. Security & Anti-Cheat Safeguards

- ✅ **Server-Side Stat Validation**: All XP calculations, level thresholds, and damage calculations are enforced by the Node.js backend to prevent client tampering.
- ✅ **Relational Foreign Key Integrity**: Cascading deletes and relation constraints prevent orphaned quests or duplicate inventories.
- ✅ **Bcrypt Password Hashing**: Salt rounds of 10 applied to all passwords prior to storage.
- ✅ **Rate Limiting & Helmet Headers**: Protection against brute-force attacks on authentication endpoints.
- ✅ **No Fake LocalStorage Persistence**: All player attributes, inventory, and completed quests live in PostgreSQL.

---

## 📜 13. License

This project is open-source and available under the [MIT License](LICENSE).