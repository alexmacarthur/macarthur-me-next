---
title: Bullets, Cannonballs, and Web Components
subTitle: Pushing the Technological Envelope While Validating New Business Ventures
ogImage: https://images.unsplash.com/photo-1483494970302-fffedd90fee4?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1200&q=100
---

In his book *Great by Choice*, Jim Collins describes how launching new initiatives is best done by first firing [bullets, then cannonballs](https://www.jimcollins.com/concepts/fire-bullets-then-cannonballs.html). That is, performing small, inexpensive experiments helps companies "calibrate their line of sight," increasing the chance of success when the more substantial cannonballs are finally launched.

It's hard not to get excited by an approach that helps to reduce risk and make the most of your resources in such an illustrative way. And that excitement can be contagious, overflowing into areas peripheral to the business initiative you're interested in launching. As a developer, one of those areas is (obviously) technology.

## Staying Modern is Hard

It can be a hard sell getting organizations on board with adopting a modern tool on the web platform, due to a range of legitimate concerns, including these:

- **A subset of users is on a system that doesn't support it**, and the business doesn't want to risk losing a paying customer.
- **It would take time away from working on proven systems,** and there's hesitancy around shifting resources onto something not guaranteed to yield a return.
- **The potential advantages are ambiguous or indirect,** and the there's resistance to investing time into anything without clear-cut, understood benefits to how the business works today.

But when you're just shooting bullets, the spirit of the game is different. Your work is inexpensive and confined to a small territory. The same risks don't exist here — at least in the same capacity. And as a digital product team, this spirit can be leveraged to push the digital envelope with little risk to a business's revenue streams, while *still* calibrating those larger ventures.

## Some Real-World Context

I'm on a team that's doing its best to adopt this "bullets, then cannonballs" mindset (it can be a difficult shift to make, btw!), and we've been using it at a small scale to build out a product for helping people looking to buy or sell a home get connected with trusted, local real estate agents. In doing so, we're testing and iterating on a variety of digital experiences in a rapid fashion and with a small slice of users.

A key part of this work is collecting quick user feedback for each component of those experiences, so that we can determine if our bullets are actually hitting anything. And to do that, we decided to build a small UI component that would allow users to give feedback by clicking either a "thumbs up" or "thumbs down" icon.

After some discussion, the solution we landed on was a relatively new kid on the block: a [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components). This modern standard of building UI components met all of our requirements, but it did carry with it a downside: there's [no support for Internet Explorer](https://caniuse.com/custom-elementsv1). And while usage of IE is low — [well under 2%](https://caniuse.com/usage-table) — it represents enough revenue that would've normally caused us to hit the brakes by default. After all, in your typical, day-to-day feature building, abandoning virtually any number of paying customers was a non-starter, even if the reason for doing so had the potential to unlock greater gains.

But this wasn't day-to-day work, which meant we could take a fresh approach to vetting technology.

## Guidelines for Trying Vetting Tech While Shooting Bullets

With the foundation for how we had been assessing technology shifting under our feat, it changed the tone of our feedback component discussion. And in doing so, some general criteria seemed to emerge for determining whether it made sense to experiment with this modern solution while still shooting bullets for our bigger initiative.

When reading through these, keep this in mind: these are the result of me reviewing our decision-making process in hindsight, and in the scope of our team's particular project. They aren't intended to be exhaustive, and certainly not set in stone. Here they are:

### 1. It should gracefully degrade.

Calibrating your line of site doesn't require you to shoot at every ship in the sea. Similarly, toying with a modern technology doesn't mean every user *needs* to experience it. But at the same time, you don't want to worsen the experience for the portion of customers being excluded. If you're gonna try a new tool, it should fall back with users having little to no awareness that they're missing out on something.

For a web component, this is straightforward to control. For the most part, the bucket of users who can't use web components are the same whose browsers don't support ES modules. So, to prevent a component from being downloaded and parsed in older browsers, it's as simple as loading the source with a `type="module"` attribute attached.

```html
<feedback-component></feedback-component>

<script type="module" src="path/to/feedback-component.js" />
```

If a person is using IE, the component won't render at all, and no errors will be thrown. For us, it just meant that this small slice of users wouldn't contribute feedback data, and for what we were interested in testing, that was fine with us. A nice side benefit to this tactic is that we could freely use modern JavaScript's syntax without parsing errors occurring. In fact, we could avoid any sort of transpilation altogether, simplifying & lightening our workflow even further.

In other situations, graceful degradation may look entirely different. Or, it might not even be possible given the constraints. Whatever the case, it's important to have this expectation in place so any decisions won't bear a negative impact on the application's core functionality, or your efforts at calibrating your larger initiative.

### 2. It shouldn't take long to learn.

One of the big reasons there's value in first shooting bullets is their low cost, and *time* is a costly resource. As such, any new technology you choose to try in this frame of mind shouldn't require a lot of amount of time to become competent in using it at a level that allows you to effectively evaluate it.

Building a web component was a good choice because while the high-level API is new, it's written in JavaScript, and has parallels to the lifecycle of a component from mainstream UI libraries (React, for example). Since our team had at least a good baseline understanding of that world, there wasn't a huge risk of us slowing down any of our primary work, while still allowing us to evaluate its usefulness.

Another factor in this piece of the decision-making process was the solution's future trajectory. Web components isn't an obscure client-side JavaScript framework with a couple hundred stars on GitHub. It exists as an [active web standard](https://html.spec.whatwg.org/multipage/custom-elements.html) that'll stick around and continue to evolve for time to come. So, the time cost in learning it was also being weighed against whether we could count on it sticking around in the web platform anyway.

### 3. It should solve (or help to avoid) real problems.

It's the gift of a passionate developer to manufacture problems that support choosing the flashy, new framework tending on Twitter. But for it to be a legitimate contender for a team who's shooting bullets, these decisions need to be driven by the the need to solve problems or prevent otherwise real problems from occurring.

In our particular case, we had the following basic needs to consider when choosing a solution to build our feedback component:

- **It would need to be portable.** We'd be using it in a variety of applications for related experiments.
- **It would need to be stack-agnostic**. For example, creating a view component in Ruby on Rails would've been a poor decision, since other consuming applications aren't guaranteed to be built on RoR.
- **It would need to be dependency-free.** This one was mainly born out of a concern for performance. For example, creating it as a React component would be bad idea since it could potentially require other applications to take on a heavy React dependency just to collect simple user feedback.

If we're going by those needs (or problems we wanted to avoid), web components passed with flying colors, despite the tradeoffs associated with it being a relatively new item in the toolshed.

### 4. The footprint of what it's used to build should be minimal.

An equally key reason it's best to first shoot bullets is their size. If things don't pan out as well as you hoped, a bullet is small and easy enough to swap out for another.

Our feedback component was a great candidate to try out the web component standard for a similar reason — it was small, and perhaps even more importantly, it only served as ancillary support for the primary product we were interested in testing. We knew that we'd be able to gather feedback from 98%+ of those who saw it, and even if we ran into unexpected issues, the scope of the component is so small that switching from it altogether wouldn't have been a major lift.

The outcome of this process might've been far different if we were dealing with more complex functional requirements, or if what we used to build with it had been absolutely critical to the larger venture we were trying to calibrate as a business.

## Risk It Up Front

As exciting as the notion of "shooting bullets, then cannonballs" can be, the only reason it's even worth thinking about is the fact that you're gonna fail — not always, but often enough to get familiar with the feeling. That's why, as Marty Cagan also emphasizes in his book *[INSPIRED](https://svpg.com/inspired-how-to-create-products-customers-love/),* it's so important to tackle risks *up front*, rather than after you've invested a significant amount of time and resources trying to make something stick.

This is important to keep in mind as you vet new technologies too. More than you'd like, you're gonna delve into a new tool that turns out to be a total flop, resulting in you scrapping everything and switching to something else, or maybe rethinking the problem altogether. That's not fun, but it's a prerequisite to landing something whose trial paid off in more ways than expected.

So, in more areas than just your big business initiatives, think big, test small, and start to engage with tomorrow's tools today.
