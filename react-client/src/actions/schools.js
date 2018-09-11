import {
  ADD_SCHOOL,
  CHANGE_SCHOOL,
  CREATE_SCHOOL_ERRORS,
  DELETE_SCHOOL,
  NEW_SCHOOL_LOADING,
  SET_SCHOOLS, SET_SCHOOL,
  SUCCESSFUL_EDIT_SCHOOL
} from "./actionTypes";
import axios from "axios";
import {setSchoolModal} from "./modals";
import {retryRequest} from "../service/utils";

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

export const removeSchool = (school) => {
  return {
    type: DELETE_SCHOOL,
    payload: school
  }
};

export const deleteSchool = (schoolId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/school/${schoolId}`)
      .then(res => {
        dispatch(removeSchool(res.data))
      })
  }
};

export const successfulEditSchool = (schoolId) => {
  return {
    type: SUCCESSFUL_EDIT_SCHOOL,
    payload: schoolId
  };
};

export const changeSchool = (school) => {
  return {
    type: CHANGE_SCHOOL,
    payload: school
  }
};

export const editSchool = (school) => {
  return (dispatch) => {
    dispatch(newSchoolLoading(true));
    axios.patch(`/api/v1/school/${school.id}`, school)
      .then(res => {
        dispatch(setSchoolModal(false));
        dispatch(changeSchool(res.data))
      }).catch(errors => {
      dispatch(createSchoolErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newSchoolLoading(false));
    });
  }
};

export const setSchool = (school = {}) => {
  return {
    type: SET_SCHOOL,
    payload: school
  };
};

export const getSchool = (schoolId) => {
  return (dispatch) => {
    axios.get(`/api/v1/school/${schoolId}`)
      .then(res => {
        dispatch(setSchool(res.data));
      })
      .catch(retryRequest(getSchool, dispatch)(schoolId))
  }
};