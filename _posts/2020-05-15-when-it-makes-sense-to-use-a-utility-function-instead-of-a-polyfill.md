---
title: When It Makes Sense to Use a Utility Function Instead of a Polyfill
ogImage: >-
  https://images.unsplash.com/photo-1553343801-5d4a45829f2a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=100
---

Modern iterations of JavaScript have introduced some nice methods that make writing code a lot more legible, performant, and fun to write. Take, for example, the `find()` method on the `Array` prototype, which allows you to elegantly retrieve the first item in an array that meets some condition.

```js
const players = [
  {id: 3, name: "Bob"},
  {id: 9, name: "Bill"},
  {id: 2, name: "Baker"},
  {id: 4, name: "Bo"},
];

const player = players.find(p => p.id === 9);

// {id: 9, name: "Bill"}
```

Features like this are slick, so it's a bummer when they're not supported by your target browsers (like IE11). In those situations, it's tempting to reach for the closest polyfill you can find, `npm install`, and press forward. But if you're striving to keep your bundle size as slim as possible, **your best option _might_ be to write a utility function instead.**

## Polyfills Can Be Fat

In many (if not most) cases, polyfill authors aim to keep their packages as close to the official specification as possible, or attempt to bridge the slight differences in how various browsers implement that feature. This makes sense -- they're written to be distributed and (often) to align with an established standard, and so they need to behave predictably and consistently regardless of how a consumer chooses to implement them.

Consider that `find()` method. It sounds simple, but with a good share of polyfills out there, you get a lot more than what you might expect (or need). [The one provided by MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill), for example, makes up 1,327 bytes:

```js
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      // 1\. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2\. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3\. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }

      // 4\. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5\. Let k be 0.
      var k = 0;

      // 6\. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7\. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}
```

And from what I can find, that's a pretty common thing. The `Array.prototype.fill()` polyfill weighs in at about [928 bytes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill), `Array.prototype.findIndex()` comes in at [1,549 bytes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill), and `Array.from()` sits at [2,665 bytes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill).

The range in file size will obviously vary from polyfill to polyfill, but the implication is still clear. These tools aren't built to satisfy you and your specific context, and so that means you'll likely be subscribing to more than what your circumstances require by leveraging them.

## A Small Utility May Save You Some Bytes

When you don't need the full scope of what a polyfill provides, you can shave some bundle weight by rolling something more specific to you. And depending on the method, it often doesn't take much. Gander at these few examples from methods I fairly commonly use:

### A Simple `Array.prototype.find()` Utility

Looking at `find()` once again, a suitable utility method might look like this:

```js
const find = (arr, func) => {
  for(let index = 0; index < arr.length; index++) {
    if(func.call(this, arr[index], index)) {
       return arr[index];
     }
  }

  return undefined;
}

const players = [
    {id: 3, name: "Bob"},
    {id: 9, name: "Bill"},
    {id: 2, name: "Baker"},
    {id: 4, name: "Bo"},
];

const player = find(players, p => p.id === 9);

// {id: 9, name: "Bill"}
```

### A Simple `Array.prototype.findIndex` Utility

And that could be easily converted into a `findIndex()` utility as well:

```js
const findIndex = (arr, func) => {
  for(let index = 0; index < arr.length; index++) {
    if(func.call(this, arr[index], index)) {
       return index;
     }
  }

  return undefined;
}

const players = [
    {id: 3, name: "Bob"},
    {id: 9, name: "Bill"},
    {id: 2, name: "Baker"},
    {id: 4, name: "Bo"},
];

const player = findIndex(players, p => p.id === 9);

// 1
```

### A Simple `Array.from()` Utility

If you're simply looking to convert something like a `NodeList` into an array, you could use something like this, which in this case, performs virtually the same function as `Array.from()` (in this case), and doesn't require that you ship those extra 2,665 bytes.

```js
const arrayFrom = (arrayLikeThing) => {
  return [].slice.call(arrayLikeThing);
}

arrayFrom(document.querySelectorAll('span'));

// [ ...array of nodes ]
```

### A Simple `Array.prototype.fill()` Utility

For one more example, here's how a simple utility method for `fill()` might look:

```js
const fill = ({array, value, start = 0, end = undefined}) => {
  end = end ? end + 1 : array.length;
  array.splice(
    start,
    end - start,
    array.slice(start, end).map(i => value)
  );
  return [].concat.apply([], array);
}

fill({
  array: [1, 2, 3, 4, 5],
  value: "x",
  start: 1,
  end: 3
});

// [ 1, 'x', 'x', 'x', 5 ]
```

Again, none of these utilities serve as a straight-up replacement for what any of the native APIs provide, and **they're not intended to do everything a polyfill would do.** But they get _your_ job done, they're light, and it's reasonably straightforward to build them yourself.

## What about ready-made utility libraries?

You might be thinking of something like [Lodash](https://lodash.com/) here. Depending on your needs, that might be a suitable choice. Still, similar tradeoffs exist in choosing to leverage tools like this rather than whipping up a utility more unique to your needs. Libraries like Lodash are intended for wide distribution, and so the methods they provide often just do more than what your specific circumstances require.

For example, our `findIndex` implementation was less than 10 lines of code. But Lodash's version is [11 lines](https://github.com/lodash/lodash/blob/4.6.0-npm-packages/lodash.findindex/index.js#L1743), and it also depends on a shared `baseFindIndex` method, which accounts for [_another_ 11 lines](https://github.com/lodash/lodash/blob/4.6.0-npm-packages/lodash.findindex/index.js#L175).

Libraries like this can provide confidence that writing your own utilities may not, and it may also be a slimmer approach than pulling in a polyfill. But even so, you'll probably be signing up for a bit of weight that you could likely avoid by rolling something yourself.

## Sometimes, a Polyfill _Does_ Make Sense

This definitely isn't a blanket prescription for how you should handle feature support for older browsers. Depending on the context, it might make perfect sense to include a polyfill, lean on a utility library, or do nothing at all. A few scenarios come to mind:

- **You're writing a library to be distributed.** If that's the case, you might want to leave your code as-is and instead require consumers to polyfill themselves when needed. This is helpful because it'll lessen package size for a majority number of people, while still providing a path forward for the minority. In fact, it's the approach I take with [TypeIt](https://typeitjs.com/). I don't include API polyfills for IE and older, but I do document which ones people will need to include themselves, should they need to support an older browser.
- **You use a particular feature a lot.** If it's become a habit to leverage a given feature, and each context is slightly varied, it might make sense to pull in a comprehensive polyfill. That piece of code, albeit beefy, might cover more specification gotchas between each implementation, and may also make it easier to transition away from the polyfill when native browser support becomes adequate. Not to mention, the ergonomics of some of these APIs are really good, and it may be worth the efficiency gains in developers getting to lean into them.
- **You practice differential serving.** It's possible to automatically polyfill based on your target browsers using tools like [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#usebuiltins). If you're automating it like this, it's become a popular pattern to generate two separate bundles -- one for modern consumers, and one for legacy. This way, _most_ people get a slimmer bundle, and you can freely use certain features without worrying so much about the added bloat.
- **Ain't got time 4 dat.** It takes time to roll a utility function, and when you do, there's always the chance you'll miss something that a polyfill might have covered for you. That makes for the potential to spin your wheels when there may have been a better ROI by simply pulling in that polyfill.

## Whatever You Do, Mind Your Bundle.

Especially when so many resources are quickly available via `npm install`, it's easy to lose sight of what's actually ending up in your bundle (and what that means for your users). So, no matter how you approach providing new-ish features to your application, do it with your production code in mind.

Thanks for reading!
