import EmberObject from '@ember/object';
import ZoomContainerMixin from 'flow-logic/mixins/zoom-container';
import { module, test } from 'qunit';

module('Unit | Mixin | zoom-container', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ZoomContainerObject = EmberObject.extend(ZoomContainerMixin);
    let subject = ZoomContainerObject.create();
    assert.ok(subject);
  });
});
