import Ember from 'ember';
import BrowserScrollingMixin from 'flow-logic/mixins/browser-scrolling';
import { module, test } from 'qunit';

module('Unit | Mixin | browser scrolling');

// Replace this with your real tests.
test('it works', function(assert) {
  let BrowserScrollingObject = Ember.Object.extend(BrowserScrollingMixin);
  let subject = BrowserScrollingObject.create();
  assert.ok(subject);
});
