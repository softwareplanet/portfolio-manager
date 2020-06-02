import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader, PrivatePageRedirect, Tooltip} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {
  Checkbox,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  PrimaryButton,
  SelectionMode,
  Icon,
} from "office-ui-fabric-react";
import {disableEmployee, getEmployees} from "../../actions/user";
import axios from "axios";
import ReactPaginate from 'react-paginate';
import { Paginator } from '../../service/utils';
import { Link } from 'react-router-dom';

class EmployeesPage extends Component {

  _openDeleteDialog(employeeToDelete) {
    this.setState({employeeToDelete: employeeToDelete, hideDialog: false})
  }

  _setEmployeesToShow(pageNumber) {
    this.setState({ employeesToShow: this.Paginator.getCurrentPage(pageNumber), pageNumber });
  }

  handlePageClick({ selected }) {
    this._setEmployeesToShow(selected)
  }

  _columns = [
    {
      key: 'staff',
      name: 'Staff',
      maxWidth: 25,
      minWidth: 25,
      onRender: ({isStaff}) => (
        <Checkbox
          checked={isStaff}
          disabled={true}
        />
      )
    },
    {
      key: 'name',
      name: 'Name',
      minWidth: 150,
      maxWidth: 250,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({firstName, lastName, image, id}) => {
        return <Link
          style={{display: 'flex'}}
          to={`./${id}/profile`}
          className="table-link"
        >
          <div className={`employee-image ${image ? '' : 'missing-img'}`}
               style={{
                 backgroundImage: 'url(' + (image ? axios.defaults.baseURL + image : '/missing-photo.svg') + ')',
                 marginRight: 1 + 'rem'
               }}
          />
          {`${firstName} ${lastName}`}</Link>;
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
        const skillsS = skills.map((skill) => skill).join(', ');
        return (
          <Tooltip text={skillsS}>{skillsS}</Tooltip>
        );
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
        const projectsS = projects.map((project) => project).join(', ');
        return (
          <Tooltip text={projectsS}>{projectsS}</Tooltip>
        );
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
                  key: 'presentation',
                  text: 'Show Candidate presentation',
                  iconProps: {iconName: 'AccountManagement', style: {color: '#000'}},
                  onClick: () => this.props.history.push(`/home/${item.id}/presentation`)
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
    employeeToDelete: null,
    employeesToShow: [],
    pageNumber: 0,
  };

  Paginator = new Paginator(this.props.employees);

  componentDidMount() {
    const {user, getEmployees} = this.props;
    if (user && user.isStaff) {
      getEmployees();
    }
    this._setEmployeesToShow(this.state.pageNumber);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {employees} = this.props;

    if (nextProps.employees) {
      this.Paginator.array = nextProps.employees;
      this._setEmployeesToShow(this.state.pageNumber)
    }
    if ((employees && nextProps.employees && (employees.length !== nextProps.employees.length))) {
      const {hideDialog} = this.state;
      !hideDialog && this._closeDialog();
    }
  }

  render() {
    const {hideDialog, employeeToDelete, employeesToShow} = this.state;
    const {employees} = this.props;
    return (
      <div className={'page-container'}>
        <PrivatePageRedirect/>
        <span className={'page-title'}>Employees</span>
        {
          employees && employeesToShow ?
            <div>
            <DetailsList
              items={employeesToShow}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            />
              <ReactPaginate
                previousLabel={(() => (<Icon iconName="ChevronLeft"/>))()}
                nextLabel={(() => (<Icon iconName="ChevronRight"/>))()}
                breakLabel={'...'}
                pageCount={this.Paginator.getPagesCount()}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick.bind(this)}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>:
            <Loader title="Loading employees..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Disable employee ${employeeToDelete && (employeeToDelete.firstName + ' ' + employeeToDelete.lastName)}`,
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
              }} text="Disable"/>
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
