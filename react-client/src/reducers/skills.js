import {
  ADD_SKILL,
  CHANGE_SKILL,
  CREATE_SKILL_ERRORS,
  DELETE_SKILL,
  NEW_SKILL_LOADING,
  SET_SKILL, SET_SKILL_CATEGORIES,
  SET_SKILLS
} from "../actions/actionTypes";

export const skills = (state = null, action) => {
  switch (action.type) {
    case SET_SKILLS:
      return action.payload;

    case ADD_SKILL:
      return [...state, action.payload];

    case DELETE_SKILL:
      return state.filter(skill => skill.id !== action.payload.id);

    case CHANGE_SKILL: {
      const indexOfSkill = state.findIndex(({id}) => id === action.payload.id);
      return [...state.slice(0, indexOfSkill), action.payload, ...state.slice(indexOfSkill + 1)];
    }

    default:
      return state;
  }
};

export const skillCategories = (state = [], action) => {
  switch (action.type) {
    case SET_SKILL_CATEGORIES:
      return action.payload;

    default:
      return state;
  }
};

export const skill = (state = {}, action) => {
  switch (action.type) {
    case SET_SKILL:
      return action.payload;

    default:
      return state;
  }
};

export const newSkillLoading = (state = false, action) => {
  switch (action.type) {
    case NEW_SKILL_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const createSkillErrors = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SKILL_ERRORS:
      return action.payload;

    default:
      return state;
  }
};