import Ember from 'ember';
import layout from '../templates/components/flow-connection';

/**
* A component that displays the connection between two elements with a curve.
* The component is rendered as an SVG path so make sure to place it in a SVG
* container. Otherwise it will not be displayed.
*/
export default Ember.Component.extend({
  layout,

  tagName: 'path',
  //tagName: 'line',

  attributeBindings: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap'], //, 'startX:x1', 'startY:y1', 'endX:x2', 'endY:y2'],
  startX: -1,
  startY: -1,
  endX: -1,
  endY: -1,

  offsetX: 0,
  offsetY: 0,

  /**
   * Computes the form of the path that will be displayed to the user
   */

  d: Ember.computed('startX', 'startY', 'endX', 'endY',
                    'offsetX', 'offsetY', function(){
    const offsetX = this.get('offsetX');
    const offsetY = this.get('offsetY');

    const startX = this.get('startX') + offsetX;
    const startY = this.get('startY') - offsetY;

    const endX = this.get('endX') + offsetX;
    const endY = this.get('endY') - offsetY;

    const cX = startX;
    const cY = endY;

    const dX = endX;
    const dY = startY;

    if(isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY))
      return `M0,0 C0,0 0,0 0,0`;

    return `M${startX},${startY} C${cX},${cY} ${dX},${dY} ${endX},${endY}`;
  }),


  fill: 'none',

  stroke: '#78909C',

  'stroke-width': '4',

  'stroke-linecap': 'round'
});
