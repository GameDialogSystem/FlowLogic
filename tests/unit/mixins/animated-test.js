import Ember from 'ember';
import AnimatedMixin from 'flow-logic/mixins/animated';
import { module, test } from 'qunit';

module('Unit | Mixin | animated');

// Replace this with your real tests.
test('it works', function(assert) {
  let AnimatedObject = Ember.Object.extend(AnimatedMixin);
  let subject = AnimatedObject.create();
  assert.ok(subject);
});
