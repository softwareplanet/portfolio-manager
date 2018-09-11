import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {IconButton, SelectionMode} from "office-ui-fabric-react";
import {getSchool} from "../../actions/schools";

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
      fieldName: 'durationYears',
      minWidth: 30,
      maxWidth: 55,
      data: 'string',
      onRender: ({durationYears}) => {
        return <span>{durationYears + ` Year${durationYears > 1 ? 's' : ''}`}</span>;
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
                text: 'All schools',
                iconProps: {iconName: 'UserEvent', style: {color: '#000'}},
                onClick: () => this._openEmployeeSchools(item.employeeId)
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
    const {user, getSchool, schoolId} = this.props;
    if (user) {
      getSchool(schoolId);
    }
  }

  render() {
    const {school: {employees, name}} = this.props;
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
            <Loader title="Loading people from selected school..."/>
        }
      </div>
    );
  }

  _openEmployeeProfile = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/profile`);
  };
  _openEmployeeSchools = (employeeId) => {
    this.props.history.push(`/home/${employeeId}/schools`);
  };
}

const mapStateToProps = ({user, school}, {match: {params: {schoolId}}}) => {
  return {user, school, schoolId};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSchool: (schoolId) => dispatch(getSchool(schoolId))
  };
};

export const EmployeesFromSchool = connect(mapStateToProps, mapDispatchToProps)(EmployeesFromSchoolPage);