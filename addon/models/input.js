import DS from 'ember-data';
import Point from './point';


/**
 * Represents an input pin for a block that can be connnected by a connection.
 * @see {@link Block}
 * @see {@link Connection}
 */
export default Point.extend({
  connection: DS.belongsTo('connection'),

  belongsTo: DS.belongsTo('block'),
});
