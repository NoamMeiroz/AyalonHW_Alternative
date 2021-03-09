import { MAP_CHANGE } from './types';

/**
 * return the list of employees for a given comapny.
 */
export const mapChange = (zoom, position) => {
    return (dispatch) => {dispatch({ type: MAP_CHANGE, zoom: zoom, position: position})};
};
