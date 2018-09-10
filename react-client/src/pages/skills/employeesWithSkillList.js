import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {SelectionMode} from "office-ui-fabric-react";

class EmployeesWithSkillPage extends Component {

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
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      minWidth: 70,
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
      minWidth: 30,
      maxWidth: 55,
      data: 'string',
      onRender: ({durationMonths}) => {
        return <span>{durationMonths + ` Month${durationMonths > 1 ? 's' : ''}`}</span>;
      },
      isPadded: true
    },
    {
      key: 'description',
      name: 'Role on project',
      fieldName: 'description',
      minWidth: 110,
      maxWidth: 250,
      isResizable: true,
      isPadded: true,
      onRender: ({description}) => {
        return <span>{description}</span>;
      },
    },
    {
      key: 'skills',
      name: 'Skills',
      fieldName: 'skills',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({skills}) => {
        return <span>{skills.map((skill) => skill.name).join(', ')}</span>;
      },
      isPadded: true
    }
  ];

  componentDidMount() {
    const {user, getProject, skillId} = this.props;
    if (user) {
      getProject(skillId);
    }
  }

  render() {
    const {project: {employees, name}} = this.props;
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
            <Loader title="Loading project team..."/>
        }
      </div>
    );
  }
}

const mapStateToProps = ({user, skill}, {match: {params: {skillId}}}) => {
  return {user, skillId, skill};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSkill: (projectId) => dispatch(getSkill(projectId))
  };
};

export const EmployeesWithSkill = connect(mapStateToProps, mapDispatchToProps)(EmployeesWithSkillPage);