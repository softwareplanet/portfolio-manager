import React from "react";
import {Icon} from "office-ui-fabric-react";

export const NoPermission = () => {
  return (
    <div className={'centered-loading'} style={{height: 100 + '%', flexDirection: 'column', fontSize: 1.3 + 'rem'}}>
      <div style={{fontSize: 6 + 'rem'}}>
        <Icon iconName={'DeactivateOrders'}/>
      </div>
      <span>Sorry, but you don't have permission to access this page.</span>
    </div>
  );
};