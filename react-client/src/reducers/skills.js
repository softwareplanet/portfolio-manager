import {SET_SKILLS} from "../actions/actionTypes";

export const skills = (state = [], action) => {
  switch (action.type) {
    case SET_SKILLS:
      return action.payload;

    default:
      return state;
  }
};