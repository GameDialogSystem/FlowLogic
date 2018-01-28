import Model from 'ember-data/model';
import DS from 'ember-data';


/**
 * Model to represents simple 2D points. These are normally used to define
 * coordinates of elements.
 */
export default Model.extend({
  x: DS.attr('number'),
  y: DS.attr('number')
});
