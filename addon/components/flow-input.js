import Ember from 'ember';
import layout from '../templates/components/flow-input';
import ConnectorMixin from '../mixins/connector';

/**
 * Connector that will be used to display an input pin on a block element.
 */
export default Ember.Component.extend(ConnectorMixin, {
  layout,

  tagName: 'flow-input',

  rerouting: false,

  classNameBindings: ['connected'],

});
