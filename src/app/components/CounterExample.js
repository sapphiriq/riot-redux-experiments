import { createComponent } from '../utils';
import { incrementCounter, decrementCounter } from '../actions';

export default createComponent('counter-example', `
  <h1>Counter:</h1>
  <button onclick="{ incrementCounter }">+</button>
  <span style="font-size: 24px;">{ counter }</span>
  <button onclick="{ decrementCounter }">-</button>
`, {

  attrs: 'class="counter-example box"',

  mapStateToProps: (state) => ({
    counter: state.counter,
  }),

  mapDispatchToProps: (dispatch) => ({
    incrementCounter() {
      dispatch(incrementCounter());
    },

    decrementCounter() {
      dispatch(decrementCounter());
    },
  }),

});
