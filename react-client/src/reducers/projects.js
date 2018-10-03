import {
  ADD_PROJECT, ADD_PROJECT_FILE,
  CHANGE_PROJECT,
  CREATE_PROJECT_ERRORS,
  DELETE_PROJECT,
  NEW_PROJECT_LOADING, REMOVE_PROJECT_FILE,
  SET_PROJECT,
  SET_PROJECTS
} from "../actions/actionTypes";

export const projects = (state = null, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return action.payload;

    case ADD_PROJECT:
      return [...state, action.payload];

    case DELETE_PROJECT:
      return state.filter(project => project.id !== action.payload.id);

    case CHANGE_PROJECT: {
      const indexOfProject = state.findIndex(({id}) => id === action.payload.id);
      return [...state.slice(0, indexOfProject), action.payload, ...state.slice(indexOfProject + 1)];
    }

    default:
      return state;
  }
};

export const project = (state = {}, action) => {
  switch (action.type) {
    case SET_PROJECT:
      return action.payload;

    case ADD_PROJECT_FILE: {
      return {...state, files: [...state.files, action.payload]}
    }

    case REMOVE_PROJECT_FILE: {
      return {...state, files: state.files.filter(({id}) => id !== action.payload)}
    }

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