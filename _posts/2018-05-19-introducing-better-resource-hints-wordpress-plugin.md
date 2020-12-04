---
title: Introducing Better Resource Hints, a Performance-Enhancing Plugin for WordPress
ogImage: "https://images.pexels.com/photos/8775/traffic-car-vehicle-black.jpg"
---

It's easy to rattle off a bunch of ways you can improve the performance of your website:

* minify your CSS & JS
* optimize your images
* cache the crap out of it
* use a CDN
* etc.

Those are all important, but there's also a more modern, less-discussed approach that can almost immediately earn you some serious performance points: **resource hints**. Sparing the [long, detailed explanation of what these actually are](https://www.w3.org/TR/resource-hints/), you can think of them as rules you give the browser for how and when it downloads resources needed for your website, including CSS, JS, images, fonts, and any other assets. When the browser follows these rules, your site loads and becomes interactive more quickly, causing metrics like time to interactive and perceptual speed index to improve.

And now, it's a lot easier to implement and manage these hints on your WordPress site.

I just introduced [Better Resource Hints](https://wordpress.org/plugins/better-resource-hints/), a WordPress plugin that enables you to intelligently implement different resource hints for your website with little intimidation or complicated configuration. Just by turning it on, the plugin will take a conservative but effective approach to setting up these hints, and allow you to beef it up if needed.

Specifically, this plugin leverages the following types of hints:

**Preconnecting** – This one is similar to the more common hint “dns-prefetch,” but a more beefier version. Instead of just resolving the DNS as early as possible, the preconnect hint handles TLS negotiations and TCP handshakes, resulting in reduced page latency.

**Preloading** – Preloading occurs when the browser is told it can start downloading an asset in the background early during page load, instead of waiting until the asset is explicitly called to start the process. This hint is most beneficial for assets loaded later on in the page, but are nonetheless essential to the page’s functionality. More often than not, the type of asset that benefits most from this is JavaScript, but it can be used for any type of resource. Enabling this results in an overall faster load time, and quicker time to interactive.

**Prefetching** – Prefetching assets is similar to preloading, but the assets are downloaded in low priority for the purpose of caching them for later use. For example, if a user hits your home page and is likely to go to a page that uses a heavy JavaScript file, it’s wise to prefetch that asset on the home page, so it’s cached and ready to go on the next. Again, the result is a quicker subsequent page load, quicker time to interactive, and an improved overall user experience. This is different from DNS prefetching, which will only resolve the DNS of a resource’s host, and not actually download the resource itself.

**Server Push** – If enabled, server push will tell your server to start delivering an asset before the browser even asks for it. This results in a much faster delivery of key assets, and it be toggled on for both preloaded, prefetched, and preconnected assets. Note: This feature requires a server that supports server push, and is the most experimental strategy this plugin provides.

There's not much to lose here. [Download the plugin](https://wordpress.org/plugins/better-resource-hints/), activate it, and start measuring your performance gains using a tool like Google Lighthouse. Regardless of the results, [let me know!](/contact) I want to know what I can do to make the plugin better in any way.
