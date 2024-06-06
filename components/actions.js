import {SET_ACTIVE_USER, SET_PHONE_NUMBER} from './actionTypes'; // Import action types

export const setPhoneNumber = phoneNumber => ({
  type: SET_PHONE_NUMBER,
  payload: phoneNumber,
});

export const setActiveUser = user => ({
  type: SET_ACTIVE_USER,
  payload: user,
});
