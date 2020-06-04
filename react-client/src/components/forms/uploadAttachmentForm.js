import React, { Component } from 'react';
import {
  ActionButton,
  Dropdown,
  Modal,
  PrimaryButton,
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
    this.setState({ files: files.map(file => ({ file, group: this.props.group ? this.props.group : 1 })) });
  }

  render() {
    const { opened, closeModal, groups: [_, ...groups] } = this.props;
    const { files } = this.state;

    return (
      <Modal
        isOpen={ opened }
        onDismiss={ closeModal }
        isBlocking={ false }
        containerClassName="modal-container attachment-modal-container"
      >
        <span className={ 'modal-header' }>Upload attachments</span>
        <div>
          { files.map(({ file, group }, i) =>
            <div key={ i } className="file-row">
              <div className="file-name">{ file.name }</div>

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
            Upload
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

  addFiles(droppedFiles) {
    const {files} = this.state;
    this.setState({ files: [...files, ...droppedFiles.map(file => ({ file, group: this.props.group ? this.props.group : 1 }))] });
  }

  uploadFiles() {
    const {files} = this.state;
    this.setState({ loading: true });
    Promise.all(files.map(({ file, group }) => this.props.uploadAttachment({file, group: Number(group)}))).then(() => {
      this.setState({ loading: false });
      this.props.closeModal();
    })
  }
}
