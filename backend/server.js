const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const articleRoutes = require("./routes/articleRoutes");
const Article = require("./models/Article");
const runPhase1 = require("./utils/scraper");

const app = express();

const startServer = async () => {
  try {
    await connectDB(); // Connect to Database
    console.log(" MongoDB Connected");

    const count = await Article.countDocuments();
    if (count === 0) {
      console.log(" Database is empty! Auto-triggering Phase 1 Scraper...");

      await runPhase1();
      console.log(" 5 Oldest articles successfully fetched and stored.");
    }

    app.use(
      cors({
        origin: [
          "http://localhost:5173",
          "https://your-frontend-link.vercel.app",
        ],
        credentials: true,
      })
    );

    app.use(express.json());

    // Routes
    app.use("/api/articles", articleRoutes);

    app.get("/", (req, res) => {
      res.send("AI Content Automator Backend is running 🚀");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  } catch (error) {
    console.error(" Server Startup Error:", error.message);
  }
};

startServer();
