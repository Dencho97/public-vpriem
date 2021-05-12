import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { DICTIONARY_FILIALS_ROUTE } from '../../../constans/routes';
import FilialsPage from './filials';

export default [
  <PrivateRouter key={DICTIONARY_FILIALS_ROUTE} component={FilialsPage} path={DICTIONARY_FILIALS_ROUTE} permissions={['dictionary/filials']} />,
];
