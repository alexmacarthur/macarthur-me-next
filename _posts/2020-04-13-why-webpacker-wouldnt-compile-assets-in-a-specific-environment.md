---
title: Why Webpacker Wouldn't Compile Assets in a Specific Environment
ogImage: https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200
---

A while back, I started working in a Rails application in which I needed to introduce a JavaScript file that'd be compiled with Webpacker. To do so, I created the file in my `packs` directory and loaded it up via `content_for`:

```erb
<% content_for(:body_assets) do %>
  <%= javascript_pack_tag("some-file") %>
<% end %>
```

Locally, things worked great! But once I deployed, integration tests running in the CI pipeline would unexpectedly fail, even though the same tests were _passing_ on my machine. After some time spent troubleshooting, it turned out to be one primary issue, which was drawn out by my misunderstanding of how Webpacker loads configuration settings for an environment. This is a quick review of the entire debugging process.

## Problem #1: A `manifest.json` file wasn't being generated.

As Rails is running a request and the `javascript_pack_tag` method is encountered, it'll reference a `manifest.json` file in order to load the correct assets. If that file doesn't exist, Rails vomits. This is the sort of error you'll see:

```
ActionView::Template::Error: Webpacker can't find some-script in /my/app/path/public/packs/manifest.json. Possible causes:

1\. You want to set webpacker.yml value of compile to true for your environment
   unless you are using the `webpack -w` or the webpack-dev-server.
2\. webpack has not yet re-run to reflect updates.
3\. You have misconfigured Webpacker's config/webpacker.yml file.
4\. Your webpack configuration is not creating a manifest.
```

This made sense. Upon deploy, Webpacker was apparently not being told to compile assets _before_ requests were made or _as_ they were made, and so that file was never getting correctly generated.

### Solution: Ensure my `webpacker.yml` file has `compile` set to `true`.

In all of my environments _except_ `production`, I wanted to set `compile` to `true`, so that on each request, Rails would check to see if it needs to compile assets before continuing. Instead of duplicating this change in my `development` and `test` environments, I opted to make it the default, since `production` already had it explicitly set to `false`.

```yaml
default: &default
    compile: true

development:
  <<: *default
    # other settings...

test:
    <<: *default
    # other settings...

production:
  <<: *default
  compile: false
    # other settings...
```

I felt good about this... until it failed.

## Problem #2: Webpacker wasn't respecting default settings in its configuration file.

After some brief internal rage, I noticed a particular log that I must have passed over earlier:

```
RAILS_ENV=build environment is not defined in config/webpacker.yml, falling back to production environment
```

My tests were being run in the `build` environment -- not `test`. And as it turns out, **Webpacker will fall back `production` if it can't find the specified environment.** _This_ is why my assets weren't being compiled. A `build` environment wasn't set in my Webpacker configuration file, so it was falling back to `production`, which was explicitly telling Webpacker to _not_ compile assets.

### Solution: Ensure my environment exists in the `webpacker.yml` file.

Like most bugs that tempt you to rip your hair out, the solution turned out to be two lines:

```yaml
build:
    <<: *default
```

Sure, enough. All was green after that change.

## Key Takeaway: Read Your Logs Good.

What bit me here is some assumptions I made about how Webpacker loaded a configuration. The amount of time dealing with the consequences of those assumptions might have been avoided if I had been just a little more thorough in reading through the error logs. Don't make this mistake yourself!
