import Model from 'ember-data/model';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default Model.extend({
  x: DS.attr('number', { defaultValue : 0 }),
  y: DS.attr('number', { defaultValue : 0 }),

  position: computed('x', 'y', function(){
    return {
      x: this.get('x'),
      y: this.get('y')
    }
  })
});
