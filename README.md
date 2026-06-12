# CollabSphere | Enterprise Knowledge Sharing & Expert Discovery Platform

CollabSphere is a peer-to-peer knowledge management system and expertise discovery ecosystem built as a Development Assessment MVP. It helps service industry organizations unlock siloed institutional knowledge, connect employees across multiple office branches, ask/answer operational questions, and reward continuous learning.

---

## 🚀 Key Features

### Employee Portal
1. **User Authentication & Profiles**:
   - Personalized profiles showing bio, department, branch location, core skills, points tally, and badges.
   - Dynamic avatar customizer using Dicebear identicons.
2. **Knowledge Feed**:
   - Create and share success stories, best practices, lessons learned, and documents/web links.
   - Like posts and reply to discussions with interactive comments.
   - Pinned posts (by admins) remain at the top of the feed.
3. **Discussion Q&A Forum**:
   - Ask technical/operational questions to the community with tags (e.g., `#MongoDB`, `#PHP`, `#Refunds`).
   - Upvote helpful threads.
   - Accept/Mark the "Best Answer" (restricted to the question author).
4. **Expert Discovery**:
   - Interactive search directory to identify subject matter experts by skill tag or name.
   - Filter employees by Department or Branch location.
   - Modal details view displaying their points scorecard, bio, and all published playbooks.
5. **Interest Circles (Communities)**:
   - Dedicated workspace circles (e.g., *Tech Pioneers*, *Customer Success Champions*).
   - Join/leave circles and filter knowledge feeds to see only circle-specific playbooks.
6. **Learning Library**:
   - Central repository for templates, PDF guides, presentations, and instruction videos.
   - Tracks download metrics and awards points to contributors who upload documents.
7. **Gamification & Rewards**:
   - Contributor points system: Share post (+10 pts), Ask question (+5 pts), Reply/Answer (+5 pts), Accept best answer (+20 pts to answerer), Comment (+2 pts).
   - Automatically unlocks digital badges: *Initiate Contributor*, *Knowledge Champion*, *Top Mentor*, and *Intellectual Guru*.
   - Standings leaderboard highlighting the top 3 on a podium.

### Admin Command Center
- **System Analytics**: Card statistics (counts of employees, posts, questions, communities) and SVG bar charts illustrating branch engagement, department size, and top skills.
- **User Management Database**: Complete list of all accounts. Admins can toggle account status between **Active** and **Suspended**, or promote employees to Admins.
- **Content Moderation Logs**: Control panel listing all feed posts, enabling admins to pin important announcements or delete inappropriate content.

---

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js, JWT Auth, Mongoose
- **Database**: MongoDB (via Mongoose)
- **Deployment-Ready**: Dynamic dual-mode client database fallback. If the backend server is unreachable, CollabSphere switches to an offline interactive sandbox mode powered by `localStorage` with pre-seeded data, ensuring 100% up-time.

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally (default URI: `mongodb://127.0.0.1:27017/knowledge_sharing`)

### Step 1: Clone and Install Dependencies
In the root directory, install the dependencies for all directories:
```bash
npm run install:all
```
*This installs root dependencies (`concurrently`), backend dependencies (`express`, `mongoose`, `jsonwebtoken`, etc.), and frontend dependencies (`lucide-react`, `tailwindcss`, etc.).*

### Step 2: Configure Environment Variables
Inside the `backend/` directory, an `.env` file has been created:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/knowledge_sharing
JWT_SECRET=supersecretjwtkeyforcompanyportal
```

### Step 3: Seed the Database
Seed MongoDB with realistic mock data (employees, communities, Q&As, and posts):
```bash
npm run seed
```

### Step 4: Run the Application Locally
Launch both the Express backend server and the Vite React frontend server concurrently:
```bash
npm run dev
```
- Frontend will open at: **http://localhost:5173**
- Backend will run at: **http://localhost:5000**

---

## 🔑 Demo Login Credentials

You can use the quick login cards on the login screen or enter the following accounts manually:

### 🧑‍💼 Employee Account (Primary Demo)
- **Email**: `employee@test.com`
- **Password**: `password123`
- **Role**: Employee (Ayan Mondal - Kolkata Branch)

### 🛡️ HR Admin Account
- **Email**: `admin@test.com`
- **Password**: `password123`
- **Role**: Portal Administrator (Super Admin)

---

## 📂 Project Structure
```text
collabsphere/
├── backend/
│   ├── middleware/
│   │   └── auth.js         # JWT Authentication & Admin protection
│   ├── models/
│   │   ├── User.js         # Employee Schema (points, skills, branch, status)
│   │   ├── Post.js         # Knowledge Feed Schema
│   │   ├── Question.js     # Forum Q&A Schema
│   │   ├── Community.js    # Interest Circle Schema
│   │   └── Resource.js     # Learning Library Schema
│   ├── routes/
│   │   ├── authRoutes.js   # Registration, Login, Expert search
│   │   ├── postRoutes.js   # Feed publishing, Comments, Likes
│   │   ├── questionRoutes.js# Q&A upvoting, Best Answer
│   │   ├── communityRoutes.js# Group memberships
│   │   ├── resourceRoutes.js# Learning materials download
│   │   └── adminRoutes.js  # Dashboard aggregations & moderations
│   ├── utils/
│   │   └── gamification.js # Point allocation & Badge awards logic
│   ├── .env                # Env variables
│   ├── seed.js             # Data seeder
│   └── server.js           # Server boot
├── frontend/
│   ├── src/
│   │   ├── components/     # Modular UI View Panels
│   │   │   ├── Sidebar.jsx # Navigation panel
│   │   │   ├── Navbar.jsx  # Page headers & Health indicator
│   │   │   ├── LoginView.jsx# Forms & Quick Login buttons
│   │   │   ├── FeedView.jsx # Story publishing, comments
│   │   │   ├── DiscoveryView.jsx# Search skills, details modal
│   │   │   ├── QAView.jsx   # Upvoting, Selecting solved replies
│   │   │   ├── CommunitiesView.jsx# Circular directories
│   │   │   ├── LibraryView.jsx# Download library
│   │   │   ├── LeaderboardView.jsx# Crown rankings
│   │   │   ├── AdminView.jsx# Engagement bar charts
│   │   │   └── ProfileView.jsx# Custom Dicebear avatar seed editor
│   │   ├── mockData.js     # Standalone local datasets
│   │   ├── App.jsx         # State coordinator & Offline-fallback sync
│   │   ├── index.css       # Styles & Glassmorphic variables
│   │   └── main.jsx        # App entry point
│   ├── index.html          # Base DOM template
│   ├── tailwind.config.js  # Colors, fonts, animations
│   └── vite.config.js
├── package.json            # Root scripts Orchestrator
└── README.md               # Setup Guide
```
