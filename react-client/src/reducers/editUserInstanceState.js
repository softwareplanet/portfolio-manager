import {
  SUCCESSFUL_EDIT_USER,
  SUCCESSFUL_EDIT_USER_PROJECT,
  SUCCESSFUL_EDIT_USER_SCHOOL,
  SUCCESSFUL_EDIT_USER_SKILL
} from "../actions/actionTypes";

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

export const editUserSchoolState = (state = null, action) => {
  switch (action.type) {
    case SUCCESSFUL_EDIT_USER_SCHOOL:
      return action.payload;

    default:
      return state;
  }
};

export const editUserState = (state = null, action) => {
  switch (action.type) {
    case SUCCESSFUL_EDIT_USER:
      return action.payload;

    default:
      return null;
  }
};