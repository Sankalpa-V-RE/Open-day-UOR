# 🎓 Faculty of Engineering, University of Ruhuna — Open Day 2026

Registration website for the Faculty of Engineering Open Day.

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

The website will be running at:
- **Main site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin

---

## 🔐 Admin Panel

- URL: `/admin`
- Default password: `openday2026`

**To change the admin password**, set the environment variable:
```bash
ADMIN_PASSWORD=yourSecurePassword npm start
```

Or on Linux/Mac:
```bash
export ADMIN_PASSWORD=yourSecurePassword
npm start
```

Admin features:
- View all registrations in a searchable table
- Filter by attendance confirmation
- Export all data as CSV

---

## 🖼️ Adding Faculty Photos

Place your photos in the `public/images/` folder with these filenames:

| File | Suggested Content |
|------|------------------|
| `gallery-1.jpg` | Main faculty building / entrance |
| `gallery-2.jpg` | Laboratory or workshop |
| `gallery-3.jpg` | Student activities / cultural event |
| `gallery-4.jpg` | Lecture hall or classroom |
| `gallery-5.jpg` | Campus grounds / outdoor area |

Images display in:
1. A 5-panel animated strip at the bottom of the hero section
2. A large 5-photo editorial grid in the Gallery section

**Recommended dimensions:** At least 800×600px. JPG format preferred. Any aspect ratio works as they're cropped to fit.

---

## 📁 Project Structure

```
openday/
├── server.js           # Express app entry point
├── db/
│   └── database.js     # SQLite database setup (via sql.js)
├── routes/
│   └── api.js          # API endpoints
├── public/
│   ├── index.html      # Main registration website
│   ├── admin.html      # Admin dashboard
│   └── images/         # ← Place your faculty photos here
└── openday.db          # SQLite database (auto-created on first run)
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Submit a registration |
| GET | `/api/stats` | Get public registration stats |
| GET | `/api/admin/registrations?password=` | Get all registrations (admin) |
| GET | `/api/admin/export-csv?password=` | Download CSV export (admin) |

---

## 🗄️ Database Schema

Table: `registrations`

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT | UUID, primary key |
| `full_name` | TEXT | Required |
| `address` | TEXT | City / address |
| `school_name` | TEXT | Required |
| `attendance_confirmed` | INTEGER | 0 = No, 1 = Yes |
| `distance_km` | REAL | Distance to campus in km |
| `contact_number` | TEXT | Phone number |
| `email` | TEXT | Unique per registration |
| `registered_at` | TEXT | ISO 8601 datetime |

---

## 🌐 Deploying to the Web

### Option A: Render (free tier)
1. Push this folder to a GitHub repository
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set start command: `node server.js`
4. Add environment variable: `ADMIN_PASSWORD=yourPassword`

### Option B: Railway
1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub

### Option C: VPS / cPanel
1. Copy the project files to your server
2. Run `npm install` then `node server.js`
3. Use Nginx or Apache as a reverse proxy to port 3000

> **Note:** The SQLite database (`openday.db`) is stored as a file. On platforms with ephemeral storage (like Render free tier), data may reset. For production, consider using a persistent disk or upgrading to PostgreSQL.

---

## 🎨 Customization

- **Change event date/details:** Edit `public/index.html`
- **Change colors:** CSS variables at the top of `index.html` and `admin.html`
- **Change admin password:** Set `ADMIN_PASSWORD` environment variable
- **Add more form fields:** Update `routes/api.js`, `db/database.js`, and the form in `index.html`
