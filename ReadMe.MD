#  TASP Project – Backend

This folder contains the backend code for the TASP  AI Assistant. The backend handles authentication, OTP verification, chat history storage, and integration with AI services.

---

##  Tech Stack

- **Node.js** + **Express.js**
- **MYSQL** (for Database)
- **JWT** for authentication
- **Dotenv** for environment configs
- **Email service** for OTP (Nodemailer)

---

##  Getting Started

### 1. Clone the project

```bash
git clone https://github.com/Designers-X/BKL-TASPBOTX-Backend.git

npm install

cp .env.example .env

npm run dev
# or
node index.js


backend/
│
├── controllers/     Business logic
├── routes/          API endpoints
├── utils/           Helper functions
├── index.js         App entry point
├── .env.example     Sample environment config
└── README.md        You're here

---

### 🔐 `.env.example` (Paste this in `backend/.env`)

```env
PORT=5000
GMAIL_USER=YOUR Email for nodemailer
GMAIL_PASS=your pass key
JWT_SECRET=unique secret key
backend_url=your backend server URL


