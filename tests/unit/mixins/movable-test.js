import Ember from 'ember';
import MovableMixin from 'flow-logic/mixins/movable';
import { module, test } from 'qunit';

module('Unit | Mixin | movable');

// Replace this with your real tests.
test('it works', function(assert) {
  let MovableObject = Ember.Object.extend(MovableMixin);
  let subject = MovableObject.create();
  assert.ok(subject);
});
