import Ember from 'ember';
import layout from '../templates/components/multi-selection';

import BrowserScrolling from '../mixins/browser-scrolling';

export default Ember.Component.extend(BrowserScrolling, {
  layout,

  tagName: 'multi-selection',

  startX : null,
  startY : null,

  endX : null,
  endY : null,

  selectionModeEnabled: false,

  selectionRectangle : {"x": 0, "y": 0, "width": 0, "height": 0},

  mouseMoveListener: null,
  mouseUpListener : null,


  selectionChanged: Ember.observer("startX", "startY", "endX", "endY", function(){
    const startX = this.get("startX");
    const startY = this.get("startY");

    const endX = this.get("endX");
    const endY = this.get("endY");

    const negativeEndX = (endX < startX);
    const negativeEndY = (endY < startY);

    this.set("selection", {
      "x" : negativeEndX ? endX : startX,
      "y" : negativeEndY ? endY : startY,
      "width": negativeEndX ? (startX - endX) : (endX - startX),
      "height": negativeEndY ? (startY - endY) : (endY - startY)
    });
  }),


  /**
   * scrollingOffsetChanged - Observer that is called each time the scrolling
   * offset of the browser window is changed. This is mostly done by the user
   * scrolling.
   *
   * @param  {type} "scrollOffset.left" description
   * @param  {type} "scrollOffset.top"  description
   */
  scrollingOffsetChanged: Ember.observer("scrollOffset.left", "scrollOffset.top", function(){
    //const left = this.get("scrollOffset.left");
    //const top = this.get("scrollOffset.top");

    const endX = this.get("endX");
    const endY = this.get("endY");

    // only update the selection handler if there was a change of the selection
    if(endX !== null || endY !== null){
        this.updateSelectionHandlerGeometry(this.get("endX"), this.get("endY"));
    }
  }),


  /**
   * updateSelectionHandlerGeometry - Changes the geometry e.g. width and/or height
   * of the selection indicator to the current mouse position.
   *
   * @param  {type} mouseX description
   * @param  {type} mouseY description
   * @return {type}        description
   */
  updateSelectionHandlerGeometry: function(mouseX, mouseY){
    // verify that mouseX coordinate is a number
    if(mouseX === null || mouseX === undefined || typeof mouseX !== "number"){
      throw new TypeError(`mouse position x is not a number. Its actual value is ${mouseX}`);
    }

    // verify that mouseY coordinate is a number
    if(mouseY === null || mouseY === undefined || typeof mouseY !== "number"){
      throw new TypeError(`mouse position y is not a number. Its actual value is ${mouseY}`);
    }

    // only update in case selection mode is enabled
    if(this.get("selectionModeEnabled")){
      // the start position of the selection indicator
      const startX = this.get("startX");
      const startY = this.get("startY");

      const element = Ember.$(this.element);
      const elementOffsetX = element.offset().left;
      const elementOffsetY = element.offset().top;

      // save the end position of the selection handler to the
      // current mouse position
      this.set("endX", mouseX - elementOffsetX);
      this.set("endY", mouseY - elementOffsetY);

      // end position of the selection handler
      const endX = this.get("endX");
      const endY = this.get("endY");

      // switch x coordinates in case the end coordinate is smaller than the
      // start coordinate
      const negativeEndX = (endX < startX);
      const negativeEndY = (endY < startY);

      // get scroll offset object from the browser scrolling mixin
      // to respond to scroll events
      const scrollOffsetStart = this.get("scrollOffsetStart");
      const scrollOffsetStartLeft = scrollOffsetStart.left;
      const scrollOffsetStartTop = scrollOffsetStart.top;

      const scrollOffset = this.getScrollOffset();
      const scrollOffsetLeft = scrollOffset.left;
      const scrollOffsetTop = scrollOffset.top;

      const scrollDifferenceWidth = Math.abs(scrollOffsetLeft - scrollOffsetStartLeft);
      const scrollDifferenceHeight = Math.abs(scrollOffsetTop - scrollOffsetStartTop);

      // calculate the final position based on scrolling offset,
      // moving the selection handle etc.
      const finalPositionX = (negativeEndX ? endX : startX) + scrollOffsetStartLeft;
      const finalPositionY = (negativeEndY ? endY : startY) + scrollOffsetStartTop;

      // the selection indicator element
      const selectionIndicator = Ember.$(this.element).find(".flow-selection-indicator");

      // reposition the selection indicator and change the size of it
      selectionIndicator
      .css("left", finalPositionX)
      .css("top", finalPositionY)
      .width(negativeEndX ? (startX - endX) : (endX - startX) + scrollDifferenceWidth)
      .height(negativeEndY ? (startY - endY) : (endY - startY) + scrollDifferenceHeight)  - elementOffsetY;

      this.set("endX", endX);
      this.set("endY", endY);

      // set selection object to inform child views that a selection was
      // successfully created
      //
      this.set("selectionRectangle", {
        "x": finalPositionX,
        "y": finalPositionY,
        "width": selectionIndicator.width(),
        "height": selectionIndicator.height()
      })
    }
  },

/*
  mouseDown: function(e){
    const self = this;

    this._super(...arguments);

    if(e.button === 0){
      const element = Ember.$(this.element);

      this.set("startX", e.clientX - element.offset().left);
      this.set("startY", e.clientY - element.offset().top);
      this.set("selectionModeEnabled", true);

      this.set("scrollOffsetStart", this.getScrollOffset());

      this.set('mouseMoveListener', function(e){
        self.mouseMove(e);
      })

      this.set('mouseUpListener', function(e){
        self.mouseUp(e);
      });

      Ember.$(this.element).find(".flow-selection-indicator").show();

      document.addEventListener('mousemove', this.get('mouseMoveListener'));
      document.addEventListener('mouseup', this.get('mouseUpListener'));
    }
  },

  mouseMove: function(e){
    e.preventDefault();

    this.updateSelectionHandlerGeometry(e.clientX, e.clientY);
  },

  mouseUp: function(e){
    this._super(...arguments);

    const element = Ember.$(this.element);

    element.find(".flow-selection-indicator").hide();

    document.removeEventListener('mousemove', this.get('mouseMoveListener'));
    document.removeEventListener('mouseup', this.get('mouseUpListener'));

    this.set("selectionModeEnabled", false);

    const selectionIndicator = Ember.$(this.element).find(".flow-selection-indicator");

    const selectionRectangle = this.get("selectionRectangle");


    const mouseX = e.clientX - element.offset().left;
    const mouseY = e.clientY - element.offset().top;

    if(selectionRectangle.width < 20 && selectionRectangle.height < 20 ||
       this.get("startX") === mouseX && this.get("startY") === mouseY){

      // set selection rectangle to empty in order to clear previously selected
      // elements
      this.set("selectionRectangle", {
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0
      });
    }

    // reposition the selection indicator and change the size of it
    selectionIndicator
    .css("left", 0)
    .css("top", 0)
    .width(0)
    .height(0);
  }
*/
});
