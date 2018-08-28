import React from "react";
import {ActionButton} from "office-ui-fabric-react";

export const CreateNew = ({onClick, text}) => {
  return (
    <div className={'centered-loading create-new-suggestion'} onClick={onClick}>
      <span>{text}</span>
      <ActionButton
        iconProps={{iconName: 'Add'}}

      />
    </div>
  );
};