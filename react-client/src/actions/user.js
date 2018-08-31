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

export const updateUserPhoto = (data) => {
  return (dispatch) => {
    let formData = new FormData();
    formData.append('image', data.image);
    axios.patch(`/api/v1/me`, formData)
      .then(res => {
        dispatch(setUser(res.data))
      })
      .catch(error => {
        console.log(error);
      })
  }
};

export const updateUser = (data) => {
  return (dispatch) => {
    axios.patch(`/api/v1/me`, data)
      .then(res => {
        dispatch(setUser(res.data))
      })
      .catch(error => {
        console.log(error);
      })
  }
};