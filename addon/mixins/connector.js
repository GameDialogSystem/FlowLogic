import Ember from 'ember';
import AnimatedMixin from './animated';


/**
* Implements functionality needed for the connectors of two elements.
* This mixin might change in future to an own component so please be aware of
* this.
*
* @mixin
*/
export default Ember.Mixin.create({
  offsetX: null,
  offsetY: null,

  init() {
    this._super(...arguments);

    // for each dialog line an empty output is generated and has the status
    // loaded.created.uncommited. Therefore the state name will not change
    // and the isLoaded observer is not triggered. Therefore we trigger
    // it at this position so that the output model has the correct coordinates
    if(this.get("model.currentState.stateName") === "root.loaded.created.uncommitted"){

    }
  },

  /**
   * isLoaded - Observer that listens for the model state. In case that
   * the model has the state "root.loaded.saved" the model was fully loaded
   * and the width and height can be set by the DOM element geometry.
   */
  isLoaded: Ember.observer("model.currentState.stateName", function(){

    if(this.get("model.currentState.stateName") === "root.loaded.saved"){
      const point = this.getCenteredPosition();

      this.get('model').set('x', point.x);
      this.get('model').set('y', point.y);
    }
  }),


  /**
   * Returns the offset of the parent element as an object.
   * The object has the form {left: x, top: x}.
   */
  getParentOffset: function(){
    return Ember.$(this.element).parent().offset();
  },


  /**
   * Gets the size of the parent element and returns this as an object.
   * The object has the form {width: x, height: x}.
   */
  getParentSize: function(){
    let element = Ember.$(this.element);
    let parent = element.parent();

    return {width: parent.width(), height: parent.height()};
  },


  /**
   * Calculates the margin to the parent element based on the actual position
   * within the DOM.
   */
  getMarginOfElement: function(){
    let element = Ember.$(this.element);

    let offset = element.offset();
    let parentOffset = this.getParentOffset();
    let parentSize = this.getParentSize();

    return {
      left: offset.left - parentOffset.left,
      top: offset.top - parentOffset.top,
      right: (offset.left + element.width()) - (parentOffset.left + parentSize.width),
      bottom: (parentOffset.top + parentSize.height) - (offset.top + element.height())
    };
  },


  /**
   * Returns the centered position of the connector. Be aware that this function
   * keeps margin, padding and position in a flex container in mind.
   */
  getCenteredPosition : function(){
    const element = Ember.$(this.element);
    let parentOffset = element.parents("multi-selection").offset();
    let rect = this.element.getBoundingClientRect();
    //let margin = this.getMarginOfElement();
    let width = element.width();
    let height = element.height();

    let parent = element.parent();

    // the correct margin is determined by the flex options of the parent element
    //let correctHorizontalMargin = 0;
    //let correctVerticalMargin = 0;
    let justifyContent = parent.css('justify-content');
    if(parent.css('flex-direction') === "row"){
      if(justifyContent === "flex-start"){
        //correctHorizontalMargin = margin.left;
      }else if(justifyContent === "flex-end"){
        //correctHorizontalMargin = margin.right;
      }
    }else if(parent.css('flex-direction') === "column"){
      if(justifyContent === "flex-start"){
        //correctVerticalMargin = margin.top;
      }else if(justifyContent === "flex-end"){
        //correctVerticalMargin = margin.bottom;
      }
    }


    return {
      x: (rect.left + width / 2), //+ element.parents("flow-container").scrollLeft(), // - parentOffset.left + 3, //+ correctHorizontalMargin,
      y: (rect.top + height / 2) - parentOffset.top// + correctVerticalMargin
    };
  },


  /**
   * Returns the actual mouse position subtracted with the offset of the container
   * element.
   *
   * @param {MouseEvent} mouseEvent - the mouse event as defined by jQuery.
   */
  getCorrectMousePosition: function(mouseEvent){
    let parentOffset = Ember.$(this.element).closest('flow-container').offset();
    let x = mouseEvent.clientX - parentOffset.left;
    let y = mouseEvent.clientY - parentOffset.top;

    return {'x': x, 'y': y};
  },

  /**
   * Handles pressing the mouse button and registers document listeners in
   * order to respond to mouse events that happened outside of the element
   * boundaries. In case the left mouse button was pressed the 'moveStart'
   * is set to true to indicate that the user wants to reconnect the connector
   * with another one
   */
  mouseDown: function(e){
    if(e.button == 0){
      e.stopPropagation();
      e.preventDefault();

      this.set('moveStart', true);

      var self = this;
      this.set('mouseMoveListener', function(e){
        self.mouseMove(e);
      });

      this.set('mouseUpListener', function(e){
        self.mouseUp(e);
      });

      document.addEventListener('mousemove', this.get('mouseMoveListener'));
      document.addEventListener('mouseup', this.get('mouseUpListener'));
    }
  },


  /**
   * Handles releasing the mouse button and unregisters the document listeners
   * that were added during the mouseDown action. Also the 'moveStart' will be
   * set to false to cancel the reconnection of the connector
   */
  mouseUp: function(e){
    this._super(...arguments);

    if(e.button == 0){
      e.stopPropagation();
      e.preventDefault();

      this.set('moveStart', false);
    }

    document.removeEventListener('mousemove', this.get('mouseMoveListener'));
    document.removeEventListener('mouseup', this.get('mouseUpListener'));
  },


  /**
   * Observer to respond if the user scrolled or changed the position of the
   * related parent element. In this case the position of the connector will
   * be changed accordingly.
   * @see {@link updatePosition}
   */
  elementMoved : Ember.observer('parent.x', 'parent.y', function(){
    const self = this;
    const element = Ember.$(this.element);
  }),

  /**
   * connected - Determines if the output is connected to a block or not
   *
   * @return {boolean}                    true if the output is connected, false
   * otherwise
   */
  connected: Ember.computed('model.connection', function(){
    if(this.get('model') === undefined)
      return false;

    const content = this.get('model.connection').content;
    if (content !== undefined && content !== null){
      return (content.content !== null);
    }

    return (content !== null);
  }),



  parentChanged: Ember.observer('model.belongsTo.x', 'model.belongsTo.y', function() {
    this.setCSSOffset();
  }),

  parentOutputsChanged: Ember.observer('model.belongsTo.outputs.length', function() {
    this.setCSSOffset();
  }),

  didInsertElement: function(){
    this.setCSSOffset();
  },


    setCSSOffset: function(){
      const parentOffset = $(this.element).parents("flow-element").offset();
      const offset = $(this.element).offset();
      const width = $(this.element).width();

      this.set('offsetX', offset.left - parentOffset.left);
      this.set('offsetY', offset.top - parentOffset.top);

      this.set('model.x', this.get('model.belongsTo.x') + width + this.get('offsetX'));
      this.set('model.y', this.get('model.belongsTo.y') + 10 + this.get('offsetY'));
    }

});
