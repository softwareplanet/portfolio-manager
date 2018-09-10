import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {IconButton, Rating, SelectionMode} from "office-ui-fabric-react";
import {getSkill} from "../../actions/skills";

class EmployeesFromSchoolPage extends Component {

  _columns = [
    {
      key: 'employeeName',
      name: 'Name',
      fieldName: 'employeeName',
      minWidth: 110,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({employeeName}) => {
        return <span>{employeeName}</span>;
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
        return <span>{description}</span>;
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

  componentDidMount() {
    const {user, getSkill, skillId} = this.props;
    if (user) {
      getSkill(skillId);
    }
  }

  render() {
    const {skill: {employees, name}} = this.props;
    return (
      <div className={'page-container'}>
        <span
          className={'page-title'}>{'Employees with skill: ' + (name ? name : '')}</span>
        {
          employees ?
            <DetailsList
              items={employees}
              columns={this._columns}
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

const mapStateToProps = ({user, skill}, {match: {params: {skillId}}}) => {
  return {user, skillId, skill};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSkill: (projectId) => dispatch(getSkill(projectId))
  };
};

export const EmployeesFromSchool = connect(mapStateToProps, mapDispatchToProps)(EmployeesFromSchoolPage);