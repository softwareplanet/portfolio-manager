import {SET_PASSWORD_MODAL, SET_PROJECT_MODAL, SET_SCHOOL_MODAL, SET_SKILL_MODAL, SET_TEAM_MODAL} from "./actionTypes";

export const setProjectModal = (modalState = false) => {
  return {
    type: SET_PROJECT_MODAL,
    payload: modalState
  };
};

export const setTeamModal = (modalState = false) => {
  return {
    type: SET_TEAM_MODAL,
    payload: modalState
  };
};

export const setSkillModal = (modalState = false) => {
  return {
    type: SET_SKILL_MODAL,
    payload: modalState
  };
};

export const setSchoolModal = (modalState = false) => {
  return {
    type: SET_SCHOOL_MODAL,
    payload: modalState
  };
};

export const setPasswordModal = (modalState = false) => {
  return {
    type: SET_PASSWORD_MODAL,
    payload: modalState
  };
};