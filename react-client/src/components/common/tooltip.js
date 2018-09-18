import React from "react";
import {DirectionalHint, TooltipHost} from "office-ui-fabric-react";

export const Tooltip = ({text, ...props}) => {
  return (
    <span>
      <TooltipHost content={text} 
                   calloutProps={{gapSpace: 0}} 
                   closeDelay={100}
                   directionalHint={DirectionalHint.leftBottomEdge}>
        {props.children}
      </TooltipHost>
    </span>
  )
};