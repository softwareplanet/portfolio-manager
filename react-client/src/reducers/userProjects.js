import {ADD_USER_PROJECT, DELETE_USER_PROJECT, SET_USER_PROJECTS} from "../actions/actionTypes";

export const userProjects = (state = null, action) => {
  switch (action.type) {
    case SET_USER_PROJECTS:
      return action.payload;

    case ADD_USER_PROJECT:
      return [...state, action.payload];

    case DELETE_USER_PROJECT: {
      return state.filter( ({project}) => project.id !== action.payload.id);
    }

    default:
      return state;
  }
};