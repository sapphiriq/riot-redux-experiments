import '../assets/styles/main.styl';

import page from 'page';
import riot from 'riot';

import configureStore from '../app/configureStore';
import { getRoutes } from '../app/routes';

import { injectStoreMiddleware, addRoutes } from '../app/router';

import App from '../app/containers/App';

// Create store
let initialState = window.__INITIAL_STATE__;
let store = configureStore(initialState, true);
let mountApp = () => {
  riot.mount('app', App, { store, browser: true, server: initialState });
};

let routes = getRoutes();
routes.unshift(injectStoreMiddleware(store));
addRoutes(routes, page);

setTimeout(() => {
  page({ dispatch: true });
  mountApp();
}, 1000);

// Debug
import assign from 'lodash/object/assign';
window.riot = riot;
window.store = store;
window.actions = require('../app/actions');
window.assign = assign;

if (module.hot) {
  module.hot.accept('../app/containers/App', function() {
    require('../app/containers/App');
    mountApp();
  });
}
