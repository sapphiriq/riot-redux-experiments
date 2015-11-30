import pathToRegexp from 'path-to-regexp';
import { urlWithQuery } from './url';

// Named routes
let namedRoutes = {};

export function isCurrentRoute(store) {
  return (name, params, query) => {
    if (name[0] == '/') {
      return name.split('?')[0] == store.getState().router.path;
    } else if (!namedRoutes[name]) {
      return false;
    } else {
      let currentRoute = store.getState().router.path;
      if (params) {
        let path = buildNamedRoute(name, params);
        return path == currentRoute;
      } else {
        return !!namedRoutes[name].regexp.exec(currentRoute);
      }
    }
  };
}

export function createNamedRouteBuilder(getPath) {
  return function(params, query) {
    let url = getPath(params);
    return urlWithQuery(url, query);
  };
}

export function buildNamedRoute(name, params, query) {
  if (!namedRoutes[name]) {
    return null;
  } else {
    return namedRoutes[name].fn(params, query);
  }
}

export function addNamedRoute(name, path) {
  console.log('Named route added:', name, path);

  // let fnBody = 'return "' + (path.replace(/:([a-zA-Z_]+)?/g, '" + params.$1 + "')) + '";';
  // let getPath = Function('params', 'query', fnBody);
  let keys = [];
  let regexp = pathToRegexp(path, keys);
  let getPath = pathToRegexp.compile(path);

  return namedRoutes[name] = {
    path: path,
    keys: keys,
    regexp: regexp,
    fn: createNamedRouteBuilder(getPath),
  };
}
