import {createBrowserHistory} from "history";
import {applyMiddleware, compose, createStore} from "redux";
import {connectRouter, routerMiddleware} from "connected-react-router";
import rootReducer from "./reducers/rootReducer";
import thunk from "redux-thunk";

export const history = createBrowserHistory();

export const store = createStore(
  connectRouter(history)(rootReducer),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk
    ),
  )
);