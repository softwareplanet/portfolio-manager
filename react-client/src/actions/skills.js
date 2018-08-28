import {ADD_SKILL, NEW_SKILL_LOADING, SET_SKILLS} from "./actionTypes";
import axios from "axios";
import {setSkillModal} from "./modals";

export const setSkills = (userProjects = null) => {
  return {
    type: SET_SKILLS,
    payload: userProjects
  };
};

export const getSkills = () => {
  return (dispatch) => {
    axios.get(`/api/v1/skill`)
      .then(res => {
        dispatch(setSkills(res.data));
      })
  }
};

export const newSkillLoading = (bool = false) => {
  return {
    type: NEW_SKILL_LOADING,
    payload: bool
  };
};

export const addSkill = (skill) => {
  return {
    type: ADD_SKILL,
    payload: skill
  }
};

export const createSkill = (skill) => {
  return (dispatch) => {
    console.log(skill);
    dispatch(newSkillLoading(true));
    axios.post('/api/v1/skill', skill)
      .then( res => {
        dispatch(newSkillLoading(false));
        dispatch(setSkillModal(false));
        dispatch(addSkill(res.data));
      })
  }
};