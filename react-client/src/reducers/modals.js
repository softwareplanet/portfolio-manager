import {SET_PASSWORD_MODAL, SET_PROJECT_MODAL, SET_SCHOOL_MODAL, SET_SKILL_MODAL} from "../actions/actionTypes";

export const skillModal = (state = false, action) => {
  switch (action.type) {
    case SET_SKILL_MODAL:
      return action.payload;

    default:
      return state;
  }
};

export const schoolModal = (state = false, action) => {
  switch (action.type) {
    case SET_SCHOOL_MODAL:
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

export const passwordModal = (state = false, action) => {
  switch (action.type) {
    case SET_PASSWORD_MODAL:
      return action.payload;

    default:
      return state;
  }
};