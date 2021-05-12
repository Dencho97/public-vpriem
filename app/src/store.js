import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createRootReducer from './reducers';

export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    process.env.NODE_ENV === 'production' ? compose(applyMiddleware(routerMiddleware(history), thunk)) : composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
  );

  return store;
}
