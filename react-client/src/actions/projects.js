import {ADD_PROJECT, CREATE_PROJECT_ERRORS, NEW_PROJECT_LOADING, SET_PROJECTS} from "./actionTypes";
import axios from "axios";
import {setProjectModal} from "./modals";

export const setProjects = (projects = null) => {
  return {
    type: SET_PROJECTS,
    payload: projects
  };
};

export const getProjects = () => {
  return (dispatch) => {
    axios.get(`/api/v1/project`)
      .then(res => {
        dispatch(setProjects(res.data));
      })
  }
};

export const newProjectLoading = (bool = false) => {
  return {
    type: NEW_PROJECT_LOADING,
    payload: bool
  };
};

export const addProject = (project) => {
  return {
    type: ADD_PROJECT,
    payload: project
  }
};

export const createProjectErrors = (errors = {}) => {
  return {
    type: CREATE_PROJECT_ERRORS,
    payload: errors
  };
};

export const createProject = (project) => {
  return (dispatch) => {
    dispatch(newProjectLoading(true));
    axios.post('/api/v1/project', project)
      .then(res => {
        dispatch(setProjectModal(false));
        dispatch(addProject(res.data));
      })
      .catch(errors => {
        dispatch(createProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      }).finally(() => {
      dispatch(newProjectLoading(false));
    })
  }
};