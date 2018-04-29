import Ember from 'ember';


/**
 * Mixin to allow scrolling within a container
 *
 * @mixin Scrolling
 */
export default Ember.Mixin.create({
  /**
   * Property to toggle the scroll offset calculation via pressing the mouse
   * wheel button
   */
  scrollModeEnabled : false,


  /**
   * stores the x coordinate of the mouse cursor to calculate the difference
   * between current position and the position when the user entered the
   * scroll mode.
   */
  scrollStartPositionX : 0,


  /**
   * stores the y coordinate of the mouse cursor to calculate the difference
   * between current position and the position when the user entered the
   * scroll mode.
   */
  scrollStartPositionY : 0,


  /**
   * Handle the mouse down action to enable scrolling with the middle
   * mouse button
   */
  mouseDown(e){
    this._super(e);

    // pressed mouse button was the middle mouse button
    if(e.button == 1){
      this.set('scrollModeEnabled', true);
      const element = Ember.$(this.element);

      this.set('scrollStartPositionX', e.clientX);
      this.set('scrollStartPositionY', element.scrollTop() + e.clientY);
    }
  },


  /**
   * calculates the offset caused by scrolling and sets the value to the
   * attributes scrollOffsetX and scrollOffsetY to make the values publicly
   * available to other components
   */
  mouseMove(e){
    this._super(e);

    if(this.get('scrollModeEnabled') === true){
      const element = Ember.$(this.element);
      const x = e.clientX;
      const y = e.clientY;

      const scrollStartX = this.get('scrollStartPositionX');
      const scrollStartY = this.get('scrollStartPositionY');

      const differenceX = (x - scrollStartX) * 0.1;
      const differenceY = (y - scrollStartY) * 0.1;


      element.scrollLeft(element.scrollLeft() + differenceX);
      element.scrollTop(element.scrollTop() + differenceY);
    }
  },


  /**
   * disables the scroll mode and sets the current scroll offset to a fixed
   * value.
   */
  mouseUp(e){
    this._super(e);

    // leave scrolling mode in case the user released the mousewheel button
    if(e.button == 1){
      this.set('scrollModeEnabled', false);
    }
  },
});
