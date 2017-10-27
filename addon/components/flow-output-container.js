import Ember from 'ember';
import layout from '../templates/components/flow-output-container';

export default Ember.Component.extend({
  layout,

  tagName: 'flow-output-container',

  actions: {
    acceptRerouting: function(target){
      this.get('acceptRerouting')(target);
    },

    cancelReroute: function(){
      this.get('cancelReroute')();
    }
  }
});
