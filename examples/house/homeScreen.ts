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
    const house = got.lens(houseId).view();
    const floor = got.lens(floorId).view() || got.lens(house.id).first('floor').view();
    const room = got.lens(roomId).view() || got.lens(floor.id).first('room').view();
    return {
        house,
        floor,
        room,
        floors: got.lens(house.id).list('floor').map(l => l.view()),
        rooms: got.lens(floor.id).list('room').map(l => l.view()),
    };
};

const initialUiState: Partial<HomeScreenState> = {
    houseId: 'house1',
    // floorId: 'floor2',
};
const uiState = homeScreen(initialUiState, houseState);

console.log(uiState);