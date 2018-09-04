import React from 'react'
import connect from "react-redux/es/connect/connect";
import axios from "axios";

const UserAvatarComponent = ({user, className}) => {
  if (!user) user = {};
  return (
    <img src={(user.image ? axios.defaults.baseURL + user.image : '/missing-photo.svg') } width={user.image ? '100%' : '90%'} className={className} alt="Your avatar"/>
  );
};

const mapStateToProps = ({user}) => {
  return {user};
};

export const UserAvatar = connect(mapStateToProps)(UserAvatarComponent);