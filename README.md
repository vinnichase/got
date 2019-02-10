<img src="https://raw.githubusercontent.com/vinnichase/got/master/docs/got-logo.png" width="200">

# got

got is a fluent, functional, zero-dependency, in-memory JavaScript **graph database**. You can create data structures at any degree of complexity within your JavaScript application both in the browser and Node.js. The whole database is represented in a state object which is basically a plain JavaScript object. The state is immutable, which means that existing states are never modified directly, instead a mutation will always result in a clone of the previous state, including the updates. For that reason, got is also perfect to manage heavily complex states with pure redux.

**inspired by:** [Ramda](https://github.com/ramda/ramda), [Gun](https://github.com/amark/gun), [Redux](https://github.com/reduxjs/redux), [GraphQL](https://github.com/facebook/graphql), [Cycle.js](https://github.com/cyclejs/cyclejs) and [git](https://git-scm.com/) 😋

## Installation
On Node:

`$ npm i gotjs` or

`$ yarn add gotjs`

The package provides its own typings so you can use it with TypeScript out of the box. However you can also start over with plain JS.

## Usage

As any other [graph database](https://en.wikipedia.org/wiki/Graph_database) a got graph consists of exact two entities: **nodes** and **edges**. Nodes have a property `id` which uniquely identifies them in the whole graph. Additionally each node can contain an arbitrarily structured JavaScript object. Edges are defined by at least four properties `from`, `fromType`, `to` and `toType`. `from` and `to` are `id`s of two nodes which are connected by the edge which would practically be enough to define a very simple graph. But in order to represent any possible data structure we will need to define the type of connection between two nodes. In other words, we have to define the role that one node plays in connection with another. This can be done with the properies `fromType` and `toType`.

### Writing the Graph State

Now since we know the basic elements of a got graph we should start **writing** the graph to have a foundation to play with.

Let's model a friendship between John and Paul:

```
FIGURE: simple graph John <-> Paul
```

And in the code:
```JavaScript
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

```JavaScript
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

> You might also notice that this function returns a got operator containing an immutable copy of the state after the two write operations. So all the heavy users of **redux** should recognize the pattern: This is nothing more than a reducer function which is taking some arguments plus the old state (wrapped in the `gotOperator`) and returning a transformed state that did **not** mutate the old state at all. We will later learn in detail how to integrate got with redux.

Now you can use it to quickly add friends:
```JavaScript
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

```JavaScript
console.log(friends1.state().nodes.person1);
// prints: { id: 'person1', name: 'John' }

console.log(friends1.state().nodes.person3);
// prints: undefined

console.log(friends2.state().nodes.person3);
// prints: { id: 'person3', name: 'George' }
```

But don't be afraid that your memory gets spilled over after tons of operations. Even though the modified parts of the state are cloned, the unchanged parts still share the same references:

```JavaScript
const person1FirstState = friends1.state().nodes.person1;
const person1SecondState = friends2.state().nodes.person1;
console.log(person1FirstState === person1SecondState);
// prints: true
```
> This is a very basic implementation of the idea of [structural sharing](https://www.youtube.com/watch?v=e-5obm1G_FY&t=16m14s).


The above concepts come as heavily simplified examples. Of course you can apply concepts like [currying](https://en.wikipedia.org/wiki/Currying) the `addFriend(...)` function or [piping](https://ramdajs.com/docs/#pipe) multiple state transitons. There are no boundaries to your creativity in functional programming:

```JavaScript
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

To do so the got operator offers us one read operation `.lens(id)` which is heavily inspired by [Ramda](https://github.com/ramda/ramda) however it is implemented a little different plus that it only provides `.view()` to view the lenses content and no `.set()`.

But what is a lens? － for those who haven't heard about Ramda. A lens 🔎 can be described as a small window that is pointing at a node in the graph ready to perform more operations on the node it is pointing at. A lens will give you four functions for selecting nodes in the graph: `.view()`, `.list(type)`, `.first(type)` and `.prop(name)`.

Let's start with the most straight forward function `.view()` which is just returning the object the lens is pointing at:

```JavaScript
const { got } = require('gotjs');

// Start over with an initial state of the previous examples
const initialState = {
    nodes: {
        person1: { id: 'person1', name: 'John' },
        person2: { id: 'person2', name: 'Paul' }
    },
    edges: [{
        from: 'person1',
        fromType: 'friend',
        to: 'person2',
        toType: 'friend'
    }]
};
const friends = got(initialState);

// Create a lens at person2 and view its content
const person2 = friends.lens('person2').view();
console.log(person2);

// prints: { id: 'person2', name: 'Paul' }
```



<!-- 
test
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