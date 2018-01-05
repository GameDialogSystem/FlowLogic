import DS from 'ember-data';
import Point from './point';

export default Point.extend({
  // allow object oriented programming by setting it to polymorphic
  inputs: DS.hasMany('input', { polymorphic: true }),
  outputs: DS.hasMany('output', { polymorphic: true }),

  belongsTo: DS.belongsTo('flow-element')
});
