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

test('', function(assert) {
  const someThing = this.subject();
  someThing.set('positionX', 0);
  assert.equal($(someThing.element).css("left"), "0px");

  someThing.set('positionY', 0);
  assert.equal($(someThing.element).css("top"), "0px");
})
