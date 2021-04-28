## Setting up the Environment

1. Open the project folder in VS Code

![image-20210428144555509](https://i.loli.net/2021/04/28/eJs5pk4wrImtFOb.png)

2. Open the command prompt (Ctrl + `)

![image-20210428145329448](https://i.loli.net/2021/04/28/ujC2bEF6WqgrTSN.png)

3. Install the dependencies that are needed;

   command is: ``npm i cheerio qs node-fetch``

   ![image-20210428145428593](https://i.loli.net/2021/04/28/K5DjPnzsFAQkMV9.png)

4. Open a file, in my examples I'll call it as ``index.js``

   ![image-20210428145522600](https://i.loli.net/2021/04/28/wVAa4LEdcNnJf5p.png)

5. Import the dependencies you just installed.

![image-20210428145635175](https://i.loli.net/2021/04/28/u8AxpGUHgS35fVB.png)



## Scraping a site

So, I'll first explain the process and then I'll do it step by step in code.



#### HTML

So, you first need to know how HTML is structured. It is structured like an upside down tree.

What do I mean by that? That's a nice question.



In HTML every element must have a parent (except the root elements).

Html has a head and a body which are contained inside the root TML element.

The head element has info about the page, such as the title of the page, any styles it uses (css) and any scripts it imports (js).



Whereas the body element contains anything visible on the screen.



All elements inside the html tag are related either as parents, children or siblings of each other.



#### Navigating inside an HTML document

Here is some example HTML

```html
<html>
    <head>
        <title>Hello there!</title>
    </head>
    <body>
        <ul class="anime-list">
            <li><a href="anime-1">Anime 1</a></li>
            <li><a href="anime-2">Anime 2</a></li>
            <li><a href="anime-3">Anime 3</a></li>
            <li><a href="anime-4">Anime 4</a></li>
            <li><a href="anime-5">Anime 5</a></li>
        </ul>
    </body>
</html>
```

In the above html code we have a list of links to "anime"

To work with the example code I'll paste it as a variable inside ``index.js``

![image-20210428154258420](https://i.loli.net/2021/04/28/4PJwxn1FBAVcQmZ.png)

Now, to parse the html document with cheerio we do:

![image-20210428154400144](https://i.loli.net/2021/04/28/Y1ShD8ILnBw3Q4i.png)

And to print each "anime link" we do:

![image-20210428154835672](https://i.loli.net/2021/04/28/BU9YMJWu7lC5z84.png)

Notice ``"ul.anime-list > li"``, it is a css selector. You can learn more about them [here](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors).

In the above code I do 3 things.

1. Generate a list of items (``$("ul.anime-list > li").toArray()``)
2. Iterate over the items and create a constant that stores the anchor tag located inside each item.
3. output the attribute ``href`` the anchor tag has



Sounds easy right? Because it is that easy.

Now lets go ahead and use this code on a real world example.



I'll scrape the search results from [this](https://www.imdb.com/search/title/?title=overlord&title_type=tv_series&genres=animation) link.

![image-20210428160728995](https://i.loli.net/2021/04/28/DrijpOSbNvX64U1.png)

For now you can ignore the code that acquires the html and just focus on the rest of the stuff.

![image-20210428170325082](https://i.loli.net/2021/04/28/HxOZhBmpKDkNwRv.png)

The above code is quite simple.

It parses the html, then creates a list with the items we need.

After that it creates an object that stores the title and id of each item and after that it logs that object.

![image-20210428170501594](https://i.loli.net/2021/04/28/HeMO6xujbqsgtRZ.png)

Code used in example:

```js
const fetch = require("node-fetch");
const cheerio = require("cheerio");


const link = "https://www.imdb.com/search/title/?title=overlord&title_type=tv_series&genres=animation"


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

```

If you want to understand more on how cheerio works you can visit [this](https://cheerio.js.org/) link.



### Bonus section

In the above example I used this ``https://www.imdb.com/search/title/?title=overlord&title_type=tv_series&genres=animation`` page to scrape the content from.

But it is inefficient to edit the string in order to change the search options, isn't it?



to simplify that we will use qs!

qs stands for query string



it takes an object like

```js
{
    title: "overlord",
    title_type: "tv_series",
    genres: "animation"
}
```

And converts it to

```js
"title=overlord&title_type=tv_series&genres=animation"
```

quite convenient, right?



so I can refactor my code to be

```js
const fetch = require("node-fetch");
const qs = require("qs");
const cheerio = require("cheerio");


const link = "https://www.imdb.com/search/title/?" + qs.stringify({
    title: "overlord",
    title_type: "tv_series",
    genres: "animation"
})


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

```





### Understanding fetch()

Well, I am too lazy to do that, so until I decide to update this guide you can go to [this](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) link.





node-fetch is a complete clone of the fetch function that browsers provide but in nodejs

so the browser documentation should be more than enough
