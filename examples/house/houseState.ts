import { got } from '../../src/got';

export const houseState = got()
    .node({ id: 'house1', name: 'Haus 1', description: 'Vinnis Haus' })
    .node({ id: 'floor1', name: 'Etage 1' })
    .edge({ from: 'house1', fromType: 'house', to: 'floor1', toType: 'floor' })
    .node({ id: 'floor2', name: 'Etage 2' })
    .edge({ from: 'house1', fromType: 'house', to: 'floor2', toType: 'floor' })
    .node({ id: 'floor3', name: 'Etage 2' })
    .edge({ from: 'house1', fromType: 'house', to: 'floor3', toType: 'floor' })
    .node({ id: 'floor4', name: 'Etage 2' })
    .edge({ from: 'house1', fromType: 'house', to: 'floor4', toType: 'floor' })
    .node({ id: 'room21', name: 'Raum 21' })
    .edge({ from: 'floor2', fromType: 'floor', to: 'room21', toType: 'room' })
    .node({ id: 'room22', name: 'Raum 22', description: 'Wohnzimmer' })
    .edge({ from: 'floor2', fromType: 'floor', to: 'room22', toType: 'room' })
    .node({ id: 'room23', name: 'Raum 23' })
    .edge({ from: 'floor2', fromType: 'floor', to: 'room23', toType: 'room' })
    .node({ id: 'room24', name: 'Raum 24' })
    .edge({ from: 'floor2', fromType: 'floor', to: 'room24', toType: 'room' })
    .node({ id: 'room31', name: 'Raum 31' })
    .edge({ from: 'floor3', fromType: 'floor', to: 'room31', toType: 'room' })
    .node({ id: 'room32', name: 'Raum 32', description: 'Wohnzimmer' })
    .edge({ from: 'floor3', fromType: 'floor', to: 'room32', toType: 'room' })
    .node({ id: 'room33', name: 'Raum 33' })
    .edge({ from: 'floor3', fromType: 'floor', to: 'room33', toType: 'room' })
    .node({ id: 'room34', name: 'Raum 34' })
    .edge({ from: 'floor3', fromType: 'floor', to: 'room34', toType: 'room' })
    .node({ id: 'room41', name: 'Raum 41' })
    .edge({ from: 'floor4', fromType: 'floor', to: 'room41', toType: 'room' })
    .node({ id: 'room42', name: 'Raum 42', description: 'Wohnzimmer' })
    .edge({ from: 'floor4', fromType: 'floor', to: 'room42', toType: 'room' })
    .node({ id: 'room43', name: 'Raum 43' })
    .edge({ from: 'floor4', fromType: 'floor', to: 'room43', toType: 'room' })
    .node({ id: 'room44', name: 'Raum 44' })
    .edge({ from: 'floor4', fromType: 'floor', to: 'room44', toType: 'room' });