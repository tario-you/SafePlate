import {combineReducers} from 'redux'; // Make sure to import combineReducers correctly
import {SET_ACTIVE_USER, SET_PHONE_NUMBER} from './actionTypes';

const phoneNumberReducer = (state = null, action) => {
  switch (action.type) {
    case SET_PHONE_NUMBER:
      return action.payload;
    default:
      return state;
  }
};

const activeUserReducer = (state = null, action) => {
  switch (action.type) {
    case SET_ACTIVE_USER:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  phoneNumber: phoneNumberReducer,
  activeUser: activeUserReducer,
});

export default rootReducer;
