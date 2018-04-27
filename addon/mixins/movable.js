import Ember from 'ember';

/**
* Provides methods to make a component movable by using drag and drop.
* Use this only for components
*
* @mixin
*/
export default Ember.Mixin.create({
  /**
   * property to indicate that the user has started to move the element on the
   * DOM canvas
   */
  moveStart : false,

  /**
   * saves the mouse offset x coordinate
   */
  mouseOffsetX: 0,

  /**
   * saves the mouse offset y coordinate
   */
  mouseOffsetY: 0,

  /**
   * reference to a mouse move listener to react to mouse events that happens
   * outside of the element that uses this mixin
   */
  mouseMoveListener: null,

  /**
   * reference to a mouse up listener to react to mouse events that happens
   * outside of the element that uses this mixin
   */
  mouseUpListener : null,

  /**
   * Defines a grid size that will be used for calculation the position.
   * Set this value in your component to 1 in order to disable the grid
   */
  gridSize : 5,

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
   * @param  {object} e contains the mouse event as an object
   */
  mouseDown(e){
    this._super(...arguments);

    if(e.button == 0 && e.target.tagName !== "TEXTAREA"){
      this.set('moveStart', true);

      const element = Ember.$(this.element);
      const offset = element.offset();
      this.set('mouseOffsetX', e.clientX - offset.left + element.scrollLeft());
      this.set('mouseOffsetY', e.clientY - offset.top + element.scrollTop());

      const position = element.position();
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
  },

  handleConnectionAnimations: Ember.observer('customLayouted', function() {
    const element = Ember.$(this.element);
    const enabled = !this.get('customLayouted');

    Ember.$(element.parents("flow-container")
    .children("svg")[0])
    .children("path")
    .each(function(index, object){
      if(enabled){
        Ember.$(object).addClass("transition");
      }else{
        Ember.$(object).removeClass("transition")
      }
    })
  }),

  /**
   * mouseMove - moving an element is caused by moving the mouse while in
   * state "moveStart".
   *
   * @param  {object} e contains the mouse event as an object
   */
  mouseMove(e){
    this._super(...arguments);

    if(this.get('moveStart') && e.target.tagName !== "TEXTAREA"){
      this.set('customLayouted', true);

      const element = Ember.$(this.element);

      const parentOffset = element.parent().offset();
      const x = this.getScaledCoordinate(e.clientX - this.get('mouseOffsetX') - parentOffset.left);
      const y = this.getScaledCoordinate(e.clientY - this.get('mouseOffsetY') - parentOffset.top);

      //const position = element.position();
      const elementMovedEvent = this.get("onElementMoved");

      const offset = {
        "x" : x, // - position.left + element.scrollLeft(),
        "y" : y //- position.top + element.scrollTop()
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
   * @param  {object} e contains the mouse event as an object
   */
  mouseUp(e){
    this._super(...arguments);

    if(this.get('moveStart') && e.target.tagName !== "TEXTAREA"){
      this.set('moveStart', false);
      this.set('customLayouted', false);

      document.removeEventListener('mousemove', this.get('mouseMoveListener'));
      document.removeEventListener('mouseup', this.get('mouseUpListener'));

      // prevent bubbling in case the user started moving the component
      // and therefore the mouse up action is handled only by the mixin
      return false;
    }
  }
});
