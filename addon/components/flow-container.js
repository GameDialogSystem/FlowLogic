import Ember from 'ember';
import RSVP from 'rsvp';
import layout from '../templates/components/flow-container';
import { observer } from '@ember/object';

export default Ember.Component.extend({
  layout,

  tagName: 'flow-container',

  actions: {
    reroute: function(start, end){
      this.set('showReconnector', true);
      this.set('start', start);
      this.set('end', end);
    },

    cancelReroute: function(output, point){
      this.set('showReconnector', false);

      this.get('onAddNewElement')(output, point);
    },
  }
});
