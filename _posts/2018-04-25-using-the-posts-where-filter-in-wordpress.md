---
title: "Using the 'posts_where' Filter with WP_Query in WordPress"
date: "2018-04-25"
ogImage: "https://images.unsplash.com/photo-1483736762161-1d107f3c78e1?ixlib=rb-0.3.5&s=761469e5b4fedfc206d9fe3cee4d2d71&auto=format&fit=crop&w=1200&q=100"
---

If you've spent 20 seconds in WordPress development, you've likely worked with, cursed, and fallen in love with the WP\_Query class -- one of the most useful, commonly used tools in any given WordPress website or application.

Aside from being responsible for the main query on any given page or post, it serves as the go-to way to interface with your database in tons of different contexts. Most commonly, you might see it used to retrieve data like custom post types. For example, getting all of the cat massage tutorials in a site:

```php
$massageQuery = new WP_Query([
	'post_type' => 'cat_massage_tutorial',
	'posts_per_page' => -1
]);
```

Even more than that, you can use this class to make slightly more complex queries based on meta data attached to different posts. Let's get all the cat massage tutorials whose difficulty level are above 8:

```php
$massageQuery = new WP_Query([
	'post_type' => 'cat_massage_tutorial',
	'posts_per_page' => -1,
	'meta_query' => [
		[
			'key' => 'difficulty',
			'compare' => '>',
			'value' => 8,
			'type' => 'numeric'
		]
	]
]);
```

That's all really neat, and honestly, relatively common to see. So, let's do something a little more interesting and gather a set of posts not easily queryable by WP\_Query out of the box.

Imagine that we want all of the "long" cat massage tutorials in our database -- those whose content have at least a certain number of characters. This information isn't stored in post meta, so we can't rely on out-of-the-box functionality of WP\_Query. So, how do we collect only the "long" posts in our database?

### One option: Loop through all the things.

We _could_ do something like get all the posts, and then loop over each retrieved post in our PHP, filtering out those under a certain character count. But this is inefficient and bit more cumbersome compared to another option we have.

### Better option: Use the 'posts\_where' filter to modify the 'where' clause in your WP\_Query.

By modifying the SQL query underlying our WP\_Query, the work can be efficiently offloaded to where it _should_ be done, rather than dealing with it elsewhere, like in template logic.

**First, create a WP\_Query object querying for all of our posts.**

```php
$massageQuery = new WP_Query([
	'post_type' => 'cat_massage_tutorial',
	'posts_per_page' => -1
]);
```

**In our arguments, pass a `query_label` key and value. This isn't a WP\_Query option -- it's a totally arbitrary key we're passing that we'll use later to identify our query.**

```php
$massageQuery = new WP_Query([
	'query_label' => 'our_cat_massage_query',
	'post_type' => 'cat_massage_tutorial',
	'posts_per_page' => -1
]);
```
**Next up, we need to filter part of the SQL statement that's retrieving stuff from our database.**

```php
add_filter('posts_where', function ($where, $query) {
	//-- Stuff will go here.
	return $where;
}, 10, 2);
```

**Using the `query_label` key we passed earlier, make sure we're only doing this on our specific query.**

```php
add_filter('posts_where', function ($where, $query) {
	$label = $query->query['query_label'] ?? '';
	if($label === 'our_cat_massage_query') {
		//-- More stuff will go here.
	}

	return $where;
}, 10, 2);
```
**Now, append a condition to the `where` clause of that query.** You'll obviously need to have a baseline understanding of SQL here. In this case, we're grabbing all the posts whose content is more than 1200 characters.

```php
add_filter('posts_where', function ($where, $query) {
	$label = $query->query['query_label'] ?? '';
	if($label === 'our_cat_massage_query') {
		global $wpdb;
		$where .= " AND LENGTH({$wpdb->prefix}posts.post_content) > 1200";
	}

	return $where;
}, 10, 2);
```

Now, our WP\_Query object will return exactly what we defined in our arguments, but within the scope of how we filtered our `where` clause. All _without_ needing to be clever with any other PHP.

### "When am I ever going to need this?"
I don't know. This WordPress development we're talking about. Always be ready.

### "This doesn't make me feel very good."
I'm right there with you. When querying like this, making a WP\_Query object and then writing a filter in a different location is far less than elegant, and I'm certainly open to more effective ways so do this without getting abandoning use of the tool altogether. Do you have a better solution? Share it!

For better or for worse, I hope this will help tackle a task using WP_Query in the future. That said, if you're struggling with this or anything related in your own application, I'm available for hire. [Get in touch](/contact)!
