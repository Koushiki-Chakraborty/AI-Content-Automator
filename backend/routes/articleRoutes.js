const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router.post("/scrape", articleController.triggerScrape); // Trigger scraping of oldest BeyondChats articles
router.get("/", articleController.getArticles); // Get all articles
router.get("/:id", articleController.getArticleById); // Get one article
router.put("/:id", articleController.updateArticle); // Update an article
router.delete("/:id", articleController.deleteArticle); // Delete an article

module.exports = router;
