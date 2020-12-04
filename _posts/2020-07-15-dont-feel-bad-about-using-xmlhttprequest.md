---
title: Don't Feel Bad About Using XMLHttpRequest
ogImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=100"
---

A while back, I began contributing to a small JavaScript library responsible for sending a POST request with some data to an endpoint. At the time, it used [axios](https://github.com/axios/axios) to make that request, and I wanted to simplify things by shedding a dependency. The obvious alternative was `fetch` -- modern, native, and ergonomic.

But in this very particular case, the following bits of context made me wonder if this obvious choice was the _best_ choice. The package...

1. would be distributed amongst several teams
2. had a simple, single responsibility, with little need to do anything after that responsibility had been fulfilled (so, a Promised-based API wasn't a must-have)
3. would need to work for users on IE11 (for _most_ teams -- some had dropped that requirement)

## Where Fetch Held Me Up

The `fetch` API is a welcomed upgrade to making HTTP requests in JavaScript, but in order to leverage it here, teams would need to rely on two different polyfills: the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object, and the `fetch` API itself. And that would mean putting at least a little more burden on the teams who implement it, as well as the users who interact with it:

* It'd require teams supporting IE to set up additional dependencies, which would involve vetting which polyfills to use (there are several for any given API), ensuring none are already being loaded by the application, and potentially working through unforseen issues.
* Unless some sort of [differential serving](https://macarthur.me/posts/should-we-implement-differential-serving) is set up, it'd require most users to download polyfills they don't actually need ([~94%+ are on browsers](https://caniuse.com/#feat=fetch) that support `fetch`).

For my simple needs, this just felt like too much, especially considering the strong culture of performance that exists throughout the organization as a whole.

## Making Prehistoric HTTP Requests

So, I thought back to what our ancestors used to do such things: `XMLHttpRequest`. The O.G. of HTTP requests in JavaScript. I've heard rumors of this thing. The verbosity. The insanity it's left in its wake.

Despite that reputation, I gave it a shot wiring it up. And as it turned out, **for simple requests, most of those rumors were overblown.** After the switch, my implementation went from something like this:

```js
try  {
    let response = await axios.post('http://localhost:4000', {
        name: 'Alex'
    }, {
        headers: {
            'x-api-key': 'my-api-key'
        }
    });

    console.log(response.data);
} catch (e) {
    console.log('Request failed!');
}
```

To something more like this:

```js
const xhr = new XMLHttpRequest();
xhr.open('POST', "http://localhost:4000");
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('x-api-key', 'my-api-key');

xhr.onload = function () {
    if (this.status >= 200 && this.status < 400) {
        console.log(JSON.parse(this.responseText));
        return;
    }

    console.log('Something went wrong!');
};

xhr.onerror = function () {
    console.log('Something went wrong!');
}

xhr.send(JSON.stringify({ name: 'Alex' }));
```

That's a very similar amount of code for virtually the same functionality. **And no polyfills.**

## Why XMLHttpRequest Made Sense

Given all that aforementioned context, a few notable perks surfaced as a result of switching to `XMLHttpRequest`.

### 1. Less code shipped.

Being so old-school in terms of making HTTP requests, [browser support](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Browser_compatibility) isn't even remotely a concern. By using it, teams can avoid loading those polyfills still required to use `fetch` in IE, saving about ~4kb of bundled code (assuming teams would've used these two pretty good polyfills I came across):

|Polyfill|Size (minified)|Size (minified + gzipped)|
|---|---|---|
|[`promise-polyfill`](https://bundlephobia.com/result?p=promise-polyfill@8.1.3)|2.9kb|1.1kb|
|[`unfetch`](https://bundlephobia.com/result?p=unfetch@4.1.0)|1kb|554b|

Those savings aren't monumental, but they shouldn't be scoffed at either, especially considering the low amount of effort on my part, and the fact that those savings will be multipled throughout several different projects.

### 2. Simpler distribution.

Being polyfill-free, I don't need to worry about asking other teams to deal with extra dependencies at all. No vetting process, no added documentation. Just grab the library & go. This also means we'll be avoiding the consequences that arise when teams inevitably fail to read that added documentation.

### 3. Less risky implementation.

When pulling in the package, teams don't need to deal with the array of potential issues that come up from introducing global dependencies, such as double-loading polyfills that are already being pulled in, or subtle differences in how a polyfill behaves relative to the actual specification. Any risk in implementing the library is limited to the package code itself. In general, the JavaScript polyfill landscape is the [wild west](https://twitter.com/BenLesh/status/1283491594327515140), with no guarantees that packages will meet the full specification of an API (in fact, many don't intend to). Being able to sidestep the unavoidable risks in dealing with them is huge.

## Some Common Objections

Despite these good things, there are a few objections I've seen come up a few times:

### 1. We should lean into writing modern JavaScript!

Agreed, but not if that means doing so _for the sake of_ writing modern JavaScript. If "modern" code introduces complexity and costs that could be avoided without a significant amount of effort, there's no shame in going old-school. There's a balance that needs to be found with every project, and more often than not, the "new" might have the best case (in fact, most of the time, I'd just go with `fetch`). But more classic solutions shouldn't be immediately dismissed _exclusively_ because there's a flashier option out there. "It's 2020, use `fetch` already!" is a weak argument to me.

### 2. Isn't XMLHttpRequest deprecated?

No. A _part_ of it ([the ability to make synchronous HTTP requests](https://xhr.spec.whatwg.org/#synchronous-flag)) is in the process of being removed from the platform due to the horrid performance issues that come along with it. But the core API itself isn't going anywhere, and still offers advantages over `fetch`, like [being able to track progress](https://xhr.spec.whatwg.org/#interface-progressevent) on file uploads.

By using `XMLHttpRequest`, you're not just piling on tech debt you'll need to clean up a couple years from now. In fact, choosing it might actually set you up for _less_ work in the future, since you'd otherwise be removing polyfills when they're no longer needed (assuming you currently need to support IE).

### 3. That API is disgusting!

Yeah, it is. That's why I'm placing decent emphasis on it being best for _simple_ requests. The instant the scope of a package goes beyond that, or as soon as you drop IE as a supported browser, `fetch`(or something else) might be a better way to go. Until then, at the very least, play with it for a while instead of dismissing it based off water cooler dev chatter. You'll likely discover (like I did) that it's not nearly as bad as people make it out to be.

### 4. I like my Promise-based API!

Me too! But thankfully, it's easy enough to wrap an `XMLHttpRequest` implementation in a Promise to retain that interface. You'll get those ergonomics, and you'll still have to deal with one less polyfill than if you had gone with something like `fetch`.

```js
const fire = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', "http://localhost:4000");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-api-key', 'my-api-key');

    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                return resolve(JSON.parse(this.responseText));
            } else {
                return reject(new Error('Something went wrong!'));
            }
        };

        xhr.onerror = function () {
            return reject(new Error('Something went wrong!'));
        }

        xhr.send(JSON.stringify({ name: 'Alex' }));
    });
}
```

```js
(async () => {
    try {
        console.log(await fire());
    } catch(e) {
        console.log(e.message);
    }
})();
```

## Sometimes, New _Might_ Not Be Best

It's easy to get excited about advancements to web APIs like `fetch`, and they're very often the best tool for the job. But if we're not careful, it's just as easy to become dogmatic about using newer technologies exclusively because they're new. As you wade these waters, try to keep the full scope of your circumstances in mind -- the users, the needs, the environment, everything. You may find out that the best tool for the job is the one that's been around since your grandma was making HTTP requests.
