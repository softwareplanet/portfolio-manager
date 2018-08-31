import React from 'react';

export const SummaryTable = ({items, renderRow, title}) => {
  return (
    <div className={'profile-skills'}>
      <span className={'table-title'}>{title}</span>
      <table className={'summary-table'}>
        <tbody>
        {items && items.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};