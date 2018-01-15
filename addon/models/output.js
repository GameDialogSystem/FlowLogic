import DS from 'ember-data';
import { computed } from '@ember/object';
import Point from './point';

export default Point.extend({
  connection: DS.belongsTo('connection'),

  belongsTo: DS.belongsTo('block'),

  isConnected: computed('connection', function(){
    return this.get('connection.content') !== null;
  })
});
