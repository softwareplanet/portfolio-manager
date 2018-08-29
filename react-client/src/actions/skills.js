import {ADD_SKILL, CREATE_SKILL_ERRORS, NEW_SKILL_LOADING, SET_SKILLS} from "./actionTypes";
import axios from "axios";
import {setSkillModal} from "./modals";

export const setSkills = (skills = null) => {
  return {
    type: SET_SKILLS,
    payload: skills
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

export const createSkillErrors = (errors = {}) => {
  return {
    type: CREATE_SKILL_ERRORS,
    payload: errors
  };
};

export const createSkill = (skill) => {
  return (dispatch) => {
    dispatch(newSkillLoading(true));
    axios.post('/api/v1/skill', skill)
      .then(res => {
        dispatch(setSkillModal(false));
        dispatch(addSkill(res.data));
      })
      .catch(errors => {
        dispatch(createSkillErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      }).finally(() => {
      dispatch(newSkillLoading(false));
    })
  }
};