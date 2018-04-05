import Ember from 'ember';
import MultiselectionContainerMixin from 'flow-logic/mixins/multiselection-container';
import { module, test } from 'qunit';

module('Unit | Mixin | multiselection container');

// Replace this with your real tests.
test('it works', function(assert) {
  let MultiselectionContainerObject = Ember.Object.extend(MultiselectionContainerMixin);
  let subject = MultiselectionContainerObject.create();
  assert.ok(subject);
});
