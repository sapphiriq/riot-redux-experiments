import AppHeader from '../components/AppHeader';
import LinkTo from '../components/LinkTo';
import TodosBox, { TodosItem } from '../components/Todos';
import CounterExample from '../components/CounterExample';
import CheckMark from '../components/CheckMark';
import StateSidebar from '../components/StateSidebar';

import mapKeys from 'lodash/object/mapKeys';
import keys from 'lodash/object/keys';
import assign from 'lodash/object/assign';
import { createComponent } from '../utils';
import { changeRoute } from '../router/actions';

createComponent('app-route', '<div if="{isVisible}"><yield></yield></div>', {
  mapStateToProps(state) {
    return {
      isVisible: state.router.path == this.opts.path,
    };
  },

  init(opts) {},
});

createComponent('page-home', `
  <h1>Home page</h1>
  <yield></yield>
  <todos-box></todos-box>
`);

export default createComponent('app', `
  <state-sidebar></state-sidebar>

  <div class="app-wrap">

    <app-header></app-header>

    <div class="app-content">

      <page-home if="{ isCurrent('home') }">
        <h2>Home subheader</h2>
      </page-home>

      <app-route path="/about">
        <h1>About page</h1>
        <h2>Counter from parent: { parent.counter }</h2>
      </app-route>

      <counter-example></counter-example>

      <ul if="{ isCurrent('home', {}, {menu: true}) }">
        <li><button onclick="{ gotoUtopia }">Go to Utopia</button></li>
        <li><link-to name="program" params="{{ programId: 315 }}" query="{ { limit: 10 } }">Go to program #315</link-to></li>
      </ul>

      <pre>router: { JSON.stringify(router, null, 4) }</pre>

      <p>
        Server: <check-mark val="{ opts.server }"></check-mark>
        <br />
        Browser: <check-mark val="{ opts.browser }"></check-mark>
      </p>

    </div>
  </div>
`, {

  mapStateToProps: (state) => ({
    counter: state.counter,
    router: state.router,
    programId: (state.router.params) && state.router.params.programId || null,
  }),

  init: function(opts) {

    this.gotoUtopia = () => {
      this.store.dispatch(changeRoute('program', { programId: 'killallhumans' }));
    };

  },
});
