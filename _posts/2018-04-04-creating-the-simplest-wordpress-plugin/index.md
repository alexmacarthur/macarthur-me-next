---
title: Creating the Simplest WordPress Plugin
ogImage: "https://cdn.pixabay.com/photo/2014/02/13/07/28/wordpress-265132_1280.jpg"
---

If you're making modifications to the functionality of your WordPress site or application, there are _generally_ two places where people put the code to do it.

1. A theme's functions.php file.
2. A plugin.

Given the choice, which option should you almost always choose?

**A plugin.**

Why? The list of reasons is longer than this, but here are the big ones:

**1. Features are better organized and isolated, making it easier to debug.**
For example, if your application is having an issue, you can start by toggling individual plugins rather than your entire theme. If the the bug goes away when a particular plugin has been deactivated, you've just narrowed the down the range of possible causes.

**2. You can update your theme without worrying about losing any unrelated functionality.**
Let's say I've purchased a premium theme and also have a lazy loading plugin installed. When updates are made to the theme, or if I change themes altogether, my lazy loading should be unaffected, because that feature is contained in its own plugin.

I'll probably be referencing this plugin-over-functions.php suggestion in my posts, so here's a brief set of instructions on creating the most basic WordPress plugin you can use to build out a feature for your site. It's void of any opinions on structure, design, or anything else. It's just bare bones framework for making what WordPress recognizes as a plugin it can activate. That's it.

**1. In your `wp-content/plugins/` directory, create a folder named `simplest-plugin`.**

**2. Inside that folder, create a `simplest-plugin.php` file.**

**3. Open up that newly created file and add a header comment.**
There are several pieces of information a plugin's header comment _should_ have, and [you can read about them here](https://developer.wordpress.org/plugins/the-basics/header-requirements/), but I mean it when I say we're creating the _simplest_ plugin, so I'm just going to add a plugin name:

```php
<?php
/*
Plugin Name: Simplest Plugin
*/
```

**4. Confirm the plugin exists and can be activated.**
Head to your `wp-admin/plugins.php` page and scroll down to find your inactive plugin.

![The Simplest WordPress Plugin](simplest-wordpress-plugin.jpg)

It doesn't have much -- no description, version, author, or details, and you _should_ include all of these things, but that's not the point of this post. The point here is that you now have the barest-of-bones framework in which you can build functionality into your site or application.

It's that simple!
