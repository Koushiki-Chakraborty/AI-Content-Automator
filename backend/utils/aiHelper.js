const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const improveArticle = async (original, competitor1, competitor2) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
        I have an original blog post and two top-ranking competitor blog posts on the same topic.
        
        Original Article: ${original}
        
        Competitor 1: ${competitor1}
        Competitor 2: ${competitor2}
        
        Task:
        1. Rewrite my original article to be more engaging and professionally formatted.
        2. Use the tone and depth found in the competitor articles.
        3. Use Markdown (H1, H2, Bold, Lists) for better readability.
        4. Keep the core message but make it much better.
    `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { improveArticle };
