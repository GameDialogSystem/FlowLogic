import Ember from 'ember';


/**
 * Mixin to allow scrolling within a container
 */
export default Ember.Mixin.create({
  scrollModeEnabled : false,
  scrollStartPositionX : 0,
  scrollStartPositionY : 0,

  scrollOffsetX : 0,
  scrollOffsetY : 0,

  currentScrollOffsetX : 0,
  currentScrollOffsetY : 0,

  /**
   * Handle the mouse down action to enable scrolling with the middle
   * mouse button
   */
  mouseDown: function(e){
    this._super(...arguments);

    // pressed mouse button was the middle mouse button
    if(e.button == 1){
      this.set('scrollModeEnabled', true);
      this.set('scrollStartPositionX', e.clientX);
      this.set('scrollStartPositionY', e.clientY);
    }
  },

  /**
   * calculates the offset caused by scrolling and sets the value to the
   * attributes scrollOffsetX and scrollOffsetY to make the values publicly
   * available to other components
   */
  mouseMove: function(e){
    this._super(...arguments);

    if(this.get('scrollModeEnabled') === true){
      let x = e.clientX;
      let y = e.clientY;

      let scrollStartX = this.get('scrollStartPositionX');
      let scrollStartY = this.get('scrollStartPositionY');

      Ember.run.schedule('afterRender', this, function(){
        this.set('scrollOffsetX', x-scrollStartX + this.get('currentScrollOffsetX'));
        this.set('scrollOffsetY', y-scrollStartY + this.get('currentScrollOffsetY'));
      });
    }
  },

  /**
   * disables the scroll mode and sets the current scroll offset to a fixed
   * value.
   */
  mouseUp: function(e){
    this._super(...arguments);

    this.set('scrollModeEnabled', false);

    this.set('currentScrollOffsetX', this.get('scrollOffsetX'));
    this.set('currentScrollOffsetY', this.get('scrollOffsetY'));
  },
});
