---
title: When a JavaScript Map() Actually Came in Handy
ogImage: https://images.pexels.com/photos/2859169/pexels-photo-2859169.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1200
---

Back when I was working on [slide-element](https://github.com/alexmacarthur/slide-element), I noticed an issue that would occur when I rapidly toggled an element open & closed. If the previous animation wasn't allowed to finish, the new one would eventually get outta whack, clipping the content on subsequent animations.

![slide-element-bad.gif](./slide-element-bad.gif)

## The Cause of the Weirdness

This was happening because each time an animation was triggered, I was grabbing the current "raw" height of the opened element, regardless of whether it was in the middle of an active animation. The library uses the Web Animations API, so the frame construction looked like this:

```jsx
// For each trigger, animate between zero and the `clientHeight` of the element.
let frames: ["0px", `${element.clientHeight}px`].map((height) => {
    return { height, overflow: "hidden" };
});
```

To fix it, I needed to calculate and cache the expanded height once when `slide-element` is first used, and then refer back to that cached value every time an animation is triggered. That way, for each page load, there'd be one, fixed expanded height value to animate to and from, and no more weirdness caused by rapid clicking.

## Weighing Solutions

Storing that value is easy enough to store on the `window` object (#dealwithit). What made it more complicated was that there could be _several_ sliding elements on a page at once. So, a single `window.slideElementExpandedHeight` variable wouldn't cut it.

It also crossed my mind to store `key:value` pairs of elements and their respective heights in that single window object. But that'd mean I'd need to find or require some unique identifier (like an ID attribute) for each target element in order to store their heights. And that's a library change I wasn't interested in.

But then I recalled a new-ish native JavaScript object that allows you to use _any_ value as a key -- the [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object.

## Using DOM Nodes as Keys

Using a `Map`, which enjoys very strong [browser support](https://caniuse.com/mdn-javascript_builtins_map), DOM nodes themselves (since they're objects, after all), can serve as the keys to any given values you need to store. For example:

```html
<span id="thing" class="thing">a thing.</thing>

<script>
const myMap = new Map();

// Set a value to a specific node reference.
myMap.set(document.getElementById('thing'), 'some value');

// Access that value by passing the same reference.
console.log(myMap.get(document.querySelector('.thing')); // 'some value'
</script>
```

With this tool at my disposal, rigging up an expanded height cache for each target element became relatively straight forward:

1. Create a dedicated `Map` for storing expanded element heights.
2. When `slide-element` is called on an element, create a key in that Map and store the full, pre-animated height.
3. Whenever it's needed, first check that Map for the height for the respective node.

In rather contrived & simplified code, the logic came to look something like this:

```javascript
function getExpandedHeight = () => {
 // We already have the calculated height.
 if(window.seCache.get(element)) {
     return window.seCache.get(element);
 }

 // This is the first run. Calculate & cache the full height.
 element.style.display = "block";
 window.seCache.set(element, element.clientHeight);
 element.style.display = "none";

 return window.seCache.get(element);
}

// For each trigger, animate between zero and the `clientHeight` of the element.
let frames: ["0px", `${getExpandedHeight()}px`].map((height) => {
  return { height, overflow: "hidden" };
});
```

## Way More Useful Than I Thought

For whatever reason, I didn't think there'd be much utility to a brand new JavaScript object that enables you to use objects as keys, as well as anything other feature it offered (why wouldn't a basic object cover my every need?). So, when I finally came across a use case for it, I got pretty pumped. Hopefully, this all nudges your mind to think of the tool when the appropriate need arises.

Apologies to whomever proposed this thing.
