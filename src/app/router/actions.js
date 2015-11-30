import assign from 'lodash/object/assign';
import { ROUTE_CHANGED, CHANGE_ROUTE } from './constants';

export function routeChanged(path = '/', params = {}, query = {}, name) {
  [ path ] = path.split('?');
  params = assign({}, params);
  delete params['0'];
  return {
    type: ROUTE_CHANGED,
    payload: { path, params, query, name },
  };
}

export function changeRoute(name, params = {}, query = {}) {
  params = assign({}, params);
  return {
    type: CHANGE_ROUTE,
    payload: { params, query, name },
  };
}
