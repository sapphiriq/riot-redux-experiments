import { injectStore } from './middleware';
import { createRouteHandler as _crh } from './util/route';
export let createRouteHandler = _crh;

export { changeRoute } from './actions';
export { buildNamedRoute, isCurrentRoute } from './util/namedRoutes';

export function injectStoreMiddleware(store) {
  return {
    path: '*',
    isMiddleware: true,
    handler: injectStore(store),
  };
}

export function addRoutes(routes, fn, isServer) {
  routes.forEach((routeConfig) => {
    let { path } = routeConfig;
    let routeHandler = createRouteHandler(routeConfig, isServer);
    fn(path, routeHandler);
  });
}
