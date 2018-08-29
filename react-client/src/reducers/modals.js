import {SET_PROJECT_MODAL, SET_SKILL_MODAL} from "../actions/actionTypes";

export const skillModal = (state = false, action) => {
  switch (action.type) {
    case SET_SKILL_MODAL:
      return action.payload;

    default:
      return state;
  }
};

export const projectModal = (state = false, action) => {
  switch (action.type) {
    case SET_PROJECT_MODAL:
      return action.payload;

    default:
      return state;
  }
};