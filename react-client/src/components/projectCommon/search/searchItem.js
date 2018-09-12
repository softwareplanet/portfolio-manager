import React from 'react';
import {Icon} from "office-ui-fabric-react";
import {history} from '../../../store';

export const SearchItem = ({iconName, primaryText, secondaryText, url, onClick}) => {

  return (
    <div className={'search-item'} onClick={() => {
      history.push(url);
      onClick()
    }}>
      <div className={'search-item-logo'}>
        <Icon iconName={iconName}/>
      </div>
      <div className={'search-item-content'}>
        <div className={'search-item-primary'}>{primaryText}</div>
        <span className={'search-item-secondary'}>{secondaryText}</span>
      </div>
    </div>
  )
};