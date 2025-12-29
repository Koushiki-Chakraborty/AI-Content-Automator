const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Config
const BASE_URL = "http://localhost:5000/api/articles";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runPhase2() {
  try {
    console.log(" Fetching articles from API...");
    const { data: articles } = await axios.get(BASE_URL);

    for (const article of articles) {
      if (article.isUpdated) {
        console.log(` Skipping already updated: ${article.title}`);
        continue;
      }

      console.log(`\n Processing: "${article.title}"`);

      // --- A. SEARCH GOOGLE ---
      console.log(" Searching Google for competitors...");
      const searchRes = await axios.post(
        "https://google.serper.dev/search",
        { q: article.title },
        { headers: { "X-API-KEY": process.env.SERPER_API_KEY } }
      );
      const bannedDomains = [
        "youtube.com",
        "amazon.com",
        "facebook.com",
        "instagram.com",
        "pinterest.com",
      ];

      const links = searchRes.data.organic
        .filter((item) => {
          const isSelf = item.link.includes("beyondchats.com");

          const isBanned = bannedDomains.some((domain) =>
            item.link.includes(domain)
          );

          return !isSelf && !isBanned;
        })
        .slice(0, 2)
        .map((item) => item.link);

      if (links.length < 2) {
        console.log(" Not enough competitor links found. Skipping...");
        continue;
      }

      // --- B. SCRAPE COMPETITORS ---
      console.log(` Scraping competitors: ${links.join(", ")}`);
      let competitorContent = [];
      for (const url of links) {
        try {
          const { data: html } = await axios.get(url, { timeout: 5000 });
          const $ = cheerio.load(html);
          competitorContent.push($("p").text().substring(0, 3000));
        } catch (e) {
          competitorContent.push("Content not accessible");
        }
      }

      // --- C. CALL LLM (GEMINI) ---
      console.log(" Asking AI to rewrite article...");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
                I have an original blog post and two competitor posts.
                Original: ${article.content}
                Competitor 1: ${competitorContent[0]}
                Competitor 2: ${competitorContent[1]}
                
                Rewrite my article to be better, more professional, and use Markdown formatting.
                Citations are NOT needed inside the text, I will add them at the bottom.
            `;

      const result = await model.generateContent(prompt);
      const aiText = result.response.text();

      // --- D. PUBLISH VIA CRUD API ---
      console.log(" Publishing updated article via API...");
      const finalContent = `${aiText}\n\n### References:\n- ${links[0]}\n- ${links[1]}`;

      await axios.put(`${BASE_URL}/${article._id}`, {
        content: finalContent,
        isUpdated: true,
        references: links,
      });

      console.log(` Success: ${article.title} is now updated!`);
    }

    console.log("\n All articles processed!");
  } catch (error) {
    console.error(" Phase 2 Script Error:", error.message);
  }
}

runPhase2();
