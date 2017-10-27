import Ember from 'ember';
import ConnectorMixin from 'flow-logic/mixins/connector';
import { module, test } from 'qunit';

module('Unit | Mixin | connector');

// Replace this with your real tests.
test('it works', function(assert) {
  let ConnectorObject = Ember.Object.extend(ConnectorMixin);
  let subject = ConnectorObject.create();
  assert.ok(subject);
});
