const axios = require("axios");
const cheerio = require("cheerio");

const scrapeLogic = async () => {
  const baseUrl = "https://beyondchats.com/blogs/";
  const { data: initialData } = await axios.get(baseUrl);
  const $initial = cheerio.load(initialData);
  const lastPageLink = $initial(".page-numbers").not(".next").last().text();
  let currentPageNum = lastPageLink ? parseInt(lastPageLink) : 1;

  let articleLinks = [];
  while (articleLinks.length < 5 && currentPageNum > 0) {
    const pageUrl =
      currentPageNum === 1 ? baseUrl : `${baseUrl}page/${currentPageNum}/`;
    const { data: pageData } = await axios.get(pageUrl);
    const $ = cheerio.load(pageData);

    const pageLinks = [];

    $(".post-item, article").each((index, element) => {
      const link = $(element).find("a").attr("href");
      if (link && !pageLinks.includes(link)) {
        pageLinks.push(link);
      }
    });

    // Reverse links so oldest articles on the page come first
    pageLinks.reverse();

    for (const link of pageLinks) {
      if (articleLinks.length < 5 && !articleLinks.includes(link)) {
        articleLinks.push(link);
      }
    }
    currentPageNum--;
  }

  const fullArticles = [];
  for (let url of articleLinks) {
    const { data: articlePage } = await axios.get(url);
    const $art = cheerio.load(articlePage);
    fullArticles.push({
      title: $art(".entry-title, h1").first().text().trim(),
      url,
      content: $art(".entry-content, .post-content").text().trim(),
      originalContent: $art(".entry-content, .post-content").text().trim(),
    });
  }
  return fullArticles;
};

module.exports = scrapeLogic;
