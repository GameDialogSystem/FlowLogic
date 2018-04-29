import Ember from 'ember';
import layout from '../templates/components/multi-selection';

/**
 * Component that allows the user to select multiple elements at the same time.
 * The component calculates an area defined by the users mouse movement and clicks
 * that can be passed to child elements. Within the child elements you can check
 * if the child is inside the selection bounds or not. In this way the component
 * is very independent from children and can be used more freely.
 *
 * @module
 * @augments Ember/Component
 */
export default Ember.Component.extend({
  layout,

  tagName: 'multi-selection',

  // bind tabIndex to attribute in order to receive keypress events on the
  // element and react accordingly
  attributeBindings: ['tabIndex', 'style'],
  tabIndex: '0',

  startX: null,
  startY: null,

  endX: null,
  endY: null,

  selectionModeEnabled: false,

  selectionRectangle: {
    "x": 0,
    "y": 0,
    "width": 0,
    "height": 0
  },

  mouseMoveListener: null,
  mouseUpListener: null,


  /**
   * selectionChanged - Observes all changes of the selection bounding rectangle
   * and recalculates the selection attribute that stores this rectangle
   *
   * @param  {number} "startX"  the x coordinate of the top left corner of the
   * selection bounds
   * @param  {number} "startY"  the y coordinate of the top left corner of the
   * selection bounds
   * @param  {number} "endX"    the x coordinate of the bottom right corner of the
   * selection bounds
   * @param  {number} "endY"    the y coordinate of the bottom right corner of the
   * selection bounds
   */
  selectionChanged: Ember.observer("startX", "startY", "endX", "endY", function() {
    const startX = this.get("startX");
    const startY = this.get("startY");

    const endX = this.get("endX");
    const endY = this.get("endY");

    const negativeEndX = (endX < startX);
    const negativeEndY = (endY < startY);

    this.set("selection", {
      "x": negativeEndX ? endX : startX,
      "y": negativeEndY ? endY : startY,
      "width": negativeEndX ? (startX - endX) : (endX - startX),
      "height": negativeEndY ? (startY - endY) : (endY - startY)
    });
  }),


  /**
   * updateSelectionHandlerGeometry - Changes the geometry e.g. width and/or height
   * of the selection indicator to the current mouse position.
   *
   * @function
   * @param  {number} mouseX x coordinate of the mouse position
   * @param  {number} mouseY y coordinate of the mouse position
   * @returns {undefined}
   */
  updateSelectionHandlerGeometry(mouseX, mouseY) {
    // verify that mouseX coordinate is a number
    if (mouseX === null || mouseX === undefined || typeof mouseX !== "number") {
      throw new TypeError(`mouse position x is not a number. Its actual value is ${mouseX}`);
    }

    // verify that mouseY coordinate is a number
    if (mouseY === null || mouseY === undefined || typeof mouseY !== "number") {
      throw new TypeError(`mouse position y is not a number. Its actual value is ${mouseY}`);
    }

    // only update in case selection mode is enabled
    if (this.get("selectionModeEnabled")) {
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

      const scrollOffsetLeft = element.scrollLeft();
      const scrollOffsetTop = element.scrollTop();

      const scrollDifferenceWidth = 0; //Math.abs(scrollOffsetLeft - scrollOffsetStartLeft);
      const scrollDifferenceHeight = 0; //Math.abs(scrollOffsetTop - scrollOffsetStartTop);

      // calculate the final position based on scrolling offset,
      // moving the selection handle etc.
      const finalPositionX = (negativeEndX ? endX : startX) + scrollOffsetLeft;
      const finalPositionY = (negativeEndY ? endY : startY) + scrollOffsetTop;

      // the selection indicator element
      const selectionIndicator = Ember.$(this.element).find(".flow-selection-indicator");

      // reposition the selection indicator and change the size of it
      selectionIndicator
        .css("left", finalPositionX)
        .css("top", finalPositionY)
        .width(negativeEndX ? (startX - endX) : (endX - startX) + scrollDifferenceWidth)
        .height(negativeEndY ? (startY - endY) : (endY - startY) + scrollDifferenceHeight) - elementOffsetY;

      this.set("endX", endX);
      this.set("endY", endY);

      // set selection object to inform child views that a selection was
      // successfully created
      this.set("selectionRectangle", {
        "x": finalPositionX,
        "y": finalPositionY,
        "width": selectionIndicator.width(),
        "height": selectionIndicator.height()
      })
    }
  },


  /**
   * mouseDown - Handles the event if the user presses an arbitrary mouse button.
   * This function registers a mouse move listener and a mouse up listener to
   * the document to handle mouse movement outside the component. The up listener
   * is used to delete the registered listeners if the user releases the pressed
   * mouse button.
   * The function also triggers the selection indicator to be shown to visualize
   * the selection area.
   *
   * @param  {object} e the mouse event as defined by jQuery.
   * @return {undefined}
   */
  mouseDown(e) {
    this._super(e);

    // only process in case the user presses the mouse button on an empty spot
    // of the multi selection element
    if (e.target.tagName !== "MULTI-SELECTION") {
      return;
    }

    const self = this;

    // proceed in case the user pressed the left mouse button
    if (e.button === 0) {
      const element = Ember.$(this.element);

      this.set("startX", e.clientX - element.offset().left);
      this.set("startY", e.clientY - element.offset().top);
      this.set("selectionModeEnabled", true);

      this.set('mouseMoveListener', function(e) {
        self.mouseMove(e);
      })

      this.set('mouseUpListener', function(e) {
        self.mouseUp(e);
      });

      // show the selection handle rectangle to visualize the
      // user interaction
      Ember.$(this.element).find(".flow-selection-indicator").show();

      // add document event listener to react even if the mouse event is not
      // triggered within the bounding area of the element
      document.addEventListener('mousemove', this.get('mouseMoveListener'));
      document.addEventListener('mouseup', this.get('mouseUpListener'));
    }
  },


  /**
   * mouseMove - updates the selection indicator.
   *
   * @param  {object} e the mouse move event as defined by jQuery.
   * @return {undefined}
   */
  mouseMove(e) {
    this._super(e);
    e.preventDefault();

    this.updateSelectionHandlerGeometry(e.clientX, e.clientY);
  },


  /**
   * mouseUp - is fired after the pressed mouse buttons is released. The function
   * will hide the selection indicater and remove the mouse move and mouse up
   * listeners from the document. Also the selectionModeEnabled property will be
   * set to false.
   * If the selection rectangle is smaller then 20x20, it will be cropped to 0x0.
   *
   * @param  {object} e the mouse move event as defined by jQuery.
   * @return {undefined}
   */
  mouseUp(e) {
    this._super(e);

    const element = Ember.$(this.element);

    element.find(".flow-selection-indicator").hide();

    document.removeEventListener('mousemove', this.get('mouseMoveListener'));
    document.removeEventListener('mouseup', this.get('mouseUpListener'));

    this.set("selectionModeEnabled", false);

    const selectionIndicator = Ember.$(this.element).find(".flow-selection-indicator");

    const selectionRectangle = this.get("selectionRectangle");


    const mouseX = e.clientX - element.offset().left;
    const mouseY = e.clientY - element.offset().top;

    if (selectionRectangle.width < 20 && selectionRectangle.height < 20 ||
      this.get("startX") === mouseX && this.get("startY") === mouseY) {

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
});
