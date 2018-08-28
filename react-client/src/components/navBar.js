import React from "react";
import {SearchBox} from "office-ui-fabric-react";

const Link = ({url, history, title}) => {
  const redirectTo = (link) => history.push(link);
  const isCurrent = () => history.location.pathname === url;
  return (
    <li className={'link-item ' + (isCurrent() ? 'active' : '')} onClick={() => redirectTo(url)}>{title}</li>
  );
};

export const NavBar = ({history, sideBarOpened}) => {
  return (
    <aside className={`nav-bar ${sideBarOpened ? '' : 'none'}`}>
      <SearchBox
        placeholder="Search"
        underlined={true}
      />
      <div className={'navbar-content'}>
        <span className={'list-title'}>
          Profile
        </span>
        <ul className={'links-container'}>
          <Link history={history} title="General" url="/home/profile"/>
          <Link history={history} title="Projects" url="/home/projects"/>
          <Link history={history} title="Skills" url="/home/skills"/>
          <Link history={history} title="Schools" url="/home/schools"/>
        </ul>
      </div>
    </aside>
  );
};