import Ember from 'ember';
import MovableContainerMixin from 'flow-logic/mixins/movable-container';
import { module, test } from 'qunit';

module('Unit | Mixin | movable container');

// Replace this with your real tests.
test('it works', function(assert) {
  let MovableContainerObject = Ember.Object.extend(MovableContainerMixin);
  let subject = MovableContainerObject.create();
  assert.ok(subject);
});
