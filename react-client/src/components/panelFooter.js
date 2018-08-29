import React from "react";
import {DefaultButton, PrimaryButton, Spinner, SpinnerSize} from "office-ui-fabric-react";

export const PanelFooter = ({onSave, onClose, loading}) => {
  return (
    <div className={'panel-footer'}>
      <DefaultButton onClick={onClose} className={'panel-footer-cancel'}>Cancel</DefaultButton>
      <PrimaryButton onClick={onSave}>
        {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Save'}
      </PrimaryButton>
    </div>
  );
};