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
    {title: 'My Profile', url: `/home/${userId}/profile`},
    {title: 'My Projects', url: `/home/${userId}/projects`},
    {title: 'My Skills', url: `/home/${userId}/skills`},
    {title: 'My Schools', url: `/home/${userId}/schools`},
  ];

  const staffRoutes = [
    {title: 'Employees', url: '/home/employees'},
    {title: 'Projects', url: '/home/projects'},
    {title: 'Skills', url: '/home/skills'},
    {title: 'Schools', url: '/home/schools'}
  ];

  return (
    <aside className={`nav-bar ${sideBarOpened ? '' : 'none'}`}>
      <div>
        {isStaff && <Search/>}
        <div className={'navbar-content'}>
          {isStaff &&
          <div>
        <span className={'list-title'}>
          Management
        </span>
            <ul className={'links-container'}>
              {staffRoutes.map((route, index) => <Link key={index} history={history} {...route}/>)}
            </ul>
          </div>
          }
          <span className={'list-title'}>
          Portfolio
        </span>
          <ul className={'links-container'}>
            {employeeRoutes.map((route, index) => <Link key={index} history={history} {...route}/>)}
          </ul>
        </div>
      </div>
      <div className="feedback-link">
        <a href="https://forms.gle/2251DWoZMXftWP7d6" target="_blank">Leave a feedback</a>
      </div>
    </aside>
  );
};
