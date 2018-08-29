import {SUCCESSFUL_EDIT_USER_PROJECT, SUCCESSFUL_EDIT_USER_SKILL} from "../actions/actionTypes";

export const editUserProjectState = (state = null, action) => {
  switch (action.type) {
    case SUCCESSFUL_EDIT_USER_PROJECT:
      return action.payload;

    default:
      return state;
  }
};

export const editUserSkillState = (state = null, action) => {
  switch (action.type) {
    case SUCCESSFUL_EDIT_USER_SKILL:
      return action.payload;

    default:
      return state;
  }
};