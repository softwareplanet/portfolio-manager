import {
  ADD_SCHOOL,
  CHANGE_SCHOOL,
  CREATE_SCHOOL_ERRORS,
  DELETE_SCHOOL,
  NEW_SCHOOL_LOADING,
  SET_SCHOOLS
} from "../actions/actionTypes";

export const schools = (state = null, action) => {
  switch (action.type) {
    case SET_SCHOOLS:
      return action.payload;

    case ADD_SCHOOL:
      return [...state, action.payload];

    case DELETE_SCHOOL:
      return state.filter(school => school.id !== action.payload.id);

    case CHANGE_SCHOOL: {
      const indexOfSchool = state.findIndex(({id}) => id === action.payload.id);
      return [...state.slice(0, indexOfSchool), action.payload, ...state.slice(indexOfSchool + 1)];
    }

    default:
      return state;
  }
};

export const newSchoolLoading = (state = false, action) => {
  switch (action.type) {
    case NEW_SCHOOL_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const createSchoolErrors = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SCHOOL_ERRORS:
      return action.payload;

    default:
      return state;
  }
};