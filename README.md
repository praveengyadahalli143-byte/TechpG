# 🤖 TechpG — Premium Project Registration Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwind-css)

**TechpG** is a high-end, futuristic project registration and management system designed for students and administrators. It features a conversational AI-style registration flow, a 3D interactive interface, and real-time project tracking with a premium glassmorphic UI.

---

## ✨ Key Features

### 👨‍🎓 For Students
- **Conversational Registration**: A seamless, chat-driven onboarding experience.
- **Project Tracking**: Real-time updates on project status (Pending, Approved, In-Progress, Completed).
- **Direct Chat**: Built-in real-time messaging system to communicate with project coordinators.
- **Proof of Work**: showcase and upload project milestones and files.
- **Interactive 3D UI**: Futuristic interface featuring an interactive Robot assistant.

### 👩‍💼 For Administrators
- **Robust Dashboard**: Manage all user registrations and project submissions in one place.
- **Real-time Moderation**: Approve or reject projects with instant notification delivery.
- **Multi-channel Contact**: Integrated tools for direct communication with students via chat.
- **Visitor Analytics**: Track platform engagement with built-in visitor statistics.
- **Secure Access**: Dedicated administrative authentication and role management.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion (Animations) |
| **Backend** | Supabase (Authentication & PostgreSQL) |
| **Real-time** | Supabase Realtime (WebSockets) |
| **Storage** | Supabase Storage (File Uploads) |
| **3D Engine** | Spline / Three.js |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/praveengyadahalli143-byte/TechpG.git
   cd techpg-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database:**
   Run the SQL scripts located in `src/lib/supabase-schema.sql` within your Supabase SQL Editor to set up tables and RLS policies.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Project Structure

```text
techpg-app/
├── src/
│   ├── app/            # Next.js App Router (Pages & Layouts)
│   ├── components/     # Reusable UI Components
│   ├── lib/            # Utilities, Supabase client, & SQL Scripts
│   └── styles/         # Global CSS and Tailwind config
├── public/             # Static Assets
└── .env.local          # Environment Variables (Ignored by Git)
```

---

## 👥 Meet the Team

*   **Praveen G Y** — Creator & Lead Developer  
    [GitHub](https://github.com/praveengyadahalli143-byte) • [Email](mailto:praveengyadahalli143@gmail.com)
*   **Suraja Goudar** — Developer & UI/UX  
    [Email](mailto:surajearlybird@gmail.com)
*   **Manoj M** — Backend Developer

---

## 📄 License

This project is proprietary. All rights reserved.

---
Made with 💜 by **Team TechpG**
