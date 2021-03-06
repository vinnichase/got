import { GotOperator } from '../../src/got';
import { houseState } from './houseState';

const homeScreen = ({ houseId, floorId, roomId }, got: GotOperator) => {
    const houseLens = got.lens(houseId);
    const floorLens = got.lens(floorId, houseLens.first('floor'));
    const roomLens = got.lens(roomId, floorLens.first('room'));
    return {
        header: houseLens.prop('description').get(),
        house: houseLens.view(),
        floor: floorLens.view(),
        room: roomLens.view(),
        floors: houseLens.list('floor').map(l => l.view()),
        rooms: floorLens.list('room').map(l => l.view()),
    };
};

const uiState = homeScreen({
    houseId: 'house1',
    floorId: 'floor1',
} as any, houseState);

console.log(uiState);