import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import * as Qs from 'qs';
import { API_REQUEST } from '../constants';
import fetch from 'isomorphic-fetch';
import assign from 'lodash/object/assign';

const API_ROOT = 'http://localhost:3000/api/';
const ARRAY_KEYS = {
  todos: 'todos',
};
const MODEL_KEYS = {
  todos: 'todo',
};

let defaultFetchParams = {
  credentials: 'same-origin',
  method: 'get',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

function callAPI(endpoint, schema, params = {}) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
  let fetchParams = assign({}, defaultFetchParams, params);

  if (params.json) {
    fetchParams.body = JSON.stringify(params.json);
  }

  if (fetchParams.body && !params.method) {
    fetchParams.method = 'post';
  }

  return fetch(fullUrl, fetchParams)
      .then(response =>
        response.json().then(json => ({ json, response }))
      ).then(({ json, response }) => {
        if (!response.ok) {
          return Promise.reject(json);
        }

        let key = (schema._itemSchema)
            ? ARRAY_KEYS[schema._itemSchema._key]
            : MODEL_KEYS[schema._key];

        const nextPageUrl = json.meta && json.meta.nextPageUrl;
        const camelizedJson = camelizeKeys(json[key]);
        if (camelizedJson) {
          return assign({},
            normalize(camelizedJson, schema),
            { nextPageUrl }
          );
        } else {
          return json;
        }
      }).catch(err => {
        console.error('Request failed:', err);
        throw err;
      });
}

const todoSchema = new Schema('todos', { idAttribute: 'id' });
export const Schemas = {
  TODO: todoSchema,
  TODO_ARRAY: arrayOf(todoSchema),
};

export default function apiMiddleware({ dispatch, getState }) {
  console.log('Middleware injected: API');
  return (next) => (action) => {
    if (action.type != API_REQUEST) {
      return next(action);
    }

    let { endpoint } = action.payload;
    const { schema, query, params, types } = action.payload;

    let qs = Qs.stringify(query, { encode: true, skipNulls: true });
    let endpointURL = endpoint + (qs ? '?' + qs : '');

    function actionWith(data) {
      const finalAction = assign({}, { meta: action.meta }, data);
      return finalAction;
    }

    let [fetchingType, successType, failureType] = action.payload.types;
    next(actionWith({ type: fetchingType }));

    return callAPI(endpointURL, schema, params)
      .then(
        data => next(actionWith({
          type: successType,
          payload: data,
        })),
        error => next(actionWith({
          type: failureType,
          error: error.message || 'Something bad happened',
        }))
      ).catch((err) => {
        console.error('API Catch:', err.stack);
      });
  };
}
