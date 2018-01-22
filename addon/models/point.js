import Model from 'ember-data/model';
import DS from 'ember-data';

export default Model.extend({
  x: DS.attr('number'),
  y: DS.attr('number')
});
