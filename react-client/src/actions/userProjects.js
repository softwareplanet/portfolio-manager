import {ADD_USER_PROJECT, DELETE_USER_PROJECT, SET_USER_PROJECTS} from "./actionTypes";
import axios from 'axios';

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
  }
};

export const addUserProject = (project) => {
  return {
    type: ADD_USER_PROJECT,
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
      .then( res => {
        dispatch(removeUserProject(res.data))
      })
  }
};

export const createUserProject = (userId, project) => {
  return (dispatch) => {
    axios.post(`/api/v1/employee/${userId}/project`, project)
      .then( res => {
        dispatch(addUserProject(res.data))
      })
  }
};