import {
  ADD_USER_SKILL,
  CHANGE_USER_SKILL,
  CREATE_USER_SKILL_ERRORS,
  DELETE_USER_SKILL,
  NEW_USER_SKILL_LOADING,
  REMOVE_USER_SKILL_ERRORS,
  SET_USER_SKILLS,
  SUCCESSFUL_EDIT_USER_SKILL
} from "./actionTypes";
import axios from 'axios';
import {retryRequest} from "../service/utils";

export const successfulEditUserSkill = (userSkillId) => {
  return {
    type: SUCCESSFUL_EDIT_USER_SKILL,
    payload: userSkillId
  };
};

export const setUserSkills = (userSkills = null) => {
  return {
    type: SET_USER_SKILLS,
    payload: userSkills
  };
};

export const removeSkillErrors = () => {
  return {
    type: REMOVE_USER_SKILL_ERRORS
  }
};

export const getUserSkills = (userId) => {
  return (dispatch) => {
    axios.get(`/api/v1/employee/${userId}/skill`)
      .then(res => {
        dispatch(setUserSkills(res.data));
      })
      .catch(retryRequest(getUserSkills, dispatch)(userId))
  }
};

export const addUserSkill = (skill) => {
  return {
    type: ADD_USER_SKILL,
    payload: skill
  }
};

export const changeUserSkill = (skill) => {
  return {
    type: CHANGE_USER_SKILL,
    payload: skill
  }
};

export const removeUserSkill = (skill) => {
  return {
    type: DELETE_USER_SKILL,
    payload: skill
  }
};

export const deleteUserSkill = (userId, skillId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/employee/${userId}/skill/${skillId}`)
      .then(res => {
        dispatch(removeUserSkill(res.data))
      })
  }
};

export const newUserSkillLoading = (bool = false) => {
  return {
    type: NEW_USER_SKILL_LOADING,
    payload: bool
  };
};

export const createUserSkillErrors = (errors = {}) => {
  return {
    type: CREATE_USER_SKILL_ERRORS,
    payload: errors
  };
};

export const editUserSkill = (userId, skill) => {
  return (dispatch) => {
    dispatch(newUserSkillLoading(true));
    axios.patch(`/api/v1/employee/${userId}/skill/${skill.id}`, skill)
      .then(res => {
        dispatch(successfulEditUserSkill(res.data.id));
        dispatch(changeUserSkill(res.data))
      }).catch(errors => {
      dispatch(createUserSkillErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newUserSkillLoading(false));
    });
  }
};

export const createUserSkill = (userId, skill) => {
  return (dispatch) => {
    dispatch(newUserSkillLoading(true));
    axios.post(`/api/v1/employee/${userId}/skill`, skill)
      .then(res => {
        dispatch(addUserSkill(res.data))
      }).catch(errors => {
      dispatch(createUserSkillErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newUserSkillLoading(false));
    });
  }
};