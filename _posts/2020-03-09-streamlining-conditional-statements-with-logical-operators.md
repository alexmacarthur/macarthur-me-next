---
title: 'Streamlining Conditional Statements with Logical Operators'
ogImage: >-
  https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=100
---

I've been seeing my preference change in how I write simple conditional statements in JavaScript. Consider the following:

```javascript
if (snack) {
  eat(snack);
}
```

Back in the day, that's how just about every "if I have this, then do this" statement looked. As complexity and context changed, I might have pivoted a bit, but for the most part, this was the go-to pattern. And for good reason -- it's clear and easy to translate into spoken vernacular:

```
If I have a snack, then eat it.
```

## Early Return Gets the Worm

Then, I started to shift toward preferring the early return:

```javascript
if (!snack) {
  return;
}

cat(snack);
```

Not having to nest the meat of my code in an `if/else` block felt simpler. Do a quick check, and if you're not qualified to be here, don't bother running anything else. Just get outta the way.

My hunch is that once fluency with the semantics of the language became stronger, my brain naturally began to style the code in light of how it's _read as code_, rather than _spoken as English._ And for whatever reason, the flow of an early return was cognitively easier to grasp, particularly as the complexity of the method potentially grew.

This becomes clearer with a more complex example. Something like this is totally fine:

##### Before Early Returns

```javascript
let greeting;

if (isFamily(person)) {
  greeting = "hug";
} else if (isBuddy(person)){
  greeting = "high five";
} else {
  greeting = "handshake";
}

return greeting;
```

But it feels stringy and a little more difficult to read than something like this:

##### After Early Returns

```javascript
if (isFamily(person)) {
  return "hug";
}

if (isBuddy(person)){
  return "high five";
}

return "handshake";
```

What's interesting here is that while it's easier to read _as code_, it's not at all _how people speak_. As the semantics become more second nature, the oral flow of the code seems to become less of a concern.

## Along Came Short-Circuiting

Soon enough, my preference changed again. This time, toward leveraging [logical operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators) for simple expressions.

After executing one side of the `&&` or `||` operators, JavaScript will _short-circuit_ if it's logically unnecessary to run the remaining expression(s), returning the value of the last expression that was evaluated. You've probably seen short-circuiting used with the `||` operator when setting fallback values for variables.

```javascript
const myVar = "left side" || "right side";
// evaluates to "left side"

const myOtherVar = null || "not null at all";
// evaulates to "not null at all"
```

This tactic is cleaner than using a ternary, and far more elegant than an `if/else` block.

##### Good: `If/Then` Block
```javascript
let myVar;

if (otherVal) {
  myVar = otherVal;
} else {
  myVar = "fallback";
}
```

##### Better: Ternary
```javascript
let myVar = otherVal ? otherVal : "fallback";
```

##### Best: Logical Operator
```javascript
let myVar = otherVal || "fallback";
```

Similarly, the `&&` operator continues to evaluate as long as the previous value is `truthy`, returning the last evaluated expression.

```javascript
const myVar = "left side" && "right side"
// evaluates to "right side"

const func = () => "a string"
const myVar = "" && func()
// evaluates to ""
```

### A Simple Short-Circuited Conditional

And that makes for some succinct conditional statements, allowing you to abandon the `if/else` block altogether. As long as the first expression is `truthy`, the next will be evaluated as well.

##### Before: `If/Then` Block
```javascript
if (snack) {
  eat(snack);
}
```

##### After: Logical Operator
```javascript
snack && eat(snack);
```

### A Slightly More Intense Example

For something a little more involved, let's say you wanted to attempt a chain of actions only until one is successful, storing that value in a variable. And if none is successful, fall back to a default value. It's possible to pull this off using the same sort of `if/else` block, dealing with the stringy nature of the flow.

##### Option #1: `If/Else` Block

```javascript
let firstTruthyReturnValue;

if (tryIt(var1)) {
  firstTruthyReturnValue = tryIt(var1);
} else if (tryIt(var2)) {
  firstTruthyReturnValue = tryIt(var2);
} else if (tryIt(var3)) {
  firstTruthyReturnValue = tryIt(var3);
} else {
  firstTruthyReturnValue = "default value";
}
```

Or, for a more modern approach, you could use `Array.prototype.find()` to _find_ that value. It's a bit more elegant, but requires that you also handle the default value a bit more explicitly than you might have hoped.

##### Option #2: `Array.prototype.find()`

```javascript
const possibilities = [
  val1,
  val2,
  val3
];

let firstTruthyReturnValue = possibilities.find(val => {
  return tryIt(val)
});

firstTruthyReturnValue = firstTruthyReturnValue === undefined ? "default" : firstTruthyReturnValue;
```

But by using a logical operator, all that mess can be pulled together more elegantly, while preserving the ability set a default value.

##### Option #3: Logical Operators

```javascript
let firstTruthyReturnValue =
  tryIt(var1) ||
  tryIt(var2) ||
  tryIt(var3) ||
  "default value";
```

## Possible Objections

There may be some purists out there who insist on strictly using the `if/else` block, switch statement, and ternary for their conditionals. That's fine -- I'm only documenting my personal progression of preference to date.

There are also those who probably say this approach makes the code less readable. I empathize with that. It takes a second to get your brain to reliably parse conditionals written in this way especially when it's so far removed from how people speak.

But that's not a deterrent for me, maybe for the same reason many favor the early return, or even those who are good with using the `||` operator to set fallback values for variables. Once you get used to the semantics, the gained elegance might hook you for life.

Or, you might yet again change your preference a few months down the road, which is entirely possible for me.

