import Ember from 'ember';
import ZoomMixin from 'flow-logic/mixins/zoom';
import { module, test } from 'qunit';

module('Unit | Mixin | zoom');

// Replace this with your real tests.
test('it works', function(assert) {
  let ZoomObject = Ember.Object.extend(ZoomMixin);
  let subject = ZoomObject.create();
  assert.ok(subject);
});
