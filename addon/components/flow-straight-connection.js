import Component from '@ember/component';
import layout from '../templates/components/flow-straight-connection';

export default Component.extend({
  layout,

  /**
   * Set the svg type to path in order to render curves as connections
   *
   * @constant
   * @type {string}
   */
  tagName: 'line',

  /**
   * Disable fill for stroke lines
   *
   * @type {string}
   */
  fill: 'none',

  /**
  * The color of the connection
  *
  */
  stroke: 'black',

  /**
   * Sets the width for the stroke line
   *
   * @type {number}
   */
  'stroke-width': 1,

  /**
   * Sets the linecap to round. Line endings are rendered round with this
   * attribute
   *
   * @type {string}
   */
  'stroke-linecap': 'round',

  /**
   * X coordinate of the starting point. Usually this is an output of a block
   *
   * @type {number}
   */
  startX: -1,

  /**
   * Y coordinate of the starting point. Usually this is an output of a block
   *
   * @type {number}
   */
  startY: -1,

  /**
   * X coordinate of the end point. Usually this is an input of a block
   *
   * @type {number}
   */
  endX: -1,

  /**
   * Y coordinate of the end point. Usually this is an input of a block
   *
   * @type {number}
   */
  endY: -1,

  /**
   * bind ember attributes to the element to change the visual presentation
   * dynamically
   *
   * @constant
   * @type {string[]}
   */
  attributeBindings: ['startX:x1', 'startY:y1', 'endX:x2', 'endY:y2', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke'],
});
