import React from 'react'
import {TextField} from "office-ui-fabric-react";

export const NumberTextField = ({label, value = '', onChange, ...props}) => {

  function _onChange(event) {
    const newValue = event.target.value.replace(/\D/g,'');
    onChange && onChange(newValue)
  }

  return (
    <TextField
      label={label}
      value={value}
      onChange={_onChange}
      {...props}
    />
  );
};