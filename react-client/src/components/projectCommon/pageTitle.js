import React from 'react';
import connect from "react-redux/es/connect/connect";

const PageTitleComponent = ({user, employee, isStaff, title = ''}) => {
  return (
    <span
      className={'page-title'}>{title + (((isStaff || ((employee && user) && employee.id !== user.id))  && (employee.firstName || employee.lastName)) ? ` of ${employee.firstName} ${employee.lastName}` : '')}</span>
  )
};

const mapStateToProps = ({user, employee, isStaff}) => {
  return {user, employee, isStaff};
};

export const PageTitle = connect(mapStateToProps)(PageTitleComponent);