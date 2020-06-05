import React from 'react';
import { Icon } from 'office-ui-fabric-react';
import { Link } from 'react-router-dom';

export const SummaryTable = ({ items, renderRow, title, iconName, link }) => {
  return (
    <div className={ 'profile-skills' }>
      <Link className="table-title" to={link}>
        <Icon iconName={ iconName }
              style={ {
                fontSize: 1.5 + 'rem',
                margin: 0.5 + 'rem',
              } }/>{ title }</Link>
      <table className={ 'summary-table' }>
        <tbody>
        { items && items.map(renderRow) }
        </tbody>
      </table>
    </div>
  );
};
