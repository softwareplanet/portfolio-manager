import {
  ADD_USER_SCHOOL,
  CHANGE_USER_SCHOOL,
  CREATE_USER_SCHOOL_ERRORS,
  DELETE_USER_SCHOOL,
  NEW_USER_SCHOOL_LOADING,
  REMOVE_USER_SCHOOL_ERRORS,
  SET_USER_SCHOOLS,
  SUCCESSFUL_EDIT_USER_SCHOOL
} from "./actionTypes";
import axios from 'axios';
import {retryRequest} from "../service/utils";

export const successfulEditUserSchool = (userSchoolId) => {
  return {
    type: SUCCESSFUL_EDIT_USER_SCHOOL,
    payload: userSchoolId
  };
};

export const setUserSchools = (userSchools = null) => {
  return {
    type: SET_USER_SCHOOLS,
    payload: userSchools
  };
};

export const removeSchoolErrors = () => {
  return {
    type: REMOVE_USER_SCHOOL_ERRORS
  }
};

export const getUserSchools = (userId) => {
  return (dispatch) => {
    dispatch(createUserSchoolErrors({}));
    axios.get(`/api/v1/employee/${userId}/school`)
      .then(res => {
        dispatch(setUserSchools(res.data));
      })
      .catch(retryRequest(getUserSchools, dispatch)(userId))
  }
};

export const addUserSchool = (school) => {
  return {
    type: ADD_USER_SCHOOL,
    payload: school
  }
};

export const changeUserSchool = (school) => {
  return {
    type: CHANGE_USER_SCHOOL,
    payload: school
  }
};

export const removeUserSchool = (school) => {
  return {
    type: DELETE_USER_SCHOOL,
    payload: school
  }
};

export const deleteUserSchool = (userId, schoolId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/employee/${userId}/school/${schoolId}`)
      .then(res => {
        dispatch(removeUserSchool(res.data))
      })
  }
};

export const newUserSchoolLoading = (bool = false) => {
  return {
    type: NEW_USER_SCHOOL_LOADING,
    payload: bool
  };
};

export const createUserSchoolErrors = (errors = {}) => {
  return {
    type: CREATE_USER_SCHOOL_ERRORS,
    payload: errors
  };
};

export const editUserSchool = (userId, school) => {
  return (dispatch) => {
    dispatch(newUserSchoolLoading(true));
    dispatch(createUserSchoolErrors({}));
    axios.patch(`/api/v1/employee/${userId}/school/${school.id}`, school)
      .then(res => {
        dispatch(successfulEditUserSchool(res.data.id));
        dispatch(changeUserSchool(res.data))
      })
      .catch(errors => {
        dispatch(createUserSchoolErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      })
      .finally(() => {
        dispatch(newUserSchoolLoading(false));
      });
  }
};

export const createUserSchool = (userId, school) => {
  return (dispatch) => {
    dispatch(newUserSchoolLoading(true));
    dispatch(createUserSchoolErrors({}));
    axios.post(`/api/v1/employee/${userId}/school`, school)
      .then(res => {
        dispatch(addUserSchool(res.data))
      }).catch(errors => {
      dispatch(createUserSchoolErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newUserSchoolLoading(false));
    });
  }
};