import Model from 'ember-data/model';
import DS from 'ember-data';


/**
 * Connection is a model representation to connect two blocks. Each connection
 * needs to have an input and an output connector.
 */
export default Model.extend({
  input: DS.belongsTo('input'),
  output: DS.belongsTo('output'),
});
