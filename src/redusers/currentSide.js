import {SET_SIDE} from '../actions/currentSide';

const initialState = 'front';

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SIDE:
      return action.currentSide
    default:
      return state;
  }
};
