import {ADD_PROJECT, CREATE_PROJECT_ERRORS, NEW_PROJECT_LOADING, SET_PROJECTS} from "../actions/actionTypes";

export const projects = (state = [], action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return action.payload;

    case ADD_PROJECT:
      return [...state, action.payload];

    default:
      return state;
  }
};

export const newProjectLoading = (state = false, action) => {
  switch (action.type) {
    case NEW_PROJECT_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const createProjectErrors = (state = {}, action) => {
  switch (action.type) {
    case CREATE_PROJECT_ERRORS:
      return action.payload;

    default:
      return state;
  }
};