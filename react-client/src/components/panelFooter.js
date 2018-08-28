import React from "react";
import {DefaultButton, PrimaryButton} from "office-ui-fabric-react";

export const PanelFooter = ({onSave, onClose}) => {
  return (
    <div className={'panel-footer'}>
      <DefaultButton onClick={onClose} className={'panel-footer-cancel'}>Cancel</DefaultButton>
      <PrimaryButton onClick={onSave}>
        Save
      </PrimaryButton>
    </div>
  );
};