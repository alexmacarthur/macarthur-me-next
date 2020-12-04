---
title: Build Your Own Simple Lazy Loading Functionality in WordPress
last_updated: "2020-09-08"
ogImage: "https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg"
---

When you're looking to incorporate any given feature into your WordPress application, there's rarely a shortage of third-party plugins out there to make it happen. But sometimes, whether you're trying to avoid the inevitable complexity an unfamiliar third-party plugin introduces, or for some other reason, you might feel called to take a stab at developing that feature on your own. Lazy loading images could be one of these features, and fortunately, it's fairly simple to set it up yourself and start reaping the performance benefits.

I'm assuming here that you have full development dominion over your WordPress application, and that you're relatively familiar with the [WordPress Plugin API](https://codex.wordpress.org/Plugin_API) -- the characteristic hook system that makes WordPress development as flexible as it is. While we _could_ set up lazy loading without a plugin by putting everything inside your theme's `functions.php` file, we'll be rolling our own extremely basic plugin. This is generally a good idea over just using your theme -- it'll separate concerns a little better, you'll be able to switch themes without losing functionality, and it'll be easy to toggle whenever like, which is particularly helpful when debugging.

_Know this:_ I won't be going in-depth on the philosophy of what makes a well-crafted WordPress plugin. Experiment and argue about all that jazz on your own. I'm just gonna give you the bare bones of what it takes to make a lazy loading plugin with just a few lines of code. Let's get started.

## Set Up Your Plugin
In your plugins directory, create a `simple-lazy-loading` directory and a file inside it named `simple-lazy-loading.php`. Open that file, and place the following at the top:

```php
<?php
/*
* Plugin Name: Simple Lazy Loading
*/
```

At bare minimum, you now have a plugin that can be activated in the the WordPress admin. Head there and switch it on.

![Activate Simple Lazy Loading Plugin](simple-lazy-loading.jpg)

After you've done that, open up the file you just created and we're ready to go!

## Let's Get Lazy

You can lazy load a lot of things, but here, we're just focusing on lazy loading images stored in your WordPress database that are spit out as post or page content. Basically, images you upload and use via the WordPress admin.

To do this, let's use [Lozad](https://github.com/ApoorvSaxena/lozad.js) for our lazy loading JavaScript library. It has no jQuery dependency, appears to be pretty actively maintained, and it leverages the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), which will get you better performance, especially as browser support grows in the future. In the meantime, there's a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) you can include.

### Getting Lozad Up on Its Feet

**First, enqueue the Lozad library.** We'll also want to throw in the official W3C polyfill for the Intersection Observer API. We'll enqueue both of these in the footer because we're responsible web developers and don't want these scripts to block page rendering.

```php
add_action('wp_enqueue_scripts', function () {
   wp_enqueue_script( 'intersection-observer-polyfill', 'path-to-intersection-observer.js', [], null, true );
   wp_enqueue_script( 'lozad', 'https://cdn.jsdelivr.net/npm/lozad@1.3.0/dist/lozad.min.js', ['intersection-observer-polyfill'], null, true );
});
```

**Next, initialize Lozad.** Out of the box, a "lozad" class is used to watch for elements to be lazy loaded, but since we're going to modify the configuration a bit anyway, let's change that to a more generic "lazy-load" class. Also, note that I'm just using `wp_add_inline_script` here, since the amount of JS we're writing is small. You're welcome to put that in a separate JS file -- just make sure it executes after `lozad` is loaded.

```php
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script( 'intersection-observer-polyfill', 'path-to-intersection-observer.js', [], null, true );
    wp_enqueue_script( 'lozad', 'https://cdn.jsdelivr.net/npm/lozad@1.3.0/dist/lozad.min.js', ['intersection-observer-polyfill'], null, true );
    wp_add_inline_script( 'lozad', '
        lozad(".lazy-load").observe();
    ');
});
```
_Neat! But what if I don't want to target elements by class?_ No problem! Instead of defining a class to be watched, you can pass in a `NodeList`. In that case, our `wp_add_inline_script` section would look something more like this:

```php
wp_add_inline_script( 'lozad', '
	var myElements = document.querySelectorAll("#main img");
	lozad(myElements).observe();
');
```
If we set things up this way, Lozad will watch for any images that are children to `#main`.

**Our next step is to add our target class to every image we want to lazy load, as well as change the `src` attribute to `data-src`.** This will prevent the browser from loading the images by default (which would block the rest of the page from rendering), and only do so when `lozad` changes `data-src` back to `src`, which will happen when users scroll to those images.

For any images on custom pages outside of the WordPress database, it's pretty easy to set up the attributes we need. Just manually do it. Unfortunately, working with the images that are stored in the database will require that we filter everything via `the_content` hook. I don't _love_ the idea of having to filter post content like this, but if you're properly caching your site like you should be, this is less of an issue, at least in terms of performance.

```php
add_filter('the_content', function ($content) {
	//-- Change src to data attributes.
	$content = preg_replace("/<img(.*?)(src=)(.*?)>/i", '<img$1data-$2$3>', $content);

    	//-- Change srcset to data attributes.
    	$content = preg_replace("/<img(.*?)(srcset=)(.*?)>/i", '<img$1data-$2$3>', $content);

	//-- Add .lazy-load class to each image that already has a class.
	$content = preg_replace('/<img(.*?)class=\"(.*?)\"(.*?)>/i', '<img$1class="$2 lazy-load"$3>', $content);

	//-- Add .lazy-load class to each image that doesn't already have a class.
	$content = preg_replace('/<img((.(?!class=))*)\/?>/i', '<img class="lazy-load"$1>', $content);

	return $content;
});
```

We're doing three separate things with our filter here.

* Changing `src` and `srcset` attributes to `data-src` and `data-srcset` on each image.
* Adding a `lazy-load` class to each image so Lozad can properly target the images we want to lazy load.
* Adding a `lazy-load` class to each image that doesn't already have a class attached to it.

**Technically, you're done.** Now, each page on which you have content populated from the WordPress editor, images should _not_ load by default, and instead load only when they come into view. But that might not be good enough.

### Let's Make It All Prettier

If images only load when they come into view, you'll see an ugly pop on the page when that happens. To make everything happen in a prettier fashion, we have some options at our disposal.

**Let's adjust the `rootMargin` so images start loading when they're _about_ to come into view.** This way, they can be ready to go before the user even gets there, and everything will appear much more seamless. Go back to our `wp_add_inline_script` call:

```php
wp_add_inline_script( 'lozad', '
	lozad(".lazy-load", {
		rootMargin: "300px 0px"
	}).observe();
');
```

Now, when images come within 300px of being visible, Lozad will trigger them to start loading. Feel free to adjust that value as you see fit.

**We can also add a class after our images load, so they fade in a super pretty, majestic way.** Do that by adding a `loaded` callback:

```php
wp_add_inline_script( 'lozad', '
	lozad(".lazy-load", {
		rootMargin: "300px 0px",
		loaded: function (el) {
			el.classList.add("is-loaded");
		}
	}).observe();
');
```

And add some CSS that'll hide the images until they're fully loaded, and then allow them to fade in. Note that if you do add the following CSS, you'll need to enqueue it in a stylesheet or by some other means.

```css
.lazy-load {
    transition: opacity .15s;
    opacity: 0;
}

.lazy-load.is-loaded {
    opacity: 1;
}
```

Neat! Now, every image will now have an `opacity` of `0`, until they're loaded in, when `is-loaded` will fade them in.

### Soon, This May All Be Meaningless

Lazy loading is a good, responsible thing to implement, but, all of this will likely be possible by default in browsers. In fact, [Chromium-based browsers and Firefox already do have a native API for it](https://web.dev/native-lazy-loading/). So, pay attention. In a short while, all of what I've just showed you might be pointless, and I will need to put a sad disclaimer at the top of this post that you might just be wasting your time by reading this.

Hope this helps!
