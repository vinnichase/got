# got
<img src="https://raw.githubusercontent.com/vinnichase/got/master/docs/got-logo.png" width="200">


got is a fluent, functional, zero-dependency, in-memory JavaScript **graph database**. However it can be used with plain JS it is built with TypeScript and provides its own typings. got is more of a design pattern than a full-featured DB and therefore comes with a very small set of basic functionality at this point. Let's see where we can get.

**inspired by:** [Ramda](https://github.com/ramda/ramda), [Gun](https://github.com/amark/gun), [Redux](https://github.com/reduxjs/redux), [GraphQL](https://github.com/facebook/graphql), [Cycle.js](https://github.com/cyclejs/cyclejs) and [git](https://git-scm.com/) 😋

## Installation
On Node:

`$ npm i gotjs` or

`$ yarn add gotjs`

## Usage

```JavaScript
const { got } = require('gotjs');

const friends = got()
    .node({ id: 'person1', name: 'Bob' })
    .node({ id: 'person2', name: 'Alice' })
    .edge({ from: 'person1', fromType: 'friend', to: 'person2', toType: 'friend' });

console.log(friends.state());
```