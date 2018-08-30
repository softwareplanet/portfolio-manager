import {SET_USER} from "./actionTypes";
import axios from 'axios';
import {retryRequest} from "../service/utils";

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
      .catch(retryRequest(getUser, dispatch)())
  }
};