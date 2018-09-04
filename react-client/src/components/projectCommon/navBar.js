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

  const employeeRoutes = [
    {title: 'General', url: '/home/profile'},
    {title: 'Projects', url: '/home/projects'},
    {title: 'Skills', url: '/home/skills'},
    {title: 'Schools', url: '/home/schools'},
  ];

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
          {employeeRoutes.map((route, index) => <Link key={index} history={history} {...route}/>)}
        </ul>
      </div>
    </aside>
  );
};