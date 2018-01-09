import Ember from 'ember';
import MovableMixin from 'flow-logic/mixins/movable';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import triggerEvent from 'ember-native-dom-helpers';

module('Unit | Mixin | Integration | Component | movable');

// Replace this with your real tests.
test('it works', function(assert) {
  let MovableObject = Ember.Object.extend(MovableMixin);
  let subject = MovableObject.create();
  assert.ok(subject);
});

['mousedown'].forEach((event) => {
  test(`check if drag start is set on mouse down at ${event} event`, async function(assert){
    let MovableObject = Ember.Object.extend(MovableMixin);
    let subject = MovableObject.create();

    this.render(hbs`{{flow-element}}`);

    await triggerEvent('', event);

    assert.ok(subject.get("moveStart"), true);
  })
})
