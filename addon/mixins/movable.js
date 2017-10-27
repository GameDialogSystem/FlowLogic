import Ember from 'ember';
import { computed } from '@ember/object';

export default Ember.Mixin.create({
  moveStart : false,

  _mouseOffsetX: 0,
  _mouseOffsetY: 0,

  mouseMoveListener: null,
  mouseUpListener : null,

  gridSize : 10,

  position: { x : 0, y : 0 },

  mouseDown: function(e){
    if(e.button == 0){
      this.set('moveStart', true);

      let offset = Ember.$(this.element).offset();
      this.set('_mouseOffsetX', e.clientX-offset.left);
      this.set('_mouseOffsetY', e.clientY-offset.top);

      var self = this;
      this.set('mouseMoveListener', function(e){
        self.mouseMove(e);
      });

      this.set('mouseUpListener', function(e){
        self.mouseUp(e);
      })

      document.addEventListener('mousemove', this.get('mouseMoveListener'));
      document.addEventListener('mouseup', this.get('mouseUpListener'));
    }else if(e.button == 2){
      e.preventDefault();

    }
  },

  getScaledCoordinate(coordinate){
    let gridSize = this.get('gridSize');
    return (Math.floor(coordinate / gridSize) * gridSize);
  },

  mouseMove: function(e){
    if(this.get('moveStart')){
      this.set('customLayouted', true);

      let parentOffset = Ember.$(this.element).parent().offset();
      let x = this.getScaledCoordinate(e.clientX - this.get('_mouseOffsetX') - parentOffset.left);
      let y = this.getScaledCoordinate(e.clientY - this.get('_mouseOffsetY') - parentOffset.top);

      this.set('position', {x: x, y: y});
    }
  },

  mouseUp: function(){
    if(this.get('moveStart')){
      this.set('moveStart', false);
      document.removeEventListener('mousemove', this.get('mouseMoveListener'));
      document.removeEventListener('mouseup', this.get('mouseUpListener'));
    }
  }
});
