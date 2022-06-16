---
title: Reminding Myself that Maps Store Objects by Reference Too
ogImage: "https://images.pexels.com/photos/163726/belgium-antwerp-shipping-container-163726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
---

No matter how many times I revisit it, I have pretty consistent track record of being tripped up by how JavaScript assigns values to variables. 

## Primitives: Assigned by Value

Primitive values (numbers, strings, etc.) are assigned by *value,* meaning that assigning one variable to another variable assigned to a primitive value will result in *two, distinct values* being stored in memory. The entire *value* is copied. 

```js
const number1 = 100; 
const number2 = number1; 

// Variable / Memory Value: 
// number1 -> 100
// number2 -> 100
```

## Objects: Assigned by Reference

Everything else (objects, including functions, arrays, etc.) are assigned by *reference*. Assigning a newly created object to a variable is actually creating a *reference* to that object’s location in memory. Any further variable assignments will also point to that exact same location. 

```js
const object1 = { someProperty: 'some value' };
const object2 = object1;

// Variable / Memory Value: 
// object1 -> { someProperty: 'some value' }
// object2 -> object1
```

And that’s why things like this work. If you mess with the properties of an object — no matter which variable is referencing it — that central value in memory will be changed, impacting every variable pointing to it. 

```js
let object1 = { someProperty: 'some value' };
let object2 = object1;
let object3 = object2;
let object4 = object3;
let object5 = object4;

object5.someProperty = 'some OTHER value!';

console.log(object1);
// { someProperty: 'some OTHER value!' }
```

## A Map() Follows the Same Rules

This is a pretty fundamental concept in JavaScript, but that didn’t stop me from forgetting about it while dealing with a `Map()`. Just like a regular, old variable, a value inside a Map() is stored differently depending on the value’s type — primitive or otherwise. From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get): 

> If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the `Map`
object.

In my case, I was working with somthing like this (highly contrived):

```html
const aMap = new Map();
const anObj = {
  name: 'Alex'
}

aMap.set('a', anObj);
aMap.set('b', anObj);
aMap.set('c', anObj);

aMap.get('c').name = 'Bob';

console.table(Array.from(aMap.entries()));
```

While I was intending to modify the `name` only by on the `a` key, the results prints as follows: 

```html
| (index) |  0  |        1        |
-----------------------------------
|    0    | 'a' | { name: 'Bob' } |
|    1    | 'b' | { name: 'Bob' } |
|    2    | 'c' | { name: 'Bob' } |
```

Bob is everywhere. In hindsight, this is no surprise. _Primitives by value, objects by reference._ If I want these values to be updated independently, the answer is to duplicate the object, reserving it a new, distinct place in memory:

```diff
const aMap = new Map();
const anObj = {
  name: 'Alex'
}

- aMap.set('a', anObj);
+ aMap.set('a', {...anObj});
- aMap.set('b', anObj);
+ aMap.set('b', {...anObj});
- aMap.set('c', anObj);
+ aMap.set('c', {...anObj});

aMap.get('c').name = 'Bob';

console.table(Array.from(aMap.entries()));
```

And with that, you’re released to update properties freely: 

```html
| (index) |  0  |        1         |
------------------------------------
|    0    | 'a' | { name: 'Alex' }  |
|    1    | 'b' | { name: 'Alex' } |
|    2    | 'c' | { name: 'Bob' } |
```

Just one “Bob,” as desired. 

## Only a Matter of Time

Stay tuned for another post basically covering the same concept within another context after it inevitably trips me up again.
