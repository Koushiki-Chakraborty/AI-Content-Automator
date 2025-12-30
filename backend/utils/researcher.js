const axios = require("axios");
const cheerio = require("cheerio");

const findCompetitors = async (title) => {
  try {
    const response = await axios.post(
      "https://google.serper.dev/search",
      {
        q: title,
        num: 5,
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

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

const scrapeCompetitorContent = async (url) => {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);

    return $("p").text().substring(0, 5000);
  } catch (error) {
    return "";
  }
};

module.exports = { findCompetitors, scrapeCompetitorContent };
