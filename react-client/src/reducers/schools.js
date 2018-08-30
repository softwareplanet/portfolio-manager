import {ADD_SCHOOL, CREATE_SCHOOL_ERRORS, NEW_SCHOOL_LOADING, SET_SCHOOLS} from "../actions/actionTypes";

export const schools = (state = [], action) => {
  switch (action.type) {
    case SET_SCHOOLS:
      return action.payload;

    case ADD_SCHOOL:
      return [...state, action.payload];

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