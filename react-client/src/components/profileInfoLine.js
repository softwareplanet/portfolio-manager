import React from 'react'
import {Icon} from "office-ui-fabric-react";

export const ProfileInfoLine = ({text, iconName, noneMessage, onClick}) => {
  return (
    <span className={'profile-info-line'} onClick={onClick}>
      <Icon iconName={iconName} className={'profile-info-icon'}/>
      {text || noneMessage}
    </span>
  );
};