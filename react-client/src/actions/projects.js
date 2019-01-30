import {
  ADD_PROJECT,
  CHANGE_PROJECT,
  CREATE_PROJECT_ERRORS,
  DELETE_PROJECT,
  NEW_PROJECT_LOADING,
  SET_PROJECT,
  SET_PROJECTS,
  SUCCESSFUL_EDIT_PROJECT,
  ADD_PROJECT_FILE, REMOVE_PROJECT_FILE
} from "./actionTypes";
import axios from "axios";
import {setProjectModal} from "./modals";
import {retryRequest} from "../service/utils";

export const setProjects = (projects = null) => {
  return {
    type: SET_PROJECTS,
    payload: projects
  };
};

export const getProjects = () => {
  return (dispatch) => {
    dispatch(createProjectErrors({}));
    axios.get(`/api/v1/project`)
      .then(res => {
        dispatch(setProjects(res.data));
      })
      .catch(retryRequest(getProjects, dispatch)())
  }
};

export const getProjectsExtended = () => {
  return (dispatch) => {
    dispatch(setProjects(null));
    dispatch(createProjectErrors({}));
    axios.get(`/api/v1/project/extended`)
      .then(res => {
        dispatch(setProjects(res.data));
      })
      .catch(retryRequest(getProjectsExtended, dispatch)())
  }
};

export const newProjectLoading = (bool = false) => {
  return {
    type: NEW_PROJECT_LOADING,
    payload: bool
  };
};

export const addProject = (project) => {
  return {
    type: ADD_PROJECT,
    payload: project
  }
};

export const createProjectErrors = (errors = {}) => {
  return {
    type: CREATE_PROJECT_ERRORS,
    payload: errors
  };
};

export const createProject = (project) => {
  return (dispatch) => {
    dispatch(createProjectErrors({}));
    dispatch(newProjectLoading(true));
    axios.post('/api/v1/project', project)
      .then(res => {
        dispatch(setProjectModal(false));
        dispatch(addProject(res.data));
      })
      .catch(errors => {
        dispatch(createProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      }).finally(() => {
      dispatch(newProjectLoading(false));
    })
  }
};

export const removeProject = (project) => {
  return {
    type: DELETE_PROJECT,
    payload: project
  }
};

export const deleteProject = (projectId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/project/${projectId}`)
      .then(res => {
        dispatch(removeProject(res.data))
      })
  }
};

export const successfulEditProject = (projectId) => {
  return {
    type: SUCCESSFUL_EDIT_PROJECT,
    payload: projectId
  };
};

export const changeProject = (project) => {
  return {
    type: CHANGE_PROJECT,
    payload: project
  }
};

export const editProject = (project) => {
  return (dispatch) => {
    dispatch(newProjectLoading(true));
    dispatch(createProjectErrors({}));
    axios.patch(`/api/v1/project/${project.id}`, project)
      .then(res => {
        dispatch(setProjectModal(false));
        dispatch(setProject(res.data));
        dispatch(changeProject(res.data))
      }).catch(errors => {
      dispatch(createProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
    }).finally(() => {
      dispatch(newProjectLoading(false));
    });
  }
};

export const setProject = (projects = {}) => {
  return {
    type: SET_PROJECT,
    payload: projects
  };
};

export const getProject = (projectId) => {
  return (dispatch) => {
    dispatch(createProjectErrors({}));
    axios.get(`/api/v1/project/${projectId}`)
      .then(res => {
        dispatch(setProject(res.data));
      })
      .catch(retryRequest(getProject, dispatch)(projectId))
  }
};

export const addProjectFile = (file = {}) => ({
  type: ADD_PROJECT_FILE,
  payload: file
});



export const createProjectFile = (projectId, data) => {
  return (dispatch) => {
    dispatch(createProjectErrors({}));
    let formData = new FormData();
    formData.append('file', data.file);
    formData.append('groupId', data.group);
    axios.post(`/api/v1/project/${projectId}/files`, formData)
      .then(res => {
        dispatch(addProjectFile(res.data));
      })
      .catch(errors => {
        dispatch(createProjectErrors((errors.response && errors.response.data.errors) || {non_field_errors: [errors.message]}));
      })
  }
};

export const removeProjectFile = (projectFileId) => ({
  type: REMOVE_PROJECT_FILE,
  payload: projectFileId
});

export const deleteProjectFile = (projectFileId) => {
  return (dispatch) => {
    axios.delete(`/api/v1/file/${projectFileId}`)
      .then(({data: {id: projectFileId}}) => {
        dispatch(removeProjectFile(projectFileId))
      })
  }
};