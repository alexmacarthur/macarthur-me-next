---
title: Remember to Probably Target an Empty Object with Object.assign()
ogImage: /uploads/merge.jpg
---
Hearken back, for a moment, to what it was like merging objects in 2014. There was no support for the feature in JavaScript runtimes themselves, and it was quite common to find a solution to the problem by wading through StackOverflow to find something like this:

```js
function merge(obj1, obj2) {
  var newObject = {};

  for (var attributeName in obj1) {
    newObject[attributeName] = obj1[attributeName];
  }

  for (var attributeName in obj2) {
    newObject[attributeName] = obj2[attributeName];
  }

  return newObject;
}
```

```js
var var1 = {
  key1: "value1"
};

var var2 = {
  key2: "value2"
};

console.log(merge(var1, var2));

// { key1: "value1", key2: "value2" }
```

Despite the advancements JavaScript has made since then, I reminisce this approach. It's extremely clear what's going on when you throw values into the method. The two objects are received, and a new, separate object is returned containing the properties & values of both. Neither of your arguments are modified at all, and you could continue to go on and use `var1` and `var2` elsewhere, unscathed.

Recently, I made the mistake in assuming that `Object.assign()` operates in a similar way. I wanted a new merged object, but I also wanted to preserve the values I passed into the method for later use.

```js
let var1 = {
  key1: "value1"
};

let var2 = {
  key2: "value2"
};

let var3 = Object.assign(var1, var2);
```

I *expected* this to leave each of my three variables with the following values:

```js
// What I THOUGHT I'd get:

var1 = {
  key1: "value1"
};

var2 = {
  key2: "value2"
};

var3 = {
  key1: "value1"
  key2: "value2"
};
```

But that's not what I got. Instead, `var1` had been mutated, giving it the exact same value as `var3`:

```js
// What I ACTUALLY got:

var1 = {
  key1: "value1"
  key2: "value2"
};

var2 = {
  key2: "value2"
};

var3 = {
  key1: "value1"
  key2: "value2"
};
```

Looking at [the documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) for `Object.assign()`, this makes sense. Here's the syntax:

```js
Object.assign(target, ...sources)
```

And the description is pretty clear about what it does:

"The Object.assign() method is used to copy the values of all enumerable own properties from one or more *source* objects to a *target* object. It will return the target object."

The method makes no promises to not mutate that target object. It'll copy over properties to it and spit it that mutated version back to you.

Obviously, the solution to this is pretty simple. Pass a new, empty object as the target, and you're good to go:

```diff
-let var3 = Object.assign(var1, var2);
+let var3 = Object.assign({}, var1, var2);
```

A few more characters, a lot less frustration, and no more surprise mutations.
