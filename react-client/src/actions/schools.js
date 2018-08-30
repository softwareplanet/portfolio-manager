import {ADD_SCHOOL, CREATE_SCHOOL_ERRORS, NEW_SCHOOL_LOADING, SET_SCHOOLS} from "./actionTypes";
import axios from "axios";
import {setSchoolModal} from "./modals";

export const setSchools = (schools = null) => {
  return {
    type: SET_SCHOOLS,
    payload: schools
  };
};

export const getSchools = () => {
  return (dispatch) => {
    axios.get(`/api/v1/school`)
      .then(res => {
        dispatch(setSchools(res.data));
      })
      .catch(() => {
        setTimeout(dispatch(getSchools()), 1000)
      })
  }
};

export const newSchoolLoading = (bool = false) => {
  return {
    type: NEW_SCHOOL_LOADING,
    payload: bool
  };
};

export const addSchool = (school) => {
  return {
    type: ADD_SCHOOL,
    payload: school
  }
};

export const createSchoolErrors = (errors = {}) => {
  return {
    type: CREATE_SCHOOL_ERRORS,
    payload: errors
  };
};

export const createSchool = (school) => {
  return (dispatch) => {
    dispatch(newSchoolLoading(true));
    axios.post('/api/v1/school', school)
      .then(res => {
        dispatch(setSchoolModal(false));
        dispatch(addSchool(res.data));
      })
      .catch(errors => {
        dispatch(createSchoolErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      }).finally(() => {
      dispatch(newSchoolLoading(false));
    })
  }
};