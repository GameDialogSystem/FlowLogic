import Model from 'ember-data/model';
import DS from 'ember-data';

export default Model.extend({
  input: DS.belongsTo('input'),
  output: DS.belongsTo('output')
});
