import Ember from 'ember';

export default Ember.Mixin.create({
  didInsertElement(){
    let self = this;

    this.get('model').on("didLoad", function() {
      let point = self.getCenteredPosition();
      self.get('model').set('x', point.x);
      self.get('model').set('y', point.y);
    });
  },

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
    let parentOffset = Ember.$(this.element).parent().parent().parent().offset();
    let rect = this.element.getBoundingClientRect();
    let margin = this.getMarginOfElement();
    let width = Ember.$(this.element).width();
    let height = Ember.$(this.element).height();


    let parent = Ember.$(this.element).parent();

    // the correct margin is determined by the flex options of the parent element
    let correctHorizontalMargin = 0;
    let correctVerticalMargin = 0;
    let justifyContent = parent.css('justify-content');
    if(parent.css('flex-direction') === "row"){
      if(justifyContent === "flex-start"){
        correctHorizontalMargin = margin.left;
      }else if(justifyContent === "flex-end"){
        correctHorizontalMargin = margin.right;
      }
    }else if(parent.css('flex-direction') === "column"){
      if(justifyContent === "flex-start"){
        correctVerticalMargin = margin.top;
      }else if(justifyContent === "flex-end"){
        correctVerticalMargin = margin.bottom;
      }
    }

    return {
      x: (rect.left + width / 2), // - parentOffset.left + 3, //+ correctHorizontalMargin,
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
   * Updates the position as defined in the model to the new location.
   * Execution is scheduled after DOM rendering completion to prevent
   * an internal Ember error
   */
  updatePosition : function(){
    let point = this.getCenteredPosition();
    let self = this;
    let model = this.get('model');

    // schedule the modification of the position until the DOM rendering
    // is done. This is needed to prevent changing the position while Ember
    // renders the connector - otherwise an error would be generated
    Ember.run.schedule('afterRender', function() {
      if(model.get('x') !== point.x){
        model.set('x', point.x);
      }

      if(model.get('y') !== point.y){
        model.set('y', point.y);
      }
    });
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
  mouseUp: function(){
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
  elementMoved : Ember.observer('parent.x', 'parent.y', 'scrollOffsetX', 'scrollOffsetY', function(){
    this.updatePosition();
  })
});