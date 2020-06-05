import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader, PrivatePageRedirect, Tooltip} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {IconButton, Rating, SelectionMode} from "office-ui-fabric-react";
import {getSkill} from "../../actions/skills";
import {getProjects, setProject} from "../../actions/projects";
import { Link } from 'react-router-dom';
import { linkify } from '../../service/utils';

class EmployeesWithSkillPage extends Component {

  _employees_columns = [
    {
      key: 'employeeName',
      name: 'Name',
      fieldName: 'employeeName',
      minWidth: 110,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({employeeName, employeeId}) => {
        return <Link
          to={`/home/${employeeId}/profile`}
          className="table-link"
        >{employeeName}</Link>;
      },
    },
    {
      key: 'level',
      name: 'Level',
      fieldName: 'level',
      minWidth: 70,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: ({level}) => {
        return (<div>
          <Rating
            id={'readOnlyRatingStar'}
            min={1}
            max={5}
            rating={level}
            readOnly={true}
          />
        </div>);
      },
    }, {
      key: 'projectsCount',
      name: 'No. of projects',
      fieldName: 'projectsCount',
      minWidth: 40,
      maxWidth: 60,
      isResizable: false,
      isPadded: true,
      onRender: ({projectsCount}) => {
        return (<div style={{textAlign: 'center'}}>
          {projectsCount}
        </div>);
      },
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({description}) => {
        return <Tooltip text={description}>{description}</Tooltip>;
      },
      isPadded: true
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 50,
      maxWidth: 50,
      onRender: (item) => {
        return (<IconButton
          style={{height: 'auto'}}
          allowDisabledFocus={true}
          menuIcon={{iconName: 'MoreVertical'}}
          menuProps={{
            items: [
              {
                key: 'open',
                text: 'Open profile',
                iconProps: {iconName: 'Contact', style: {color: '#000'}},
                onClick: () => this._openEmployeeProfile(item.employeeId)
              },
              {
                key: 'skills',
                text: 'All skills',
                iconProps: {iconName: 'UserEvent', style: {color: '#000'}},
                onClick: () => this._openEmployeeSkills(item.employeeId)
              }
            ],
            directionalHintFixed: true
          }
          }
          split={false}
        />);
      },
      isPadded: true
    }
  ];

  _projects_columns = [
    {
      key: 'name',
      name: 'Project Name',
      fieldName: 'name',
      minWidth: 110,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: (item) => {
        return <Link
          to={`/home/projects/${item.id}`}
          className="table-link"
        >{item.name}</Link>;
      },
    },
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: ({startDate}) => {
        return <span>{new Date(startDate).toDateString()}</span>;
      },
    },
    {
      key: 'duration',
      name: 'Duration',
      fieldName: 'durationMonths',
      minWidth: 65,
      maxWidth: 65,
      data: 'string',
      onRender: ({durationMonths}) => {
        return <span>{durationMonths + ` Month${durationMonths > 1 ? 's' : ''}`}</span>;
      },
      isPadded: true
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      minWidth: 110,
      maxWidth: 250,
      isResizable: true,
      isPadded: true,
      onRender: ({description}) => {
        return (
          <Tooltip text={description}>{description}</Tooltip>
        );
      },
    },
    {
      key: 'url',
      name: 'Link',
      fieldName: 'url',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({url}) => {
        return <span>{url}</span>;
      },
      isPadded: true
    },
  ];

  componentDidMount() {
    const {user, getSkill, skillId, projects, getProjects} = this.props;
    if (user) {
      getSkill(skillId);
      if (!projects) {
        getProjects();
      }
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {user, getSkill, skillId} = this.props;
    const {skillId: nextId} = nextProps;
    if (skillId !== nextId) {
      if (user) {
        getSkill(nextId);
      }
    }
  }

  render() {
    const {skill: {employees, name, url, category}, projects, skillId} = this.props;
    return (
      <div className={'page-container'}>
        <PrivatePageRedirect/>
        <span
          className={'page-title'}>Skill: {name ? name : ''}</span>
        {category && category.name && <div className={'page-description'}>Category: {category.name}</div>}
        {url && <p className={'page-description'} dangerouslySetInnerHTML={{ __html: linkify(url)}}/>}
        <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem'}}>Projects with skill</h3>
        {
          projects ?
            <DetailsList
              items={projects.filter(({skills}) => skills.includes(Number(skillId)))}
              columns={this._projects_columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading people with selected skill..."/>
        }
        <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem'}}>Employees with skill</h3>
        {
          employees ?
            <DetailsList
              items={employees}
              columns={this._employees_columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading people with selected skill..."/>
        }
      </div>
    );
  }

  _openEmployeeProfile = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/profile`);
  };

  _openEmployeeSkills = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/skills`);
  };
}

const mapStateToProps = ({user, skill, projects}, {match: {params: {skillId}}}) => {
  return {user, skillId, skill, projects};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects()),
    setProject: (project) => dispatch(setProject(project)),
    getSkill: (skillId) => dispatch(getSkill(skillId))
  };
};

export const EmployeesWithSkill = connect(mapStateToProps, mapDispatchToProps)(EmployeesWithSkillPage);
