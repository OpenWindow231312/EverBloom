// ========================
// 🌸 EverBloom — CORS Setup (Render + AlwaysData + Custom Domain)
// ========================
const allowedOrigins = [
  "https://everbloomshop.co.za",
  "https://www.everbloomshop.co.za",
  "https://everbloom-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like server-to-server, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply *before* any routes
app.use(cors(corsOptions));

// ✅ Handle preflight requests globally
app.options("*", cors(corsOptions));

// 🧩 JSON & logging middleware should come AFTER CORS
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "2mb" }));
app.set("trust proxy", true);
