import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { DICTIONARY_TYPES_ROUTE } from '../../../constans/routes';
import TypesPage from './types';

export default [
  <PrivateRouter key={DICTIONARY_TYPES_ROUTE} component={TypesPage} path={DICTIONARY_TYPES_ROUTE} permissions={['dictionary/types']} />,
];
