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
  SelectionMode,
  Icon, Dropdown,
} from 'office-ui-fabric-react';
import {deleteSkill, getSkills, setSkill} from "../../actions/skills";
import {setSkillModal} from "../../actions/modals";
import ReactPaginate from 'react-paginate';
import { Paginator } from '../../service/utils';
import { Link } from 'react-router-dom';

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

  _setSkillsToShow(pageNumber) {
    this.setState({ skillsToShow: this.Paginator.getCurrentPage(pageNumber), pageNumber });
  }

  handlePageClick({ selected }) {
    this._setSkillsToShow(selected)
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
      onRender: (item) => {
        return <Link
          to={`/home/skills/${item.id}`}
          className="table-link"
        >{item.name}</Link>;
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
        return (url ? <Link to={url}>{ url }</Link> : <span>{url}</span>);
      },
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
    }
  ];

  state = {
    hideDialog: true,
    skillToDelete: null,
    skillToEdit: null,
    skillsToShow: [],
    pageNumber: 0,
    categoryId: 0,
  };

  Paginator = new Paginator(this.props.skills);

  componentDidMount() {
    const {user, getSkills} = this.props;
    if (user) {
      getSkills();
    }
    this._setSkillsToShow(this.state.pageNumber);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {skills} = this.props;
    if (nextProps.skills) {
      this.Paginator.array = nextProps.skills;
      this._setSkillsToShow(this.state.pageNumber)
    }
    if (skills && nextProps.skills && (skills.length !== nextProps.skills.length)) {
      const {hideDialog} = this.state;
      !hideDialog && this._closeDialog();
    }
    if (!nextProps.skillModal) this.setState(
      {skillToEdit: null});
  }

  filterSkills(selectedCategory) {
    const {skills} = this.props;
    if (skills) {
      const pr = skills.filter(({ category }) => !selectedCategory || selectedCategory === category.id);
      this.Paginator.array = pr;
      this.setState({
        skills: pr,
        pageNumber: 0,
        skillsToShow: this.Paginator.getCurrentPage(0),
      })
    }
  }

  render() {
    const {skillToEdit, hideDialog, skillToDelete, categoryId} = this.state;
    const {skillCategories} = this.props;
    return (
      <div className={'page-container'}>
        <CreateSkillModal skill={skillToEdit}/>
        <span className={'page-title'}>Skills</span>
        <div className="page-controls">
          <div className={'add-button'}>
            <PrimaryButton
              text={'Add a Skill'}
              onClick={this.props.createSkill}
            />
          </div>
          <div style={{ width: '15rem' }}>
            <Dropdown
              placeHolder="Select a category"
              options={[{key: 0, text: 'All Categories'}, ...skillCategories.map(({id, name}) => ({key: id, text: name}))]}
              onChanged={({key}) => {
                this.setState({categoryId: key});
                this.filterSkills(key);
              }}
              selectedKey={categoryId}
            />
          </div>
        </div>
        {
          this.props.skills ?
            <div><DetailsList
              items={ this.state.skillsToShow }
              columns={ this._columns }
              selectionMode={ SelectionMode.none }
              layoutMode={ DetailsListLayoutMode.justified }
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
            </div>
            :
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

const mapStateToProps = ({user, skills, isStaff, skillModal, skillCategories}) => {
  return {user, skills, isStaff, skillModal, skillCategories};
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
