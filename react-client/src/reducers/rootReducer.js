import {combineReducers} from 'redux';
import {isAuthenticated, loginErrors, loginLoading} from "./login";
import {registerErrors, registerLoading} from "./register";
import {user} from "./user";

export default combineReducers({
  isAuthenticated,
  loginLoading,
  loginErrors,
  registerErrors,
  registerLoading,
  user
});