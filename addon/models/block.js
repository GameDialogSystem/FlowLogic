import Model from 'ember-data/model';
import DS from 'ember-data';
import Point from './point';

export default Point.extend({
  // allow object oriented programming by setting it to polymorphic
  inputs: DS.hasMany('input', { polymorphic: true, async: false }),
  outputs: DS.hasMany('output', { polymorphic: true, async: false }),

  belongsTo: DS.belongsTo('flow-element')
});
