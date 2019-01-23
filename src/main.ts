import { got } from './got';
import * as uuid from 'uuid/v4';

const g = got();
let gg = g
    .node({ id: 'haus1', name: 'Haus 1', description: 'Vinnis Haus' })
    .node({ id: 'haus2', name: 'Haus 2', zimmer: 5 })
    .edge({ from: 'haus1', fromType: 'nachbar', to: 'haus2', toType: 'nachbar' })
    .node({ id: 'haus3', name: 'Haus 3' })
    .edge({ from: 'haus2', fromType: 'nachbar', to: 'haus3', toType: 'nachbar' });

gg = gg
    .node({ id: 'room1', name: 'Raum 1' })
    .edge({ from: 'haus1', fromType: 'haus', to: 'room1', toType: 'raum'});

// console.log(JSON.stringify(state, null, 2));
console.log(gg.state());