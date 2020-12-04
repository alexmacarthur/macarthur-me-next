---
title: Let's Stop Making it Cool to Hate jQuery
ogImage: "https://images.pexels.com/photos/249798/pexels-photo-249798.png?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb"
---

When I started web development, beginning a new project often felt like drowning and then being asked to write JavaScript that worked. At the time, all I needed to do was perform some DOM stuff: make an element disappear on a click, add some classes, animate a dropdown. For all of these tasks, jQuery provided functionality that was simple to implement, reliable across browsers, and most important at the time, easy for me to understand what the heck was going on.

Since then, the native JavaScript API has improved, browsers have stepped up their game, and educational resources have become even more accessible. As a result, dependence on jQuery has expectedly decreased. But along with that, it's also become very cool to hate it with a passionate, fiery rage.

I'll never say that you _can't_ hate jQuery, but you do need to have a legitimate reason you can articulate, because the case to give the library the reverence it deserves is pretty solid, and the case that we should quickly run from it because "😠😠😠JQUERY😠😠😠" is weak and based on some concerns that I think are largely exaggerated.

### jQuery helped make the web -- and you -- what they are today.

Because of how undisputed it is, we don't even need to spend much time discussing the technical problems jQuery helped solve when it was introduced -- the inconsistent browser support of JavaScript features, the lacking or convoluted JS API, and other challenges. The fact that jQuery made development a heck of a lot faster and easier isn't questioned. And for that, it deserves respect, as well as for the impact it had on the evolution and adoption of the language leading up until today.

On top of that, there's a good chance it also left a mark on who you are as a developer. Especially if you consider yourself to be self-taught, the authors of jQuery helped make entry into and competency within this field a little more seamless. In fact, if it weren't for the smoother learning curve jQuery provided, some developers might have thrown in the towel altogether.

Of course, I'm mainly speaking from personal experience. When I started myself, working with `$('.class').slideUp()` was far less intimidating than trying to first write a CSS class with an easing transition, and then apply that class with `document.querySelector('.class').classList.add('my-class')`. I was able to do the work required of me with less training and time, and it gave me a level of satisfaction through my productivity that kept me interested in sticking with the discipline. Thanks to the easy-to-grasp-and-get-crap-done API the library provided, jQuery (and other libraries like it) undeniably played a role in how effectively I became immersed in the field.

_**"But if you're gonna learn JavaScript, learn JavaScript! Not some abstraction of it!"**_ Agreed, but take note of the type of people I'm discussing here. I'm not focusing on the people who have dedicated time to exclusively _learn_ from the ground up, like individuals in a code boot camp or some other structured learning. I'm speaking of the people who are already in the trenches, in that increasingly common position of being asked to do the work while simultaneously learning what all of it means. In these cases, developers can't afford to slow their pace of production by diving into the fundamentals of JavaScript and abstain from learning jQuery first, which often already lays hold of the codebase in which they're working. For these people, jQuery allowed people to deliver the value being asked of them, while serving as a catalyst to immerse them into the field of web development and thereby catapulting them into continued learning.

### It's probably not hurting anybody.

While a lot of the dismissal of jQuery often just sounds like "because jQuery," one of the more common concrete objections is the performance implications of using or sticking with the library. And it usually comes in two parts.

**_"jQuery is BLOATED!"_** Great concern, but if we're loading our scripts like we should -- at the bottom of the page, where they don't block page rendering -- this concern becomes significantly less, uh... significant. It's not a free pass on library size, since the time required to load, parse, and execute JavaScript does impact user experience, but to fiercely dismiss a library because of the 30kb of minified, gzipped weight it adds to your application just isn't good enough.

That 'good enough' level drops even further when you consider how willing we are to throw in other modern packages of similar file size without much thought. Often, the same people who want to violently kill jQuery are the same ones who are completely fine loading React or Vue onto a page for a relatively small feature. Just take a glance at the weight of React specifically, which is, at best, approximately the same in foot print size, and at worst, even heavier than jQuery, minified and gzipped.

```
React 16.2.0 + React DOM = ~32KB
jQuery 3.3.1 = ~30KB
```

But despite these numbers, for some reason, because React is React, "bloat" is much further down on the list of concerns, regardless of the context of its use.

Fine. What about the people who are concerned less about file size and take more serious issue with the performance of the library itself?

**_"jQuery is an unperformant abstraction!"_** This is the objection to jQuery in which I place the most sympathy. I like it when my JavaScript does things fast and efficiently, and specifically when it comes to DOM manipulations, other libraries (like React or Vue) of similar size just perform better than jQuery. But relying on this comparison just doesn't work, because the libraries weren't designed to compete in the same way. From the beginning, jQuery was largely used to alleviate beef we had with browsers and to make singular tasks a little easier. React, on the other hand, is designed to build reactive, declarative, state-managed user interfaces. Because of the way React is designed, it's no surprise DOM manipulation is faster, but I'd never dream of swapping out jQuery with React to handle simple, separated interactions because of that. Apples and oranges.

Related to that, the circumstances in which jQuery is often used just doesn't warrant this type of performance. I'm _not_ saying it's unimportant -- just that it's not worth upending your workflow just to gain a few more performance points. The ROI of rushing to strip out jQuery on this basis alone is tremendously low, making it another insufficient excuse to hate it. Sometimes, it's just a marketing site, and no one's going to leave your site enraged that your pop-up modal didn't perform a few milliseconds faster.

### But! You probably shouldn't use jQuery for a new project.

Don't think I'm trying to make the case that we should still lean toward grabbing jQuery for a new project. I'm not. As I've said, the state of browsers' modern JavaScript API is _good_ -- good enough that your time is probably better spent learning vanilla JavaScript rather than an abstraction, and all things being equal, we should be reaching for the API that performs better too. Read that crisp & clear:

**If you're starting a new project, I _don't_ think jQuery should be on the list of resources to leverage.**

But if you're working with a codebase that incorporates jQuery, it _really is OK_ to keep using it. You're not a bad person, and you're not a crappy developer. In fact, if you're probably one of the smarter ones, because you're not frantically running from a library that still does a darn good job at what it was designed to do.

So, don't fret. When the time is right, dispose of jQuery. But when you do, do it out of smart decision making -- when the time is right, when the ROI is significant, and when your project calls for it. Nothing else.
