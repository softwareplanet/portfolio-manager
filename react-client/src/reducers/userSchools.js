import {
  ADD_USER_SCHOOL,
  CHANGE_USER_SCHOOL,
  CREATE_USER_SCHOOL_ERRORS,
  DELETE_USER_SCHOOL,
  NEW_USER_SCHOOL_LOADING,
  REMOVE_USER_SCHOOL_ERRORS,
  SET_USER_SCHOOLS
} from "../actions/actionTypes";

export const userSchools = (state = null, action) => {
  switch (action.type) {
    case SET_USER_SCHOOLS:
      return action.payload;

    case ADD_USER_SCHOOL:
      return [...state, action.payload];

    case DELETE_USER_SCHOOL: {
      return state.filter(({id}) => id !== action.payload.id);
    }

    case CHANGE_USER_SCHOOL: {
      const indexOfSchool = state.findIndex(({id}) => id === action.payload.id);
      return [...state.slice(0, indexOfSchool), action.payload, ...state.slice(indexOfSchool + 1)];
    }

    default:
      return state;
  }
};

export const newUserSchoolLoading = (state = false, action) => {
  switch (action.type) {
    case NEW_USER_SCHOOL_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const createUserSchoolErrors = (state = {}, action) => {
  switch (action.type) {
    case CREATE_USER_SCHOOL_ERRORS:
      return action.payload;

    case REMOVE_USER_SCHOOL_ERRORS:
      return {};

    default:
      return state;
  }
};