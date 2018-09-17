import {REGISTER_ERRORS, REGISTER_LOADING} from "./actionTypes";
import {AuthService} from "../service/authService";
import axios from "axios";
import {formatDate} from "../service/utils";

export const registerErrors = (errors = {}) => {
  return {
    type: REGISTER_ERRORS,
    payload: errors
  };
};

export const registerLoading = (bool) => {
  return {
    type: REGISTER_LOADING,
    payload: bool
  };
};

export const register = (user) => {
  return (dispatch) => {
    dispatch(registerLoading(true));
    const {username, email, password, firstName, lastName, birthday} = user;
    axios.post('/api/v1/employee', {
      username, email, password, firstName, lastName, dob: formatDate(birthday)
    }).then(() => {
      dispatch(registerErrors({}));
      AuthService.logIn(username, password);
    }).catch(errors => {
      dispatch(registerErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(registerLoading(false));
    })
  }
};