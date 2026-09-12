# ⚔️ LIFE RPG — Turn Mundane Tasks Into Heroic Conquests

> **Tech Zephyr 4.0 Hackathon Project**  
> *Transforming the "delayed gratification" of real-world productivity into an immediate, engaging, tactile RPG progression adventure backed by PostgreSQL.*

---

## 🌟 1. Overview & Problem Statement

Traditional habit trackers and to-do lists feel like chores due to the **delayed gratification problem**: reading books, going to the gym, or studying takes months to show tangible results. In contrast, RPG video games provide instant dopamine loops, clear progression, and tangible rewards.

**Life RPG** bridges this gap. Every workout, coding sprint, page read, and glass of water directly earns Experience Points (XP), levels up specific character attributes (Strength, Intellect, Vitality, Wisdom, Agility, Charisma), awards Gold & Gems, and unleashes strikes against a collaborative World Boss.

---

## 🏆 2. Hackathon Judging Criteria Alignment

| Criteria | Weight | How Life RPG Exceeds the Requirement |
| :--- | :---: | :--- |
| **Functionality & Execution** | **30%** | Complete end-to-end task lifecycle (CRUD), user auth, non-linear leveling engine, streak tracking, interactive armoury with item equipping, and boss raids. |
| **Technical Implementation** | **30%** | Fully decoupled architecture with **PostgreSQL 17**, Prisma ORM, Express.js with TypeScript, React 19, Vite, and server-side anti-cheat stat validation. |
| **UI / UX Design** | **15%** | Alive and tactile: procedural Web Audio synthesizer, canvas confetti fireworks, 6-axis SVG attribute radar chart, responsive mobile layout, and dark fantasy aesthetic. |
| **Innovation & Creativity** | **10%** | **Interactive World Boss Raid**: completing real-world tasks damages the "Procrastination Wyrm" with animated health bars and loot chests + zero-dependency Web Audio procedural sound engine. |
| **Adherence to Theme** | **10%** | Seamlessly cohesive terminology: Quests, Gold, Gems, Hero Classes, Armoury, Chronicles, and Stat Specializations. |
| **Equal Work Distribution** | **5%** | Modular full-stack division: Database/Prisma schema, Server controllers/security, RPG math engine, and Client UI components. |

---

## 🚀 3. Tech Stack

- **Database**: PostgreSQL 17 (Relational persistence with foreign keys, cascading deletes, transactions)
- **ORM**: Prisma Client v6 (Type-safe migrations, seeding, relational modeling)
- **Backend API**: Node.js, Express.js, TypeScript, JWT (JSON Web Tokens), bcryptjs, Helmet, Express Rate Limit
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Tactile Audio**: Custom Web Audio API procedural synthesizer (instant 8-bit sounds with zero external MP3 dependencies)

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
- Quests grant **Gold** and **Gems** based on difficulty tier (Trivial, Easy, Medium, Hard, Epic).
- Players buy weapons, armor, relics, and potions. Equipping items applies immediate bonus multipliers to character stats and boss strike damage.

### World Boss Raid System
- Active raid monster (*Ignis, the Procrastination Wyrm*) sits in the dungeon chamber.
- Completing real-world quests calculates damage based on quest XP, character strength, and equipped weapon multipliers.
- Slaying the boss yields massive gold bounties and the exclusive title: *"Wyrm Slayer"*.

---

## 🛠️ 5. Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) running locally or a cloud database (Render, Supabase, Neon)

### Option A: Local Run (Step-by-Step)

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd Life_RPG
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `server/.env`:
   ```bash
   cp .env.example server/.env
   ```
   Ensure `DATABASE_URL` matches your local PostgreSQL connection string (e.g. `postgresql://postgres:admin@localhost:5432/liferpg_db?schema=public`).

3. **Install Dependencies**:
   ```bash
   npm --prefix server install
   npm --prefix client install
   ```

4. **Initialize Database & Seed**:
   ```bash
   npm --prefix server run prisma:push
   npm --prefix server run seed
   ```

5. **Start Development Servers**:
   In two terminals (or concurrently):
   ```bash
   # Terminal 1: Backend API (Port 5000)
   npm run dev:server

   # Terminal 2: Frontend Web App (Port 5173)
   npm run dev:client
   ```
   Open **http://localhost:5173** in your browser.

### Option B: Docker Compose (For Evaluators)
```bash
docker-compose up -d
```

---

## 🔑 6. Evaluator Quick-Start Credentials

To evaluate the application instantly without manual signup:
- **Email**: `hero@zephyr.com`
- **Password**: `zephyr123`
*(Or click the "Autofill Evaluator Credentials" button directly on the login page!)*

---

## 🎬 7. Video Demonstration Script (90–180 Seconds)

1. **0:00 - 0:25 | Authentication & Hero Selection**:
   - Open app at `http://localhost:5173`.
   - Show instantaneous load (<400ms) with dark fantasy Ambient Embers.
   - Use the one-click demo login (`hero@zephyr.com` / `zephyr123`) or register with class selection (Warrior, Mage, Rogue, Paladin).
2. **0:25 - 0:55 | Command Center & Tactical Sidebar**:
   - Point out the dual-column Command Center layout: left side displays the active Quest Board; right side showcases the live World Boss Raid encounter and the equipped Paperdoll Loadout Card.
   - Use the **1-Click Quick-Add Bar** or press <kbd>N</kbd> to summon a task with dynamic bounties (+XP, +Gold, +Gems).
3. **0:55 - 1:25 | Tactile Feedback & Boss Strikes**:
   - Check off a quest: hear the procedural audio chime, watch the Floating Combat Text (`+XP`, `+Gold`, `⚔️ -Boss DMG`), and see the boss take screen-shake damage in real-time!
   - For habits, demonstrate the `+1 Rep` quick streak increment button.
   - Review the collapsible **Conquered Chronicles** accordion keeping the active board organized.
4. **1:25 - 1:55 | Armoury, Loadout Paperdoll & Character Sheet**:
   - Navigate to **"Armoury"** (<kbd>3</kbd>) or click the loadout card.
   - Buy and equip forged gear; watch the loadout card update immediately with weapon and armor badges.
   - Visit **"Character Sheet"** (<kbd>4</kbd>): demonstrate the 6-axis SVG attribute radar polygon, milestone progression roadmap, and active Title selector dropdown.
5. **1:55 - 2:20 | Proof of PostgreSQL 17 Persistence**:
   - Navigate to **"Chronicles"** (<kbd>5</kbd>) showing the audit activity log.
   - Perform a hard browser refresh (`Ctrl + F5` / `Cmd + R`).
   - Demonstrate that 100% of character stats, loadout gear, completed quests, and boss health remain strictly persisted in PostgreSQL 17.

---

## 🛡️ Disqualification Safeguards Verified

- ✅ **No fake localStorage persistence**: 100% of tasks, users, and attributes persist in PostgreSQL.
- ✅ **Clean commit history**: Initialized with chronological commits.
- ✅ **No runtime crashes**: Comprehensive try/catch boundaries, central error handler, and loading skeletons.
- ✅ **Responsive & Accessible**: Semantic HTML, ARIA labels, and keyboard navigation support.