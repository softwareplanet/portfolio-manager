import {SET_PROJECTS} from "../actions/actionTypes";

export const projects = (state = [], action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return action.payload;

    default:
      return state;
  }
};