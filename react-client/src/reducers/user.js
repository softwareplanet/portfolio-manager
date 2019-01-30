import {
  ADD_EMPLOYEE_FILE,
  EDIT_USER_ERRORS,
  EDIT_USER_LOADING,
  EDIT_USER_PHOTO_LOADING, EMPLOYEE_FILES_ERRORS,
  IS_STAFF,
  REMOVE_EMPLOYEE,
  REMOVE_EMPLOYEE_FILE,
  REMOVE_USER_ERRORS,
  SET_EMPLOYEE,
  SET_EMPLOYEE_FILES,
  SET_EMPLOYEES,
  SET_USER
} from "../actions/actionTypes";

export const user = (state = null, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;

    default:
      return state;
  }
};

export const employees = (state = null, action) => {
  switch (action.type) {
    case SET_EMPLOYEES:
      return action.payload;

    case REMOVE_EMPLOYEE: {
      return state.filter(({id}) => id !== action.payload.id);
    }

    default:
      return state;
  }
};

export const employee = (state = {}, action) => {
  switch (action.type) {
    case SET_EMPLOYEE:
      return action.payload;

    default:
      return state;
  }
};

export const employeeFiles = (state = {}, action) => {
  switch (action.type) {
    case SET_EMPLOYEE_FILES:
      return action.payload;

    case ADD_EMPLOYEE_FILE: {
      return [...state, action.payload]
    }

    case REMOVE_EMPLOYEE_FILE: {
      return state.filter(({id}) => id !== action.payload)
    }

    default:
      return state;
  }
};

export const editUserLoading = (state = false, action) => {
  switch (action.type) {
    case EDIT_USER_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const editUserPhotoLoading = (state = false, action) => {
  switch (action.type) {
    case EDIT_USER_PHOTO_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const editUserErrors = (state = {}, action) => {
  switch (action.type) {
    case EDIT_USER_ERRORS:
      return action.payload;

    case REMOVE_USER_ERRORS:
      return {};

    default:
      return state;
  }
};

export const employeeFilesErrors = (state = {}, action) => {
  switch (action.type) {
    case EMPLOYEE_FILES_ERRORS:
      return action.payload;

    default:
      return state;
  }
};

export const isStaff = (state = false, action) => {
  switch (action.type) {
    case IS_STAFF:
      return action.payload;

    default:
      return state;
  }
};