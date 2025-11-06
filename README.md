## EverBloom — Full-Stack MERN Application

**EverBloom** is a full-stack floral management and e-commerce platform that connects **buyers, florists, and farm suppliers** through an integrated dashboard and marketplace.
It’s built with the **MERN stack** using **MySQL + Sequelize ORM**, providing seamless management of flowers, harvests, coldroom inventory, orders, and sales — all through an intuitive dashboard interface.

<img width="4098" height="2400" alt="Everbloom Dashboard Front image" src="https://github.com/user-attachments/assets/f9b27a79-c3cd-483a-8182-5e00b915d024" />

---

### Tech Stack

| Layer          | Technology                                                        | Description                                  |
| -------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| **Frontend**   | React.js (Vite / CRA) + React Router + React Icons                | Interactive UI with modular dashboard design |
| **Backend**    | Node.js + Express.js                                              | REST API with authentication, routes & CORS  |
| **Database**   | MySQL + Sequelize ORM                                             | Hosted on AlwaysData for production          |
| **Deployment** | Render (Backend) + Vercel (Frontend)                              | CI/CD pipeline integrated with GitHub        |
| **Hosting**    | Custom Domain: [everbloomshop.co.za](https://everbloomshop.co.za) | Managed via GoDaddy DNS                      |
| **Analytics**  | Google Analytics (G-T7VC5RXVVK)                                   | Tracks dashboard and user activity           |

---

### UI & Brand Design

EverBloom’s visual identity captures the warmth and creativity of **local floristry** — blending handcrafted typography, natural tones, and contemporary interface design.

| Element                      | Description                                               |
| ---------------------------- | --------------------------------------------------------- |
| **Primary Logo**             | “EverBloom” wordmark with custom floral letterform        |
| **Secondary Logo & Submark** | Simplified versions for packaging, favicon, and dashboard |
| **Logo Mark (E B)**          | Used in social icons and app headers                      |

<img width="1920" height="2696" alt="Everbloom Style Guide" src="https://github.com/user-attachments/assets/cc0cf371-a9ab-44f2-ba1b-972231bdc630" />

---

## ⚙️ Local Development Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/OpenWindow231312/EverBloom.git
cd EverBloom
```

---

## **2️⃣ Backend Setup**

### Install Dependencies

```bash
cd backend
npm install
```

---

### ⚙️ Environment Configuration

Create a `.env` file inside the `/backend` folder to store your database and environment variables.

#### 🔹 **For Local Development (e.g. using XAMPP / MAMP / phpMyAdmin locally)**

```bash
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=everbloom_db
DB_DIALECT=mysql
DB_PORT=3306
NODE_ENV=development
DB_SYNC=false
```

Use this configuration when running a MySQL server on your local machine.

---

#### 🔹 **For Production (AlwaysData MySQL Server)**

```bash
DB_HOST=mysql-anikadebeer.alwaysdata.net
DB_USER=434073
DB_PASS=Anika@22
DB_NAME=anikadebeer_everbloom_db
DB_DIALECT=mysql
DB_PORT=3306
NODE_ENV=production
DB_SYNC=false
```

> **Note:** AlwaysData requires a secure (SSL) connection.  
> The backend automatically enables SSL in production mode, so you don’t need to modify any code.

---

### **Start the Server**

```bash
npm start
```

You should see the following message if everything is set up correctly:

```
✅ Database connected successfully (Localhost or AlwaysData)
🚀 EverBloom API running at http://localhost:5001
```

---

### **Test the API Health Route**

You can verify that the server is running by visiting:

```
http://localhost:5001/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "🌿 EverBloom backend running smoothly"
}
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm install react-icons
npm start
```

The React app runs locally on:

```
http://localhost:3000
```

**Note:** The dashboard uses **React Icons** for consistent UI across all dashboard pages (replacing emojis).

---

## Application Modules

The dashboard now includes **modular management pages**, each connected to live Sequelize models and API routes:

| Module             | Functionality                                                                 |
| ------------------ | ----------------------------------------------------------------------------- |
| **Overview Page**  | Displays stats: total users, orders, flowers, and active harvests.            |
| **Stock Page**     | Manage flowers with type, color, stem length, shelf life, and price per stem. |
| **Harvest Page**   | Record new harvest batches, track freshness, and batch expiry logic.          |
| **Inventory Page** | Coldroom tracking (FIFO-based). Auto-discount near-expiry flowers.            |
| **Orders Page**    | Manage orders — update status, view totals, separate pending/past orders.     |
| **Users Page**     | Update user roles (Admin, Employee, Florist, Customer).                       |

---

## Production Deployment

### Backend — Render

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

### Database — AlwaysData

**Host:** [https://admin.alwaysdata.com](https://admin.alwaysdata.com)
**Database:** `anikadebeer_everbloom_db`
**User:** `434073`
**Access:** Remote enabled (used by Render backend)

---

### Frontend — Vercel

**Framework:** Create React App
**Root Directory:** `client`
**Build Command:** `npm run build`
**Output Directory:** `build`

**Environment Variable:**

| Key               | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| REACT_APP_API_URL | [https://everbloom.onrender.com](https://everbloom.onrender.com) |

✅ Live: [https://everbloomshop.co.za](https://everbloomshop.co.za)
✅ Redirect: `everbloomshop.co.za` → `www.everbloomshop.co.za`

---

### Domain Configuration — GoDaddy

| Type      | Name  | Value                 | TTL    |
| --------- | ----- | --------------------- | ------ |
| **A**     | `@`   | `13.248.243.5`        | 1 Hour |
| **CNAME** | `www` | `everbloomshop.co.za` | 1 Hour |

This links **GoDaddy DNS** → **Vercel Frontend Deployment**.

---

## Google Analytics Setup

**Measurement ID:** `G-T7VC5RXVVK`
Inserted manually in `client/public/index.html` under `<head>`:

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

## CORS Configuration

In `/backend/index.js`, CORS allows both production and local URLs:

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

## Sequelize Model Index

All models are dynamically imported and synchronized in
`backend/models/index.js`.

Includes associations for:

* **User ↔ Role** (many-to-many)
* **Order ↔ OrderItem**
* **Flower ↔ FlowerType**
* **HarvestBatch ↔ Inventory**
* **ColdroomReservation ↔ OrderItem ↔ HarvestBatch**
* **Discard Archive** for expired flowers
* **Automatic sale pricing** for near-expiry flowers

```bash
✅ DB connection established.
✅ Tables successfully recreated from models.
```

---

## Troubleshooting

| Issue                   | Cause                          | Fix                           |
| ----------------------- | ------------------------------ | ----------------------------- |
| API not loading         | Wrong DB credentials on Render | Check `.env`                  |
| 500 Internal Error      | CORS misconfiguration          | Add correct frontend URL      |
| Database missing tables | Sequelize not synced           | Run backend once locally      |
| DNS not resolving       | DNS cache delay                | Wait up to 24h or flush DNS   |
| Icon not showing        | `react-icons` not installed    | Run `npm install react-icons` |

---

## Credits

**Developed by:** Anika de Beer
**University:** Open Window Institute
**Degree:** Bachelor of Creative Technologies — UX Design & Interactive Development
**Project:** DV200 – *EverBloom* (Full-Stack Deployment)

---

## Acknowledgements

## Live Links

| Service                   | URL                                                              |
| ------------------------- | ---------------------------------------------------------------- |
| **Frontend (Vercel)**     | [https://everbloomshop.co.za](https://everbloomshop.co.za)       |
| **Backend (Render)**      | [https://everbloom.onrender.com](https://everbloom.onrender.com) |
| **Database (AlwaysData)** | [https://admin.alwaysdata.com](https://admin.alwaysdata.com)     |

