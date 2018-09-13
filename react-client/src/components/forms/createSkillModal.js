import React, {Component} from "react";
import {ActionButton, Dropdown, Modal, PrimaryButton, Spinner, SpinnerSize, TextField} from "office-ui-fabric-react";
import {connect} from "react-redux";
import {setSkillModal} from "../../actions/modals";
import {createSkill, editSkill} from "../../actions/skills";

class CreateSkill extends Component {

  state = {
    name: '',
    url: '',
    categoryId: null
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (!nextProps.opened) {
      this.setState({name: '', url: ''})
    }
    if (nextProps.skill && !nextProps.loading) {
      this.setState({...nextProps.skill, categoryId: nextProps.skill.category.id});
    }
    if (!nextProps.skill) this.setState({name: '', url: ''});
  }

  render() {
    const {opened, closeModal, loading, createSkill, errors, skill, editSkill, skillCategories} = this.props;
    const {name, url, categoryId} = this.state;
    return (
      <Modal
        isOpen={opened}
        onDismiss={closeModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <span className={'modal-header'}>Create new skill</span>
        <form onSubmit={(e) => {
          e.preventDefault();
          !skill ?
            createSkill({name, url, categoryId}) :
            editSkill({name, url, id: skill.id, categoryId});
        }}>
          <TextField label="Name:" value={name}
                     onChange={(e) => this.setState({name: e.target.value})}
                     isRequired={true}
                     errorMessage={(errors.name || []).join('<br/>')}
                     placeholder="e.i. JavaScript"
          />
          <TextField label="Url:" value={url}
                     onChange={(e) => this.setState({url: e.target.value})}
                     placeholder="Link to technology page"
                     errorMessage={(errors.url || errors.non_field_errors || []).join('<br/>')}
                     isRequired={true}
                     style={{width: 15 + 'rem'}}
          />
          <Dropdown
            placeHolder="Select a category"
            label="Skill category:"
            options={skillCategories.map( ({id, name}) => ({key: id, text: name}))}
            onChanged={({key}) => this.setState({categoryId: key})}
            selectedKey={categoryId}
            isRequired={true}
            errorMessage={(errors.categoryId || []).join('<br/>')}
          />
          <div className={'button-group-right'}>
            <div>
              <ActionButton iconProps={{iconName: 'Cancel'}} className={'register-button'}
                            onClick={closeModal}>
                Cancel
              </ActionButton>
            </div>
            <PrimaryButton type="submit">
              {loading ? <Spinner size={SpinnerSize.medium} ariaLive="assertive"/> : skill ? 'Save' : 'Create'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = ({skillModal, newSkillLoading, createSkillErrors, skillCategories}) => {
  return {
    opened: skillModal,
    loading: newSkillLoading,
    errors: createSkillErrors,
    skillCategories
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => dispatch(setSkillModal(false)),
    createSkill: (skill) => dispatch(createSkill(skill)),
    editSkill: (skill) => dispatch(editSkill(skill))
  };
};
export const CreateSkillModal = connect(mapStateToProps, mapDispatchToProps)(CreateSkill);