---
title: For the Sake of Your Event Listeners, Use Web Workers
ogImage: >-
  https://images.unsplash.com/photo-1542044801-30d3e45ae49a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1200&q=100
---

I've been tinkering with the [Web Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) lately, and as a result, I'm really feeling the guilt of not looking into this well-supported tool a lot sooner. Modern web applications are seriously upping demands on the browser's main thread, impacting performance and the ability to deliver smooth user experiences. This tool is just one way to address the challenge.

## Where Things on('click')ed for Me

The advantages of Web Workers are many, but things really clicked for me when it came to the several DOM event listeners in any given application (form submissions, window resizes, button clicks, etc.) These all necessarily live on the browser's main thread, and if that thread is congested by a long-running process, the responsiveness of those listeners begins to suffer, stalling the entire application until the event loop is free to continue firing.

Admittedly, the reason listeners stick out to me so much is due to my initial misunderstanding about the problems Workers are meant to solve. At first, I thought it was mainly about the _speed_ of my code execution, start to finish. "If I can do more on separate threads in parallel, my code will execute so much more quickly!" But! It's pretty common to _need_ to wait for one thing to happen before another can start, like when you don't want to update the DOM until some sort of calculation has taken place. "If I'm gonna have to wait anyway, I don't see the point of moving something into a separate thread," naive me thought.

Here's the type of code that came to mind:

```javascript
const calculateResultsButton = document.getElementById(
  "calculateResultsButton"
);
const openMenuButton = document.getElementById("#openMenuButton");
const resultBox = document.getElementById("resultBox");

calculateResultsButton.addEventListener("click", (e) => {
  // "Why put this into a Worker when I
  // can't update the DOM until it's done anyway?"
  const result = performLongRunningCalculation();
  resultBox.innerText = result;
});

openMenuButton.addEventListener("click", (e) => {
  // Do stuff to open menu.
});
```

Here, I update the text of a box after performing some sort of presumably heavy calculation. Doing these things in parallel would be pointless (the DOM update necessarily depends on the calculation), so _of course_ I want everything to be synchronous. What I didn't initially understand was that **none of the _other_ listeners can fire if the thread is blocked**. Meaning: things get janky.

## The Jank, Illustrated

In the example below, clicking "Freeze" will kick off a synchronous pause for three seconds (simulating a long-running calculation) before incrementing the click count, and the "Increment" button will increment that count immediately. During the first button's pause, the whole thread is at a standstill, preventing _any_ other main thread activities from firing until the event loop can turn over again.

To witness this, click the first button and immediately click the second.

<iframe height="500" style="width: 100%;" scrolling="no" title="Event Blocking - No Worker" src="https://codepen.io/alexmacarthur/embed/XWWKyGe?height=265&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/alexmacarthur/pen/XWWKyGe'>Event Blocking - No Worker</a> by Alex MacArthur
  (<a href='https://codepen.io/alexmacarthur'>@alexmacarthur</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Frozen, because that long, synchronous pause is blocking the thread. And the impact goes beyond that. Do it again, but this time, immediately try to resize the blue-bordered box after clicking "Freeze." Since the main thread is also where all layout changes and repainting occur, you're yet again stuck until the timer is complete.

## They're Listening More Than You Think

Any normal user would be annoyed to have to deal with an experience like this -- and we were only dealing with a couple of event listeners. In the real world, though, there's a lot more going on. Using Chrome's `getEventListeners` method, I used the following script to take a tally of all event listeners attached to every DOM element on a page. Drop it into the inspector, and it'll spit back a total.

```javascript
[document, ...document.querySelectorAll("*")].reduce((accumulator, node) => {
  let listeners = getEventListeners(node);
  for (let property in listeners) {
    accumulator = accumulator + listeners[property].length;
  }
  return accumulator;
}, 0);
```

I ran it on an arbitrary page within each of the following applications to get a quick count of the active listeners.

| Application     | Number of Listeners |
| --------------- | ------------------- |
| Dropbox         | 602                 |
| Google Messages | 581                 |
| Reddit          | 692                 |
| YouTube         | 6,054 (!!!)         |

Pay little attention to the specific numbers. The point is that the numbers are big, and **if even a single long-running process in your application goes awry, _all_ of these listeners will be unresponsive.** That's a lot of opportunity to frustrate your users.

## Same Illustration, but Less Jank (Thx, Web Workers!)

With all that in mind, let's upgrade the example from before. Same idea, but this time, that long-running operation has been moved into its own thread. Performing the same clicks again, you'll see that clicking "Freeze" still delays the click count from being updated for 3 seconds, but it _doesn't block any other event listeners on the page_. Instead, other buttons still click and boxes still resize, which is exactly what we want.

<iframe height="500" style="width: 100%;" scrolling="no" title="Event Blocking - Worker" src="https://codepen.io/alexmacarthur/embed/qBEORdO?height=265&amp;theme-id=default&amp;default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/alexmacarthur/pen/qBEORdO'>Event Blocking - Worker</a> by Alex MacArthur
  (<a href='https://codepen.io/alexmacarthur'>@alexmacarthur</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

If you dig into that code a bit, you'll notice that while the Web Worker API could be a little more ergonomic, it really isn't as scary as you might expect (a lot of that scariness is due to the way I quickly threw the example together). And to make things even _less_ scary, there are some good tools out there to ease their implementation. Here are a few that caught my eye:

- [workerize](https://github.com/developit/workerize) -- run a module inside a Web Worker
- [greenlet](https://github.com/developit/greenlet) -- run an arbitrary piece of async code inside a worker
- [comlink](https://github.com/GoogleChromeLabs/comlink) -- a friendly layer of abstraction over the Web Worker API

## Start Threadin' (Where It Makes Sense)

If your application is typical, it probably has a lot of listenin' going on. And it also probably does a lot of computing that just doesn't need to happen on the main thread. So, do these listeners and your users a favor by considering where it makes sense to employ Web Workers.

To be clear, going all-in and throwing literally _all_ non-UI work into worker threads is probably the wrong approach. You might just be introducing a lot of refactoring & complexity to your app for little gain. Instead, maybe start by identifying notably intense processes and spin up a small Web Worker for them. Over time, it could make sense to stick your feet in a little deeper and rethink your UI/Worker architecture more at a wider scale.

Whatever the case, dig into it. With their solid browser support and the growing performance demands of modern applications, we're running out of reasons to not invest in tools like this.

Happy threadin'!
