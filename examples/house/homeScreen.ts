import { GotNode, GotState, got } from '../../src/got';

export interface HomeScreenState {
    selectedHouse: GotNode;
    selectedFloor: GotNode;
    selectedRoom: GotNode;
}

const homeScreen = (uiState: HomeScreenState, state: GotState) => ({
    ...uiState,
    // houses: got(state)
});
