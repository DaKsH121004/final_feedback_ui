# Faculty Feedback Portal — Frontend

> **Live:** [https://final-feedback-ui.vercel.app](https://final-feedback-ui.vercel.app)  
> **Backend API:** [https://feedback-api-gcbr.onrender.com](https://feedback-api-gcbr.onrender.com)

A modern admin portal and student-facing feedback form for **Manav Rachna University (MRU)**. Built with React 19 + Vite 6.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + Vite 6 | Core UI framework & build tool |
| React Router DOM v7 | Client-side routing |
| Redux Toolkit | Global auth state management |
| Axios | HTTP client with JWT interceptor |
| PrimeReact 10 | UI component library |
| Recharts | Analytics charts |
| TailwindCSS v4 | Utility-first styling |
| Motion (Framer) | Micro-animations |
| SheetJS (`xlsx`) | Excel file parsing for bulk uploads |
| Lucide React | Icon set |

---

## Project Structure

```
src/
├── App.jsx                 # Root router definition
├── main.jsx                # React entry point
├── index.css               # Global styles
├── constants.js            # API base URL and constants
├── components/
│   ├── Layout.jsx          # Admin sidebar + header shell
│   ├── ProtectedRoute.jsx  # JWT auth guard for admin routes
│   └── FormToggle.jsx      # Feedback window schedule toggle
├── pages/
│   ├── LoginPage.jsx       # Admin login
│   ├── DashboardPage.jsx   # KPI overview & top faculty
│   ├── AnalyticsPage.jsx   # Detailed charts & faculty profiling
│   ├── Feedback.jsx        # All submitted feedback (table view)
│   ├── SchoolsPage.jsx     # Schools CRUD
│   ├── DepartmentsPage.jsx # Departments CRUD
│   ├── FacultyPage.jsx     # Faculty CRUD + department assignment
│   ├── CoursesPage.jsx     # Courses CRUD + search
│   ├── CourseAssignPage.jsx# Faculty-course assignment + bulk upload
│   └── CreateFormPage.jsx  # Public student feedback form
├── services/
│   └── api.js              # Centralized Axios instance
└── store/
    └── index.js            # Redux store + auth slice
```

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/create-form/:token` | Student Feedback Form | Public (token-gated) |
| `/` | Dashboard | Protected (Admin) |
| `/analytics` | Analytics | Protected |
| `/feedbacks` | Feedback List | Protected |
| `/schools` | Schools | Protected |
| `/departments` | Departments | Protected |
| `/faculty` | Faculty | Protected |
| `/courses` | Courses | Protected |
| `/assignment` | Course Assignments | Protected |

---

## Key Features

- **Admin Dashboard** — KPI cards (total feedback, avg rating, faculty count), top 10 faculty leaderboard, department champions, bar/line charts.
- **Analytics Page** — Department performance, feedback volume, monthly rating trends with interactive Recharts visualizations.
- **Faculty-Course Assignment** — Assign faculty to courses per department/semester/section. Supports single and bulk Excel upload.
- **Feedback Form** — Time-gated public form accessible only via a secure token URL. Cascading dropdowns: School → Department → Faculty → Course.
- **JWT Auth** — Token stored in Redux; attached to every admin API call via an Axios interceptor.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_API_URL=https://feedback-api-gcbr.onrender.com
```

### Run Locally

```bash
npm run dev
# Starts at http://localhost:3000
```

### Build for Production

```bash
npm run build
```

---

## Deployment

Deployed on **Vercel**. The `vercel.json` rewrites all routes to `index.html` for SPA compatibility:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Related Repository

- **Backend API:** [github.com/DaKsH121004/feedback_api](https://github.com/DaKsH121004/feedback_api)
