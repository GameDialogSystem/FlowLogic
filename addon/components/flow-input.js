import Ember from 'ember';
import layout from '../templates/components/flow-input';
import ConnectorMixin from '../mixins/connector';

export default Ember.Component.extend(ConnectorMixin, {
  layout,

  tagName: 'flow-input',

  rerouting: false,

  classNameBindings: ['connected'],

  connected: Ember.computed('model.output', function(){
    return (this.get('model.output').content != null);
  }),
});
