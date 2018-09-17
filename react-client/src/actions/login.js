import {IS_AUTHENTICATED, LOGIN_ERRORS, LOGIN_LOADING} from "./actionTypes";
import {AuthService} from "../service/authService";

export const loginErrors = (errors = {}) => {
  return {
    type: LOGIN_ERRORS,
    payload: errors
  };
};

export const loginLoading = (bool) => {
  return {
    type: LOGIN_LOADING,
    payload: bool
  };
};

export const isAuthenticated = (bool) => {
  return {
    type: IS_AUTHENTICATED,
    payload: bool
  };
};

export const logIn = (username, password) => {
  return (dispatch) => {
    dispatch(loginLoading(true));

    AuthService.logIn(username, password)
      .then(() => {
        dispatch(loginLoading(false));
        dispatch(loginErrors({}));
      })
      .catch(errors => {
        dispatch(loginLoading(false));
        dispatch(loginErrors((errors.response && errors.response.data) || {non_field_errors: [errors.message]}));
      })
  }
};

export const logOut = () => {
  return (dispatch) => {
    AuthService.logOut();
    dispatch(isAuthenticated(false));
  }
};