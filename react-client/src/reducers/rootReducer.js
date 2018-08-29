import {combineReducers} from 'redux';
import {isAuthenticated, loginErrors, loginLoading} from "./login";
import {registerErrors, registerLoading} from "./register";
import {user} from "./user";
import {createUserProjectErrors, newUserProjectLoading, userProjects} from "./userProjects";
import {sideBarOpened} from "./sidebar";
import {createProjectErrors, newProjectLoading, projects} from "./projects";
import {createSkillErrors, newSkillLoading, skills} from "./skills";
import {projectModal, skillModal} from "./modals";
import {editUserProjectState, editUserSkillState} from "./editUserInstanceState";
import {createUserSkillErrors, newUserSkillLoading, userSkills} from "./userSkills";

export default combineReducers({
  sideBarOpened,
  isAuthenticated,

  skillModal,
  projectModal,

  user,
  skills,
  projects,
  userProjects,
  userSkills,

  loginLoading,
  registerLoading,
  newSkillLoading,
  newProjectLoading,
  newUserProjectLoading,
  newUserSkillLoading,

  loginErrors,
  registerErrors,
  createSkillErrors,
  createProjectErrors,
  createUserProjectErrors,
  createUserSkillErrors,

  editUserProjectState,
  editUserSkillState,
});