import React, {Component} from 'react';
import {connect} from "react-redux";
import {Loader, SkillsForm} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {deleteUserSkill, getUserSkills} from "../../actions/userSkills";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  Panel,
  PanelType,
  PrimaryButton,
  Rating,
  SelectionMode
} from "office-ui-fabric-react";
import {getSkills} from "../../actions/skills";

class SkillsPage extends Component {

  editSkill(skill) {
    this.setState({skillToEdit: skill, showPanel: true})
  }

  deleteSkill(skillId) {
    const {user, deleteSkill} = this.props;
    deleteSkill(user.id, skillId);
  }

  _openDeleteDialog(skill) {
    this.setState({skillToDelete: skill, hideDialog: false})
  }

  _columns = [
    {
      key: 'skillName',
      name: 'Skill Name',
      fieldName: 'skill.name',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({skill}) => {
        return <span>{skill.name}</span>;
      },
    },
    {
      key: 'level',
      name: 'Level',
      fieldName: 'level',
      minWidth: 70,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: ({level}) => {
        return (<div>
          <Rating
            id={'readOnlyRatingStar'}
            min={1}
            max={5}
            rating={level}
            readOnly={true}
          />
        </div>);
      },
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({description}) => {
        return <span>{description}</span>;
      },
      isPadded: true
    },
    {
      key: 'actions',
      name: 'Actions',
      fieldName: 'skills',
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
                key: 'edit',
                text: 'Edit',
                iconProps: {iconName: 'Edit'},
                onClick: () => this.editSkill(item)
              },
              {
                key: 'delete',
                text: 'Delete',
                iconProps: {iconName: 'Delete'},
                onClick: () => this._openDeleteDialog(item)
              }

            ],
            directionalHintFixed: true
          }}
          split={false}
        />);
      },
      isPadded: true
    }
  ];

  state = {
    showPanel: false,
    hideDialog: true,
    skillToDelete: null,
    skillToEdit: null
  };

  componentDidMount() {
    const {user, getUserSkills, skills, getSkills} = this.props;
    if (user) {
      getUserSkills(user.id);
      if (skills.length === 0)
        getSkills();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {userSkills, editUserSkillState} = this.props;
    if ((userSkills && nextProps.userSkills && (userSkills.length !== nextProps.userSkills.length)) ||
      ((editUserSkillState && this.state.skillToEdit) &&
        (editUserSkillState === this.state.skillToEdit.id))) {
      const {showPanel, hideDialog} = this.state;
      !hideDialog && this._closeDialog();
      showPanel && this._setShowPanel(false)();
    }
  }

  render() {
    const {skillToEdit, showPanel, hideDialog, skillToDelete} = this.state;
    return (
      <div className={'page-container'}>
        <span className={'page-title'}>Skills</span>
        <div className={'add-button'}>
          <PrimaryButton
            text={'Add a Skill'}
            onClick={this._setShowPanel(true)}
          />
          <Panel
            isBlocking={false}
            isOpen={showPanel}
            onDismiss={this._setShowPanel(false)}
            type={PanelType.smallFixedFar}
            headerText={skillToEdit ? 'Add a Skill' : 'Edit a skill'}
            hasCloseButton={false}
          >
            <SkillsForm onClose={this._setShowPanel(false)} userSkill={skillToEdit}/>
          </Panel>
        </div>
        {
          this.props.userSkills ?
            <DetailsList
              items={this.props.userSkills}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading your skills..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete skill ${skillToDelete && skillToDelete.skill.name}`,
            subText:
              'This can not be undone. Your skills from this skill would not be affected.'
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
                this.deleteSkill(skillToDelete.id);
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

  _setShowPanel = (showPanel) => {
    return () => {
      this.setState({skillToEdit: null, showPanel});
    };
  };
}

const mapStateToProps = ({user, userSkills, skills, editUserSkillState}) => {
  return {user, userSkills, skills, editUserSkillState};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserSkills: (userId) => dispatch(getUserSkills(userId)),
    getSkills: () => dispatch(getSkills()),
    deleteSkill: (userId, skillId) => dispatch(deleteUserSkill(userId, skillId))
  };
};

export const Skills = connect(mapStateToProps, mapDispatchToProps)(SkillsPage);