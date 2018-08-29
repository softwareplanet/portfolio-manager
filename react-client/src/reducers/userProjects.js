import {
  ADD_USER_PROJECT, CHANGE_USER_PROJECT,
  CREATE_USER_PROJECT_ERRORS,
  DELETE_USER_PROJECT,
  NEW_USER_PROJECT_LOADING,
  SET_USER_PROJECTS
} from "../actions/actionTypes";

export const userProjects = (state = null, action) => {
  switch (action.type) {
    case SET_USER_PROJECTS:
      return action.payload;

    case ADD_USER_PROJECT:
      return [...state, action.payload];

    case DELETE_USER_PROJECT: {
      return state.filter(({id}) => id !== action.payload.id);
    }

    case CHANGE_USER_PROJECT: {
      const indexOfProject = state.findIndex( ({id}) => id === action.payload.id);
      return [...state.slice(0, indexOfProject), action.payload, ...state.slice(indexOfProject+1)];
    }

    default:
      return state;
  }
};

export const newUserProjectLoading = (state = false, action) => {
  switch (action.type) {
    case NEW_USER_PROJECT_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const createUserProjectErrors = (state = {}, action) => {
  switch (action.type) {
    case CREATE_USER_PROJECT_ERRORS:
      return action.payload;

    default:
      return state;
  }
};