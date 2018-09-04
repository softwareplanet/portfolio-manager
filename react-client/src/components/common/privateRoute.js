import {Redirect, Route} from "react-router-dom";
import React from "react";

export const PrivateRoute = ({component: Component, authed, pathTo, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: pathTo, state: {from: props.location}}}/>}/>
  )
};