import Ember from 'ember';
import { computed } from '@ember/object';

/**
* Implements functionality needed for the connectors of two elements.
* This mixin might change in future to an own component so please be aware of
* this.
*
* @mixin Connector
*/
export default Ember.Mixin.create({
  classNameBindings: ['isConnected'],



  offsetX: null,
  offsetY: null,

  init() {
    this._super(...arguments);


    // for each dialog line an empty output is generated and has the status
    // loaded.created.uncommited. Therefore the state name will not change
    // and the isLoaded observer is not triggered. Therefore we trigger
    // it at this position so that the output model has the correct coordinates
    //if(this.get("model.currentState.stateName") === "root.loaded.created.uncommitted"){
    //}
  },

  /**
  * Returns the offset of the parent element as an object.
  * The object has the form {left: x, top: x}.
  */
  getParentOffset(){
    return Ember.$(this.element).parent().offset();
  },

  /**
  * Attribute that stores the state of a connector (connected, not connected)
  * in a boolean value that is used to add a class to the pin to visually indicate
  * if the pin is connected or not. The class added to the element is named
  * is-connected.
  */
  isConnected: computed('model.isConnected', function() {
    return this.model.isConnected;
  }),

  /**
  * Gets the size of the parent element and returns this as an object.
  * The object has the form {width: x, height: x}.
  */
  getParentSize(){
    let element = Ember.$(this.element);
    let parent = element.parent();

    return {width: parent.width(), height: parent.height()};
  },


  /**
  * Calculates the margin to the parent element based on the actual position
  * within the DOM.
  */
  getMarginOfElement(){
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
  * Returns the actual mouse position subtracted with the offset of the container
  * element.
  *
  * @param {MouseEvent} mouseEvent - the mouse event as defined by jQuery.
  */
  getCorrectMousePosition(mouseEvent){
    const container = Ember.$(this.element).closest('flow-container');
    const scrollTop = container.scrollTop();
    const scrollLeft = container.scrollLeft();

    const parentOffset = container.offset();
    const x = mouseEvent.clientX - parentOffset.left + scrollLeft;
    const y = mouseEvent.clientY - parentOffset.top + scrollTop;

    return {'x': x, 'y': y};
  },

  /**
  * Handles pressing the mouse button and registers document listeners in
  * order to respond to mouse events that happened outside of the element
  * boundaries. In case the left mouse button was pressed the 'moveStart'
  * is set to true to indicate that the user wants to reconnect the connector
  * with another one
  */
  mouseDown(e){
    if(e.button == 0){
      e.stopPropagation();
      e.preventDefault();

      this.set('moveStart', true);

      const self = this;
      this.set('mouseMoveListener', function(e){
        if(self.mouseMove){
          self.mouseMove(e);
        }
      });

      this.set('mouseUpListener', function(e){
        if(self.mouseUp){
          self.mouseUp(e);
        }
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
  mouseUp(e){
    this._super(...arguments);


    if(e.path === undefined || e.path[0].tagName !== "MULTI-SELECTION"){
      return;
    }

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
    this.setCSSOffset();
  }),

  parentOutputsChanged: Ember.observer('model.belongsTo.outputs.length', function() {
    //this.setCSSOffset();
  }),

  didInsertElement(){
    this.setCSSOffset();
  },

  /*
  modelChanged: Ember.observer('model.currentState.stateName', function() {
    if(this.get("model.currentState.stateName") === 'root.loaded.saved'){
      this.setCSSOffset();
    }
  }),
  */

  setCSSOffset(){
    Ember.run.scheduleOnce('afterRender', this, function(){
      const stateName = this.get("model.currentState.stateName");
      if(!(stateName === "root.loading" || stateName === "root.deleted.inFlight")){


        const element = Ember.$(this.element);


        const containerRect = element.parents("flow-container")[0].getBoundingClientRect();
        const rect = this.element.getBoundingClientRect();
        const x = rect.left - containerRect.left +  element.width() / 2;
        const y = rect.top - containerRect.top + element.height() / 2;

        this.set('model.x', x);
        this.set('model.y', y);
      }
    });
  }
});
