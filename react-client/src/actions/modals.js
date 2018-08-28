import {SET_PROJECT_MODAL, SET_SKILL_MODAL} from "./actionTypes";

export const setProjectModal = (modalState = false) => {
  return {
    type: SET_PROJECT_MODAL,
    payload: modalState
  };
};

export const setSkillModal = (modalState = false) => {
  return {
    type: SET_SKILL_MODAL,
    payload: modalState
  };
};