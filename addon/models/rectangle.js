import DS from 'ember-data';
import Point from './point';

/**
 * Extends the Point model to create a model representation of rectangle
 */
export default Point.extend({
  width: DS.attr('number'),
  height: DS.attr('number')
});
