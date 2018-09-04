import {
  EDIT_USER_ERRORS,
  EDIT_USER_LOADING,
  EDIT_USER_PHOTO_LOADING,
  REMOVE_USER_ERRORS,
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