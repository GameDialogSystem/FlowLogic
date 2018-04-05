import Ember from 'ember';
import layout from '../templates/components/flow-connection';

/**
* A component that displays the connection between two elements with a curve.
* The component is rendered as an SVG path so make sure to place it in a SVG
* container. Otherwise it will not be displayed.
*/
export default Ember.Component.extend({
  layout,

  /**
   * Set the svg type to path in order to render curves as connections
   */
  tagName: 'path',

  /**
  * Controls if the connection should be animated or not. This currently works
  * only in Chromium. Disabling animations is necessary in case the user
  * choose a custom layout to avoid a delay of the connection rendering
  */
  isAnimated: true,

  classNameBindings: ['isAnimated:transition:no-transition'],

  /**
   * bind ember attributes to the element to change the visual presentation
   * dynamically
   */
  attributeBindings: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap'],

  /**
   * X coordinate of the starting point. Usually this is an output of a block
   */
  startX: -1,

  /**
   * Y coordinate of the starting point. Usually this is an output of a block
   */
  startY: -1,

  /**
   * X coordinate of the end point. Usually this is an input of a block
   */
  endX: -1,

  /**
   * Y coordinate of the end point. Usually this is an input of a block
   */
  endY: -1,


  /**
   * Computes the form of the path that will be displayed to the user
   */
  d: Ember.computed('startX', 'startY', 'endX', 'endY', function(){
    const startX = this.get('startX') - 10;
    const startY = this.get('startY');

    const endX = this.get('endX') - 10;
    const endY = this.get('endY');

    const cX = startX;
    const cY = endY;

    const dX = endX;
    const dY = startY;

    // return an "empty" string in case there is an error with one of the values
    // this prevents the svg element to render broken connection lines
    if(isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY))
      return `M0,0 C0,0 0,0 0,0`;

    return `M${startX},${startY} C${cX},${cY} ${dX},${dY} ${endX},${endY}`;
  }),

  /**
   * Disable fill for stroke lines
   */
  fill: 'none',

  /**
   * Sets the width for the stroke line
   */
  'stroke-width': '4',

  /**
   * Sets the linecap to round. Line endings are rendered round with this
   * attribute
   */
  'stroke-linecap': 'round'
});
