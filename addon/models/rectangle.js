import Model from 'ember-data/model';
import DS from 'ember-data';
import Point from './point';

export default Point.extend({
  width: DS.attr('number'),
  height: DS.attr('number')
});
