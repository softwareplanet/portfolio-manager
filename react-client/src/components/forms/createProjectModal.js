import React, {Component} from "react";
import {
  ActionButton,
  Checkbox,
  DatePicker,
  Icon,
  Modal,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  TextField
} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setProjectModal} from "../../actions/modals";
import {createProject, editProject} from "../../actions/projects";
import {NumberTextField} from "../common/numberTextField";
import {formatDate} from "../../service/utils";
import {ErrorLabel} from "..";
import axios from 'axios';

class CreateProject extends Component {

  initialState = {
    name: '',
    url: '',
    description: '',
    startDate: new Date(),
    durationMonths: '',
    isFinished: false,
    image: '',
    localImage: '',
  };

  state = {...this.initialState};

  componentWillReceiveProps(nextProps) {
    if (!nextProps.opened) {
      this.setState({...this.initialState});
    }
    if (nextProps.project && !nextProps.loading) {
      this.setState({...nextProps.project, startDate: new Date(nextProps.project.startDate)});
    }
    if (!nextProps.project) this.setState({...this.initialState});
  }

  handleLogoChange(image) {
    if (!(image instanceof Blob)) return;
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = evt => {
      let img = new Image();
      img.onload = () => {
        this.setState({ localImage: img.src, image })
      };
      img.onerror = () => {};
      img.src = evt.target.result;
    }
  }

  render() {
    const {opened, closeModal, loading, errors, createProject, project, editProject} = this.props;
    const {name, url, description, durationMonths, startDate, isFinished, image, localImage} = this.state;
    const imagePreview = localImage ? localImage : image ? axios.defaults.baseURL + image : '/missing-logo.svg';
    const durationMonthsForSave = durationMonths === '' ? null : durationMonths;

    const numberTextField = isFinished ?
      <NumberTextField
        label="Duration, month:"
        value={durationMonths}
        onChange={(durationMonths) => this.setState({durationMonths})}
        errorMessage={(errors.durationMonths || []).join('\r\n')}
      />
      : '';
    return (
      <Modal
        isOpen={opened}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <span className={'modal-header'}>Create new project</span>
        <form onSubmit={(e) => {
          e.preventDefault();
          !project ?
            createProject({
              name,
              url,
              description,
              durationMonths: durationMonthsForSave,
              startDate: formatDate(startDate),
              isFinished,
              image
            }) :
            editProject({
              name,
              url,
              description,
              durationMonths: durationMonthsForSave,
              startDate: formatDate(startDate),
              id: project.id,
              isFinished,
              image
            });
        }}>
          <div className="project-modal-logo">
            <div className="project-modal-logo-img-container">
              <img src={imagePreview} alt="project-logo-img"/>  
            </div>
            <label htmlFor="project-logo-image" className={'upload-user-photo'}>
              <Icon iconName={'Upload'} style={{marginRight: 4}}/>
              Upload logo
            </label>
            <input type="file" id="project-logo-image" style={{display: 'none'}}
                   onChange={(e) => this.handleLogoChange(e.target.files[0])}
            />
            <ErrorLabel title={(errors.image || []).join('\r\n')}/>
          </div>
          <TextField
            label="Name:" value={name}
            onChange={(e) => this.setState({name: e.target.value})}
            isRequired={true}
            errorMessage={(errors.name || []).join('\r\n')}
            placeholder="Project name..."
            required
          />
          <TextField
            label="Description:" value={description}
            onChange={(e) => this.setState({description: e.target.value})}
            isRequired={true}
            errorMessage={(errors.description || []).join('\r\n')}
            placeholder="Detailed description of this project..."
            multiline rows={12}
            autoAdjustHeight={true}
            resizable={false}
            style={{width: 20 + 'rem'}}
          />
          <DatePicker
            value={startDate}
            placeholder="Select a date..."
            label="Start date:"
            onSelectDate={(startDate) => {
              this.setState({startDate});
            }}
            errorMessage={(errors.startDate || []).join('\r\n')}
            required
          />
          <br/>
          <Checkbox label="Project is finished now?" defaultChecked={isFinished} onChange={(ev, isChecked) => {
            this.setState({isFinished: isChecked});
          }}/>
          {numberTextField}
          <br/>
          <TextField
            label="Url:" value={url}
            onChange={(e) => this.setState({url: e.target.value})}
            placeholder="Link to project page"
            errorMessage={(errors.url || errors.non_field_errors || []).join('\r\n')}
            isRequired={true}
          />
          <div className={'button-group-right'}>
            <div>
              <ActionButton
                iconProps={{iconName: 'Cancel'}}
                className={'register-button'}
                onClick={closeModal}>
                Cancel
              </ActionButton>
            </div>
            <PrimaryButton type="submit">
              {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : (project ? 'Save' : 'Create')}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    );
  }


}

const mapStateToProps = ({projectModal, newProjectLoading, createProjectErrors}) => {
  return {
    opened: projectModal,
    loading: newProjectLoading,
    errors: createProjectErrors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(setProjectModal(false)),
    createProject: (project) => dispatch(createProject(project)),
    editProject: (project) => dispatch(editProject(project)),
  };
};
export const CreateProjectModal = connect(mapStateToProps, mapDispatchToProps)(CreateProject);
