import React from "react";
import {Icon} from "office-ui-fabric-react";

export const DropZone = ({text = 'Drop files here'}) => {
  return (
    <div className="dropzone-active">
        <Icon iconName={'OpenFile'} style={{fontSize: 5 + 'rem', marginBottom: 1 + 'rem'}}/>
        {text}
    </div>
  );
};