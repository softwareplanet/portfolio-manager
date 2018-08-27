import {SET_USER_PROJECTS} from "../actions/actionTypes";

export const userProjects = (state = null, action) => {
  switch (action.type) {
    case SET_USER_PROJECTS:
      return action.payload;

    default:
      return state;
  }
};