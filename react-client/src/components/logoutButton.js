import React from "react";
import {AuthService} from "../service/authService";
import {DefaultButton} from "office-ui-fabric-react";
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";

const LogoutButtonComponent = (props) => {
  const {isAuthenticated} = props;
  return (
    <div>
      {isAuthenticated ? <DefaultButton onClick={() => AuthService.logOut()} {...props}>Log out</DefaultButton> :
        <Redirect to="/"/>}
    </div>
  );
};

const mapStateToProps = ({isAuthenticated}) => {
  return {isAuthenticated};
};

export const LogoutButton = connect(mapStateToProps)(LogoutButtonComponent);