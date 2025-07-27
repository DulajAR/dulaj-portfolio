# 💼 Dulaj Ranasinghe | Developer Portfolio

Welcome to my personal portfolio project, built with **React (Vite)** and powered by **Firebase**. This site showcases my work, skills, and allows real-time content management through an **admin dashboard** — with support for authentication and dynamic Firestore integration.

🔗 **Live Website:** [https://dulaj-portfolio.web.app](https://dulaj-portfolio.web.app)

---

## 🚀 Tech Stack

| Technology       | Purpose                             |
| ---------------- | ----------------------------------- |
| React + Vite     | Frontend Framework (Fast & Modular) |
| Firebase Auth    | Admin Authentication (Realtime DB)  |
| Firestore DB     | Contact and Skill Data Management   |
| Firebase Hosting | Hosting the portfolio site          |
| Firebase Storage | Media file storage (future-ready)   |

---

## 📂 Project Structure

```
src/
│
├── components/            # Reusable UI components (Header, Contact, etc.)
├── pages/                 # Public pages (Home, AboutPage, etc.)
├── admin/                 # Admin dashboard, pages and components
│   ├── components/        # Admin-specific editable modules
│   └── pages/             # Admin route views
├── firebase.js            # Firebase config and initialization
└── App.jsx                # Main router and route protection
```

---

## 🔐 Admin Features

- **Login Authentication** using Firebase Realtime DB
- **Admin Dashboard** with secure routing
- **Manage Contact Info** (add/update/delete via Firestore)
- **Edit Skills, About Info, Projects** (admin-only access)
- Navigation back to Dashboard on all admin pages

---

## 🛠 How to Run Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add Firebase config**

   - Create a `.env` file (or use the provided `firebase.js`)
   - Replace with your own Firebase credentials if testing

4. **Start development server**

   ```bash
   npm run dev
   ```

---

## 📡 Firebase Setup

- ✅ **Firebase Authentication** — Realtime DB-based admin check
- ✅ **Firestore Database** — Dynamic data for Contact/Skills
- ✅ **Firebase Hosting** — Deployed to `https://dulaj-portfolio.web.app`

---

## 📸 Screenshots

| Public Homepage | Admin Dashboard |
| --------------- | --------------- |
|                 |                 |



---

## 🧠 Features in Progress / Future Enhancements

- ✨ Dark Mode Toggle
- 📛 Blog Section (Markdown/MDX support)
- 🖼️ Project Image Uploads via Firebase Storage
- 📊 Visitor Analytics via Google Analytics

---

## 👨‍💼 Author

**Dulaj Ranasinghe**\
Software Engineering Student | NIBM Galle\
📧 [dulajayeshmantha91@gmail.com](mailto\:dulajayeshmantha91@gmail.com)\
🔗 [LinkedIn](https://www.linkedin.com/in/dulaj-ranasinghe-2275a82b2)

---

⚠️ This project is for demonstration purposes only and is not licensed for reuse or redistribution.


