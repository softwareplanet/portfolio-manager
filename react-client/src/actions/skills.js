import {
  ADD_SKILL,
  CHANGE_SKILL,
  CREATE_SKILL_ERRORS,
  DELETE_SKILL,
  NEW_SKILL_LOADING,
  SET_SKILL,
  SET_SKILL_CATEGORIES,
  SET_SKILLS,
  SUCCESSFUL_EDIT_SKILL
} from "./actionTypes";
import axios from "axios";
import {setSkillModal} from "./modals";
import {retryRequest} from "../service/utils";

export const setSkills = (skills = null) => {
  return {
    type: SET_SKILLS,
    payload: skills
  };
};

export const setSkillCategories = (skills = null) => {
  return {
    type: SET_SKILL_CATEGORIES,
    payload: skills
  };
};

export const getSkills = () => {
  return (dispatch) => {
    axios.get(`/api/v1/skill`)
      .then(({data: {skills, categories}}) => {
        dispatch(setSkills(skills));
        dispatch(setSkillCategories(categories));
      })
      .catch(retryRequest(getSkills, dispatch)())
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

export const removeSkill = (skill) => {
  return {
    type: DELETE_SKILL,
    payload: skill
  }
};

export const deleteSkill = (skillId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/skill/${skillId}`)
      .then(res => {
        dispatch(removeSkill(res.data))
      })
  }
};

export const successfulEditSkill = (skillId) => {
  return {
    type: SUCCESSFUL_EDIT_SKILL,
    payload: skillId
  };
};

export const changeSkill = (skill) => {
  return {
    type: CHANGE_SKILL,
    payload: skill
  }
};

export const editSkill = (skill) => {
  return (dispatch) => {
    dispatch(newSkillLoading(true));
    axios.patch(`/api/v1/skill/${skill.id}`, skill)
      .then(res => {
        dispatch(setSkillModal(false));
        dispatch(changeSkill(res.data))
      }).catch(errors => {
      dispatch(createSkillErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newSkillLoading(false));
    });
  }
};

export const setSkill = (skill = {}) => {
  return {
    type: SET_SKILL,
    payload: skill
  };
};

export const getSkill = (skillId) => {
  return (dispatch) => {
    axios.get(`/api/v1/skill/${skillId}`)
      .then(res => {
        dispatch(setSkill(res.data));
      })
      .catch(retryRequest(getSkill, dispatch)(skillId))
  }
};