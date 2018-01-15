
import Ember from 'ember';
import ScrollingMixin from '../mixins/scrolling';
import MovableContainerMixin from '../mixins/movable-container';
import layout from '../templates/components/flow-container';


/**
* Renders a container component where all flow blocks are displayed.
* Also all connections are rendered within this container.
*/
export default Ember.Component.extend(ScrollingMixin, MovableContainerMixin, {
  layout,

  tagName: 'flow-container',

  offsetX : Ember.computed("scrollOffsetX", "relocateOffsetX", function(){
    const scrollOffsetX = this.get("scrollOffsetX");
    const relocateOffsetX = this.get("relocateOffsetX");

    if(scrollOffsetX === undefined && relocateOffsetX === undefined){
      return 0;
    }

    if(scrollOffsetX === undefined && relocateOffsetX !== undefined){
      return relocateOffsetX;
    }

    if(scrollOffsetX !== undefined && relocateOffsetX === undefined){
      return scrollOffsetX;
    }

    if(scrollOffsetX !== undefined && relocateOffsetX !== undefined){
      return scrollOffsetX + relocateOffsetX;
    }
  }),


  offsetY : Ember.computed("scrollOffsetY", "relocateOffsetY", function(){
    const scrollOffsetY = this.get("scrollOffsetY");
    const relocateOffsetY = this.get("relocateOffsetY");

    if(scrollOffsetY === undefined && relocateOffsetY === undefined){
      return 0;
    }

    if(scrollOffsetY === undefined && relocateOffsetY !== undefined){
      return relocateOffsetY;
    }

    if(scrollOffsetY !== undefined && relocateOffsetY === undefined){
      return scrollOffsetY;
    }

    if(scrollOffsetY !== undefined && relocateOffsetY !== undefined){
      return scrollOffsetY + relocateOffsetY;
    }
  }),

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
    }
  },
});
