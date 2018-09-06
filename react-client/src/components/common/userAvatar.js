import React from 'react'
import axios from "axios";

export const UserAvatar = ({url, className}) => {
  return (
    <img src={(url ? axios.defaults.baseURL + url : '/missing-photo.svg')} width={url ? '100%' : '90%'}
         className={className} alt="Your avatar"/>
  );
};