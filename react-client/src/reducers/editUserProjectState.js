import {SUCCESSFUL_EDIT_USER_PROJECT} from "../actions/actionTypes";

export const editUserProjectState = (state = null, action) => {
  switch (action.type) {
    case SUCCESSFUL_EDIT_USER_PROJECT:
      return action.payload;

    default:
      return state;
  }
};