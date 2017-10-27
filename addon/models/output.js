import Model from 'ember-data/model';
import DS from 'ember-data';
import Point from './point';

export default Point.extend({
  input: DS.belongsTo('input')
});
