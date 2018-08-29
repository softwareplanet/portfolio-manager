import {
  ADD_USER_SKILL,
  CHANGE_USER_SKILL,
  CREATE_USER_SKILL_ERRORS,
  DELETE_USER_SKILL,
  NEW_USER_SKILL_LOADING,
  REMOVE_USER_SKILL_ERRORS,
  SET_USER_SKILLS
} from "../actions/actionTypes";

export const userSkills = (state = null, action) => {
  switch (action.type) {
    case SET_USER_SKILLS:
      return action.payload;

    case ADD_USER_SKILL:
      return [...state, action.payload];

    case DELETE_USER_SKILL: {
      return state.filter(({id}) => id !== action.payload.id);
    }

    case CHANGE_USER_SKILL: {
      const indexOfSkill = state.findIndex(({id}) => id === action.payload.id);
      return [...state.slice(0, indexOfSkill), action.payload, ...state.slice(indexOfSkill + 1)];
    }

    default:
      return state;
  }
};

export const newUserSkillLoading = (state = false, action) => {
  switch (action.type) {
    case NEW_USER_SKILL_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const createUserSkillErrors = (state = {}, action) => {
  switch (action.type) {
    case CREATE_USER_SKILL_ERRORS:
      return action.payload;

    case REMOVE_USER_SKILL_ERRORS:
      return {};

    default:
      return state;
  }
};