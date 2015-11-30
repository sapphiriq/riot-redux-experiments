import { createComponent } from '../utils';

export default createComponent('check-mark', `
  <span class="green" if="{ opts.val }">✔︎</span>
  <span class="red" if="{ !opts.val }">✕</span>
`);
