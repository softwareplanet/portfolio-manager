import {combineReducers} from 'redux';
import {isAuthenticated, loginErrors, loginLoading} from "./login";
import {registerErrors, registerLoading} from "./register";

export default combineReducers({
  isAuthenticated,
  loginLoading,
  loginErrors,
  registerErrors,
  registerLoading
});