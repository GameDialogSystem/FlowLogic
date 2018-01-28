
import Ember from 'ember';
import ScrollingMixin from '../mixins/scrolling';
import MovableContainerMixin from '../mixins/movable-container';
import layout from '../templates/components/flow-container';


/**
 * Renders a container component where all flow blocks are displayed.
 * Also all connections are rendered within this container.
 *
 * @see {@link ScrollingMixin}
 * @see {@link MovableContainerMixin}
 */
export default Ember.Component.extend(ScrollingMixin, MovableContainerMixin, {
  layout,

  tagName: 'flow-container',

  /**
   * Scrolling offset horizontally caused by the user due to scrolling
   */
  scrollLeft: 0,


  /**
   * Scrolling offset vertically caused by the user due to scrolling
   */
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


  /**
   * relayouted - Observes all positional changes of single elements and adjusts
   * the size of the parent container element accordingly. This is needed
   * to set the correct size of the svg element and therefore the correct
   * rendering of all connections between elements
   *
   * @todo currently this method uses a very ugly workaround with a fixed
   * delay to set the size. This behaviour need to be changed to a more robust
   * and dynamically behaviour in order prevent timing issues on different
   * systems
   */
  relayouted : Ember.observer("blocks.@each.x", function(){
    const self = this;

    // TODO get rid of the ugly workaround with the timeout
     setTimeout(function () {
      const element = Ember.$(self.element).get(0);

      self.set("width", element.scrollWidth);
      self.set("height", element.scrollHeight);
    }, 1000);

  }),

  actions: {

    /**
     * reroute - Sets the showReconnector property to true to show a
     * connection to visualize the reconnection process. Also start and end
     * coordinates for the connection are set so that the connection is
     * displayed properly
     *
     * @param  {Point} start coordinates of the start point for the reconnection
     * connection. This is usually an output of a block
     * @param  {Point} end   coordinates of the end point for the reconnection
     * connection. This is usually an arbitrary point not related to any block
     */
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
  },
});
