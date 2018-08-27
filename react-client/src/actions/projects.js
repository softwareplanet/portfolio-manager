import {SET_PROJECTS} from "./actionTypes";
import axios from "axios";

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