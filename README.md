## 🌸 EverBloom — Full-Stack MERN Application

**EverBloom** is a floral e-commerce platform that connects buyers, florists, and farm suppliers in a simple, modern online marketplace. Built using the **MERN stack** (MySQL, Express, React, Node.js) with Sequelize ORM, the platform features product listings, order management, dashboards, and integrated Google Analytics tracking.

<img width="4098" height="2400" alt="Everbloom Dashboard Front image" src="https://github.com/user-attachments/assets/f9b27a79-c3cd-483a-8182-5e00b915d024" />

### 🪴 Tech Stack

| Layer          | Technology                                                        | Description                                    |
| -------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| **Frontend**   | React.js (Vite / CRA)                                             | Client-side UI built with React & React Router |
| **Backend**    | Node.js + Express.js                                              | REST API with authentication, routes, and CORS |
| **Database**   | MySQL + Sequelize ORM                                             | Hosted on AlwaysData for production            |
| **Deployment** | Render (Backend) + Vercel (Frontend)                              | CI/CD from GitHub                              |
| **Hosting**    | Custom Domain: [everbloomshop.co.za](https://everbloomshop.co.za) | Managed via GoDaddy DNS                        |
| **Analytics**  | Google Analytics (G-T7VC5RXVVK)                                   | Tracks user activity and events                |

### 🎨 UI & Brand Design

EverBloom’s visual identity captures the warmth and creativity of local floristry — blending handcrafted typography, rich reds, and soft natural tones.
The brand is rooted in celebration, community, and craftsmanship, reflected through its bold floral-inspired logo and organic color palette.

| Element                      | Description                                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| **Primary Logo**             | “EverBloom” wordmark with custom floral letterform                    |
| **Secondary Logo & Submark** | Simplified typographic versions for packaging, favicon, and dashboard |
| **Logo Mark (E B)**          | Used in social icons and app headers                                  |

<img width="1920" height="2696" alt="Everbloom Style Guide" src="https://github.com/user-attachments/assets/cc0cf371-a9ab-44f2-ba1b-972231bdc630" />

## ⚙️ Local Development Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/OpenWindow231312/EverBloom.git
cd EverBloom
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend` with your local MySQL credentials:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=everbloom_db
DB_DIALECT=mysql
DB_PORT=3307
NODE_ENV=development
```

Start the server:

```bash
npm start
```

The API runs on:

```
http://localhost:5001
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

The React app runs locally on:

```
http://localhost:3000
```

---

## 🌐 Production Deployment

### 🧩 Backend — Render

**Service:** [Render.com](https://render.com)
**Region:** Frankfurt (EU Central)
**Build Command:**

```bash
npm install
```

**Start Command:**

```bash
node index.js
```

**Root Directory:**

```
backend
```

#### Environment Variables on Render:

| Key        | Value                          |
| ---------- | ------------------------------ |
| DB_HOST    | mysql-<PRIVATE>.alwaysdata.net |
| DB_USER    | 434073                         |
| DB_PASS    | Anika@22                       |
| DB_NAME    | anikadebeer_everbloom_db       |
| DB_PORT    | 3306                           |
| DB_DIALECT | mysql                          |
| NODE_ENV   | production                     |

---

### 🌿 Database — AlwaysData

**Host:** [https://admin.alwaysdata.com](https://admin.alwaysdata.com)

* MySQL database: `anikadebeer_everbloom_db`
* User: `434073`
* Remote access enabled
* Imported from local `.sql` export

---

### 🌷 Frontend — Vercel

**Framework:** Create React App
**Root Directory:**

```
client
```

**Build Command:**

```bash
npm run build
```

**Output Directory:**

```
build
```

**Environment Variable:**

| Key               | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| REACT_APP_API_URL | [https://everbloom.onrender.com](https://everbloom.onrender.com) |

✅ Deployed URL: [https://everbloomshop.co.za](https://everbloomshop.co.za)
✅ Redirect: `everbloomshop.co.za` → `www.everbloomshop.co.za`

---

### 🌼 Domain Configuration — GoDaddy

| Type      | Name  | Value                 | TTL    |
| --------- | ----- | --------------------- | ------ |
| **A**     | `@`   | `13.248.243.5`        | 1 Hour |
| **CNAME** | `www` | `everbloomshop.co.za` | 1 Hour |

This configuration connects GoDaddy DNS to the Vercel frontend deployment.

---

## 🧭 Google Analytics Setup

**Measurement ID:** `G-T7VC5RXVVK`
Inserted manually in `client/public/index.html` right after the `<head>` tag:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T7VC5RXVVK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-T7VC5RXVVK');
</script>
```

---

## 🔐 CORS Configuration

In `/backend/index.js`, CORS allows the production frontend and local testing:

```js
const cors = require("cors");

app.use(cors({
  origin: [
    "https://ever-bloom.vercel.app",
    "https://everbloomshop.co.za",
    "http://localhost:3000"
  ],
  credentials: true,
}));
```

---

## 🧩 Sequelize Sync (Models)

Models are auto-synced and relationally defined inside
`backend/models/index.js`, including:

* Users ↔ Roles (many-to-many)
* Orders ↔ OrderItems
* Flowers ↔ FlowerTypes
* HarvestBatches ↔ Inventories
* ColdroomReservations ↔ OrderItems ↔ HarvestBatches

The file automatically authenticates DB connection and logs results:

```bash
✅ DB connection established.
✅ Tables successfully recreated from models.
```

---

## 🧠 Troubleshooting

| Issue                   | Cause                          | Fix                              |
| ----------------------- | ------------------------------ | -------------------------------- |
| API not loading         | Wrong DB credentials on Render | Check `.env`                     |
| 500 Internal Error      | CORS misconfiguration          | Add correct frontend URL         |
| Database missing tables | Sequelize not synced           | Run backend once locally         |
| DNS not resolving       | DNS cache delay                | Wait up to 24 hours or flush DNS |

---

## 🪴 Credits

**Developed by:** Anika de Beer
**University:** Open Window Institute
**Degree:** Bachelor of Creative Technologies — UX Design & Interactive Development
**Project:** DV200 – EverBloom (Full-Stack Deployment)

---

## 🌸 Live Links

| Service                   | URL                                                              |
| ------------------------- | ---------------------------------------------------------------- |
| **Frontend (Vercel)**     | [https://everbloomshop.co.za](https://everbloomshop.co.za)       |
| **Backend (Render)**      | [https://everbloom.onrender.com](https://everbloom.onrender.com) |
| **Database (AlwaysData)** | [https://admin.alwaysdata.com](https://admin.alwaysdata.com)     |
