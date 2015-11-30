import { createSelector } from 'reselect';

let selectTodosIds = (state) => {
  return state.todos && state.todos.ids;
};

let selectTodosEntities = (state) => state.entities.todos;

export let selectTodos = createSelector(
  selectTodosIds,
  selectTodosEntities,
  (ids, entities) => {
    return ids && ids.map(id => entities[id]) || [];
  }
);
