import React from "react";
import Router from "next/router";
import { isLoggedIn } from "../../utils/request.js";

const authenticatedRoute = (Component = null, options = {}) => {
  class AuthenticatedRoute extends React.Component {
    state = {
      loading: true,
    };

    componentDidMount() {
      if (isLoggedIn()) {
        this.setState({ loading: false });
      } else {
        Router.push(options.pathAfterFailure || "/login");
      }
    }

    render() {
      const { loading } = this.state;

      if (loading) {
        return <div />;
      }

      return <Component {...this.props} />;
    }
  }

  return AuthenticatedRoute;
};

export default authenticatedRoute;
