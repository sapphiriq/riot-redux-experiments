import riot from 'riot';
import assign from 'lodash/object/assign';
import any from 'lodash/collection/any';
import isEqual from 'lodash/lang/isEqual';

import { buildNamedRoute as linkTo, isCurrentRoute } from '../router';

export function createComponent(tag, html, ctrlOrConfig = {}) {
  var ctrl;
  var config;
  if (typeof ctrlOrConfig === 'function') {
    config = {};
    ctrl = ctrlOrConfig;
  } else {
    config = ctrlOrConfig;
    ctrl = config.init;
  }

  config.css || (config.css = '');
  if (config.attrs == null) {
    config.attrs = 'class="' + tag + '"';
  }

  return riot.tag(tag, html, config.css, config.attrs, function(opts) {
    if (this.parent && this.parent.store) {
      this.store = this.parent.store;
      this.isCurrent = this.parent.isCurrent;
    } else if (this.parent && this.parent.parent && this.parent.parent.store) {
      this.store = this.parent.parent.store;
      this.isCurrent = this.parent.parent.isCurrent;
    } else {
      this.store = opts.store;
      this.isCurrent = isCurrentRoute(this.store);
    }

    this.linkTo = linkTo;

    if (typeof config.mapStateToProps === 'function' || typeof config.mapDispatchToProps === 'function') {
      this.mixin(connect(config.mapStateToProps, config.mapDispatchToProps));
    }

    if (typeof ctrl === 'function') {
      ctrl.call(this, opts);
    }
  });
}

export function connect(mapStateToProps, mapDispatchToProps) {
  return {
    init: function() {

      if (mapDispatchToProps) {
        assign(this, mapDispatchToProps(this.store.dispatch));
      }

      if (!mapStateToProps) {
        return;
      }

      this.on('mount', () => {
        this.update(mapStateToProps.call(this, this.store.getState()));

        // I don't sure about always updating all components on route change
        // this.router = this.store.getState().router;
        let unsubscribe = this.store.subscribe(() => {
          try {
            let currentState = this.store.getState();
            let newProps = mapStateToProps.call(this, currentState);

            // newProps.router = currentState.router;
            if (true || this.hasChangedProps(newProps)) {
              this.update(newProps);
            }
          } catch (e) {
            console.error('Error:', e);
          }
        });
        this.on('unmount', () => {
          // unsubscribe();
        });
      });
    },

    hasChangedProps: function(props) {
      return any(props, (val, key) => !isEqual(this[key], val));
    },
  };
}

export function createConstants(...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}

export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer ? reducer(state, action) : state;
  };
}
