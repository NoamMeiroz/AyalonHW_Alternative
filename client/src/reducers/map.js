import { MAP_CHANGE } from '../actions/types';

const INITIAL_STATE = {
    position: [32.087934, 34.774547],
    zoom: 7
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case MAP_CHANGE:
            return {
                ...state,
                zoom: action.zoom,
                position: action.position
            };
        default:
            return state;
    }
}
