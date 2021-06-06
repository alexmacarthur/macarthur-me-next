---
title: Let's Stop Making it Cool to Hate jQuery
lastUpdated: "2021-06-06"
ogImage: "https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&dpr=3&w=1200"
---

When I started in development, beginning a new project often felt like drowning and then being asked to write some functioning JavaScript. At the time, all I needed to do was perform some DOM stuff &mdash; make an element disappear on a click, add some classes, or animate a dropdown. For all of these tasks, jQuery provided functionality that was simple to implement, reliable across browsers, and most important at the time, easy for me to understand what the heck was going on.

Since then, JavaScript APIs and features have matured, browsers have stepped up their game, and educational resources have become even more accessible. As a result, dependence on jQuery has expectedly decreased. But as an unwelcomed side effect, it's also become very cool to dump on it with a passionate, fiery rage.

I won't say that you _can't_ hate jQuery, but you do need to have a legitimate reason that you can articulate, because the case to give the library the reverence it deserves is pretty solid, and the case that we should quickly run from it because "ewwww, it's jQuery" is weak, and based on some concerns that I think are largely out of proportion.

### jQuery helped make the web -- and you -- what they are today.

Because of how undisputed it is, we don't even need to spend much time discussing the technical problems jQuery helped solve when it was introduced -- the inconsistent browser support of JavaScript features, the lacking or convoluted JavaScript APIs, and other challenges. The fact that jQuery made development a heck of a lot faster and easier isn't questioned. And for that, it deserves respect, as well as for the impact it had on the evolution and adoption of the language as we know it today.

On top of that, there's a decent chance it also left a mark on who you are as a developer. Especially if you consider yourself to be "self-taught", the authors of jQuery helped make entry into and competency within this field a little less painful. In fact, if it weren't for the smoother learning curve jQuery provided, many might have thrown in the towel altogether.

Of course, I'm mainly speaking from personal experience. When I started myself, working with `$('.class').slideDown()` was far less intimidating than trying to write a CSS class with an easing transition, and then apply that class with `document.querySelector('.class').classList.add('is-open')`. And trying to take it to the next level with a vanilla rendition that would allow for dynamic height transitions was totally out of the question. (Speaking of, I've made a ~600 byte modern version of jQuery's `slide` utilities that [you should check out](https://github.com/alexmacarthur/slide-element).)

I was able to do the work required of me with less training and time, and it gave me a level of satisfaction through my productivity that kept me interested in sticking with the discipline. The psychology behind it all seems to be very akin to Dave Ramsey's [debt snowball method](https://www.ramseysolutions.com/debt/how-the-debt-snowball-method-works). The quick wins built momentum, encouraging me to take on more in-depth, challenging tasks as I went along. Thanks to the easy-to-grasp-and-get-crap-done API the library provided, jQuery (and other libraries like it) undeniably played a role in how effectively I became immersed in the field.

_**"But if you're gonna learn JavaScript, learn JavaScript! Not some abstraction of it!"**_ Agreed, but take note of the type of people I'm discussing here. I'm not focusing on the people who have intentionally invested time to exclusively _learn_ from the ground up, like those who've done so within a coding bootcamp, university curriculum, or some other structured learning. I'm speaking of the people who are already in the trenches, in that increasingly common position of being asked to do the work while simultaneously learning how any of it works. In these cases, developers can't afford to slow their pace of production by diving into the fundamentals of JavaScript and abstain from learning abstractions like jQuery first, which often already lay hold of the codebase in which they're working. For these people, jQuery allowed people to deliver the value being asked of them, while serving as a catalyst to immerse them into the field of web development and thereby catapulting them into continued learning.

### It's probably not hurting anybody.

While a lot of the dismissal of jQuery often just sounds like "because jQuery," one of the more common concrete objections is the performance implications of using or sticking with the library. And it usually comes in two parts.

**_"jQuery is HUGE!"_** Legitimate concern, but if we're loading our scripts like we should (at the bottom of the page so they don't block rendering, via `defer`/`async` attributes, etc.), this concern becomes significantly uh... smaller. None of these tactics completely eliminate the need to think about it, since the time required to load, parse, and execute JavaScript still impact's user experience (namely, [Time to Interactive](https://web.dev/interactive/)), but to fiercely dismiss a library exclusively because of the ~30kb of minified, gzipped weight it adds to your application just isn't good enough.

That 'good enough' level drops even further when you consider how willing we are to throw in other modern packages of similar file size without a second thought. Often, the same people who want to violently kill jQuery are the same ones who are completely fine loading React + friends onto a marketing page for a lead form. But if those people also claim to so adamantly prioritize performance, the math isn't exactly in their favor. Using [Bundlephobia](https://bundlephobia.com/), here's how the sizes of each library line up:

| Library     | Minified + Gzipped |
| --------------- | ------------------- |
| [React](https://bundlephobia.com/package/react@17.0.2) + [React DOM](https://bundlephobia.com/package/react-dom@17.0.2) (17.0.2) | 42.2kb       |
| [jQuery (v3.6.0)](https://bundlephobia.com/package/jquery@3.6.0) | 30.4kb             |

Without fail, bringing up these numbers raises the tantential objection that a comparison like this isn't black & white: "_for specific use cases, React's bundle size is permissible due to its specific strengths_." To which I would agree, and then engage in a hearty dialogue over whether React is the only library that can claim such an exception. But even so, at this point, the goalposts have moved. We're no longer arguing about whether a library's size should preclude you from using it, but rather, how specific characteristics of that it may or may not warrant it.

So, what about the people who are concerned less about bundle size and take more serious issue with the performance of the library's code execution itself?

**_"jQuery is an unperformant abstraction!"_** This is the objection to jQuery in which I place the most sympathy. I like it when my JavaScript does things fast and efficiently, and specifically when it comes to DOM manipulations, native APIs and other libraries (like React) of similar size just perform better than jQuery for the type of work they were designed for. But therein lies the point... these libraries weren't designed to compete in the same way. From the beginning, jQuery was largely used to alleviate beef we had with browsers and to make singular tasks a little easier. React, on the other hand, is designed to build reactive, declarative, state-managed user interfaces. Because of React's underlying purpose, it's no surprise that DOM manipulation is faster and easier to maintain. But I'd never dream of swapping out jQuery with React to handle simple, separated interactions in light of that. Implementation apples and oranges.

Related to that, the circumstances in which jQuery is often used just doesn't even warrant this type of performance. I'm _not_ saying it's unimportant -- just that it's not worth upending your workflow just to get back a shred of page reflow no one would ever notice. The ROI of rushing to strip out jQuery on this basis alone is tremendously low, making it another insufficient excuse to detest it. Sometimes, it's just a marketing site, and no one's going to throw up their hands because your pop-up modal didn't render seven milliseconds faster.

### But! You probably shouldn't use jQuery for a new project.

Don't think I'm trying to make the case that we should still lean toward grabbing jQuery for a new project. I'm not. As I've said, today's browsers' JavaScript implementations are _good_ -- good enough that your time is better invested in starting with vanilla JavaScript rather than an abstraction for simple needs, and all things being equal, we should be reaching for the approach that performs better too. Read that crisp & clear:

**If you're starting a new project, I _don't_ think jQuery should be on the list of resources to leverage.**

But if you're working with a codebase that incorporates jQuery, it _really is OK_ to keep using it. You're not a bad person, and you're not a crappy developer. In fact, if you're probably one of the smarter ones, because you're not frantically running from a library that still does a darn good job at what it was designed to do.

So, don't fret. When the time is right, dispose of jQuery. But when you do, do it out of smart decision making -- when the time is right, when the ROI is significant, and when your project calls for it. Nothing else.
