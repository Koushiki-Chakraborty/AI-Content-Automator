const axios = require("axios");
const cheerio = require("cheerio");

const scrapeLogic = async () => {
  const baseUrl = "https://beyondchats.com/blogs/";
  const { data: initialData } = await axios.get(baseUrl);
  const $initial = cheerio.load(initialData);

  const lastPageText = $initial(".page-numbers").not(".next").last().text();
  let currentPageNum = lastPageText ? parseInt(lastPageText) : 1;

  let articleLinks = [];
  console.log(`🔍 Starting "Oldest 5" search from page: ${currentPageNum}`);

  while (articleLinks.length < 5 && currentPageNum > 0) {
    const pageUrl =
      currentPageNum === 1 ? baseUrl : `${baseUrl}page/${currentPageNum}/`;
    try {
      const { data: pageData } = await axios.get(pageUrl);
      const $ = cheerio.load(pageData);

      let pageLinks = [];

      $(".premium-blog-post-outer, article, .post-item").each((index, el) => {
        const link = $(el).find("a").attr("href");
        if (link) pageLinks.push(link);
      });

      pageLinks.reverse();

      for (const link of pageLinks) {
        if (articleLinks.length < 5 && !articleLinks.includes(link)) {
          articleLinks.push(link);
        }
      }

      console.log(
        `Processed page ${currentPageNum}. Current link count: ${articleLinks.length}`
      );
      currentPageNum--;
    } catch (error) {
      console.error(`Error on page ${currentPageNum}:`, error.message);
      break;
    }
  }

  const fullArticles = [];
  for (let url of articleLinks) {
    const { data: articlePage } = await axios.get(url);
    const $art = cheerio.load(articlePage);

    const title = $art(".entry-title, h1").first().text().trim();
    const content = $art(".entry-content, .post-content").text().trim();

    fullArticles.push({
      title: title || "Oldest Post",
      url,
      content: content,
      originalContent: content,
      isUpdated: false,
    });
  }

  return fullArticles;
};

module.exports = scrapeLogic;
