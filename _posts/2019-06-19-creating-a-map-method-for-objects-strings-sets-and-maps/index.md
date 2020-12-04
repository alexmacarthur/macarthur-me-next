---
title: 'Creating a .map() Method for Objects, Strings, Sets, and Maps'
ogImage: https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=format%2Ccompress&cs=tinysrgb&dpr=2&h=750&w=1260
---

It’s a well-established truth of the universe that JavaScript's `Array.prototype.map()` is one of the best parts of the language, allowing us to write cleaner, simpler code to manipulate array values, instead of using something like `forEach()`.

For example, let’s say we want to create a copy of an array with values that are tripled.

**The Uncool Way**

```javascript
let someNumz = [2, 3, 5, 4, 5];
let someTripledNumz = [];

someNumz.forEach((value, index) => {
  someTripledNumz.push(value * 3);
});

console.log(someNumz); //-- [2, 3, 5, 4, 5]
console.log(someTripledNumz); //-- [6, 9, 15, 12, 15]
```

That works, but it’s rough around the edges. We need to declare an empty `someTripledNumz` array above, and _then_ go through the process of tripling everything. But with `.map()`, things look better:

**The Cool Way**

```javascript
let someNumz = [2, 3, 5, 4, 5];
let someTripledNumz = someNumz.map(item => item * 3);

console.log(someNumz); //-- [2, 3, 5, 4, 5]
console.log(someTripledNumz); //-- [6, 9, 15, 12, 15]
```

## What if we want to `map()` over the values of an _object_?

As it stands, you can’t. There’s no `.map()` method that exists on any object for us to use out of the box. But, thanks to [prototypal inheritance](https://medium.com/@kevincennis/prototypal-inheritance-781bccc97edb), JavaScript provides a way to make that happen. We're gonna try it out, so that afterward, we'll be able to do something like this:

```javascript
let oldObject = {
  first: 1,
  second: 2,
  third: 3
};

let newObject = oldObject.map(function(item, index, thing) {
  return item * 2;
});

console.log(newObject);

// { first: 2, second: 4, third: 6 }
```

## Let’s Map() Over an Object

First, let's add an empty `.map()` method to the `Object` prototype. That method will accept a single argument: the callback method we’d like to fire on each of the values.

```javascript
Object.prototype.map = function (func) {}
```

Next up, let’s pull all of our values out of the object we we’d like to map (it’ll be available within the `this` object), and actually `map()` over them like any other array, firing our function on each item.

```javascript
Object.prototype.map = function (func) {
  // Collect an array of each value within the object.
  let oldValues = Object.values(this);

  // Manipulate those values with the provided callback method.
  let newValues = oldValues.map((item, index) => {
    return func.call(null, item, index, this);
  });
}
```

Notice that when we fire that method, we’re also passing in the `index` and the original object itself as parameters. This is to keep our method as close to the actual [specification](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Syntax) as reasonably possible.

Once we have those manipulated values, we can piece our object back together with the appropriate keys.

```javascript
Object.prototype.map = function (func) {
  // Collect an array of each value within the object.
  let oldValues = Object.values(this);

  // Manipulate those values with the provided callback method.
  let newValues = oldValues.map((item, index) => {
    return func.call(null, item, index, this);
  });

  // Reconstruct our object with each modified value.
  let mappedObject = {};
  Object.keys(this).forEach(function (key, index) {
      mappedObject[key] = newValues[index];
  });

  return mappedObject;
}
```

We did it! But if you’re like me, you’re hungry for more. So, let’s:

![Map all the things!](map-all-the-things.jpg)

Sidebar: It was _really_ difficult to commit to using that meme. So overused. So 2013. But I’m choosing to submit to its applicability for this post. Now, we continue:

## Let’s Map() Over a String()

This one’s a bit simpler than our `Object` map. Turn the target string into an array, `map()` over it as per usual, and turn it back into a string:

```javascript
String.prototype.map = function(func) {
  let stringArray = this.split("");

  let newStringArray = stringArray.map((item, index) => {
    return func.call(window, item, index, this);
  });

  return newStringArray.join("");
};
```

Then, we can do something like this:

```javascript
let newString = "I want to scream this!".map(function (item, index, thing) {
  return item.toUpperCase();
});

console.log(newString);

// 'I WANT TO SCREAM THIS!'
```

## Let’s Map() Over a Set()

Since it’s array-like, mapping over a Set is also relatively straightforward. Make it into an array, do the things, turn it back into a set. Thanks to the syntax of modern JavaScript, it looks pretty clean.

```javascript
Set.prototype.map = function(func) {
  let setArray = [...this];

  let newSetArray = setArray.map((item, index) => {
    return func.call(window, item, index, this);
  });

  return new Set(newSetArray);
};
```

```javascript
let oldSet = new Set([1, 2, 3, 4, 5]);

let newSet = oldSet.map(function (item, index, thing) {
  return item * 3;
});

console.log(newSet);

// Set { 3, 6, 9, 12, 15 }
```

## Let’s Map() Over a Map

This is where things get a wee bit nuttier. As we did before, the first thing we want to do in performing a `map()` on a `Map()` is get our target Map as an array. Take note of the format of this new array. Each item in that array is stored as an array itself, with the first item being the key, and the second being the value:

```javascript
let myMap = new Map();
myMap.set('item 1', 'value 1');
myMap.set('item 2', 'value 2');

console.log([...myMap]);

// [ [ 'item 1', 'value 1' ], [ 'item 2', 'value 2' ] ]
```

So, our prototype method beings like this:

```javascript
Map.prototype.map = function(func) {
  let mapAsArray = [...this];
};
```

And then, we’ll map over each item, handing if off to our callback method to do its thing.

```javascript
Map.prototype.map = function(func) {
  let mapAsArray = [...this];

  let newMapAsArray = mapAsArray.map((item, index) => {
    return func.call(window, item, index, this);
  });
};
```

And finally, piece that sucker back together by creating a new Map and adding values it it from our `newMapAsArray`.

```javascript
Map.prototype.map = function(func) {
  let mapAsArray = [...this];

  let newMapAsArray = mapAsArray.map((item, index) => {
    return func.call(window, item, index, this);
  });

  // Construct a new Map() with our modified values.
  let newMap = new Map();
  newMapAsArray.forEach(item => {
    // Remember, each item contains the [key, value] for our Map item.
    newMap.set(item[0], item[1]);
  });

  return newMap;
};
```

Let’s try it out. If you weren’t aware, the keys or values don’t _have_ to be of a particular type — objects, numbers, functions, etc. So, `map()` with responsibility.

```javascript
let myMap = new Map();
myMap.set('my first item', 1);
myMap.set({}, 2);

let newMap = myMap.map(function (item, index, thing) {
  // We only want to modify the _value_ of the item.
  item[1] = item[1] * 3;
  return item;
});

// Turn it back into an array just for ease of inspection.
console.log([...newMap]);

// [ [ 'my first item', 3 ], [ {}, 6 ] ]
```

## Try the Package

Since what I wrote here includes a lot of functional, possibly useful code, I wrapped it all up into a package, ready for consumption. You can [check it out here](https://github.com/alexmacarthur/map-everything), and/or dive right in with `npm install map-everything`.

## Code with Caution

Most of this was born out of "wouldn’t it be cool, if" within my brain. So, before shipping anything to production, be very intentional about what you’re manipulating, or deciding if it’s even worth adding these methods to all of these prototypes. All that said, this sure was fun! Thanks for mapping with me.
