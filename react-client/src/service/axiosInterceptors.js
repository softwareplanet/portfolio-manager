import axios from "axios";
import {AuthService} from "./authService";

let setAuthInterceptor = function () {
  axios.interceptors.response.use(function (response) {
    return response;
  }, function (err) {
    console.log(JSON.stringify(err));
    if (err.response.status === 401) {
      AuthService.logOut()
    }
    return Promise.reject(err);
  });
};
export default setAuthInterceptor;