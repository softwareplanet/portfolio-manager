import React from "react";
import {Spinner, SpinnerSize} from 'office-ui-fabric-react';

export const Loader = ({title = '', style = {}}) => {
  return (
    <div className={'centered-loading'} style={style}>
      <Spinner size={SpinnerSize.large}
               label={title}
               ariaLive="assertive"/>
    </div>
  );
};