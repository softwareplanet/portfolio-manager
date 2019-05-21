import {combineReducers} from 'redux';
import {isAuthenticated, loginErrors, loginLoading} from "./login";
import {registerErrors, registerLoading} from "./register";
import {
  editUserErrors,
  editUserLoading,
  editUserPhotoLoading,
  employee,
  employeeFiles, 
  employeeFilesErrors,
  employees,
  isStaff,
  user
} from "./user";
import {createUserProjectErrors, newUserProjectLoading, userProjects} from "./userProjects";
import {sideBarOpened} from "./sidebar";
import {createProjectErrors, newProjectLoading, project, projects} from "./projects";
import {createSkillErrors, newSkillLoading, skill, skillCategories, skills} from "./skills";
import {passwordModal, projectModal, schoolModal, skillModal, teamModal} from "./modals";
import {
  editProjectState,
  editUserProjectState,
  editUserSchoolState,
  editUserSkillState,
  editUserState
} from "./editUserInstanceState";
import {createUserSkillErrors, newUserSkillLoading, userSkills} from "./userSkills";
import {createSchoolErrors, newSchoolLoading, school, schools} from "./schools";
import {createUserSchoolErrors, newUserSchoolLoading, userSchools} from "./userSchools";

export default combineReducers({
  sideBarOpened,
  isStaff,
  isAuthenticated,

  skillModal,
  schoolModal,
  projectModal,
  teamModal,
  passwordModal,

  user,
  employee,
  employeeFiles,
  employees,
  skill,
  skills,
  skillCategories,
  school,
  schools,
  project,
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
  editUserPhotoLoading,

  loginErrors,
  registerErrors,
  createSkillErrors,
  createSchoolErrors,
  createProjectErrors,
  createUserProjectErrors,
  createUserSkillErrors,
  createUserSchoolErrors,
  editUserErrors,
  employeeFilesErrors,

  editUserProjectState,
  editProjectState,
  editUserSkillState,
  editUserSchoolState,
  editUserState,
});