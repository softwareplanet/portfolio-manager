import React, {Component} from 'react';
import {Loader} from "../..";
import {SearchItem} from "./searchItem";
import {Pivot, PivotItem} from "office-ui-fabric-react";

const overlayStyle = {
  position: 'absolute',
  width: 100 + '%',
  display: 'flex',
  height: 100 + '%',
  backgroundColor: 'rgba(147, 147, 147, 0.1)'
};

export class SearchResults extends Component {

  state = {
    selectedKey: 'all'
  };

  drawItems = (items) => {
    if (items.length) {
      items = this.state.selectedKey === 'all' ? items : items.filter(({type}) => type === this.state.selectedKey);
      return items.map(item => {
        const key = item.type + item.id;
        switch (item.type) {
          case 'employee':
            return (<SearchItem
              key={key}
              onClick={this.props.closeSearch}
              iconName="Contact"
              primaryText={item.firstName + ' ' + item.lastName}
              secondaryText={item.description}
              url={`/home/${item.id}/profile`}
            />);

          case 'project':
            return (<SearchItem
              onClick={this.props.closeSearch}
              key={key}
              iconName="ProjectLogo32"
              primaryText={item.name}
              secondaryText={item.description}
              url={`/home/projects/${item.id}`}
            />);

          case 'skill':
            return (<SearchItem
              key={key}
              onClick={this.props.closeSearch}
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

  render() {
    const {items, loading, opened} = this.props;
    const {selectedKey} = this.state;
    return (
      <div style={opened ? {display: 'block'} : {display: 'none'}}>
        <div className={'search-command-bar'}>
          <div>
            <Pivot
              selectedKey={selectedKey}
              onLinkClick={this._handleLinkClick}
              headersOnly={true}
            >
              <PivotItem linkText="All" itemKey="all" itemIcon="SearchIssue"/>
              <PivotItem linkText="Employees" itemKey="employee" itemIcon="Group"/>
              <PivotItem linkText="Projects" itemKey="project" itemIcon="ProjectLogo32"/>
              <PivotItem linkText="Skills" itemKey="skill" itemIcon="LightningBolt"/>
            </Pivot>
          </div>
        </div>
        <div className={'search-found-items'} style={opened ? {display: 'flex'} : {display: 'none'}}>
          {loading &&
          <div style={overlayStyle}>
            <Loader/>
          </div>}
          {items && items.length ?
            <div className={'search-results-container'}>
              {this.drawItems(items)}
            </div>
            :
            <div className={'centered-loading'}>
              {!items ? 'Start typing and hit Enter for search' : 'No results found'}
            </div>
          }
        </div>
      </div>
    )
  }

  _handleLinkClick = (item) => {
    this.setState({
      selectedKey: item.props.itemKey
    });
  };
}