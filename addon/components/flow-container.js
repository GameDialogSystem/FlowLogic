
import Ember from 'ember';
import ScrollingMixin from '../mixins/scrolling';
import MovableContainerMixin from '../mixins/movable-container';
import layout from '../templates/components/flow-container';


import { once } from '@ember/runloop';

/**
* Renders a container component where all flow blocks are displayed.
* Also all connections are rendered within this container.
*/
export default Ember.Component.extend(ScrollingMixin, MovableContainerMixin, {
  layout,

  tagName: 'flow-container',

  scrollLeft: 0,
  scrollTop: 0,


  /**
   * viewbox - Computes a string that is used as a property to describe the
   * viewbox used by the svg element to display connections between nodes.
   *
   * @param  {number} 'scrollLeft' left scrolling offset in case the user scrolls
   * to the left. Only positive integer values are valid.
   * @param  {number} 'scrollTop'  top scrolling offset in case the user scrolls
   * down. Only positive integer values are valid.
   * @param  {number} 'width'      the width of the parent element is used to
   * describe the viewing size horizontally
   * @param  {number} 'height'     the height of the parent element is used to
   * describe the viewing size vertically
   * @return {string}            A string in the form of scrollLeft scrollTop
   * width height e.g. 0 0 1920 1080
   */
  viewbox: Ember.computed('scrollLeft', 'scrollTop', 'width', 'height', function() {
    const scrollLeft = 0; //this.get('scrollLeft');
    const scrollTop = this.get('scrollTop');
    const width = Ember.$(this.element).get(0).scrollWidth;
    const height = Ember.$(this.element).height();

    return Ember.String.htmlSafe(`${scrollLeft} ${scrollTop} ${width} ${height}`);
  }),


  /**
   * svgSize - Computes the size for the actual DOM element of the svg element.
   * This needs to be computed dynamically each time the parent size changed in
   * order to preserve the correct desciption of the svg content
   *
   * @param  {number} 'width'      the width of the parent element is used to
   * describe the element size horizontally
   * @param  {number} 'height'     the height of the parent element is used to
   * describe the element size vertically
   * @return {string}            A string in the form of width height
   * e.g. 1920 1080
   */
  svgSize: Ember.computed('width', 'height', function() {
    return Ember.String.htmlSafe(`width:${this.get('width')}; height:${this.get("height")}}`);
  }),

  relayouted : Ember.observer("blocks.@each.x", function(){
    const self = this;

// TODO get rid of the ugly workaround with the timeout
    setTimeout(function () {
      const element = Ember.$(self.element).get(0);

      self.set("width", element.scrollWidth);
      self.set("height", element.scrollHeight);
    }, 1000);
  }),

  didInsertElement: function() {
    const self = this;

    this._super(...arguments);

    Ember.$(this.element).scroll(function() {
      self.set("scrollLeft", Ember.$(this).scrollLeft());
    });
  },

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
     *
     * @param {FlowElement} block - the block that the user want to remove
     * from the model
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
     *
     * @param {Output} output - end of the connection that is connected to the
     * rerouting connection.
     * @param {Point} point - the coordinates where the user released the mouse
     * or touch to create a new connected block to the connection
     */
    cancelReroute: function(output, point){
      this.set('showReconnector', false);

      this.get('onAddNewElement')(output, point);
    },

    handleScroll: function(scrollOffset, event){
      this.set("offsetY", scrollOffset);
    },
  },
});
