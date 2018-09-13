import React, {Component} from 'react';
import {connect} from "react-redux";
import {CreateSkillModal, Loader} from "../../components";
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
import {deleteSkill, getSkills, setSkill} from "../../actions/skills";
import {setSkillModal} from "../../actions/modals";

class SkillsPage extends Component {

  editSkill(skill) {
    this.props.createSkill();
    this.setState({skillToEdit: skill})
  }

  deleteSkill(skillId) {
    const {deleteSkill} = this.props;
    deleteSkill(skillId);
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
      onRender: ({name}) => {
        return <span>{name}</span>;
      },
    },
    {
      key: 'category',
      name: 'Category',
      fieldName: 'category',
      minWidth: 90,
      maxWidth: 260,
      isResizable: true,
      isPadded: true,
      onRender: ({category}) => {
        return (<div>
          {category.name}
        </div>);
      },
    },
    {
      key: 'url',
      name: 'Link',
      fieldName: 'url',
      minWidth: 90,
      maxWidth: 360,
      isResizable: true,
      isPadded: true,
      onRender: ({url}) => {
        return (<div>
          {url}
        </div>);
      },
    }
  ];

  _actions = {
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
              key: 'open',
              text: 'Employees with this skill',
              iconProps: {iconName: 'Group', style: {color: '#000'}},
              onClick: () => {
                this.props.setSkill(item);
                this.props.history.push(`/home/skills/${item.id}`)
              }
            },
            {
              key: 'edit',
              text: 'Edit',
              iconProps: {iconName: 'Edit', style: {color: '#000'}},
              onClick: () => this.editSkill(item)
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
    skillToDelete: null,
    skillToEdit: null
  };

  componentDidMount() {
    const {user, getSkills} = this.props;
    if (user) {
      getSkills();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.isStaff && this._columns.length === 3)
      this._columns.push(this._actions);

    const {skills} = this.props;
    if (skills && nextProps.skills && (skills.length !== nextProps.skills.length)) {
      const {hideDialog} = this.state;
      !hideDialog && this._closeDialog();
    }
    if (!nextProps.skillModal) this.setState({skillToEdit: null});
  }

  render() {
    const {skillToEdit, hideDialog, skillToDelete} = this.state;
    return (
      <div className={'page-container'}>
        <CreateSkillModal skill={skillToEdit}/>
        <span className={'page-title'}>Skills</span>
        <div className={'add-button'}>
          <PrimaryButton
            text={'Add a Skill'}
            onClick={this.props.createSkill}
          />
        </div>
        {
          this.props.skills ?
            <DetailsList
              items={this.props.skills}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading skills..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete skill ${skillToDelete && skillToDelete.name}`,
            subText:
              'This can not be undone. This skill will be deleted for all employees.'
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
}

const mapStateToProps = ({user, skills, isStaff, skillModal}) => {
  return {user, skills, isStaff, skillModal};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSkills: () => dispatch(getSkills()),
    deleteSkill: (userId, skillId) => dispatch(deleteSkill(userId, skillId)),
    createSkill: () => dispatch(setSkillModal(true)),
    setSkill: (skill) => dispatch(setSkill(skill)),
  };
};

export const Skills = connect(mapStateToProps, mapDispatchToProps)(SkillsPage);