import { loadTodos } from './actions';

import {
  TODOS_FETCH_FAILURE,
  TODOS_FETCH_SUCCESS,
} from './constants';

export function getRoutes(context) {
  return [
    {
      name: 'home',
      path: '/',
      waitFor: [[TODOS_FETCH_SUCCESS, TODOS_FETCH_FAILURE]],
      handler: (req, next) => {
        req.store.dispatch(loadTodos());
        next();
      },
    }, {
      name: 'program',
      path: '/programs/:programId',
    }, {
      path: '/about',
    },
  ];
};
