import {SET_USER} from "./actionTypes";
import axios from 'axios';

export const setUser = (user = null) => {
  return {
    type: SET_USER,
    payload: user
  };
};

export const getUser = () => {
  return (dispatch) => {
    axios.get('/api/v1/me')
      .then(res => {
        dispatch(setUser(res.data));
      })
      .catch(() => {
        setTimeout(dispatch(getUser()), 1000)
      })
  }
};