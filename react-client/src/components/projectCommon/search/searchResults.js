import React from 'react';
import {Loader} from "../..";
import {SearchItem} from "./searchItem";

const overlayStyle = {
  position: 'absolute',
  width: 100 + '%',
  display: 'flex',
  height: 100 + '%',
  backgroundColor: 'rgba(147, 147, 147, 0.1)'
};

export const SearchResults = ({items, loading, opened, closeSearch}) => {

  const drawItems = (items) => {
    if (items.length) {
      return items.map(item => {
        const key = item.type + item.id;
        switch (item.type) {
          case 'employee':
            return (<SearchItem
              key={key}
              onClick={closeSearch}
              iconName="Contact"
              primaryText={item.firstName + ' ' + item.lastName}
              secondaryText={item.description}
              url={`/home/${item.id}/profile`}
            />);

          case 'project':
            return (<SearchItem
              onClick={closeSearch}
              key={key}
              iconName="ProjectLogo32"
              primaryText={item.name}
              secondaryText={item.description}
              url={`/home/projects/${item.id}`}
            />);

          case 'skill':
            return (<SearchItem
              key={key}
              onClick={closeSearch}
              iconName="LightningBolt"
              primaryText={item.name}
              secondaryText={''}
              url={`/home/skills/${item.id}`}
            />);

          default:
            return ''
        }
      })
    }
  };

  return (
    <div className={'search-found-items'} style={opened ? {display: 'flex'} : {display: 'none'}}>
      {loading &&
      <div style={overlayStyle}>
        <Loader/>
      </div>}
      {items && items.length ?
        <div className={'search-results-container'}>
          {drawItems(items)}
        </div>
        :
        <div className={'centered-loading'}>
          {!items ? 'Start typing and hit Enter for search' : 'No results found'}
        </div>
      }
    </div>
  )
};