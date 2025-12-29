const axios = require("axios");
const cheerio = require("cheerio");

// 1. Search Google for the Title
const findCompetitors = async (title) => {
  try {
    const response = await axios.post(
      "https://google.serper.dev/search",
      {
        q: title,
        num: 5, // Get top 5 to find 2 good blogs
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Filter out results that aren't blogs (like YouTube or PDF)
    const links = response.data.organic
      .filter(
        (item) =>
          !item.link.includes("youtube.com") &&
          !item.link.includes("beyondchats.com")
      )
      .slice(0, 2)
      .map((item) => item.link);

    return links;
  } catch (error) {
    console.error("Google Search Error:", error.message);
    return [];
  }
};

// 2. Scrape the Competitor Content
const scrapeCompetitorContent = async (url) => {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);
    // We grab the main text from common blog tags
    return $("p").text().substring(0, 5000); // Limit to 5000 chars for AI
  } catch (error) {
    return "";
  }
};

module.exports = { findCompetitors, scrapeCompetitorContent };
