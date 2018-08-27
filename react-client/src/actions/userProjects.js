import {SET_USER_PROJECTS} from "./actionTypes";
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