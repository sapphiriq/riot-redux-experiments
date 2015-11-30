import { createComponent } from '../utils';
import './LinkTo';

export default createComponent('app-header', require('./AppHeader.tpl'), {

  mapStateToProps: (state) => ({
    // Some props
  }),

  init: function(opts) {
    this.homeLink = this.linkTo('home');
    this.linkToUtopiaProgram = this.linkTo('program', { programId: 'killallhumans' });
  },
});
