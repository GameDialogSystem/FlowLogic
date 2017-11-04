import Ember from 'ember';
import layout from '../templates/components/flow-output';
import ConnectorMixin from '../mixins/connector';

export default Ember.Component.extend(ConnectorMixin, {
  layout,

  tagName: 'flow-output',

  rerouting: false,

  classNameBindings: ['connected'],

  connected: Ember.computed('model.input', function(){
    return (this.get('model.input').content != null);
  }),



  mouseMove: function(e){
    let point = this.getCenteredPosition();

    if(this.get('moveStart')){
      this.get('reroute')(point, this.getCorrectMousePosition(e));
    }
  },

  contextMenu() {
    return false;
  },

  mouseUp : function(e){
    e.preventDefault();
    if(this.get('moveStart')){
      this._super(e);

      this.get('connectToNewBlock')(this.get('model'), this.getCorrectMousePosition(e));
    }
  },
});
