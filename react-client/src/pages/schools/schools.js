import React, {Component} from 'react';
import {connect} from "react-redux";
import {CreateSchoolModal, Loader} from "../../components";
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
import {deleteSchool, getSchools, setSchool} from "../../actions/schools";
import {setSchoolModal} from "../../actions/modals";

class SchoolsPage extends Component {

  editSchool(school) {
    this.props.createSchool();
    this.setState({schoolToEdit: school})
  }

  deleteSchool(schoolId) {
    const {deleteSchool} = this.props;
    deleteSchool(schoolId);
  }

  _openDeleteDialog(school) {
    this.setState({schoolToDelete: school, hideDialog: false})
  }

  _columns = [
    {
      key: 'name',
      name: 'School Name',
      fieldName: 'name',
      minWidth: 210,
      maxWidth: 450,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({name}) => {
        return <span>{name}</span>;
      },
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      minWidth: 250,
      maxWidth: 450,
      isResizable: true,
      data: 'string',
      onRender: ({description}) => {
        return <span>{description}</span>;
      },
      isPadded: true
    }
  ];

  _actions = {
    key: 'actions',
    name: 'Actions',
    fieldName: 'schools',
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
              text: 'Employees from this school',
              iconProps: {iconName: 'PublishCourse', style: {color: '#000'}},
              onClick: () => {
                this.props.setSchool(item);
                this.props.history.push(`/home/schools/${item.id}`)
              }
            },
            {
              key: 'edit',
              text: 'Edit',
              iconProps: {iconName: 'Edit', style: {color: '#000'}},
              onClick: () => this.editSchool(item)
            },
            {
              key: 'delete',
              text: 'Delete',
              iconProps: {iconName: 'Delete', style: {color: '#000'}},
              onClick: () => this._openDeleteDialog(item)
            }

          ],
          directionalHintFixed: true
        }}
        split={false}
      />);
    },
    isPadded: true
  };

  state = {
    hideDialog: true,
    schoolToDelete: null,
    schoolToEdit: null
  };

  componentDidMount() {
    const {user, getSchools} = this.props;
    if (user) {
      getSchools();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.isStaff && this._columns.length === 2)
      this._columns.push(this._actions);

    const {schools} = this.props;
    if ((schools && nextProps.schools && (schools.length !== nextProps.schools.length))) {
      const {hideDialog} = this.state;
      !hideDialog && this._closeDialog();
    }
    if (!nextProps.schoolModal) this.setState({schoolToEdit: null});
  }

  render() {
    const {schoolToEdit, hideDialog, schoolToDelete} = this.state;
    return (
      <div className={'page-container'}>
        <CreateSchoolModal school={schoolToEdit}/>
        <span className={'page-title'}>Schools</span>
        <div className={'add-button'}>
          <PrimaryButton
            text={'Add a School'}
            onClick={this.props.createSchool}
          />
        </div>
        {
          this.props.schools ?
            <DetailsList
              items={this.props.schools}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading your schools..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete school ${schoolToDelete && schoolToDelete.name}`,
            subText:
              'This can not be undone. School will be deleted for all employees.'
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
                this.deleteSchool(schoolToDelete.id);
              }} text="Delete"/>
            <DefaultButton onClick={this._closeDialog} text="Cancel"/>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  _closeDialog = () => {
    this.setState({hideDialog: true});
  };
}

const mapStateToProps = ({user, schools, isStaff, schoolModal}) => {
  return {user, isStaff, schools, schoolModal};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSchools: () => dispatch(getSchools()),
    deleteSchool: (schoolId) => dispatch(deleteSchool(schoolId)),
    createSchool: () => dispatch(setSchoolModal(true)),
    setSchool: (school) => dispatch(setSchool(school)),
  };
};

export const Schools = connect(mapStateToProps, mapDispatchToProps)(SchoolsPage);