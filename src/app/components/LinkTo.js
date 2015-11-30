import { createComponent } from '../utils';
import riot from 'riot';

let updateParentClass = (tag, parentNode) => {
  try {
    let routerState = tag.store.getState().router;
    let currentPath = tag.linkTo(routerState.name, routerState.params, routerState.query);
    let isCurrentRoute = (currentPath == tag.path);

    // getAttribute is for server-side rendering
    let parentClassName = (parentNode.getAttribute('class') || '').split(' ');
    let activeClassIdx = parentClassName.indexOf('is-active');
    let hasActiveClass = activeClassIdx !== -1;
    if (isCurrentRoute && !hasActiveClass) {
      parentNode.setAttribute('class', [].concat(parentClassName, 'is-active').join(' '));
    } else if (!isCurrentRoute && hasActiveClass) {
      parentClassName.splice(activeClassIdx, 1);
      parentNode.setAttribute('class', parentClassName.join(' '));
    }
  } catch (e) {
    console.error('error:', e);
  }
};

createComponent('a', `<yield></yield>`, {
  attrs: false,
  init(opts) {
    if (!opts.path) return;
    this.path = opts.path;
    this.on('mount', () => {
      this.root.removeAttribute('path');
      this.root.setAttribute('href', this.path);
      let parentNode = this.root.parentNode;
      let nodeWithClass = (parentNode.nodeName == 'LI') ? parentNode : this.root;
      updateParentClass(this, nodeWithClass);
      let unsubscribe = this.store.subscribe(() => {
        updateParentClass(this, nodeWithClass);
      });
      this.on('unmount', () => {
        unsubscribe();
      });
    });
  },
}
);

createComponent('link-to', `<a href="{ path }"><yield></yield></a>`, function(opts) {
  if (opts.path) {
    this.path = opts.path;
  } else {
    this.path = this.linkTo(opts.name, opts.params, opts.query);
  }

  this.on('mount', () => {
    let parentNode = this.root.parentNode;
    if (parentNode.nodeName == 'LI') {
      updateParentClass(this, parentNode);
      let unsubscribe = this.store.subscribe(() => {
        updateParentClass(this, parentNode);
      });

      // TODO: Unmount is probably broken in riot. Need to check later
      this.on('unmount', () => {
        unsubscribe();
      });
    }

  });

});
