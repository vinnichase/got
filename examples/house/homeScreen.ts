import { GotOperator } from '../../src/got';
import { houseState } from './houseState';

export interface HomeScreenState {
    houseId: string;
    floorId: string;
    roomId: string;
}

const homeScreen = (
    { houseId, floorId, roomId }: Partial<HomeScreenState>,
    got: GotOperator,
) => {
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

const initialUiState: Partial<HomeScreenState> = {
    houseId: 'house2',
    // floorId: 'floor2',
};
const uiState = homeScreen(initialUiState, houseState);

console.log(uiState);