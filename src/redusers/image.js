import {SET_COLOR, SET_CONFIG, SET_FRAME} from '../actions/image';

const initialState = {
  color: '#fff',
  config: null,
  frame: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_COLOR:
      state.color = action.color;
      return state;
    case SET_CONFIG:
      state.config = action.config;
      return state;
    case SET_FRAME:
      state.frame = action.frame;
      return state;
    default:
      return state;
  }
};
