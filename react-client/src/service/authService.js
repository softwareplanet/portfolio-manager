import axios from 'axios';

export class AuthService {
  static logIn(username, password) {
    return axios.post('/login', {username, password})
      .then( res => {
        const {token} = res.data;
        if (token) {
          localStorage.setItem('token', token);
          AuthService.setAuthToken(token);
        }
      })
  }

  static setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
  }

  static logOut() {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
  }

  static isAuthenticated(){
    return !!localStorage.getItem('token');
  }

}