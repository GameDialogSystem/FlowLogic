import Ember from 'ember';
//import { computed } from '@ember/object';

/**
* Provides methods to make a component movable by using drag and drop.
* Use this only for components
*
* @mixin
*/
export default Ember.Mixin.create({
  moveStart : false,

  mouseOffsetX: 0,
  mouseOffsetY: 0,

  mouseMoveListener: null,
  mouseUpListener : null,

  /**
   * Defines a grid size that will be used for calculation the position.
   * Set this value in your component to 1 in order to disable the grid
   */
  gridSize : 5,

  positionX: 0,
  positionY: 0,

  p : Ember.observer("positionX", "positionY", function(){
    Ember.$(this.element).css("left", this.get("positionX"));
    Ember.$(this.element).css("top", this.get("positionY"));
  }),


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

    this._super(e);

    if(e.button == 0){
      this.set('moveStart', true);

      const offset = Ember.$(this.element).offset();
      this.set('mouseOffsetX', e.clientX-offset.left);
      this.set('mouseOffsetY', e.clientY-offset.top);

      const position = Ember.$(this.element).position();
      this.set("oldPosition", {"x": position.left, "y": position.top});

      const self = this;
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
    if(this.get('moveStart')){
      this.set('customLayouted', true);

      const parentOffset = Ember.$(this.element).parent().offset();
      const x = this.getScaledCoordinate(e.clientX - this.get('mouseOffsetX') - parentOffset.left);
      const y = this.getScaledCoordinate(e.clientY - this.get('mouseOffsetY') - parentOffset.top);

      const position = Ember.$(this.element).position();
      const elementMovedEvent = this.get("onElementMoved");

      const offset = {
        "x" : x - position.left,
        "y" : y - position.top
      }

      if(typeof elementMovedEvent === "function"){
        elementMovedEvent(offset, this);
      }

      return false;
    }
  },


  /**
   * mouseUp - reset the "moveStart" flag after releasing the pressed mouse
   * button to stop moving an element
   *
   * @return {type}  description
   */
  mouseUp: function(e){
    this._super(...arguments);

    e.preventDefault();

    if(this.get('moveStart')){
      this.set('moveStart', false);

      document.removeEventListener('mousemove', this.get('mouseMoveListener'));
      document.removeEventListener('mouseup', this.get('mouseUpListener'));

      // prevent bubbling in case the user started moving the component
      // and therefore the mouse up action is handled only by the mixin
      return false;
    }
  }
});
