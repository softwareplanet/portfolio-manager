import React from "react";
import {Search} from "./search/search";

const Link = ({url, history, title}) => {
  const redirectTo = (link) => history.push(link);
  const isCurrent = () => history.location.pathname === url;
  return (
    <li className={'link-item ' + (isCurrent() ? 'active' : '')} onClick={() => redirectTo(url)}>{title}</li>
  );
};

export const NavBar = ({history, sideBarOpened, isStaff, userId}) => {

  const employeeRoutes = [
    {title: 'General', url: `/home/${userId}/profile`},
    {title: 'Projects', url: `/home/${userId}/projects`},
    {title: 'Skills', url: `/home/${userId}/skills`},
    {title: 'Schools', url: `/home/${userId}/schools`},
  ];

  const staffRoutes = [
    {title: 'General', url: `/home/${userId}/profile`},
    {title: 'Employees', url: '/home/employees'},
    {title: 'Projects', url: '/home/projects'},
    {title: 'Skills', url: '/home/skills'},
    {title: 'Schools', url: '/home/schools'},
  ];

  return (
    <aside className={`nav-bar ${sideBarOpened ? '' : 'none'}`}>
      {isStaff && <Search/>}
      <div className={'navbar-content'}>
        <span className={'list-title'}>
          Portfolio
        </span>
        <ul className={'links-container'}>
          {(isStaff ? staffRoutes : employeeRoutes).map((route, index) => <Link key={index}
                                                                                history={history} {...route}/>)}
        </ul>
      </div>
    </aside>
  );
};
