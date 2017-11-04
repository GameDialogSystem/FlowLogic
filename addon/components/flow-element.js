import Ember from 'ember';
import MovableMixin from '../mixins/movable';
import layout from '../templates/components/flow-element';

export default Ember.Component.extend(MovableMixin, {
  layout,

  tagName: 'flow-element',

  /**
   * set tabindex to 1 in order to receive keyevents on this component
   * to allow deletion by pressing the DELETE button
   */
  attributeBindings: ['tabindex'],

  tabindex: '1',

  actions: {
    acceptRerouting: function(){

    },

    cancelReroute: function(output, point){
      this.get('cancelReroute')(output, point);
    },
  },

  /**
   * Update the position in the model in case the element was dragged to a
   * new position.
   */
  mouseMove: function(e){
    this._super(e);

    if(this.get('moveStart')){
      let scrollOffsetX = this.get('scrollOffsetX');
      let scrollOffsetY = this.get('scrollOffsetY');

      let model = this.get('model');
      model.set('x', this.get('position').x - scrollOffsetX);
      model.set('y', this.get('position').y - scrollOffsetY);
    };
  },

  /**
   * Update the position of the DOM element each time the model position
   * was changed.
   */
  positionChanged: Ember.observer('model.x', 'model.y', 'scrollOffsetX', 'scrollOffsetY', function(){
    let scrollOffsetX = this.get('scrollOffsetX');
    let scrollOffsetY = this.get('scrollOffsetY');

    Ember.$(this.element).css('left', `${this.get('model.x') + scrollOffsetX}px`);
    Ember.$(this.element).css('top', `${this.get('model.y') + scrollOffsetY}px`);
  }),

  /**
   * Overwrite the custom behaviour in order to hide the context menu in case
   * the right mouse button was pressed.
   */
  contextMenu: function(){
    return false;
  },

  /**
   * Respond to keypress events to allow the deletion of the element
   * by pressing the DELETE button.
   */
  keyPress: function(e){
    let deleteBlock = this.get('deleteBlock');

    if(e.keyCode === 127 && (deleteBlock !== null || deleteBlock !== undefined)){
      deleteBlock(this.get('model'));
    }
  },

  /**
   * Change the position of the DOM element to the saved position from the model
   * each time the element is inserted for the first time to the DOM.
   */
  didInsertElement: function(){
    let x = this.get('model').get('x');
    let y = this.get('model').get('y');

    let element = Ember.$(this.element);
    element.css('left', x + 'px');
    element.css('top', y + 'px');

    this.set('position', { 'x': x, 'y': y});
  }
});
