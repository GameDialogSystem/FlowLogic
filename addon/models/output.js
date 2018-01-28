import DS from 'ember-data';
import { computed } from '@ember/object';
import Point from './point';

/**
 * Represents an output pin for a block that can be connnected by a connection.
 * @see {@link Block}
 * @see {@link Connection}
 */
export default Point.extend({
  connection: DS.belongsTo('connection'),

  belongsTo: DS.belongsTo('block'),


  /**
   * isConnected - Computes if a output is connected by a connection to a
   * input pin
   *
   * @return{boolean} True in case the output is connected, False otherwise
   */
  isConnected: computed('connection', function(){
    return this.get('connection.content') !== null;
  })
});
