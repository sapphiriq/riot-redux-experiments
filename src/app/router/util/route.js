import assign from 'lodash/object/assign';
import partial from 'lodash/function/partial';
import { addNamedRoute } from './namedRoutes';
import { routeChanged } from '../actions';

const defaultHandler = (req, next) => { next(); };

/* Wraps handler with routeChange dispatcher */
export function createRouteHandler(routeConfig, isServer) {
  let { path, name, handler, waitFor } = routeConfig;
  let config = assign({}, routeConfig);
  let isMiddleware = path === '*';
  delete config.handler;
  name && addNamedRoute(name, path);

  handler || (handler = defaultHandler);

  let routeHandler = function(req, next) {
    let newNext = isMiddleware ? next : partial(go, req, next, config);
    handler(req, newNext, config);
  };

  if (isServer && waitFor) {
    return (req, res, next) => {
      req.store.dispatch({ type: 'WAIT_FOR', payload: waitFor });
      routeHandler(req, next);
    };
  } else if (isServer) {
    return (req, res, next) => {
      routeHandler(req, next);
    };
  } else {
    return routeHandler;
  }

}

/* Normalize next for express and page.js */
export function go(req, next, routeConfig) {

  if (routeConfig.isMiddleware) {
    return typeof next === 'function' ? next() : void 0;
  }

  req.store.dispatch(routeChanged(req.path, req.params, req.query, routeConfig.name));

  if (next) {
    req.handled = true;
    return next();
  }
}
