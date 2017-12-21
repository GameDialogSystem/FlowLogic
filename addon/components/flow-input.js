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

  /**
   * returns if the input connector is connected with an output connector
   * or not.
   *
   * @returns {boolean} If connected with an output connector, this will
   * return true, otherwise false will be returned
   */
  connected: Ember.computed('model.connection', function(){
    return (this.get('model.connection').content != null);
  }),
});
