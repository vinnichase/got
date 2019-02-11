<img src="https://raw.githubusercontent.com/vinnichase/got/master/docs/got-logo.png" width="200">

# got

got is a fluent, functional, zero-dependency, in-memory JavaScript **graph database**. You can create data structures at any degree of complexity within your JavaScript application both in the browser and Node.js. The whole database is represented in a state object which is basically a plain JavaScript object. The state is immutable, which means that existing states are never modified directly, instead a mutation will always result in a clone of the previous state, including the updates. For that reason, got is also perfect to manage heavily complex states with pure Redux.

**inspired by:** [Ramda](https://github.com/ramda/ramda), [Gun](https://github.com/amark/gun), [Redux](https://github.com/reduxjs/redux), [GraphQL](https://github.com/facebook/graphql), [Cycle.js](https://github.com/cyclejs/cyclejs) and [git](https://git-scm.com/) 😋

## Installation
On Node:

`$ npm i gotjs` or

`$ yarn add gotjs`

The package provides its own typings so you can use it with TypeScript out of the box. However you can also start over with plain JS. For the sake of simplicity all examples in this README are written in JS (ES2015).

## Usage

As any other [graph database](https://en.wikipedia.org/wiki/Graph_database) a got graph consists of exact two entities: **nodes** and **edges**. Nodes have a property `id` which uniquely identifies them in the whole graph. Additionally each node can contain an arbitrarily structured JavaScript object. Edges are defined by at least four properties `from`, `fromType`, `to` and `toType`. `from` and `to` are `id`s of two nodes which are connected by the edge which would practically be enough to define a very simple graph. But in order to represent any possible data structure we will need to define the type of connection between two nodes. In other words, we have to define the role that one node plays in connection with another. This can be done with the properies `fromType` and `toType`.

### Writing the Graph State

Now since we know the basic elements of a got graph we should start **writing** the graph to have a foundation to play with.

Let's model a friendship between John and Paul:

```
FIGURE: simple graph John <-> Paul
```

And in the code:
```js
const { got } = require('gotjs');

const friends = got()
    .node({ id: 'person1', name: 'John' })
    .node({ id: 'person2', name: 'Paul' })
    .edge({
        from: 'person1',
        fromType: 'friend',
        to: 'person2',
        toType: 'friend'
    });

console.log(friends.state());

// prints:
// { nodes:
//    { person1: { id: 'person1', name: 'John' },
//      person2: { id: 'person2', name: 'Paul' } },
//   edges:
//    [ { from: 'person1',
//        fromType: 'friend',
//        to: 'person2',
//        toType: 'friend' } ] }
```
Thats it! Now you have the basic building block for creating every graph that you could think of. The output shows that there is no magic and no hidden information in the state － only the nodes and the edge that we created before. Now you also know the complete set of write operations for got: `.node()` and `.edge()`.

> Note that the initial invoke of `got()` and all chained write operations (`.node()` and `.edge()`) always return a got operator with the cloned graph being able to again perform all operations on its copy of the graph.

Some of you might ask where the benefit is, when the input is as verbose as the output. The reason is that got wants to give you full responsibility for your data － meaning you can create for instance edges for nodes that don't even exist and vice versa. Therefore creating secure shortcuts is also under your responsibility. You can do so by creating custom sugar functions for repetetive tasks of your business logic:

```js
function addFriend(fromFriend, toFriend, gotOperator) {
    return gotOperator
        .node(toFriend)
        .edge({
            from: fromFriend.id,
            fromType: 'friend',
            to: toFriend.id,
            toType: 'friend'
        });
}
```
You can hide more complex logic in your custom functions to connect for example multiple nodes or work with collections. There are no limits.

> You might also notice that this function returns a got operator containing an immutable copy of the state after the two write operations. So all the heavy users of **Redux** should recognize the pattern: This is nothing more than a reducer function which is taking some arguments plus the old state (wrapped in the `gotOperator`) and returning a transformed state that did **not** mutate the old state at all. We will later learn in detail how to integrate got with Redux.

Now you can use it to quickly add friends:
```js
const { got } = require('gotjs');

const john = { id: 'person1', name: 'John' };
const paul = { id: 'person2', name: 'Paul' };
const george = { id: 'person3', name: 'George' };
const ringo = { id: 'person4', name: 'Ringo' };

const friends = got().node(john);
const friends1 = addFriend(john, paul, friends);
const friends2 = addFriend(john, george, friends1);
const friends3 = addFriend(john, ringo, friends2);

console.log(friends3.state());

// prints:
// { nodes:
//    { person1: { id: 'person1', name: 'John' },
//      person2: { id: 'person2', name: 'Paul' },
//      person3: { id: 'person3', name: 'George' },
//      person4: { id: 'person4', name: 'Ringo' } },
//   edges:
//    [ { from: 'person1',
//        fromType: 'friend',
//        to: 'person2',
//        toType: 'friend' },
//      { from: 'person1',
//        fromType: 'friend',
//        to: 'person3',
//        toType: 'friend' },
//      { from: 'person1',
//        fromType: 'friend',
//        to: 'person4',
//        toType: 'friend' } ] }
```

See how our function did correctly create all the nodes and edges for us － awesome. The reassignments of the operations to `friends1`, `friends2` and `friends3` (and feeding them into the next state transition) illustrate how the different steps of state mutation have no impact on previous states:

```js
console.log(friends1.state().nodes.person1);
// prints: { id: 'person1', name: 'John' }

console.log(friends1.state().nodes.person3);
// prints: undefined

console.log(friends2.state().nodes.person3);
// prints: { id: 'person3', name: 'George' }
```

But don't be afraid that your memory gets spilled over after tons of operations. Even though the modified parts of the state are cloned, the unchanged parts still share the same references:

```js
const person1FirstState = friends1.state().nodes.person1;
const person1SecondState = friends2.state().nodes.person1;
console.log(person1FirstState === person1SecondState);
// prints: true
```
> This is a very basic implementation of the idea of [structural sharing](https://www.youtube.com/watch?v=e-5obm1G_FY&t=16m14s).


The above concepts come as heavily simplified examples. Of course you can apply concepts like [currying](https://en.wikipedia.org/wiki/Currying) the `addFriend(...)` function or [piping](https://ramdajs.com/docs/#pipe) multiple state transitons. There are no boundaries to your creativity in functional programming:

```js
const { got } = require('gotjs');
const R = require('rambda');

// Provide a curried version of addFriend
const addFriend = (fromFriend, toFriend) => (gotOperator) => gotOperator
    .node(toFriend)
    .edge({
        from: fromFriend.id,
        fromType: 'friend',
        to: toFriend.id,
        toType: 'friend'
    });

const john = { id: 'person1', name: 'John' };
const paul = { id: 'person2', name: 'Paul' };
const george = { id: 'person3', name: 'George' };
const ringo = { id: 'person4', name: 'Ringo' };

const johnsGraph = got().node(john);

// Pipe mutation operations together and execute them on johnsGraph
const johnsFriends = R.pipe(
    addFriend(john, paul),
    addFriend(john, george),
    addFriend(john, ringo)
)(johnsGraph);

console.log(johnsFriends.state());

// prints the same state as before
```

### Reading the Graph State

Now since we learned how to write a got graph we should take a look on how to **read** from the graph. Of course by reading we don't mean to simply call `johnsFriends.state()` and look at the output. By reading we mean to call query operations on the got operator in a functional fashion so that we can make use of plain JS stuff like `.map()`, `.filter()` or `.reduce()`.

To do so the got operator offers us one read operation `.lens(id)` which is heavily inspired by [Ramda](https://github.com/ramda/ramda) however it is implemented a little different plus it is only providing `.view()` and no `.set()`.

But what is a lens? － for those who haven't heard about Ramda. A lens 🔎 can be described as a small window that is pointing at a node in the graph ready to perform more operations on the node it is pointing at. A lens will give you four functions for selecting nodes in the graph: `.view()`, `.list(type)`, `.first(type)` and `.prop(name)`.

First we set up a small example from the previous examples:

```js
const { got } = require('gotjs');

const friends = got({
    nodes: {
        person1: { id: 'person1', name: 'John' },
        person2: { id: 'person2', name: 'Paul' },
        person3: { id: 'person3', name: 'George' },
        person4: { id: 'person4', name: 'Ringo' }
    },
    edges: [{
        from: 'person1',
        fromType: 'friend',
        to: 'person2',
        toType: 'friend'
    },
    {
        from: 'person1',
        fromType: 'friend',
        to: 'person3',
        toType: 'friend'
    },
    {
        from: 'person1',
        fromType: 'friend',
        to: 'person4',
        toType: 'friend'
    }]
});
```
> Note that you can feed an existing state into `got(state?)` to initialize it. That helps for example in Redux when you write a reducer and receive the previous state as a plain object.

#### `lens(id).view()`

Let's start with the most straight forward function `.view()` which is just returning the object the lens is pointing at:

```js
const person2 = friends.lens('person2').view();
console.log(person2);

// prints: { id: 'person2', name: 'Paul' }
```

This is again the easiest element of reading the graph which you can later use to compose more complex queries. The lens also acts as an entry point for reading the graph. Let's therefore call the node it is pointing at the **entry node** of the lens.

#### `lens(id).list(type)`

The next important building block is to fetch a list of nodes that is connected to the entry node via a certain type of edge. To view for example all friends of a person we can use `.list('friend')`:

```js
const johnsFriends = friends.lens('person1').list('friend');
```
When you print `johnsFriends` you will notice, that it is not actually holding the nodes but the lenses that point at the nodes. But the cool thing is, that we don't have to waste computation power until we actually need the nodes. When we do so we can just use vanilla JS and map the lenses to their `.view()`:

```js
const johnsFriends = friends.lens('person1').list('friend').map(friendLens => friendLens.view());
console.log(johnsFriends);

// prints:
// [ { id: 'person2', name: 'Paul' },
//   { id: 'person3', name: 'George' },
//   { id: 'person4', name: 'Ringo' } ]
```
So by combining `.list(type)` and `.view()` you can navigate through the whole graph coming from one entry node. Because when you look at the `.map()` function you could again perform a `.list(type)` on each lens of the list and select nodes of further relation types.

All of this empowers you now to model one-to-many and many-to-many relationships between nodes. But what about one-to-one relationships?

#### `lens(id).first(type)`

Well got treats one-to-one relations as one-to-many (1-n) relations with n being 1. So in general there is the possibility of a node being connected to two other ones via the edges `{ from: 'human1', fromType: 'son', to: 'human2', toType: 'father'}` and `{ from: 'human1', fromType: 'son', to: 'human3', toType: 'father'}` which means that `human1` would have two fathers which might be semantically wrong. got gives you no constraints on how you structure your graph. If it is wrong to have two fathers in the context of your application it is your responsibility to take care of it. But got gives you the sugar function `.first(type)` for selecting exactly one node of a certain relation type:

```js
const { got } = require('gotjs');

const humans = got({
    nodes: {
        human1: { id: 'human1', name: 'Anakin' },
        human2: { id: 'human2', name: 'Luke' }
    },
    edges: [{
        from: 'human1',
        fromType: 'father',
        to: 'human2',
        toType: 'son'
    }]
});

const lukesFather = humans.lens('human2').first('father').view();
console.log(lukesFather);

// prints: { id: 'human1', name: 'Anakin' }
```

#### `lens(id).prop(name)`

Last but not least you should be able to access a property of a node. Of course you could do so by just viewing the node and calling the property with vanilla JS: `.lens('person1').view().name`. But got gives you the opportunity to access your nodes properties in a functional manner.

```js
const { got } = require('gotjs');

const humans = got({
    nodes: {
        human1: { id: 'human1', name: 'Paul' },
        human2: { id: 'human2' }
    }
});

const name1 = humans.lens('human1').prop('name').get();
console.log(name1);
// prints: Paul

const name2 = humans.lens('human2').prop('name').get();
console.log(name2);
// prints: undefined
```
Of course in this case there is no difference to the `.lens('person1').view().name` approach, but when you try it yourself you notice that `.prop()` returns an `Option` of the value which you can use to pass the problem of an undefined property down the river until it is appropriate to decide what to do with `undefined`:
```js
function writeGreeting(lens) {
    // .get() takes a default value as argument
    return lens.prop('name').map(name => 'Greetings to you, ' + name + '! 🧐').get('There is no name 😡');
}

console.log(writeGreeting(humans.lens('human1')));
// prints: Greetings to you, Paul! 🧐
console.log(writeGreeting(humans.lens('human2')));
// prints: There is no name 😡
```

### Summary

Coming soon.

## But What's Different?

Coming soon.

<!-- 
# Brainstorming
## Naming
- graph, object, types
- gangster, opportunistic, transformation 

## Key Features
- immutable state: structural sharing
- custom sugar functions
- no magic for the user (state is human readable)
- views can be declared (Transformation of the graph, different graphs can be feeded in one view)
- user has the full control of the data graph
- nodes are dynamically typed
- types of nodes are just defined via the edges (fromType and toType). This represents which role a node plays in the relationship with another one
- 1-to-1: With first() -> If there is a 1-to-1 relation the user is responsible, that there is only one edge of this type to another object
- 1-to-n, n-to-m Relations can be handled easily via the types of edge-ends
- basic functional javascript with map, filter, reduce

## Integrations
- Redux
- Cycle.js

## Visions
- Ordered collections
- Portal gothub.io
  - Right-Management
  - e2e encryption
- Reactiveness / Streamify
- Presentation Layer: configurable views
- Visualization: Simple graph overview with all API actions
- configure sugar functions in GotOperator
- Setter in lenses

## Documentation

- GotOperator
- GotLens
- GotNode
- GotEdge
- GotState

## CTA
- Contribute on Visions
- Report Issues
- Fork and bring your own version life
- Realize your own visions without me

-->