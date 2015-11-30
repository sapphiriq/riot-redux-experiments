import page from 'page';
import { REHYDRATE } from '../constants';
import { CHANGE_ROUTE } from './constants';
import { urlWithQuery } from './util/url';
import { buildNamedRoute } from './util/namedRoutes';

// Injects store into context of page.js
export function injectStore(store) {
  return (req, next) => {
    req.query = require('qs').parse(req.querystring);
    req.store = store;
    next();
  };
}

// routerMiddleware
export default function routerMiddleware({ getState }) {
  console.log('Middleware injected: Router');
  return (next) => (action) => {
    switch (action.type) {
      case REHYDRATE:
        next(action);
        let { path, query } = getState().router;
        let url = urlWithQuery(path, query);
        console.log('[Router] | Push path:', url);
        if (process.browser) {
          page.show(url, null, false, true);
        }

        break;

      case CHANGE_ROUTE:
        if (process.browser) {
          var { name, path, params, query } = action.payload;
          if (name) {
            path = buildNamedRoute(name, params, query);
          }

          if (path) {
            page.show(path);
          }
        }

        break;

      default:
        return next(action);
    }
  };
}
