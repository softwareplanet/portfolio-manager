import {SET_SKILLS} from "./actionTypes";
import axios from "axios";

export const setSkills = (userProjects = null) => {
  return {
    type: SET_SKILLS,
    payload: userProjects
  };
};

export const getSkills = () => {
  return (dispatch) => {
    axios.get(`/api/v1/skill`)
      .then(res => {
        dispatch(setSkills(res.data));
      })
  }
};