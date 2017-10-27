import Ember from 'ember';
import MovableMixin from '../mixins/movable';
import layout from '../templates/components/flow-element';

export default Ember.Component.extend(MovableMixin, {
  layout,

  tagName: 'flow-element',

  actions: {
    reroute: function(start, end){
      this.get('reroute')(start, end);
    },

    acceptRerouting: function(){

    },

    cancelReroute: function(output, point){
      this.get('cancelReroute')(output, point);
    },
  },

  mouseMove: function(e){
    this._super(e);

    let model = this.get('model');
    model.set('x', this.get('position').x);
    model.set('y', this.get('position').y);
  },

  positionChanged: Ember.observer('model.x', 'model.y', function(){
    Ember.$(this.element).css('left', this.get('model.x') + 'px');
    Ember.$(this.element).css('top', this.get('model.y') + 'px');
  }),

  contextMenu: function(){
    return false;
  },

  didInsertElement: function(){
    let x = this.get('model').get('x');
    let y = this.get('model').get('y');

    Ember.$(this.element).css('left', x + 'px');
    Ember.$(this.element).css('top', y + 'px');

    this.set('position', { 'x': x, 'y': y});
  }
});
