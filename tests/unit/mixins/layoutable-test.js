import Ember from 'ember';
import LayoutableMixin from 'flow-logic/mixins/layoutable';
import { module, test } from 'qunit';

module('Unit | Mixin | layoutable');

// Replace this with your real tests.
test('it works', function(assert) {
  let LayoutableObject = Ember.Object.extend(LayoutableMixin);
  let subject = LayoutableObject.create();
  assert.ok(subject);
});
