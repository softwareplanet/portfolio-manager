import {TOGGLE_SIDE_BAR} from "../actions/actionTypes";

export const sideBarOpened = (state = true, action) => {
  switch (action.type) {
    case TOGGLE_SIDE_BAR:
      return !state;

    default:
      return state;
  }
};