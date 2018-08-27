import React from "react";
import {ActionButton} from "office-ui-fabric-react";

export const CreateNew = ({onClick, text}) => {
  return (
    <div className={'centered-loading'}>
      <span>{text}</span>
      <ActionButton
        iconProps={{iconName: 'Add'}}
        onClick={onClick}
      />
    </div>
  );
};