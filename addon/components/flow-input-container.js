import Ember from 'ember';
import layout from '../templates/components/flow-input-container';

export default Ember.Component.extend({
  layout,

  tagName: 'flow-input-container',

  actions: {
    acceptRerouting: function(target){
      this.get('acceptRerouting')(target);
    },

    cancelReroute: function(){
      this.get('cancelReroute')();
    }
  }
});
