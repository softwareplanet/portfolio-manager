import React from 'react'
import axios from "axios";

export const ProjectLogo = ({url, className}) => {
  return (
    <div className={'project-logo'}>
    <img src={(url ? axios.defaults.baseURL + url : '/missing-logo.png')} width={url ? '100%' : '90%'}
         className={className} alt="Your avatar"/>
    </div>
  );
};