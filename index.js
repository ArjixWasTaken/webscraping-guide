const fetch = require("node-fetch");
const qs = require("qs");
const cheerio = require("cheerio");

// prettier-ignore
const link = "https://www.imdb.com/search/title/?" + qs.stringify({
    title: "overlord",
    title_type: "tv_series",
    genres: "animation"
})

// prettier-ignore
fetch(link).then((data) => data.text()).then((html) => {
    const $ = cheerio.load(html);
    $(".lister-list > .lister-item.mode-advanced").toArray().forEach(item => {
        const element = $(item)
        console.log({
            title: element.find('.lister-item-content > h3 > a').text(),
            imdbId: element.find('.lister-item-content > h3 > a').attr('href').match(/\/title\/(tt\d+)\//)[1]
        })
    })
});
