# 🌸 EverBloom — Full-Stack Floral Management & E-Commerce Platform

![Hero](https://github.com/user-attachments/assets/40576841-c4e0-483a-b3ef-11814a2277cd)

[![Stars](https://img.shields.io/github/stars/OpenWindow231312/EverBloom)](https://github.com/OpenWindow231312/EverBloom/stargazers)
[![Forks](https://img.shields.io/github/forks/OpenWindow231312/EverBloom)](https://github.com/OpenWindow231312/EverBloom/network/members)
![GitHub repo size](https://img.shields.io/github/repo-size/OpenWindow231312/EverBloom)
![GitHub last commit](https://img.shields.io/github/last-commit/OpenWindow231312/EverBloom)
![GitHub issues](https://img.shields.io/github/issues/OpenWindow231312/EverBloom)

---

# 📑 Table of Contents  
- [Overview](#-everbloom--full-stack-floral-management--e-commerce-platform)  
- [Tech Stack](#-tech-stack-overview)  
- [UI & Brand Style](#-ui--brand-style)  
- [Key Features](#-key-features)  
- [Local Development Setup](#️-local-development-setup)  
- [Backend Setup](#-backend-setup)  
- [Frontend Setup](#-frontend-setup)  
- [API Endpoints](#-api-endpoints-summary)  
- [SEO & Sitemap](#-seo--sitemap)  
- [Production Deployment](#-production-deployment)  
- [Mockups](#-mockups--screens)  
- [Troubleshooting](#-troubleshooting)  
- [Credits](#-credits)  
- [Live Links](#-live-links)

---

# 🌸 EverBloom — Full-Stack Floral Management & E-Commerce Platform

EverBloom is a full-stack floral management and e-commerce application that connects **buyers, florists, and farm suppliers** through a unified digital ecosystem.  
Built with React, Node.js, Express, MySQL (AlwaysData), and deployed via Vercel + Render — EverBloom supports **inventory management, harvest tracking, e-commerce, dashboards, roles**, and more.

---

# 🏗️ Tech Stack Overview

| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend** | React.js (CRA), React Router, React Icons | Modern marketplace + dashboard |
| **Backend** | Node.js + Express | REST API with authentication |
| **Database** | MySQL + Sequelize ORM | Hosted on AlwaysData |
| **Deployment** | Render (Backend), Vercel (Frontend) | CI/CD with GitHub |
| **Domain** | GoDaddy DNS | `everbloomshop.co.za` |
| **Analytics** | Google Analytics (G‑T7VC5RXVVK) | Tracks user activity |

---

# 🎨 UI & Brand Style

EverBloom merges **artisan floristry** with clean modern UI principles.

### ✨ Style Summary
- Soft natural beige + warm terracotta  
- Clean white cards + rounded corners  
- Minimal shadows, soft gradients  

### 🖋 Typography
- Headings: **Poppins**  
- Body: **Inter / System Sans**  

<img width="1920" height="2696" alt="Everbloom Style Guide" src="https://github.com/user-attachments/assets/cc0cf371-a9ab-44f2-ba1b-972231bdc630" />

---

# 💐 Key Features

- 🔐 **Authentication** (JWT + role-based access)  
- 🌺 **Flower & Harvest Management**  
- 🧊 **Coldroom FIFO Inventory**  
- 🛒 **Marketplace + Checkout Flow**  
- ⭐ **Review System**  
- 📊 **Sales & User Dashboard**  
- ♻️ **Expired Flower Archive**  
- ⚡ **Auto-discount near expiry**

---

# ⚙️ Local Development Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/OpenWindow231312/EverBloom.git
cd EverBloom
```

---

# 2️⃣ Backend Setup

## Install Dependencies
```bash
cd backend
npm install
```

### 🔹 Local Development `.env`
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=everbloom_db
DB_DIALECT=mysql
DB_PORT=3306
NODE_ENV=development
DB_SYNC=false
```

### 🔹 Production (AlwaysData) `.env`
```env
DB_HOST=mysql-anikadebeer.alwaysdata.net
DB_USER=434073
DB_PASS=Anika@22
DB_NAME=anikadebeer_everbloom_db
DB_DIALECT=mysql
DB_PORT=3306
NODE_ENV=production
DB_SYNC=false
```

### ▶️ Start Server
```bash
npm start
```

### Health Check Route
```
http://localhost:5001/health
```

---

# 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

Frontend runs at:  
`http://localhost:3000`

---

# 🌐 API Endpoints (Summary)

### Authentication  
`POST /api/auth/register`  
`POST /api/auth/login`

### Flowers  
`GET /api/flowers`  
`POST /api/flowers`

### Dashboard  
`GET /api/dashboard/sales-summary`

---

# 🌍 SEO & Sitemap

### 📌 Sitemap  
**https://everbloomshop.co.za/sitemap.xml**

### 📈 Google Analytics  
Installed in `/public/index.html`.

---

# 🚀 Production Deployment

## Backend — Render
- Region: Frankfurt  
- Auto-deploy on push  
- Root folder: `/backend`  

## Database — AlwaysData  
- MySQL 8  
- Remote access enabled  

## Frontend — Vercel  
- Root folder: `/client`  
- Build command: `npm run build`  

---

# 🖼️ Mockups & Screens

![Overview](https://github.com/user-attachments/assets/861af038-49cf-4222-82ce-e3e81d6900de)
<img width="8332" height="7538" alt="Frame e6" src="https://github.com/user-attachments/assets/a8913f57-6ed3-4be5-bb07-ea8621596c01" />

---

# 🧪 Troubleshooting

| Problem | Fix |
|--------|-----|
| CORS errors | Add correct frontend URL |
| API not connecting | Check DB credentials |
| Missing tables | Run backend locally once |
| Render build failing | Ensure root folder is backend |

---

# 👩‍💻 Credits

**Developer:** Anika de Beer  
**Institution:** Open Window Institute  
**Degree:** Bachelor of Creative Technologies  
**Project:** DV200 — *EverBloom* 
**Lecturer:** Tsungai Katsuro


---

# 🔗 Live Links

| Service | URL |
|--------|-----|
| **Frontend** | https://everbloomshop.co.za |
| **Backend API** | https://everbloom.onrender.com |
| **Database** | https://admin.alwaysdata.com |
| **Sitemap** | https://everbloomshop.co.za/sitemap.xml |



