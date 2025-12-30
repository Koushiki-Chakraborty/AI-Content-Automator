const Article = require("../models/Article");
const scrapeLogic = require("../utils/scraper");
const {
  findCompetitors,
  scrapeCompetitorContent,
} = require("../utils/researcher");
const { improveArticle } = require("../utils/aiHelper");

// SCRAPING LOGIC
exports.triggerScrape = async (req, res) => {
  try {
    const articles = await scrapeLogic();
    for (let art of articles) {
      await Article.findOneAndUpdate({ url: art.url }, art, { upsert: true });
    }
    res
      .status(200)
      .json({ message: "Scraping complete", count: articles.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
};

// UPDATE (Will be used in Phase 2)
exports.updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
