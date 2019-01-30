# got
<img src="https://raw.githubusercontent.com/vinnichase/got/master/docs/got-logo.png" width="200">


got is a fluent, functional, zero-dependency, in-memory JavaScript **graph database**. However it can be used with plain JS it is built with TypeScript and provides its own typings. got is more of a design pattern than a full-featured DB and therefore comes with a very small set of basic functionality at this point. Let's see where we can get.

**inspired by:** [Ramda](https://github.com/ramda/ramda), [Gun](https://github.com/amark/gun), [Redux](https://github.com/reduxjs/redux), [GraphQL](https://github.com/facebook/graphql), [Cycle.js](https://github.com/cyclejs/cyclejs) and [git](https://git-scm.com/) 😋

## Installation
On Node:

`$ npm i gotjs` or

`$ yarn add gotjs`

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

## Usage

```JavaScript
const { got } = require('gotjs');

const friends = got()
    .node({ id: 'person1', name: 'Bob' })
    .node({ id: 'person2', name: 'Alice' })
    .edge({ from: 'person1', fromType: 'friend', to: 'person2', toType: 'friend' });

console.log(friends.state());

// prints:
// { nodes:
//    { person1: { id: 'person1', name: 'Bob' },
//      person2: { id: 'person2', name: 'Alice' } },
//   edges:
//    [ { from: 'person1',
//        fromType: 'friend',
//        to: 'person2',
//        toType: 'friend' } ] }

```

