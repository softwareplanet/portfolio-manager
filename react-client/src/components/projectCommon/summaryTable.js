import React from 'react';
import {Icon} from "office-ui-fabric-react";

export const SummaryTable = ({items, renderRow, title, iconName}) => {
  return (
    <div className={'profile-skills'}>
      <span className={'table-title'}><Icon iconName={iconName}
                                            style={{fontSize: 1.5 + 'rem', margin: 0.5 + 'rem'}}/>{title}</span>
      <table className={'summary-table'}>
        <tbody>
        {items && items.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};