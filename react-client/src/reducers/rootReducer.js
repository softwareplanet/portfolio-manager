import {combineReducers} from 'redux';
import {isAuthenticated, loginErrors, loginLoading} from "./login";
import {registerErrors, registerLoading} from "./register";
import {editUserErrors, editUserLoading, user} from "./user";
import {createUserProjectErrors, newUserProjectLoading, userProjects} from "./userProjects";
import {sideBarOpened} from "./sidebar";
import {createProjectErrors, newProjectLoading, projects} from "./projects";
import {createSkillErrors, newSkillLoading, skills} from "./skills";
import {projectModal, schoolModal, skillModal} from "./modals";
import {editUserProjectState, editUserSchoolState, editUserSkillState, editUserState} from "./editUserInstanceState";
import {createUserSkillErrors, newUserSkillLoading, userSkills} from "./userSkills";
import {createSchoolErrors, newSchoolLoading, schools} from "./schools";
import {createUserSchoolErrors, newUserSchoolLoading, userSchools} from "./userSchools";

export default combineReducers({
  sideBarOpened,
  isAuthenticated,

  skillModal,
  schoolModal,
  projectModal,

  user,
  skills,
  schools,
  projects,
  userProjects,
  userSkills,
  userSchools,

  loginLoading,
  registerLoading,
  newSkillLoading,
  newSchoolLoading,
  newProjectLoading,
  newUserProjectLoading,
  newUserSkillLoading,
  newUserSchoolLoading,
  editUserLoading,

  loginErrors,
  registerErrors,
  createSkillErrors,
  createSchoolErrors,
  createProjectErrors,
  createUserProjectErrors,
  createUserSkillErrors,
  createUserSchoolErrors,
  editUserErrors,

  editUserProjectState,
  editUserSkillState,
  editUserSchoolState,
  editUserState,
});