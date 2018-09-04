import React from "react";
import {ActionButton} from "office-ui-fabric-react";

export const SelectedItem = (props) => {
  return (
    <div key={props.item.id} className={'selected-item'}>
      <span className={'title'}>{props.item.name}</span>
      <ActionButton
        className={'delete-button'}
        onClick={props.onRemoveItem}
        iconProps={{iconName: 'Cancel'}}
      />
    </div>
  );
};