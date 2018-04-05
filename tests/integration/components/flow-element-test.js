import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module('Integration | Component | style', function(hooks) {
  setupRenderingTest(hooks);


  hooks.beforeEach(function() {
    this.layout = EmberObject.create({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    })
  });

  test('correct style calculation', async function(assert) {
    assert.expect(5);

    await render(hbs`{{flow-element model=layout}}`);

    assert.equal(this.element.querySelector('flow-element').getAttribute('style'), `left: ${0}px; top: ${0}px; width: ${0}px; min-height: ${0}px`);

    this.set("layout.x", 100);
    assert.equal(this.element.querySelector('flow-element').getAttribute('style'), `left: ${100}px; top: ${0}px; width: ${0}px; min-height: ${0}px`);

    this.set("layout.y", 100);
    assert.equal(this.element.querySelector('flow-element').getAttribute('style'), `left: ${100}px; top: ${100}px; width: ${0}px; min-height: ${0}px`);

    this.set("layout.width", 200);
    assert.equal(this.element.querySelector('flow-element').getAttribute('style'), `left: ${100}px; top: ${100}px; width: ${200}px; min-height: ${0}px`);

    this.set("layout.height", 200);
    assert.equal(this.element.querySelector('flow-element').getAttribute('style'), `left: ${100}px; top: ${100}px; width: ${200}px; min-height: ${200}px`);
  });
});
