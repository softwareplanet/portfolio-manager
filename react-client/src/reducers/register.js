import {REGISTER_ERRORS, REGISTER_LOADING} from "../actions/actionTypes";

export const registerLoading = (state = false, action) => {
  switch (action.type) {
    case REGISTER_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const registerErrors = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_ERRORS:
      return action.payload;

    default:
      return state;
  }
};