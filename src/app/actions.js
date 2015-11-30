import {
  API_REQUEST,
  ROUTE_CHANGED,
  REHYDRATE,
  WAIT_FOR,
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
  TODOS_FETCH_REQUESTED,
  TODOS_FETCH_SUCCESS,
  TODOS_FETCH_FAILURE,
  TODOS_CREATE_REQUESTED,
  TODOS_CREATE_SUCCESS,
  TODOS_CREATE_FAILURE,
  TODOS_UPDATE_REQUESTED,
  TODOS_UPDATE_SUCCESS,
  TODOS_UPDATE_FAILURE,
  TODOS_DELETE_REQUESTED,
  TODOS_DELETE_SUCCESS,
  TODOS_DELETE_FAILURE,
} from './constants';
import { Schemas } from './middleware/api';

export function incrementCounter() {
  return { type: INCREMENT_COUNTER };
}

export function decrementCounter() {
  return { type: DECREMENT_COUNTER };
}

export function waitFor(actions) {
  return {
    type: WAIT_FOR,
    payload: actions,
  };
}

export function fetchTodos() {
  return {
    type: API_REQUEST,
    payload: {
      endpoint: 'todos',
      schema: Schemas.TODO_ARRAY,
      query: { limit: 10 },
      types: [
        TODOS_FETCH_REQUESTED,
        TODOS_FETCH_SUCCESS,
        TODOS_FETCH_FAILURE,
      ],
    },
  };
}

export function loadTodos() {
  return (dispatch, getState) => {
    const todos = getState().todos.wasFetched;
    if (todos) {
      return null;
    }

    return dispatch(fetchTodos());
  };
}

export function createTodo(title) {
  return {
    type: API_REQUEST,
    payload: {
      endpoint: 'todos',
      schema: Schemas.TODO,
      params: {
        json: { title, done: false },
      },
      types: [
        TODOS_CREATE_REQUESTED,
        TODOS_CREATE_SUCCESS,
        TODOS_CREATE_FAILURE,
      ],
    },
  };
}

export function deleteTodo(id) {
  return {
    type: API_REQUEST,
    meta: { id },
    payload: {
      endpoint: `todos/${id}`,
      schema: Schemas.TODO,
      params: {
        method: 'delete',
      },
      types: [
        TODOS_DELETE_REQUESTED,
        TODOS_DELETE_SUCCESS,
        TODOS_DELETE_FAILURE,
      ],
    },
  };
}

export function markTodoAsDone(id, val = true) {
  return {
    type: API_REQUEST,
    meta: { id },
    payload: {
      endpoint: `todos/${id}`,
      schema: Schemas.TODO,
      params: {
        method: 'put',
        json: { done: val },
      },
      types: [
        TODOS_UPDATE_REQUESTED,
        TODOS_UPDATE_SUCCESS,
        TODOS_UPDATE_FAILURE,
      ],
    },
  };
}

export function rehydrate(state) {
  return {
    type: REHYDRATE,
    payload: state,
  };
}
