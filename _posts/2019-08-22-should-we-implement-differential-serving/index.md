---
title: Should We All Start Implementing Differential Serving?
ogImage: https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=1200&w=1200
---

There's been a lot of discussion around the potential to serve browsers the JavaScript bundles they can support. For example, if a user's on Internet Explorer, serve a transpiled, polyfilled bundle. If they're on a modern version of Chrome, deliver the slimmer, non-transpiled version.

To accomplish this, the `module` / `nomodule` trick has been thrown around quite a bit. It looks like this:

```html
<script type="module" src="scripts.modern.min.js"></script>
<script nomodule src="scripts.min.js"></script>
```

Old browsers will pass over `type="module"`and download the `nomodule` version. Modern browsers will pass over the `nomodule` attribute and download the `type="module"` version. As a result, browsers get the code they can handle. These days, most of them can understand modern JavaScript anyway, so serving bundles in this way benefits most of sites' visitors.

## Yeah, but is it reliable?

From what I've read and witnessed, not very. [John Stewart](https://www.johnstewart.dev/) has some [really interesting results](https://github.com/johnstew/differential-serving#tests) he shared from his own research, revealing (and verified by my own tinkering) that quite a few browser versions end up downloading bundles they shouldn't -- sometimes even multiple times. So, if your user just happens to be using MS Edge 18, for example, you're actually _harming_ performance -- not helping.

And even if the community's generally moving away from the browsers with these issues, their use is still widespread enough to deter me from using the `module` / `nomodule` trick in production. At least for now.

## Is there another way?

Yes, a couple of them.

### A Server-Side Alternative

Some have explored [a server-side solution](https://www.johnstewart.dev/differential-serving#alternative-approach) that examines a browser's user agent before serving the correct assets. It's more reliable in appearance (albeit certainly not bulletproof), but when caching and other factors are added to the mix, it gets complicated and unpredictable real fast. [CloudFront, for example](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/RequestAndResponseBehaviorCustomOrigin.html#request-custom-user-agent-header), totally overrides the `User-Agent` header, and recommends that you don't cache objects based on its incoming value anyway. Mozilla takes an even stronger position against `User-Agent` sniffing, outright saying that [you should just **never** do it](https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Considerations_before_using_browser_detection). Bold words! Literally. Their words are in bold on their site.

### A Client-Side Alternative

Dare I say it, there _is_ a JavaScript approach to explore:

```html
<script>
    var MODERN_BUNDLE = "assets/dist/js/scripts.modern.min.js";
    var LEGACY_BUNDLE = "assets/dist/js/scripts.min.js";

    function isModern() {
      try {
        new Function('import("")');
        return true;
      } catch (err) {
        return false;
      }
    }

    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("src", isModern() ? MODERN_BUNDLE : LEGACY_BUNDLE);
    document.body.appendChild(scriptTag);
</script>
```

By wrapping some modern feature inside a `try/catch` block, we can return a `boolean` in checking if a browser can understand modern JS. Once we know that, a `<script>` tag can be attached to the body to tell it exactly which file to download. I implemented this in my own sandbox, and it appears to work even using the problem browsers mentioned above.

Points for reliability, but it still doesn't feel right. There's an inherent performance tradeoff in needing go wait for a small piece of JS to parse and execute before you can download a big piece of JS. And after digging into this a little more, the performance losses were more significant than I anticipated.

#### Testing the Client-Side Approach

I ran through some scenarios loading a **~300kb transpiled file** and a **~50kb "modern" file** in three different ways. In my own experimentation, the amount of code I saved by not transpiling ranged from 10% - 50%, so I figured I'd test with a more extreme example (> 80% savings) to determine if the load-via-JS approach is even reasonable. All of these examples involved loading the files at the end of the body, with the results being the approximate average of each approach with a simple static site on my local machine. Here they are:

**Standard**: a simple `<script>` tag loading the 300kb file.

**Modern via HTML:** loading the slim version with the `module` / `nomodule` trick.

**Modern via JS:** loading the slim version after feature detection with JS.

Approach   | Queued At | Download Time | Ready to Use
------ | ------ | ------ | ------
Standard | 20ms | 35ms | 55ms
Modern via HTML | 20ms | 15ms | 35ms
Modern via JS | 120ms | 15ms | 135ms

To no surprise, the slimmer file takes less time to download, but when it's loaded via JS, it gets queued to download _far_ later on. The embedded and JS approaches end up comparing something like this:

![Browser Waterfall](waterfall.jpg)

That's significant. And likely due to a couple of reasons:

**First, it takes time to parse and execute JavaScript.** There's a whole lotta information out there on that, with one of the most well-known voices being Addy Osmani and his [Cost of JavaScript talks](https://v8.dev/blog/cost-of-javascript-2019).

**Second (and most primarily), you can't take advantage of the browser's speculative parsing** (also referred to as "preload scanning") when the file you want to download isn't actually embedded into the document. [Milica Mihajlija has a great article on this](https://hacks.mozilla.org/2017/09/building-the-dom-faster-speculative-parsing-async-defer-and-preload/) (which was published on my birthday -- huge).

She explains that when loading the page, not-ancient browsers (meaning those since 2008) don't strictly fetch scripts in the order they appear in the document. Instead, at the start of the page lifecycle, they "speculatively" discover assets that will eventually be needed and start loading them in the background. So, embedded scripts have a huge leg up vs. those loaded by JS, which first have to wait for their time to come in the DOM-building process before they can even _start_ downloading. And that's why that waterfall looks the way it does.

#### Can we make this more performant?

A couple of options did come to mind:

First, I tried loading the scripts in the `<head>` of the document rather than the `<body>`. It didn't help much. I saved around 10-15ms due to the file being queued sooner, which doesn't make up for the ~100ms lost in comparison to embedding those files into the document.

Second, I experimented with preloading the modern bundle in the `<head>` of the page. Queue times were _much_ sooner in the page lifecycle, since speculative parsing can be leveraged, and since older browsers [don't support the preload resource hint](https://caniuse.com/#feat=link-rel-preload), they won't unnecessarily download assets they shouldn't. This sounds good, but it also means that those same browsers will be slave to the gross loading times we discovered above. Depending on your industry, that's often still a _lot_ of users.

So, after all of that, the client-side approach turned out to be less than impressive.

## What does all this mean?

The big implication of this stuff should be pretty obvious: as it's been pitched, differential serving isn't ready for mainstream implementation. As far as I've seen, there's just too much hassle and unpredictability for not enough gain.

And even if it's a matter of waiting for browsers to more consistently handle the `module` / `nomodule` trick, by the time they do, it might not be worth creating two different bundles at all. [Support for ES2015 is getting _really_ good](https://caniuse.com/#feat=es6), with **~91%** of users being on browsers with full support, and **~96%** having at least partial support. And on top of that, the release rhythm for most browsers is pretty quick nowadays -- around every couple of months or so, based on [Chromium's](https://www.chromium.org/developers/calendar) and [Firefox's](https://wiki.mozilla.org/Release_Management/Calendar) release calendars.

The point is that it probably won't be long before "modern JavaScript" will just be understood as "JavaScript," and worrying about getting differential serving down will probably amount to a lot of wasted energy.

## Sorry!

If you read this in anticipation of me revealing a surprise, reliable alternative approach to differential serving... I apologize. At the very least, I hope you've gained some nuggets of insight!
