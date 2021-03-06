import Ember from 'ember';
import StraightConnection from './flow-straight-connection';
import layout from '../templates/components/flow-connection';

/**
* A component that displays the connection between two elements with a curve.
* The component is rendered as an SVG path so make sure to place it in a SVG
* container. Otherwise it will not be displayed.
*
* @module
* @augments Ember/Component
*/
export default StraightConnection.extend({
  layout,

  /**
   * Set the svg type to path in order to render curves as connections
   *
   * @constant
   * @type {string}
   */
  tagName: 'path',

  /**
  * Controls if the connection should be animated or not. This currently works
  * only in Chromium. Disabling animations is necessary in case the user
  * choose a custom layout to avoid a delay of the connection rendering
  *
  * @type {boolean}
  */
  isAnimated: false,

  /**
   * binds the isAnimated property to a class name to enable/disable animation
   * of connections. Animation of svg pathes works only within chrome
   *
   * @constant
   * @type {string[]}
   */
  classNameBindings: ['isAnimated:transition:no-transition'],

  /**
   * bind ember attributes to the element to change the visual presentation
   * dynamically
   *
   * @constant
   * @type {string[]}
   */
  attributeBindings: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke'],

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
   * Computes the form of the path that will be displayed to the user
   *
   * @returns {string}
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
   * didUpdateAttrs - This event is used to check if start and end point are
   * properly defined and if so the isAnimated property will be set to true
   * to enable the animation of connection lines after relayouting an block
   *
   * @event
   * @return {undefined}
   */
  didUpdateAttrs() {
    this._super(...arguments);

    const sx = this.startX !== undefined;
    const sy = this.startY !== undefined;
    const ex = this.endX !== undefined;
    const ey = this.endY !== undefined;

    const self = this;
    if(sx && sy && ex && ey){
      setTimeout(() => {
        self.set('isAnimated', true);
      }, 0)
    }
  },
});
