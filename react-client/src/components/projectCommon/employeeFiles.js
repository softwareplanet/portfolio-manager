import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import Dropzone from "react-dropzone";
import {DropZone, Loader} from "..";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  PrimaryButton,
} from "office-ui-fabric-react";
import axios from "axios";
import {createEmployeeFile, deleteEmployeeFile, getEmployeeFiles} from "../../actions/user";
import { Attachment } from './attachment';
import { UploadAttachmentModal } from '../forms/uploadAttachmentForm';

class EmployeeFilesComponent extends Component {

  state = {
    hideDialog: true,
    group: 0,
    groups: [{key: 0, text: 'All groups'}],
    dropzoneActive: false,
    files: [],
    attachmentModalOpened: false,
  };


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

  onDrop = (files) => {
    this.setState({dropzoneActive: false, files, attachmentModalOpened: true});
  };

  render() {
    const {employeeFiles: files} = this.props;
    const {hideDialog, employeeFileToDelete, group, groups, dropzoneActive, files: localFiles, attachmentModalOpened} = this.state;

    return (
      <div>
        <UploadAttachmentModal
          opened={attachmentModalOpened}
          closeModal={() => this.setState({ attachmentModalOpened: false, files: [] })}
          groups={groups}
          group={group}
          files={localFiles}
          enableComments
          uploadAttachment={(attachment) => this.props.addEmployeeFile(this.props.employeeId, attachment)}
        />
        <Dropzone
          disableClick
          style={{position: 'relative'}}
          onDrop={this.onDrop}
          onDragEnter={this._setDropZoneActive(true)}
          onDragLeave={this._setDropZoneActive(false)}
        >
          {dropzoneActive && <DropZone/>}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{fontWeight: 200, marginLeft: 1 + 'rem', marginRight: 1 + 'rem'}}>Attached files</h3>
              <PrimaryButton
                iconProps={{iconName: 'Save'}}
                onClick={() => {
                  this.setState({ attachmentModalOpened: true })
                }}
                text="Upload"
              />
            </div>
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
              <div className="attachments-container">
                { (group ? files.filter(({group: {id}}) => id === group) : files || []).map(file => (
                  <Attachment key={file.id} file={file} onDeleteFile={(file) => this._openDeleteDialog(file)}/>
                )) }
              </div>
                  :
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
