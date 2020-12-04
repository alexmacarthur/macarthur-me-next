---
title: Best-ish Practices for Dynamically Prefetching & Prerendering Pages with JavaScript
date: "2018-11-13"
ogImage: "https://images.pexels.com/photos/730134/pexels-photo-730134.jpeg"
---

[Resource hints](https://www.w3.org/TR/resource-hints/) (preload, prefetch, prerender, etc.) have breathed some fresh life into the front-end performance game, especially as browsers are coming to support them more & more. For a traditional server-rendered application, a lot of these hints are pretty straightforward in terms of knowing when to implement them. For example, you should *preload* critical assets when you know they’ll be needed later on the page, and you should perform a *dns-prefetch* when you know you’ll be loading a bunch of assets from the same domain, like those from a CDN.

Other hints, however, are a bit more challenging. Both `prefetch` and `prerender` are concerned with loading an asset when it's *likely* that the user will need it in the *future*. But predicting the future is really hard. And for this reason, instead of hard-coding these hints in your HTML, it's often better to create them dynamically with JavaScript in response to a user's behavior.

This really isn't a new thing. In fact, there’s a lot of discussion and how-tos out there that explore using JavaScript to do things like [prerender a page on hover](https://css-tricks.com/prerender-on-hover/), [prefetch pages on intended click](https://www.mskog.com/posts/instant-page-loads-with-turbolinks-and-prefetch/), and a whole lot more. Much of this talk focuses on the *how,* rather than exploring any of the rationale for why you might do it to begin with. That said, there'a a lot of room for clarity in answering a few questions:

*When using JavaScript to do it...*

- *…how do I know if I should I prefetch vs. prerender a page?*
- *…how many pages should I prefetch and/or prerender at any given time?*
- *…how do I know when I should trigger any* `prefetch` *or* `prerender`*?*

All of these questions hover around a delicate balance. If we prefetch and/or prerender too much, we risk bloating our user's network bandwidth and may end up _harming_ performance. If too little (or unintelligently), all of our work could be for nothing because no one actually benefits from it. The fulcrum for this balance is positioned differently for almost every application you encounter, and it's only complicated by the flexibility JavaScript provides in leveraging these tools.

Based on what I’ve found while experimenting, here are some miscellaneous, *highly opinionated* personal best-ish practices for using JavaScript to dynamically and intelligently generate `prerender` and `prefetch` hints. As we move through these recommendations, we’ll be crafting some code to actualize all of this a little more. Let's go!

## 1. *Do* use JavaScript to prefetch or prerender on *probable* click.

Unless you’re working with a site that has very little content and only a few links, it’s generally a bad idea to do a blanket prefetch or prerender for every link on the page, immediately after page load. Why? That's a lot of data downloaded all at once, and much of it will never even be used. Instead, it’s best to reserve these tasks for when you can be reasonably confident a user is going to click on something.

One straightforward way to do this is to trigger an action on hover:

```js
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseover', (e) => {
        //-- Prefetch or prerender!
    });
});
```

For a lot of cases, I think this is just fine. But, if you’re working on a page with a significant number of links, or if you’re hoping to do a resource-intensive `prerender`, it’s just not intelligent enough to give us full confidence that a click is actually about to happen. For all we know, the user could just be navigating the mouse from one part of the page to another. Triggering a prefetch or prerender for any of these hovers may be a little too generous.

So, let’s up our prediction game by triggering something on hover with _intentiona_. We could get really hairy with our level of sophistication here, but to keep things simple, let’s assume that the longer a person hovers, the more likely they are to click something.

To help with this, I wrote [ProbaClick](https://github.com/alexmacarthur/probaclick), a small utility that fires an action when a user hovers over something for a collective period time. By default that period of time is 500ms. If any number of hovers add up to that time, the callback is fired. Let’s wire that up here. A small side benefit is that its API will make our implementation a little cleaner.

```js
//- Fire some action when any <a /> element is hovered over for some time.
ProbaClick('a', {
    callback: function (element) {
        //-- Prefetch or prerender!
    }
});
```

And to cut to the chase, let’s start to generate some hints for links that a user is probably going to click:

```js
const makeHint = (href, type) => {
    let link = document.createElement("link");
    link.setAttribute("rel", type);
    link.setAttribute("href", href);
    document.head.appendChild(link);
    return href;
}

let hasBeenPrerendered = [];
let hasBeenPrefetched = [];

ProbaClick('a', {
    callback: function (link) {
        let href = link.getAttribute('href');

        //-- Only generate hint if we haven't done so already for this URL.

        if(!hasBeenPrerendered.includes(href)) {
            hasBeenPrerendered.push(makeHint(href, 'prerender'));
        }

        if(!hasBeenPrefetched.includes(href)) {
            hasBeenPrefetched.push(makeHint(href, 'prefetch'));
        }
    }
});
```

Summary of that snippet: When a user hovers over a link for a total of 500ms, we append `prerender` and `prefetch` hints to the `<head>` of the document, but only if those respective hints haven’t already been generated in the past.

This is a step in the right direction, but there’s an adjustment in this we need to make, specifically dealing with how we’re prerendering pages.

## 2. *Do not* use JS to *prerender* more than one page per load.

Just like how our code is currently set up, it's tempting to generate a `prender` hint for every link that will probably be clicked. But don't waste your time, because technically, it’s only possible to run a single prerender process per instance of the browser, which means that we’re just wasting our time doing anything more than that. While I haven’t found any official documentation on this being the case for *all* browsers, it does seem to be largely agreed upon. [This nice blog post](http://ipullrank.com/how-i-sped-up-my-site-68-percent-with-one-line-of-code/), [this StackOverflow question](https://stackoverflow.com/questions/26387612/html-performance-prerendering-of-multiple-pages), and my personal experience all confirm it.

Before adjusting our code to account for this, let’s dive into the behavior of the `prerender` hint a little bit.

**How Prerendering Behaves w/ Hard-Coded HTML**

Prior to touching any JavaScript, I played with some hard-coded `prerender` hints, just to get an idea of how the browser might do things out of the box. To verify what was actually being prerendered, I used Chrome’s Net Internals tool: [chrome://net-internals/#prerender](chrome://net-internals/#prerender)

Here’s what I had in the head of my HTML:

```html
<link rel="prerender" href="https://www.typeitjs.com"/>
<link rel="prerender" href="https://www.typeitjs.com/docs"/>
```

When I loaded the page, only the *first* hint was respected, and nothing was done with the second. It was seemingly just ignored. Interestingly, though, after I refreshed that same page, the *second* URL was actively prerendered, with the first hint being designated as a “duplicate.” Apparently, the browser holds onto previously prerendered pages, at least for a little while. And when I refreshed again, neither was prerendered.

The lesson learned here is that the browser will prerender the first hint it finds that's not already cached (if we can call it that). Once a prerender process has started, any of the following `prerender` hints are useless.

**How Prerendering Behaves w/ JavaScript**

All of those observations provided some clarity in understanding why using JavaScript to prerender hints ended up being pretty weird when I first tried it.

To experiment, I set up a single page with three links, all of which had different `href` attributes. No resource hints existed on the page.

```html
<a href="https://www.typeitjs.com">Home</a>
<a href="https://www.typeitjs.com/docs">Docs</a>
<a href="https://github.com/alexmacarthur/typeit">GitHub</a>
```

Then, with JavaScript, I waited for each link to be hovered over.

```js
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseover', (e) => {
        let href = link.getAttribute('href');
        let prerenderLink = document.createElement("link");
        prerenderLink.setAttribute("rel", "prerender");
        prerenderLink.setAttribute("href", href);

        //-- Spit out the prerender hint.
        document.head.appendChild(prerenderLink);
    });
});
```

At first, I had what I thought was a pretty straightforward hypothesis: When a link was hovered over, the respective URL would actively prerendered. That was correct… sort of.

When I hovered over the *first* link, everything worked as expected. The URL was preloaded, which I verified with both the Net Internals tool, as well as [Google’s Task Manager](https://www.lifewire.com/google-chrome-task-manager-4103619) pane:

![](https://d2mxuefqeaa7sj.cloudfront.net/s_86E490487AB28BDE8348427E1A325AD17E133E23ED436D4676C93BA3733A0D42_1540932164500_image.png)

But on any subsequent hover, and to my frustration, nothing changed. The same initial link remained “active,” and I gained nothing by hovering over any of the other links. In hindsight, this makes perfect sense because of what we discovered with hard-coded hints. When the browser starts a prerender process, you can’t start another one. This makes it rather difficult to effectively leverage JavaScript to prerender multiple pages, because once it’s done, it’s done.

Let’s apply this lesson to our code. To be a little more responsible with our hint generation, we need to prevent any subsequent prerendering after we’ve done it once.

```js
const makeHint = (href, type) => {
    let link = document.createElement("link");
    link.setAttribute("rel", type);
    link.setAttribute("href", href);
    document.head.appendChild(link);
    return href;
}

let hasBeenPrerendered = false;
let hasBeenPrefetched = [];

ProbaClick('a', {
    callback: function (link) {
        let href = link.getAttribute('href');

        //-- Only generate hint if we haven't done so already for this URL.

        //-- Only prerender if _nothing_ has been prerenderd before.
        if(!hasBeenPrerendered) {
            hasBeenPrerendered = makeHint(href, 'prerender');
        }

        if(!hasBeenPrefetched.includes(href)) {
            hasBeenPrefetched.push(makeHint(href, 'prefetch'));
        }
    }
});
```

This is helpful, but because we only get once chance to prerender a page, it feels a little, uh, not right, to be using the exact same criteria to prerender as we do prefetch. Let's do something about that.

## 3. *Do* be _very_ intentional in how you decide when you should prerender a page.
There's a decent amount at stake when choosing to dynamically prerender a page. We get one shot, and if we're wrong, we waste a good chunk of our user's bandwidth for nothing. To help us be a lot more intentional with choosing how to prerender, let's pull it out of our current setup altogether and beef up the logic we use to pull the trigger.

For this separate set of logic, instead of just doing something like increasing the delay before firing the action, ProbaClick also allows you to set a maximum hover count to do so. If a user hovers over an element a certain number of times OR if the total hover duration time is met, that event fires.

```js
const makeHint = (href, type) => {
    let link = document.createElement("link");
    link.setAttribute("rel", type);
    link.setAttribute("href", href);
    document.head.appendChild(link);
    return href;
}

let hasBeenPrefetched = [];
ProbaClick('a', {
    callback: function (link) {
        let href = link.getAttribute('href');

        if(!hasBeenPrefetched.includes(href)) {
            hasBeenPrefetched.push(makeHint(href, 'prefetch'));
        }
    }
});

let hasBeenPrerendered = false;
ProbaClick('a', {
    delay: 1000,
    count: 3,
    callback: function (link) {
        let href = link.getAttribute('href');

        if(!hasBeenPrerendered) {
            hasBeenPrerendered = makeHint(href, 'prerender');
        }
    }
});
```

With that change, we're generating hints based on the following criteria:

**Prefetch** when user collectively hovers over a link for 500ms.
**Prerender** when user collectively hovers over a link for 1000ms, OR when they've hovered 3 different times.

This feels more appropriate, given the fact that `prefetch` and `prerender` hints do different things in different ways.

## 4. *Do not* prefetch or prerender pages on someone else’s site.

The main reason for this is the fact that you didn't build that other site, and so you probably don't know in detail how it's constructed -- including its page weight, code quality, or maybe even some insecure practices it may be employing. By prefetching or prerendering someone else's site, you necessarily take on a notable level of risk. The level of this risk obviously varies from site to site, but on the whole, it's enough for me to say "naaah" to the practice altogether.

This is particularly a big deal when prerendering pages. As mentioned earlier, prerendering is resource-intensive and involves more than just "fetching" a page document for later rendering. A `prerender` hint _prerenders_ the page, which includes fetching and execution of the page’s sub-resources. It's a feat.

So, let's say you publish a blog post encouraging people to donate to a GoFundMe cause, and your post contains a link to the donation page. To quicken the subsequent render when someone clicks that link, you *could* prerender it in the background. But don’t, for these reasons:

- You might not be aware of the fact that its main JavaScript file is a 500MB behemoth. And that's just one file, before it's even been parsed and executed. By prerendering that page, you just maxed out your user's mobile data plan for the month, when they MIGHT not even have visited the page anyway.
- You have no idea what kind of third party scripts that site may be using, much less the impact it may have on your own site's performance and security.

So, let's make a modification to *not* prefetch or prerender any links that belong to a different domain than our own.

```js
const makeHint = (href, type) => {
    let link = document.createElement("link");
    link.setAttribute("rel", type);
    link.setAttribute("href", href);
    document.head.appendChild(link);
    return href;
}

const isExternalLink = (href) => {
    return !href.match(/^\//) && !href.includes(window.location.host)
};

let hasBeenPrefetched = [];
ProbaClick('a', {
    callback: function (link) {
        let href = link.getAttribute('href');

        if(isExternalLink(href)) return;

        if (!hasBeenPrefetched.includes(href)) {
            hasBeenPrefetched.push(makeHint(href, 'prefetch'));
        }
    }
});

let hasBeenPrerendered = false;
ProbaClick('a', {
    delay: 1000,
    count: 3,
    callback: function (link) {
        let href = link.getAttribute('href');

        if (isExternalLink(href)) return;

        if (!hasBeenPrerendered) {
            hasBeenPrerendered = makeHint(href, 'prerender');
        }
    }
});
```

## Clean-Up Time
Nice! We've got the meat of our code written, but let's tidy some things up a bit:

```js
let hasBeen = {
    prefetch: [],
    prerender: []
}

const makeHint = (href, type) => {
    let link = document.createElement("link");
    link.setAttribute("rel", type);
    link.setAttribute("href", href);
    document.head.appendChild(link);
    return href;
}

const isExternalLink = (href) => {
    return !href.match(/^\//) && !href.includes(window.location.host)
};

const maybeMakeHint = ({link, type, max = null} = {}) => {
    let href = link.getAttribute('href');

    if(isExternalLink(href)) return;
    if(hasBeen[type].includes(href)) return;
    if(max !== null && hasBeen[type].length >= max) return;

    hasBeen[type].push(makeHint(href, type));
}

ProbaClick('a', {
    callback: function (link) {
        maybeMakeHint({
            link,
            type: 'prefetch'
        });
    }
});

ProbaClick('a', {
    delay: 1000,
    count: 3,
    callback: function (link) {
        maybeMakeHint({
            link,
            type: 'prerender',
            max: 1
        });
    }
});
```

There we have it: a few lines of untested code following some higly-opinionated best-ish practices related to using JavaScript to generate `prerender` and `prefetch` resource hints. If you have a better way to implement anything here, have any additions, or if you take deep offense to something I said, say something! At the very least, I hope you walk away from all of this thinking things like this:

* "There really are quite a few things I need to be careful about when using these tactics in my own application."
* "I just feel like I have better clarity into how these hints work and how they differ."
* "The level of general interest and excitability I experienced when reading this post was high enough for me to tweet about it."

Thanks for reading!
