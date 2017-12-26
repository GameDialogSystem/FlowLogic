import Ember from 'ember';
import { computed } from '@ember/object';

/**
* Provides methods to make a component movable by using drag and drop.
* Use this only for components
*
* @mixin
*/
export default Ember.Mixin.create({
  moveStart : false,

  _mouseOffsetX: 0,
  _mouseOffsetY: 0,

  mouseMoveListener: null,
  mouseUpListener : null,

  /**
   * Defines a grid size that will be used for calculation the position.
   * Set this value in your component to 1 in order to disable the grid
   */
  gridSize : 10,

  position: { x : 0, y : 0 },

  /**
   * converts an absolute position to a grid based position.
   * Always use this function to read the component position
   * to prevent bypassing the grid attribute.
   *
   * @param {number} coordinate - the coordinate value that will be converted
   */
  getScaledCoordinate(coordinate){
    let gridSize = this.get('gridSize');
    return (Math.floor(coordinate / gridSize) * gridSize);
  },

  /**
   * mouseDown - handle the mouse down event. To move an element
   * the movable state is set during this event.
   *
   * @param  {type} e description
   * @return {type}   description
   */
  mouseDown: function(e){
    e.preventDefault();

    if(e.button == 0){
      this.set('moveStart', true);

      let offset = Ember.$(this.element).offset();
      this.set('_mouseOffsetX', e.clientX-offset.left);
      this.set('_mouseOffsetY', e.clientY-offset.top);

      var self = this;
      this.set('mouseMoveListener', function(e){
        self.mouseMove(e);
      });

      this.set('mouseUpListener', function(e){
        self.mouseUp(e);
      })

      document.addEventListener('mousemove', this.get('mouseMoveListener'));
      document.addEventListener('mouseup', this.get('mouseUpListener'));
    }

    return false;
  },


  /**
   * mouseMove - moving an element is caused by moving the mouse while in
   * state "moveStart".
   *
   * @param  {type} e description
   * @return {type}   description
   */
  mouseMove: function(e){
    e.preventDefault();

    if(this.get('moveStart')){
      this.set('customLayouted', true);

      let parentOffset = Ember.$(this.element).parent().offset();
      let x = this.getScaledCoordinate(e.clientX - this.get('_mouseOffsetX') - parentOffset.left);
      let y = this.getScaledCoordinate(e.clientY - this.get('_mouseOffsetY') - parentOffset.top);

      this.set('position', {x: x, y: y});
    }

    return false;
  },


  /**
   * mouseUp - reset the "moveStart" flag after releasing the pressed mouse
   * button to stop moving an element
   *
   * @return {type}  description
   */
  mouseUp: function(e){
    e.preventDefault();

    if(this.get('moveStart')){
      this.set('moveStart', false);
      document.removeEventListener('mousemove', this.get('mouseMoveListener'));
      document.removeEventListener('mouseup', this.get('mouseUpListener'));
    }

    return false;
  }
});
