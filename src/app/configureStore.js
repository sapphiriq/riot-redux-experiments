import rootReducer from '../app/reducers';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import createLogger from 'redux-logger';
import { api, thunk, log } from './middleware';
import router from './router/middleware';

export default function configureStore(initialState, debug = false) {
  var finalCreateStore;
  const createStoreWithMiddleware = applyMiddleware(thunk, api, router);

  if (debug) {
    let logger = createLogger({
      collapsed: true,
      duration: true,
    });
    finalCreateStore = compose(createStoreWithMiddleware, applyMiddleware(logger))(createStore);
  } else {
    finalCreateStore = createStoreWithMiddleware(createStore);
  }

  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../app/reducers', () => {
      const nextRootReducer = require('../app/reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
