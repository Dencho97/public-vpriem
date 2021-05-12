import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  FORBIDDEN_ROUTE,
  LOGIN_ROUTE,
  TARIFFS_ROUTE,
  PAYMENTS_SUCCESS_ROUTE,
  PAYMENTS_REDIRECT_ROUTE,
  PAYMENTS_ERROR_ROUTE,
  SETTINGS_ORGANIZATION_ROUTE,
  PAYMENTS_HISTORY_ROUTE,
  REFERAL_ROUTE
} from '../constans/routes';
import { checkAuthAction } from '../pages/login/actions';
import Preloader from './Preloader';

class PrivateRoute extends React.PureComponent {
  componentDidMount() {
    const { auth } = this.props;
    const { token } = auth;
    if (token && !auth.authorized) {
        const { dispatch } = this.props;
        dispatch(checkAuthAction(token));
    }
}

  render() {
    const {
      component: Component,
      auth,
      permissions,
      ...rest
    } = this.props;
    const { tariff } = auth;

    if (auth.token === null) {
      return (<Redirect to={LOGIN_ROUTE} />);
    }

    if (!auth.authorized || auth.loading) {
      return <Preloader />;
    }

    const availibleIfExpiredTariff = [
      TARIFFS_ROUTE,
      PAYMENTS_SUCCESS_ROUTE,
      PAYMENTS_ERROR_ROUTE,
      PAYMENTS_REDIRECT_ROUTE,
      SETTINGS_ORGANIZATION_ROUTE,
      PAYMENTS_HISTORY_ROUTE,
      REFERAL_ROUTE
    ];

    return (
      <Route
        {...rest}
        render={(props) => {
            if (auth.authorized) {
              if (permissions.length && auth.permissions[permissions[0]] !== undefined && auth.permissions[permissions[0]]) {
                if (!tariff.active && !availibleIfExpiredTariff.includes(rest.path)) {
                  return (<Redirect to={TARIFFS_ROUTE} />);
                }
                return (<Component {...props} />);
              }
              if (!permissions.length) {
                if (!tariff.active && !availibleIfExpiredTariff.includes(rest.path)) {
                  return (<Redirect to={TARIFFS_ROUTE} />);
                }
                return (<Component {...props} />);
              }
              return (<Redirect to={FORBIDDEN_ROUTE} />);
            }
            return (<Redirect to={FORBIDDEN_ROUTE} />);
          }
        }
      />
    );
  }
}

PrivateRoute.defaultProps = {
  permissions: []
};

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    permissions: PropTypes.array,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
