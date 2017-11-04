
import Ember from 'ember';
import RSVP from 'rsvp';
import layout from '../templates/components/flow-container';
import { observer } from '@ember/object';

/**
* Renders a container component where all flow blocks are displayed.
* Also all connections are rendered within this container.
*/
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

    /**
     * action will triggered if the user reroutes a connection to the container
     * and not to a new connection point, a new block will be added to the
     * container. Specify the method that modifies model and adds the new block
     * in the route class or controller.
     */
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

  /**
   * calculates the offset caused by scrolling and sets the value to the
   * attributes scrollOffsetX and scrollOffsetY to make the values publicly
   * available to other components
   */
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

  /**
   * disables the scroll mode and sets the current scroll offset to a fixed
   * value.
   */
  mouseUp: function(e){
    this.set('scrollModeEnabled', false);

    this.set('currentScrollOffsetX', this.get('scrollOffsetX'));
    this.set('currentScrollOffsetY', this.get('scrollOffsetY'));
  }
});
