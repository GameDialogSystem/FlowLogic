import DS from 'ember-data';
import Point from './point';

import LayoutableMixin from '../mixins/layoutable';

export default Point.extend(LayoutableMixin, {
  // allow object oriented programming by setting it to polymorphic
  inputs: DS.hasMany('input', { polymorphic: true }),
  outputs: DS.hasMany('output', { polymorphic: true }),

  belongsTo: DS.belongsTo('flow-element')
});
