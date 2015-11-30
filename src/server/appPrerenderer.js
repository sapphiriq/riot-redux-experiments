import express from 'express';

// Render app
import template from 'lodash/string/template';
import riot from 'riot';

// Redux
import { getRoutes } from '../app/routes';
import { createRouteHandler, addRoutes } from '../app/router';
import configureStore from '../app/configureStore';
import indexPageTemplate from './indexPageTemplate';

let router = express.Router();
let routesArray = getRoutes();

router.use(createStoreForRequest);
addRoutes(routesArray, (path, handler) => {
  router.get(path, handler);
}, true);
router.use(waitForAsyncActionsAndRender);
export default router;

function createStoreForRequest(req, res, next) {
  console.log('\nCreate store: ' + req.path + '\n-------------------------------');
  req.store = configureStore({ router: { path: req.path }});
  next();
}

function renderPage(req, res) {
  let App = require('../app/containers/App');
  let store = req.store;
  let html = riot.render(App, { store, server: true });
  console.log('Render App');
  res.send(indexPageTemplate({ html, initialState: store.getState() }));
}

function waitForAsyncActionsAndRender(req, res, next) {
  let store = req.store;
  var rendered = false;
  var timeoutListener = null;

  if (store.getState().waitFor.length) {
    let unsubscribe = store.subscribe(function() {
      if (store.getState().waitFor.length == 0) {
        unsubscribe();
        if (timeoutListener) {
          clearTimeout(timeoutListener);
        }

        if (!rendered) {
          rendered = true;
          process.nextTick(renderPage, req, res);
        }
      }
    });

    let timeoutExceeded = () => {
      console.error('\x1B[33mTimeout!\x1B[39m', store.getState().waitFor);
      unsubscribe();
      if (!rendered) {
        rendered = true;
        process.nextTick(renderPage, req, res);
      }
    };

    timeoutListener = setTimeout(timeoutExceeded, 2000);
  } else {
    process.nextTick(renderPage, req, res);
  }
}
