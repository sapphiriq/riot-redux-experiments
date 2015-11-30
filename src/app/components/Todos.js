import { createComponent } from '../utils';
import { selectTodos } from '../selectors/todos';
import { createTodo, deleteTodo, markTodoAsDone } from '../actions';

export default createComponent('todos-box', `
  <h1 class="todos-box__heading">ToDos</h1>
  <todos-list todos="{ todos }"></todos-list>
  <todos-form></todos-form>
`, {
  mapStateToProps: (state) => {
    return {
      todos: selectTodos(state),
    };
  },
});

export let TodosItem = createComponent('todos-item', `
  <label class="todos-item__label">
    <input onclick="{ onCheck }" type="checkbox" __checked="{ opts.todo.done }">
    <span class="todos-item__title">{ opts.todo.title }</span>
    <button onclick="{ onDelete }" class="todos-item__delete-button">&times;</button>
  </label>
`, {
  mapDispatchToProps: (dispatch) => ({
    onDelete() {
      dispatch(deleteTodo(this.opts.todo.id));
    },

    onCheck() {
      dispatch(markTodoAsDone(this.opts.todo.id, !this.opts.todo.done));
    },
  }),
});

export let TodosList = createComponent('todos-list', `
  <h2 class="todos-list__summary">total tasks to do: { opts.todos.length }</h2>
  <todos-item no-reorder each="{ opts.todos }" todo="{ this }"></todos-item>
`);

export let TodosForm = createComponent('todos-form', `
  <form class="todos-form__form" id="todosForm" onsubmit="{ onSubmit }">
    <input class="todos-form__input" type="text" name="title">
    <button class="todos-form__button" type="submit">Add todo</button>
  </form>
`, function todosFormCrtl(opts) {
  this.onSubmit = (e) => {
    let newTodoText = this.title.value;
    this.store.dispatch(createTodo(newTodoText));
    this.title.value = '';
  };
});
