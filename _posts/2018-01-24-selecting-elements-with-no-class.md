---
title: Using the Negation Pseudo-Class to Select Elements with No Class
ogImage: ""
---

If you've been a developer for more than 7 minutes, you've probably felt uncomfortably pressured into doing something weird with your code, like specifically styling plain, classless, attribute-less elements. Don't ask for the details, just accept the reality of this happening sometimes.

When I meet scenarios like this, by default, I instantly architecting the most terrible, complicated solution that's tied to my unique context.

```css
.page-whatever-wordpress-plugin .this-class + .that-class > h3:nth-child(3) ~ span {
     font-weight: bold;
}
```

For obvious reasons, solutions like this _usually_ quickly pass by, and I'm forced to step back and rubber duck the problem verbally. Thankfully, for this problem, that conversation was over pretty quickly, when I realized we already have a solution for this.

### Use the negation pseudo-class to select elements that do **not** have something.

Or, as you might otherwise call it, the [:not() selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:not).

This trick isn't new, but I'd usually seen it used to avoid selecting elements by a specific attribute _value_. For example:

* Selecting all elements that don't have a `whatever-class-i-want-to-avoid` class:
```css
*:not(.whatever-class-i-want-to-avoid) {
}
```

* Select all elements that don't have a `data-id` of 33.
```css
*:not([data-id="33"]) {
}
```

But this time, I don't care about what the value is. I want to know if the attribute exists on the element at all.

### You can use the negation pseudo-class to (not) select only by attribute too. *crazy text*

And remember, `class` _is_ just an HTML attribute. Meaning, we can do completely permissible, non-hacky things like this:

* Select all elements that have no class:
```css
*:not([class]) {
}
```

* Select elements that have a class attribute whose value is empty:
```css
*:not([class=""]) {
}
```

Beyond that, we can do a wide range of things more concerned with the _existence_ of an attribute rather than the attribute's value. [See a brief example on CodePen.](https://codepen.io/alexmacarthur/pen/zpJeeG/)

And with that, another weird, one-off challenge resolved with tools we already had available to us.
