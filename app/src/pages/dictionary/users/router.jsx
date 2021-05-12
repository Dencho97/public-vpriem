import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { DICTIONARY_USERS_ROUTE } from '../../../constans/routes';
import UsersPage from './users';

export default [
  <PrivateRouter key={DICTIONARY_USERS_ROUTE} component={UsersPage} path={DICTIONARY_USERS_ROUTE} permissions={['dictionary/users']} />,
];
