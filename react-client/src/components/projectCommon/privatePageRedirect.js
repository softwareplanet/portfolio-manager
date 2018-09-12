import React from 'react';
import connect from "react-redux/es/connect/connect";
import {Redirect} from "react-router-dom";

const PrivatePageRedirectComponent = ({user, employeeId = null, isStaff}) => {
  return (
    <div>
      {(!isStaff && (user && Number(employeeId) !== user.id)) &&
      <Redirect to={'/home/no_permission'}/>}
    </div>
  )
};

const mapStateToProps = ({isStaff, user}) => ({isStaff, user});

export const PrivatePageRedirect = connect(mapStateToProps)(PrivatePageRedirectComponent);