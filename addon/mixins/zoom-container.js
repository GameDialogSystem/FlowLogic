import Mixin from '@ember/object/mixin';
import Ember from 'ember';

/**
* Adds a scroll property to an arbitraty ember object. The mixin defines four
* important values: minZoomLevel to control the minimum zoom level available
* to choose, maxZoomLevel for the maximum zoom level, currentZoomLevel representing
* the zoom level currently choosen by the user and zoomStepSize to define
* the step size how the zoom level will change by an increment or decrement
* step
*
* @mixin ZoomContainer
*/
export default Mixin.create({
  minZoomLevel: 0,
  maxZoomLevel: 400,
  currentZoomLevel: 100,
  zoomStepSize: 5,

  didInsertElement() {
    this._super(...arguments);

    Ember.$(this.element).bind('mousewheel', (e) => {
      this.scrolledEvent(e);
    });
  },

  scrolledEvent(e) {
    e.preventDefault();


    const zoomStepSize = this.zoomStepSize;
    if (e.originalEvent.wheelDelta / 120 > 0) {
      if (this.currentZoomLevel < this.maxZoomLevel) {
        this.incrementProperty('currentZoomLevel', zoomStepSize);
      }
    } else {
      if (this.currentZoomLevel > this.minZoomLevel) {
        this.decrementProperty('currentZoomLevel', zoomStepSize);
      }
    }
  }
});
