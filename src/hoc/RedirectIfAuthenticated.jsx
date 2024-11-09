import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export const RedirectIfAuthenticated = ({ element }) => {
  RedirectIfAuthenticated.propTypes = {
    element: PropTypes.node.isRequired,
  };
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <Navigate to="/" /> : element;
};
