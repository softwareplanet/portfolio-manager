import React from "react";
import {Spinner, SpinnerSize} from 'office-ui-fabric-react';

export const Loader = ({title = ''}) => {
  return (
    <div className={'centered-loading'}>
      <Spinner size={SpinnerSize.large}
               label={title}
               ariaLive="assertive"/>
    </div>
  );
};