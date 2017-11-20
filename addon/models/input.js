import Model from 'ember-data/model';
import DS from 'ember-data';
import Point from './point';

export default Point.extend({
  output: DS.belongsTo('output'),

  belongsTo: DS.belongsTo('block'),
});
