import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {AuthService} from "../../service/authService";
import axios from "axios";

class LogoutButtonComponent extends Component {

  state = {
    authButtonHovered: false
  };

  render() {
    let {isAuthenticated, user} = this.props;
    const {authButtonHovered} = this.state;
    if (!user) user = {};
    return (
      <div>
        {isAuthenticated ?
          <button className={`logout-button ${authButtonHovered ? 'logout-img' : user.image ? '' : 'missing-img'}`}
                  style={authButtonHovered ? {} : {backgroundImage: 'url(' + (user.image ? axios.defaults.baseURL + user.image : '/missing-photo.svg') + ')'}}
                  onMouseEnter={() => this.setState({authButtonHovered: true})}
                  onMouseLeave={() => this.setState({authButtonHovered: false})}
                  onClick={() => AuthService.logOut()} title="Sign out"/> :
          <Redirect to="/"/>}
      </div>
    );
  };
}

const mapStateToProps = ({isAuthenticated, user}) => {
  return {isAuthenticated, user};
};

export const LogoutButton = connect(mapStateToProps)(LogoutButtonComponent);