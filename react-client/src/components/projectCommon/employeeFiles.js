import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import Dropzone from "react-dropzone";
import {DropZone, Loader} from "..";
import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IconButton,
  PrimaryButton,
  SelectionMode,
  TextField
} from "office-ui-fabric-react";
import axios from "axios";
import {createEmployeeFile, deleteEmployeeFile, getEmployeeFiles} from "../../actions/user";

class EmployeeFilesComponent extends Component {

  state = {
    comment: '',
    hideDialog: true,
    group: 0,
    groups: [{key: 0, text: 'All groups'}],
    dropzoneActive: false,
    files: []
  };

  _files_columns = [
    {
      key: 'fileName',
      name: 'Name',
      fieldName: 'fileName',
      minWidth: 110,
      maxWidth: 540,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({file}) => {
        return <a href={axios.defaults.baseURL + file} download target="_blank">{file.split('/').slice(-1)[0]}</a>;
      },
    },
    {
      key: 'comment',
      name: 'Comment',
      fieldName: 'comment',
      minWidth: 400,
      maxWidth: 700,
      isPadded: true,
      onRender: ({comment}) => {
        return <span>{comment}</span>;
      },
    },
    {
      key: 'group',
      name: 'Group',
      fieldName: 'group',
      minWidth: 70,
      maxWidth: 100,
      isPadded: true,
      onRender: ({group: {name}}) => {
        return <span>{name}</span>;
      },
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
                key: 'delete',
                text: 'Delete',
                iconProps: {iconName: 'Trash', style: {color: '#000'}},
                onClick: () => this._openDeleteDialog(item)
              }
            ],
            directionalHintFixed: true
          }
          }
          split={false}
        />);
      },
      isPadded: true
    }];

  componentWillReceiveProps(nextProps) {
    const {user, getEmployeeFiles, employeeId} = this.props;
    const {employeeId: nextId} = nextProps;
    if (employeeId !== nextId) {
      if (user) {
        getEmployeeFiles(nextId);
      }
    }
    const {employeeFiles: files} = this.props;
    if (files && nextProps) {
      if (files && nextProps.employeeFiles && (files.length !== nextProps.employeeFiles.length)) {
        const {hideDialog} = this.state;
        !hideDialog && this._closeDialog();
      }
    }
  }

  componentDidMount() {
    this.mounted = true;
    const {user, employeeId, getEmployeeFiles} = this.props;
    if (user) {
      getEmployeeFiles(employeeId)
    }
    this.getFileGroups();
  }

  getFileGroups = () => {
    axios.get('/api/v1/files_group').then(({data}) => {
      this.mounted &&
      this.setState({
        groups: [...this.state.groups, ...data.map(({id, name}) => ({
          key: id,
          text: name
        }))]
      })
    });
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  uploadFiles = () => {
    const {group, comment, files} = this.state;
    files.map(file => this.props.addEmployeeFile(this.props.employeeId, {
      file,
      group: group ? group.toString() : '1',
      comment
    }));
    this.setState({comment: '', files: []});
  };

  onDrop = (files) => {
    this.setState({dropzoneActive: false, files});
  };

  render() {
    const {employeeFiles: files} = this.props;
    const {hideDialog, employeeFileToDelete, group, groups, dropzoneActive, comment, files: localFiles} = this.state;
    return (
      <div>
        <Dropzone
          disableClick
          style={{position: 'relative'}}
          onDrop={this.onDrop}
          onDragEnter={this._setDropZoneActive(true)}
          onDragLeave={this._setDropZoneActive(false)}
        >
          {dropzoneActive && <DropZone/>}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem'}}>Attached files</h3>
            <div className="employee-attachments-comment">
              <TextField
                value={comment}
                onChange={(e) => this.setState({comment: e.target.value})}
                placeholder="Comment to attachments..."
              />
            </div>
            <PrimaryButton
              iconProps={{iconName: 'Save'}}
              onClick={() => {
                this.uploadFiles();
              }}
              disabled={!localFiles.length}
              text="Upload"
            />
            <div style={{width: 10 + 'rem', marginLeft: '1rem'}}>
              <Dropdown
                selectedKey={group}
                onChanged={({key: group}) => this.setState({group})}
                placeHolder="Select a Group"
                options={groups}
              />
            </div>
          </div>
          {!!localFiles.length && (<div className="employee-attachments-disclaimer">
            {localFiles.length} file{localFiles.length > 1 ? 's' : ''} will be
            uploaded: {localFiles.map(({name}) => name).join(', ')}
          </div>)}
          {
            files ?
              <DetailsList
                items={group ? files.filter(({group: {id}}) => id === group) : files}
                columns={this._files_columns}
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
              /> :
              <Loader title="Loading employee attached files..."/>
          }
        </Dropzone>
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete file ${employeeFileToDelete && employeeFileToDelete.file.split('/').slice(-1)[0]}`,
            subText:
              'This can not be undone.'
          }}
          modalProps={{
            isBlocking: false
          }}
        >
          <DialogFooter>
            <PrimaryButton
              iconProps={{iconName: 'Delete'}}
              onClick={() => {
                this.props.deleteEmployeeFile(employeeFileToDelete.id);
              }}
              text="Delete"
            />
            <DefaultButton onClick={this._closeDialog} text="Cancel"/>
          </DialogFooter>
        </Dialog>
      </div>
    )
  }

  _openDeleteDialog(employeeFile) {
    this.setState({employeeFileToDelete: employeeFile, hideDialog: false})
  }

  _setDropZoneActive = (bool) => () => this.setState({dropzoneActive: bool});
  _closeDialog = () => {
    this.setState({hideDialog: true});
  };
}

const mapStateToProps = ({user, employeeFiles}) => {
  return {user, employeeFiles};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getEmployeeFiles: (employeeId) => dispatch(getEmployeeFiles(employeeId)),
    addEmployeeFile: (employeeId, data) => dispatch(createEmployeeFile(employeeId, data)),
    deleteEmployeeFile: (employeeId) => dispatch(deleteEmployeeFile(employeeId)),
  };
};

export const EmployeeFiles = connect(mapStateToProps, mapDispatchToProps)(EmployeeFilesComponent);