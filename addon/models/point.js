import Model from 'ember-data/model';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default Model.extend({
  x: DS.attr('number'),
  y: DS.attr('number'),
});
