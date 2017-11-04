
import Ember from 'ember';
import RSVP from 'rsvp';
import layout from '../templates/components/flow-container';
import { observer } from '@ember/object';

export default Ember.Component.extend({
  layout,

  tagName: 'flow-container',

  scrollModeEnabled : false,
  scrollStartPositionX : null,
  scrollStartPositionY : null,

  scrollOffsetX : 0,
  scrollOffsetY : 0,

  currentScrollOffsetX : 0,
  currentScrollOffsetY : 0,

  actions: {
    reroute: function(start, end){
      this.set('showReconnector', true);
      this.set('start', start);
      this.set('end', end);
    },

    /**
     * Use this function to add a block to the model. Overwrite this function
     * to customize the behaviour.
     *
     * @param {Output} output - the outgoing pin where the action was initialized
     * @param {Point} point - the position where the mouse button was released and
     * the new block should be inserted
     */
    connectToNewBlock: function(output, point){
      let connectToNewBlock = this.get('connectToNewBlock');

      if(connectToNewBlock !== null){
        this.set('showReconnector', false);
        connectToNewBlock(output, point);
      }
    },

    /**
     * deletes the block from the container and all related connections
     * to this element.
     */
    deleteBlock: function(block){
      let deleteBlock = this.get('deleteBlock');

      if(deleteBlock !== null || deleteBlock !== undefined){
        deleteBlock(block);
      }
    },

    cancelReroute: function(output, point){
      this.set('showReconnector', false);

      this.get('onAddNewElement')(output, point);
    },
  },

  /**
   * Handle the mouse down action to enable scrolling with the middle
   * mouse button
   */
  mouseDown: function(e){
    // pressed mouse button was the middle mouse button
    if(e.button == 1){
      this.set('scrollModeEnabled', true);
      this.set('scrollStartPositionX', e.clientX);
      this.set('scrollStartPositionY', e.clientY);
    }
  },

  mouseMove: function(e){
    if(this.get('scrollModeEnabled') === true){
      let x = e.clientX;
      let y = e.clientY;

      let scrollStartX = this.get('scrollStartPositionX');
      let scrollStartY = this.get('scrollStartPositionY');

      Ember.run.schedule('afterRender', this, function(){
        this.set('scrollOffsetX', x-scrollStartX + this.get('currentScrollOffsetX'));
        this.set('scrollOffsetY', y-scrollStartY + this.get('currentScrollOffsetY'));
      });
    }
  },

  mouseUp: function(e){
    this.set('scrollModeEnabled', false);

    this.set('currentScrollOffsetX', this.get('scrollOffsetX'));
    this.set('currentScrollOffsetY', this.get('scrollOffsetY'));
  }
});
