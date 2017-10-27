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
    let x = e.clientX;
    let y = e.clientY;

    if(this.get('moveStart')){
      this.get('reroute')(point, { 'x': x, 'y': y });
    }
  },

  mouseUp : function(e){
    if(this.get('moveStart')){
      this._super(e);

      this.get('cancelReroute')(this.get('model'), {'x': e.clientX, 'y': e.clientY});
    }
  }
});
