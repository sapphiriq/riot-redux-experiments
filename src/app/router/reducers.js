import assign from 'lodash/object/assign';
import filter from 'lodash/collection/filter';
import { ROUTE_CHANGED, WAIT_FOR } from './constants';

// Router reducer
export function routerReducer() {
  let initialState = {
    path: '/',
    params: {},
    query: {},
    name: '',
  };

  return (state = initialState, action) => {
    switch (action.type) {
      case ROUTE_CHANGED:
        return assign({}, state, {
          path: action.payload.path,
          params: action.payload.params,
          query: action.payload.query,
          name: action.payload.name,
        });

      default:
        return state;
    }
  };
}

// WaitFor reducer
// Pass an array to wait for one of its values
//
// example: {
//   type: 'WAIT_FOR',
//   payload: [
//     'USER_FETCHED',
//     ['POST_FETCH_SUCCESS', 'POST_FETCH_FAILURE']
//   ]
// }
export function waitForReducer() {
  return (state = [], action) => {
    switch (action.type) {
      case WAIT_FOR:
        console.log('\x1B[33m[WAIT_FOR:add]\x1B[39m', action.payload);
        return [].concat(state, action.payload);

      default:
        return filter(state, (x) => {
          var res;
          if (typeof x == 'string') {
            res = x == action.type;
          } else {
            res = x.indexOf(action.type) !== -1;
          }

          if (res) {
            console.log('\x1B[33m[WAIT_FOR:completed] ' + action.type + '\x1B[39m', x);
          }

          return !res;
        });
    }
  };
}
