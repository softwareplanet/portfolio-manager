import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton,
  SelectionMode
} from "office-ui-fabric-react";
import {disableEmployee, getEmployees} from "../../actions/user";

class EmployeesPage extends Component {

  _openDeleteDialog(employeeToDelete) {
    this.setState({employeeToDelete: employeeToDelete, hideDialog: false})
  }

  _columns = [
    {
      key: 'name',
      name: 'Name',
      minWidth: 150,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({firstName, lastName}) => {
        return <span>{`${firstName} ${lastName}`}</span>;
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
        return <span>{skills.map((skill) => skill).join(', ')}</span>;
      },
      isPadded: true
    },
    {
      key: 'projects',
      name: 'Projects',
      fieldName: 'projects',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({projects}) => {
        return <span>{projects.map((project) => project).join(', ')}</span>;
      },
      isPadded: true
    },
    {
      key: 'dob',
      name: 'Birthday',
      fieldName: 'dob',
      minWidth: 95,
      maxWidth: 110,
      isResizable: true,
      data: 'string',
      onRender: ({dob}) => {
        return <span>{new Date(dob).toDateString()}</span>;
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
          menuProps={this.props.isStaff ? {
              items: [
                {
                  key: 'open',
                  text: 'Open profile',
                  iconProps: {iconName: 'Contact', style: {color: '#000'}},
                  onClick: () => this._openEmployeeProfile(item.id)
                },
                {
                  key: 'delete',
                  text: 'Disable',
                  iconProps: {iconName: 'Delete', style: {color: '#000'}},
                  onClick: () => this._openDeleteDialog(item)
                }
              ],
              directionalHintFixed: true
            } :
            {
              items: [
                {
                  key: 'open',
                  text: 'Open profile',
                  iconProps: {iconName: 'Contact', style: {color: '#000'}},
                  onClick: () => this._openEmployeeProfile(item.id)
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

  state = {
    hideDialog: true,
    employeeToDelete: null
  };

  componentDidMount() {
    const {user, getEmployees} = this.props;
    if (user) {
      getEmployees();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {employees} = this.props;
    if ((employees && nextProps.employees && (employees.length !== nextProps.employees.length))) {
      const {hideDialog} = this.state;
      !hideDialog && this._closeDialog();
    }
  }

  render() {
    const {hideDialog, employeeToDelete} = this.state;
    const {employees} = this.props;
    return (
      <div className={'page-container'}>
        <span className={'page-title'}>Employees</span>
        {
          employees ?
            <DetailsList
              items={employees}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading employees..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete employee ${employeeToDelete && (employeeToDelete.firstName + ' ' + employeeToDelete.lastName)}`,
            subText:
              'Employee will be disabled, but can be enabled again.'
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false
          }}
        >
          <DialogFooter>
            <PrimaryButton
              iconProps={{iconName: 'Delete'}}
              onClick={() => {
                this.deleteEmployee(employeeToDelete.id);
              }} text="Delete"/>
            <DefaultButton onClick={this._closeDialog} text="Cancel"/>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  deleteEmployee = (employeeId) => {
    this.props.disableEmployee(employeeId);
  };

  _closeDialog = () => {
    this.setState({hideDialog: true});
  };

  _openEmployeeProfile = (employeeId) => {
    this.props.history.push(`./${employeeId}/profile`);
  };
}

const mapStateToProps = ({user, employees, isStaff}) => {
  return {user, employees, isStaff};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getEmployees: () => dispatch(getEmployees()),
    disableEmployee: (employeeId) => dispatch(disableEmployee(employeeId))
  };
};

export const Employees = connect(mapStateToProps, mapDispatchToProps)(EmployeesPage);