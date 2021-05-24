---
title: 'The Time I (Sorta) Had a Real Use Case for a Bitwise Operator in Client-Side JavaScript'
ogImage: >-
  https://images.unsplash.com/photo-1569338270981-4159a7818c13?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=100
---

There's a certain number of JavaScript features that I've never really used and find highly intimidating. Bitwise operators are among them.

These operators exist for manipulating binary representations of data, and for the type of work I usually do, I've never met a scenario when I've needed to dive into nitty-gritty bit handling. As far as I imagined, they'd only be useful to NASA engineers writing their newest rover's operating system, or something else super cerebral.

But then I found myself working on [a project](https://github.com/alexmacarthur/slide-element) with an explicit priority to shave off as many bytes as possible. As it turns out, a bitwise operator could be shoehorned into supporting that objective. And at this point, I'd take any shot at justifying me spending time understanding what they do and how they work. So, I went for it.

## Quick Overview of Bitwise

There's a ton of great documentation out there that'll do a better job of explaining the what, why, and how of JavaScript's bitwise operators, but for some quick context (as well as some practice explaining this stuff myself), here's a brief overview.

The data used in the applications we build are represented by multiple bits -- 1s and 0s -- that are pieced together to make up bytes of information. For example, the numbers `10`, `20`, and `30` are represented by the following bit sequences:

```
01010 // 10
10100 // 20
11110 // 30
```

JavaScript's bitwise operators allow us to perform operations on the individual, corresponding bits of two values, which results in a new binary sequence. Several operators exist -- AND, OR, XOR, and more -- all of which compare bits in a different way.

Let's use the bitwise AND (&) operator to illustrate. This operator will spit out a `1` when the bits in a certain positioned are both `1`. So, if we wanted to know the result of a bitwise AND operation between `20` and `30` in JavaScript, we might write something like this:

```js
console.log(20 & 30);
// 20
```

To "show our work" in that operation, we can stack the binary representations of each number on top of each other, and then compare the values in each position. If they're both `1`, the output for that position is `1`:

```
// Moving vertically, compare each bit.
// If both are `1`, the resulting bit is `1`.

10100 // 20
11110 // 30
-----
10100 // 20
```

Similarly, the OR (|) operator returns a `1` if either of the corresponding bits are `1`:

```
// bitwise OR

10100 // 20
11110 // 30
-----
11110 // 30
```

You get the idea.

## My Situation

In my particular case, this sort of operator's usefulness didn't have much to do with the binary values themselves. Rather, it had more to do with allowing me to select a certain array item using the least amount of characters possible. Here's the stage (pared-down quite a bit):

In [slide-element](https://github.com/alexmacarthur/slide-element), I return a Promise after a sliding animation is complete for an element. That animation is powered by a CSS transition, so knowing when to `resolve()` that Promise requires listening for both the `transitionend` and `transitioncancel` events. The former fires whenever an animation is allowed to fully complete (or "end"), and the latter fires whenever it's stopped before completion (or "cancelled"). To attach those listeners, I store them in an array and loop over `addEventListener`, resolving my Promise when an animation is finished.

```js
new Promise((resolve) => {
  const events = ["transitionend", "transitioncancel"];

  events.forEach((event, index) => {
    box.addEventListener(event, (e) => {
      // Animation is done... whether it's completed or cancelled.
      resolve();
    }, { once: true });
  });
}
```

## Cleaning Up Unneeded Event Listeners

Attaching the listeners and resolving the Promise is straightforward enough. Where things get a little more complicated is the cleanup. After an animation is finished, I don't want to let old listeners hang around to potentially cause unexpected behavior or performance bottlenecks.

One thing that helps is setting `{ once: true }` on each event listener I set up. This causes the listener to detach itself after firing, removing the need for me to do it. But the _other_ event listener is left to fend for itself. I went through a couple of approaches to handle this.

### Cleanup Approach #1: Loop & Remove Event Listeners

This option entailed storing my callback as a variable, and then looping over the events whenever one of them is triggered to fire `removeEventListener`, referencing that same callback in memory.

```js
new Promise((resolve) => {
  const events = ["transitionend", "transitioncancel"];

  const callback = (e) => {
    // Whenever one of the events fires, remove all listeners.
    events.forEach(event => {
      event.removeEventListener(event, callback);
    });

    resolve();
  }

  events.forEach((event, index) => {
    box.addEventListener(event, callback);
  });
};
```

This approach worked, but it's a little convoluted, and felt like too much code to do a simple task. As a result, I moved to another tactic that didn't involve `removeEventListener()` at all.

### Cleanup Approach #2: Programatically Trigger the Remaining Listener

This method involves "faking" the event by dispatching a `TransitionEvent` instance on _other_ listener. For example, whenever `transitionend` was triggered, a `transitioncancel` event would kick off to trigger & remove the remaining listener via the `{ once: true }` configuration.

The key piece here is accessing the _other_ event type based on the one that just fired. Conveniently, I was working with an array that had exactly two items, **whose indices would always be binary**, truthy/falsey values (I'd like there to be a term for such an array, but I can't seem to find one). So, I could do something like this:

```js
new Promise((resolve) => {
  const events = ["transitionend", "transitioncancel"];

  events.forEach((event, index) => {
    box.addEventListener(event, (e) => {
      box.dispatchEvent(
        // Trigger the OTHER event listener, in order to remove it.
        new TransitionEvent(EVENTS[index ? 1 : 0])
      );

      resolve();
    }, { once: true });
  });
}
```

But on my byte-shaving crusade, that made my gut twist a bit (lol). If it's a binary value I'm trying to access, I shouldn't need to rely on a ternary to explicitly return either a `1` or a `0`. Thankfully, this is just the sort of low-level calculation bitwise operators are well-suited for. All I was interested in was the _opposite_ boolean value, **making the XOR operator the perfect choice.**

The "exlusive or" operator evaluates to `1` if only _one_ of the operands is `1`. This makes it a great low-level "switch," since it'll flip values whenever one of the operand changes, like the index of a two-item array being looped over.

```js
const items = ['first', 'second'];

// Loop #1: 'first' is the current item.
let index = 0;
console.log(items[index ^ 1]);
// 'second' is the other.

// Loop #2: 'second' is the current item
let index = 1;
console.log(items[index ^ 1]);
// 'first' is the other.
```

Knowing this, I could make a subtle change to my event handling snippet:

```diff
new Promise((resolve) => {
  const events = ["transitionend", "transitioncancel"];

  events.forEach((event, index) => {
    box.addEventListener(event, (e) => {
      box.dispatchEvent(
        // Trigger the OTHER event listener, in order to remove it.
-       new TransitionEvent(EVENTS[index ? 1 : 0])
+       new TransitionEvent(EVENTS[index ^ 1])
      );

      resolve();
    }, { once: true });
  });
}
```

If you're doing the math as you follow along, that change gives me a savings of **four whole characters,** and a fresh understanding of how bitwise operators actually work!

## Was This Solution Worth It?

If you consider the amount of time spent digging into this, and the tangible value it brought to the package, lol, nope. As a friend of mine put it in response to hearing about all of this, it "sounds like a solution looking for a problem."

But! This was a small project of mine for which I chose to make bundle size a big, possibly irrational priority. Pair that with the fact that I'd been itching for a chance to learn about what this bitwise garbage even means and how I could use it, then yes, it was _absolutely_ worth it.

When a moment like this ever arises for yourself, I'd encourage you to do the same. At best, you'll land on a solution with some discernible benefit. At worst, it may not have made much of a difference, but you'll be able to take those learnings with you onto the next thing.

Get bitty!
