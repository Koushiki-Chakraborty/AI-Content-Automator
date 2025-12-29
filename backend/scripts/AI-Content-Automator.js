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
                
                TASK: Rewrite my article to be high-quality, professional, and use Markdown formatting.
                
                IMPORTANT RULES:
                1. DO NOT include any introductory or conversational text (e.g., "Here is the rewritten version").
                2. Start the response IMMEDIATELY with the Article Title or the first paragraph.
                3. Use clear headings (##) and bullet points where appropriate.
                4. Do not mention the competitor articles in your response.
            `;

      const result = await model.generateContent(prompt);
      if (!result.response || !result.response.text()) {
        console.log(` AI failed to generate content for: ${article.title}`);
        continue;
      }
      let cleanedAiText = result.response.text();

      // --- CLEANING LOGIC (Must be inside the loop) ---
      const fillers = [
        "Here is a rewritten version",
        "Here's your rewritten blog post",
        "I have rewritten the article",
        "I've enhanced the blog post",
        "Sure, here is the professionally formatted",
      ];

      fillers.forEach((phrase) => {
        if (cleanedAiText.includes(phrase)) {
          const startOfContent = cleanedAiText.search(/\n\n|## |# /);
          if (startOfContent !== -1) {
            cleanedAiText = cleanedAiText.substring(startOfContent).trim();
          }
        }
      });

      // --- D. PUBLISH VIA CRUD API ---
      console.log(" Publishing updated article via API...");
      const finalContent = cleanedAiText;

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
