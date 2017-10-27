import Model from 'ember-data/model';
import DS from 'ember-data';
import Point from './point';

export default Point.extend({
  inputs: DS.hasMany('input', { polymorphic: true }),
  outputs: DS.hasMany('output', { polymorphic: true })
});
