import {
  ADD_USER_PROJECT, CHANGE_USER_PROJECT,
  CREATE_USER_PROJECT_ERRORS,
  DELETE_USER_PROJECT,
  NEW_USER_PROJECT_LOADING,
  SET_USER_PROJECTS, SUCCESSFUL_EDIT_USER_PROJECT
} from "./actionTypes";
import axios from 'axios';

export const successfulEditUserProject = (userProjectId) => {
  return {
    type: SUCCESSFUL_EDIT_USER_PROJECT,
    payload: userProjectId
  };
};

export const setUserProjects = (userProjects = null) => {
  return {
    type: SET_USER_PROJECTS,
    payload: userProjects
  };
};

export const getUserProjects = (userId) => {
  return (dispatch) => {
    axios.get(`/api/v1/employee/${userId}/project`)
      .then(res => {
        dispatch(setUserProjects(res.data));
      })
      .catch(() => {
        setTimeout(dispatch(getUserProjects(userId)), 1000)
      })
  }
};

export const addUserProject = (project) => {
  return {
    type: ADD_USER_PROJECT,
    payload: project
  }
};

export const changeUserProject = (project) => {
  return {
    type: CHANGE_USER_PROJECT,
    payload: project
  }
};

export const removeUserProject = (project) => {
  return {
    type: DELETE_USER_PROJECT,
    payload: project
  }
};

export const deleteUserProject = (userId, projectId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/employee/${userId}/project/${projectId}`)
      .then(res => {
        dispatch(removeUserProject(res.data))
      })
  }
};

export const newUserProjectLoading = (bool = false) => {
  return {
    type: NEW_USER_PROJECT_LOADING,
    payload: bool
  };
};

export const createUserProjectErrors = (errors = {}) => {
  return {
    type: CREATE_USER_PROJECT_ERRORS,
    payload: errors
  };
};

export const editUserProject = (userId, project) => {
  return (dispatch) => {
    dispatch(newUserProjectLoading(true));
    axios.patch(`/api/v1/employee/${userId}/project/${project.id}`, project)
      .then(res => {
        dispatch(successfulEditUserProject(res.data.id));
        dispatch(changeUserProject(res.data))
      }).catch(errors => {
      dispatch(createUserProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newUserProjectLoading(false));
    });
  }
};

export const createUserProject = (userId, project) => {
  return (dispatch) => {
    dispatch(newUserProjectLoading(true));
    axios.post(`/api/v1/employee/${userId}/project`, project)
      .then(res => {
        dispatch(addUserProject(res.data))
      }).catch(errors => {
      dispatch(createUserProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newUserProjectLoading(false));
    });
  }
};