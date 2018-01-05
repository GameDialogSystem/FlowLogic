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

  attributeBindings: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap'],
  startX: -1,
  startY: -1,
  endX: -1,
  endY: -1,

  /**
   * Computes the form of the path that will be displayed to the user
   */
  d: Ember.computed('startX', 'startY', 'endX', 'endY', function(){
    //let index = this.get('index')-1;
    //let answersCount = this.get('start.answers.length');

    let startX = this.get('startX');
    let startY = this.get('startY');

    let endX = this.get('endX');
    let endY = this.get('endY');

    let cX = startX;
    let cY = endY;

    let dX = endX;
    let dY = startY;

    if(isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY))
      return `M0,0 C0,0 0,0 0,0`;

    return `M${startX},${startY} C${cX},${cY} ${dX},${dY} ${endX},${endY}`;
  }),

  fill: 'none',

  stroke: '#78909C',

  'stroke-width': '4',

  'stroke-linecap': 'round'
});
