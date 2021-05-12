import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import moment from 'moment';
import configureStore from './store';
import App from './App';
import { setTutorialAction } from './components/Tutorial/actions';
import './index.scss';

// import assets //
require.context('./assets', true, /^.+$/im);

moment.locale('ru');
const store = configureStore();

if (localStorage.getItem('tutorial') === null) {
  store.dispatch(setTutorialAction(null, true));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
