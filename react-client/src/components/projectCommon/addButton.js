import React from 'react';
import connect from "react-redux/es/connect/connect";
import {PrimaryButton} from "office-ui-fabric-react";

const AddButtonComponent = ({user, employee, isStaff, title = '', onClick}) => {
  return (
    <div>
      {(isStaff || ((employee && user) && employee.id === user.id)) &&
      <PrimaryButton
        text={title}
        onClick={onClick}
      />}  
    </div>
  )
};

const mapStateToProps = ({user, employee, isStaff}) => {
  return {user, employee, isStaff};
};

export const AddButton = connect(mapStateToProps)(AddButtonComponent);