---
title: Why I Like Tailwind CSS
subtitle: And a Couple of Challenges I've Seen Too
ogImage: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200'
---

I've used [Tailwind CSS](https://tailwindcss.com/) for a few projects over the last several months, and it's been steadily growing on me -- to the point of it becoming **my go-to tool for styling new projects**.

At the same time, I'm seeing a lot of people ask what all the hype is about, often in an effort to determine if it's right for them too. I've responded to those questions a couple of times now, and thought it'd be handy to have a quick reference as to why I've come to like it myself, as well as the challenges I've experienced along the way. All of this is based on my own experience from recent memory, so it's likely to change to some degree as time goes on. Still, hopefully it helps someone else grasp if it's something they should try out themselves.

## Things I Really Like

**1. I can prototype _much_ more quickly.**

Other styling approaches I've used require me to jump between multiple different files just to stand up a page with some basic asthetics. At minimum, that'd mean an HTML file and a stylesheet. And whenever I was in a highly-componentized BEM project (like I most often was), that could mean a _lot_ of files open at once -- the file containing the HTML and then one SCSS file for each UI component I was writing.

With Tailwind, however, all I really need to pay attention to is the HTML. Fewer VS Code tabs for my brain to manage means I can prototype more easily and quickly.

**2. Built-in PurgeCSS means I only ship the styles I actually use.**

When working with other utility-based CSS frameworks, it's a pain to ensure you don't ship any of the CSS you don't actually use. Depending on the framework, your options are to manually import the things you actually use, give up altogether, or try your hand at configuring a tool like [PurgeCSS](https://purgecss.com/) to remove unused classes on compilation. As of v1.4, [Tailwind has PurgeCSS built in](https://tailwindcss.com/docs/release-notes/#tailwind-css-v1-4), with a lot of the hassle abstracted away, so I can focus on styling without worrying so much about CSS bloat.

**3. I can throw away HTML without orphaning accompanying CSS.**

Especially when I'm prototyping something, it's common for me to spontaneously throw out HTML I thought I'd need but don't. When my styles and makeup are maintained separately, a second step is required to remove that unnecessary CSS. I often forget to do that, forever leaving it orphaned. The markup-driven styling provided by Tailwind means all I have to throw away is the HTML itself. Nothing else (unless I have some custom components I've composed somewhere, but that's rare).

**4. I don't need to name so many things.**

It takes time, it's hard, and I suck at it. When using Tailwind, the only time I need to dream up a class name is when I'm composing my own components, which isn't often at all. For the most part, I can spend my time bringing my UI to life, rather than wasting it second-guessing what I chose to name something.

**5. Consistent design token values (font sizes, colors, spacing, etc.) are set up for me.**

When starting with more of a bare-bones, roll-my-own styling approach, it's a chore to determine what my base font sizes, colors, spacing values, and everything else should be. Tailwind offers consistent sets of these values out-of-the-box, while also enabling me to [customize them](https://tailwindcss.com/docs/margin/#customizing) as needed.

**6. It's easy to incrementally adopt in a project.**

If you want to leverage just _some_ of the utilities provided by Tailwind, or want to migrate to it more slowly, it's relatively easy to do so without overcommitting yourself or putting the entire project through a refactor. After setting it up (the most common way to do so is probably [as a PostCSS plugin](https://tailwindcss.com/docs/installation#using-tailwind-with-postcss)), you can either [manually configure Tailwind](https://tailwindcss.com/docs/configuration/) to include only what you need, or rely on the aforementioned PurgeCSS integration to remove the styles you don't use. I appreciate that flexibility.

**7. The documentation is incredible.**

In particular, the search functionality in the Tailwind documentation is nearly psychic (and the "press '/' to focus" feature is a huge nice-to-have). If I'm looking for some utility, my first search attempt nearly always returns what I need without requiring me to try again with different terms. It's just good. Moreover, it's fast, thorough, and filled with helpful examples.

### Some Challenges I've Seen

My admiration for this tool is strong, but it'd be unfair to leave out the challenges I've had working with it.

**1. The learning curve can be steep.**

At first, it sort of felt like I was relearning CSS itself, and that was frustrating. There's a utility for virtually everything (it seems like), and trying to get my brain to map real CSS attributes to those utilities just took some time (I'm still working on it). This is where that documentation really shines, because if it weren't for that, I'd have given up early on.

**2. HTML can quickly become ugly & convoluted.**

Much of this is probably just preferential, or perhaps due to the fact that it goes against what I've become accustomed to while working with BEM for so long. But at the same time, when working with something like JSX in React or any other templating language infused with a moderate amount of logic, it can get rough to parse everything going on in a component with utility classes sprinkled everywhere.

I experienced some of this pain when building [TypeIt's site](https://typeitjs.com) with Tailwind + [Gatsby](https://gatsbyjs.org). In order to fine-tune the styling I wanted, I had to do stuff like this:


```jsx
<div
  className={`
            lg:flex
            justify-center
            fixed
            lg:relative
            top-0
            left-0
            h-full
            w-full
            bg-white
            translate-left
            lg:translate-none
            overflow-scroll
            lg:overflow-visible
            pt-8
            md:p-0
            ${menuIsOpen ? "translate-none" : ""}
          `}
>
  <ul className="self-start mx-auto lg:-mx-3 lg:mt-0 block lg:flex mb-8 lg:mb-0">
    {links.map((link) => {
      return (
        <li
          key={link.path}
          ref={navItemRef}
          className={`siteNavListItem flex px-5 flex-col lg:flex-row items-center font-light justify-center mb-5 lg:mb-0 relative`}
        >
          {/* link content... */}
        </li>
      );
    })}
  </ul>
</div>;
```

With so many utility classes in play, it was just _hard_ to figure out the best way to format everything while keeping the entire file relatively legible.

Admittedly, there are some tricks to help mitigate this, mainly relying on strategies Tailwind recommends to [componentize parts of your UI](https://tailwindcss.com/docs/extracting-components/), such as:

- using Tailwind's `@apply` directive to create single classes composed of utilities.
- writing templates or JS components that accept the data you'd like to display.

But these all feel like more work I just don't want to do. All that said, "messy" HTML, at some level, may just be a necessary trade-off of using a styling approach like Tailwind does, much like any other approach has trade-offs of its own.

### Why Do You Like It?

Despite the couple of challenges I've seen, Tailwind has allowed me to style UI components in a more productive fashion, and I'll likely keep it around as my go-to tool for doing such things. Even so, that might not be the case for everyone. So, I'm curious to hear what you like about Tailwind, as well as the challenges you've encountered. Are there things you like or hate that I don't mention here, or are even offshoots of any of them? Bring 'em up!
