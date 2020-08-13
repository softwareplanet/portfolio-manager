import React, { Component } from 'react';
import {
  ActionButton,
  Dropdown,
  Modal,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  TextField,
} from 'office-ui-fabric-react';
import { DropZone } from '..';
import Dropzone from 'react-dropzone';

export class UploadAttachmentModal extends Component {

  state = {
    files: [],
    loading: false,
  };

  componentWillReceiveProps(nextProps) {
      const {files} = nextProps;
      this.setFiles(files);
  }

  setFiles(files) {
    this.setState({ files: files.map(this.mapFile) });
  }

  mapFile = (file) => ({
    file,
    group: this.props.group ? this.props.group : 1,
    ...(this.props.enableComments ? { comment: '' } : {}),
  });

  render() {
    const { opened, closeModal, groups: [, ...groups], enableComments } = this.props;
    const { files, loading } = this.state;

    return (
      <Modal
        isOpen={ opened }
        onDismiss={ closeModal }
        isBlocking={ false }
        containerClassName="modal-container attachment-modal-container"
      >
        <span className={ 'modal-header' }>Upload attachments</span>
        <div>
          { files.map(({ file, group, comment }, i) =>
            <div key={ i } className="file-row">
              <div className="file-name">{ file.name }</div>
              { enableComments &&
              <div style={{marginLeft: 1 + 'rem', marginRight: 1 + 'rem'}}><TextField
                value={comment}
                onChange={(e) => this.setFileComment(i, e.target.value)}
                placeholder="Comment to attachments..."
              /></div> }
              <div style={{ width: 10 + 'rem' }}>
                <Dropdown
                  selectedKey={ group }
                  placeHolder="Select a Group"
                  onChanged={({key: group}) => this.setFileGroup(i, group)}
                  options={ groups }
                />
              </div>
            </div>) }
        </div>
        <Dropzone
          style={{position: 'relative'}}
          onDrop={(files) => this.addFiles(files)}
        >
          <div style={{ height: 10 + 'rem' }}>
            <DropZone text="Click or drop files here"/>
          </div>
        </Dropzone>
        <div className={'button-group-right'}>
          <div>
            <ActionButton iconProps={{iconName: 'Cancel'}} className={'register-button'}
                          onClick={closeModal}>
              Cancel
            </ActionButton>
          </div>
          <PrimaryButton onClick={() => this.uploadFiles()}>
            {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : 'Upload'}
          </PrimaryButton>
        </div>
      </Modal>
    );
  }

  setFileGroup(fileIndex, group) {
    const { files } = this.state;
    files[fileIndex].group = group;
    this.setState({ files });
  }

  setFileComment(fileIndex, comment) {
    const { files } = this.state;
    files[fileIndex].comment = comment;
    this.setState({ files });
  }

  addFiles(droppedFiles) {
    const {files} = this.state;
    this.setState({ files: [...files, ...droppedFiles.map(this.mapFile)] });
  }

  uploadFiles() {
    const {files} = this.state;
    this.setState({ loading: true });
    Promise.all(files.map(({ file, group, comment }) => this.props.uploadAttachment({
      file,
      group: Number(group),
      ...(this.props.enableComments ? { comment } : {}),
    }))).then(() => {
      this.setState({ loading: false });
      this.props.closeModal();
    })
  }
}
