import {
  ADD_TEAM_MEMBERS,
  ADD_USER_PROJECT,
  CHANGE_USER_PROJECT, CREATE_TEAM_MEMBERS_ERRORS, CREATE_TEAM_MEMBERS_LOADING,
  CREATE_USER_PROJECT_ERRORS,
  DELETE_USER_PROJECT,
  NEW_USER_PROJECT_LOADING,
  SET_USER_PROJECTS,
  SUCCESSFUL_EDIT_USER_PROJECT,
} from './actionTypes'
import axios from 'axios';
import {retryRequest} from "../service/utils";
import {setTeamModal} from "./modals";

export const successfulEditUserProject = (userProjectId) => {
  return {
    type: SUCCESSFUL_EDIT_USER_PROJECT,
    payload: userProjectId
  };
};

export const setUserProjects = (userProjects = null) => {
  return {
    type: SET_USER_PROJECTS,
    payload: userProjects
  };
};

export const getUserProjects = (userId) => {
  return (dispatch) => {
    dispatch(createUserProjectErrors({}));
    axios.get(`/api/v1/employee/${userId}/project`)
      .then(res => {
        let projects = res.data;
        projects = projects.map(project => {
          if(!project.isFinished) {
            project.durationMonths = getMonthDurationFromStartDate(project.startDate);
          }
          return project;
        });
        dispatch(setUserProjects(projects));
      })
      .catch(retryRequest(getUserProjects, dispatch)(userId))
  }
};

export const addUserProject = (project) => {
  return {
    type: ADD_USER_PROJECT,
    payload: project
  }
};

export const addTeamMembers = (results) => {
  return {
    type: ADD_TEAM_MEMBERS,
    payload: results
  }
};

export const changeUserProject = (project) => {
  return {
    type: CHANGE_USER_PROJECT,
    payload: project
  }
};

export const removeUserProject = (project) => {
  return {
    type: DELETE_USER_PROJECT,
    payload: project
  }
};

export const deleteUserProject = (userId, projectId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/employee/${userId}/project/${projectId}`)
      .then(res => {
        dispatch(removeUserProject(res.data))
      })
  }
};

export const newUserProjectLoading = (bool = false) => {
  return {
    type: NEW_USER_PROJECT_LOADING,
    payload: bool
  };
};

export const createTeamMembersLoading = (bool = false) => {
  return {
    type: CREATE_TEAM_MEMBERS_LOADING,
    payload: bool
  };
};

export const createUserProjectErrors = (errors = {}) => {
  return {
    type: CREATE_USER_PROJECT_ERRORS,
    payload: errors
  };
};

export const createTeamMemberErrors = (errors = {}) => {
  return {
    type: CREATE_TEAM_MEMBERS_ERRORS,
    payload: errors
  };
};

export const editUserProject = (userId, project) => {
  return (dispatch) => {
    dispatch(newUserProjectLoading(true));
    dispatch(createUserProjectErrors({}));
    axios.patch(`/api/v1/employee/${userId}/project/${project.id}`, project)
      .then(res => {
        dispatch(successfulEditUserProject(res.data.id));

        const project = res.data;
        if(!project.isFinished) {
          project.durationMonths = getMonthDurationFromStartDate(project.startDate);
        }
        dispatch(changeUserProject(project))
      })
      .catch(errors => {
        dispatch(createUserProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      })
      .finally(() => {
        dispatch(newUserProjectLoading(false));
      });
  }
};

export const createUserProject = (userId, project) => {
  return (dispatch) => {
    dispatch(newUserProjectLoading(true));
    dispatch(createUserProjectErrors({}));
    axios.post(`/api/v1/employee/${userId}/project`, project)
      .then(res => {

        const projectForCreating = res.data;
        if(!projectForCreating.isFinished) {
          projectForCreating.durationMonths = getMonthDurationFromStartDate(projectForCreating.startDate);
        }

        dispatch(addUserProject(projectForCreating))
      }).catch(errors => {
      dispatch(createUserProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newUserProjectLoading(false));
    });
  }
};

export const createTeamMembers = (users, project) => {
  return (dispatch) => {
    dispatch(createTeamMembersLoading(true));
    dispatch(createTeamMemberErrors({}));
    Promise.all(
      users.map(
        user => axios.post(`/api/v1/employee/${user.id}/project`, project)
          .then(({data}) => Promise.resolve({user, project: data})),
      ),
    ).then(results => {
      dispatch(addTeamMembers(results));
    }).catch(errors => {
      dispatch(createTeamMemberErrors(
        (errors.response && errors.response.data.errors) ||
        {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(setTeamModal(false));
      dispatch(createTeamMembersLoading(false));
    });

  };
};

export function getMonthDurationFromStartDate(dateOfStart) {
    const today = new Date();
    const startDate = new Date(dateOfStart);
    return Math.floor((today - startDate)/1000/60/60/24/30);
}