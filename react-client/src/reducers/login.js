import {IS_AUTHENTICATED, LOGIN_ERRORS, LOGIN_LOADING} from "../actions/actionTypes";

export const isAuthenticated = (state = !!localStorage.getItem('token'), action) => {
  switch (action.type) {
    case IS_AUTHENTICATED:
      return action.payload;

    default:
      return state;
  }
};

export const loginLoading = (state = false, action) => {
  switch (action.type) {
    case LOGIN_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const loginErrors = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_ERRORS:
      return action.payload;

    default:
      return state;
  }
};