import { combineReducers } from 'redux';
import image from './image';
import currentSide from './currentSide';

export default combineReducers({
  image,
  currentSide
});
