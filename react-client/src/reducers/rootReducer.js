import {combineReducers} from 'redux';
import {isAuthenticated, loginErrors, loginLoading} from "./login";
import {registerErrors, registerLoading} from "./register";
import {user} from "./user";
import {userProjects} from "./userProjects";
import {sideBarOpened} from "./sidebar";
import {projects} from "./projects";
import {newSkillLoading, skills} from "./skills";
import {projectModal, skillModal} from "./modals";

export default combineReducers({
  isAuthenticated,
  loginLoading,
  loginErrors,
  registerErrors,
  registerLoading,
  user,
  userProjects,
  sideBarOpened,
  projects,
  skills,
  skillModal,
  projectModal,
  newSkillLoading
});