import { createComponent } from '../utils';
import { rehydrate } from '../actions';

createComponent('state-sidebar', `<div class="state-sidebar">
  <h1>Redux State</h1>
  <button class="blue-button" type="button" onclick="{ saveState }">Save state</button>
  <button class="blue-button" type="button" onclick="{ rehydrate }">Rehydrate</button>
  <br>
  <textarea name="lastState" id="lastStateTextarea" cols="80" rows="40">{ lastState }</textarea>
</div>`, {

  mapStateToProps: (state) => ({
    currenState: state,
  }),

  mapDispatchToProps(dispatch) {
    return {
      rehydrate() {
        try {
          var json = JSON.parse(this.lastStateTextarea.value);
          dispatch(rehydrate(json));
        } catch (e) {
          console.error(e);
          alert('Can\'t parse JSON');
        }
      },
    };
  },

  init(opts) {

    this.saveState = () => {
      this.lastStateTextarea.value = JSON.stringify(this.store.getState(), null, 2);
    };

    this.on('mount', () => {
      this.saveState();
    });

  },
});
