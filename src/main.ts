import { got } from './got';
import * as uuid from 'uuid/v4';

const g = got();
const state = g
    .predicate('house', 'house')
    .put({ id: 'house1', name: 'Haus 1'})
    .state;

// console.log(JSON.stringify(state, null, 2));
console.log(state);