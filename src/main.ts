import { got } from './got';
import * as uuid from 'uuid/v1';

const g = got();
const state = g
    .type('house')
    .type('floor')
    .type('room')
    .type('position')
    .house.put({ id: uuid(), name: 'Haus 1' })
    .house.put({ id: uuid(), name: 'Haus 2' })
    .house.put({ id: uuid(), name: 'Haus 3' })
    .floor.put({ id: uuid(), name: 'Raum 1' })
    .floor.put({ id: uuid(), name: 'Raum 2' })
    .floor.put({ id: uuid(), name: 'Raum 3' })
    .state;

console.log(g.house.put.toString());
console.log(JSON.stringify(state, null, 2));
console.log(JSON.stringify(g.floor.get(), null, 2));