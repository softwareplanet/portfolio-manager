import React from "react";

export const SuggestionsItem = (props) => {
  return (
    <span className={'suggestion-item'}>
      {props.name}
    </span>
  );
};