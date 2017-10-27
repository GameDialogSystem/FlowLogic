import Ember from 'ember';
import layout from '../templates/components/curve-editor';

export default Ember.Component.extend({
  layout,

  tagName: 'svg',

  attributeBindings: ['id', 'width', 'height', 'viewBox', 'xmlns', 'version'],

  id: 'svg',

  width: 1680,

  height: 1000,

  viewBox: '0 0 1680 1000',

  xmlns: 'http://www.w3.org/2000/svg',

  version: '1.1',

  x: 0,
  y: 0,

  path: 'M10 80 Q 52.5 10, 95 80 T 150 150',

  didInsertElement: function(){
    console.log("Guinea Pig");

    let self = this;
    this.element.onmousemove = function(e){
      self.set('x', e.clientX);
      self.set('y', e.clientY);
    }
  }
});
