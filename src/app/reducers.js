import {
  REHYDRATE,
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
  TODOS_FETCH_REQUESTED,
  TODOS_FETCH_SUCCESS,
  TODOS_FETCH_FAILURE,
  TODOS_CREATE_SUCCESS,
  TODOS_DELETE_SUCCESS,
} from './constants';

import { combineReducers } from 'redux';
import { routerReducer, waitForReducer } from './router/reducers';
import { createReducer } from './utils';
import paginate from './utils/paginate';
import assign from 'lodash/object/assign';
import merge from 'lodash/object/merge';
import filter from 'lodash/collection/filter';

let waitFor = waitForReducer();
let router = routerReducer();

let counter = createReducer(42, {
  [INCREMENT_COUNTER]: (state, action) => {
    return state + 1;
  },

  [DECREMENT_COUNTER]: (state, action) => {
    return state - 1;
  },
});

let todos = (state = {
  wasFetched: false,
  isFetching: false,
  nextPageUrl: undefined,
  pageCount: 0,
  ids: [],
}, action) => {
  switch (action.type) {

    case TODOS_FETCH_REQUESTED:
      return assign({}, state, {
        isFetching: true,
      });

    case TODOS_FETCH_FAILURE:
      return assign({}, state, {
        isFetching: false,
        wasFetched: true,
      });

    case TODOS_FETCH_SUCCESS:
      return assign({}, state, {
        isFetching: false,
        wasFetched: true,
        ids: [].concat(state.ids, action.payload.result),
        pageCount: state.pageCount + 1,
      });

    case TODOS_CREATE_SUCCESS:
      console.log(state, action);
      return assign({}, state, {
        isFetching: false,
        ids: [].concat(state.ids, action.payload.result),
      });

    case TODOS_DELETE_SUCCESS:
      let newState = assign({}, state, {
        isFetching: false,
        ids: [].concat(filter(state.ids, id => id != action.meta.id)),
      });
      return newState;

    default:
      return state;
  }
};

function entities(state = { todos: {} }, action) {
  if (action.payload && action.payload.entities) {
    var res = merge({}, state, action.payload.entities);
    return res;
  }

  return state;
};

let rootReducer = combineReducers({
  waitFor,
  router,
  counter,
  entities,
  todos,
});

export default (state, action) => {
  if (action.type === REHYDRATE) {
    return rootReducer(action.payload, action);
  } else {
    return rootReducer(state, action);
  }
};
