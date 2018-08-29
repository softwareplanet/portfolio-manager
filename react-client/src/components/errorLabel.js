import React from "react";

export const ErrorLabel = ({title = ''}) => {
  return (
    <div>
        <span className={'error-label'}>
          {title}
        </span>
    </div>
  );
};