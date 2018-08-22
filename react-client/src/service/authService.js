import axios from 'axios';
import {history, store} from '../store'
import {isAuthenticated} from "../actions/login";
import {setUser} from "../actions/user";

export class AuthService {
  static logIn(username, password) {
    return axios.post('/login', {username, password})
      .then(res => {
        const {token} = res.data;
        if (token) {
          localStorage.setItem('token', token);
          AuthService.setAuthToken(token);
          store.dispatch(isAuthenticated(true));
          history.push('/');
        }
      })
  }

  static setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
  }

  static logOut() {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
    store.dispatch(isAuthenticated(false));
    store.dispatch(setUser())
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

}