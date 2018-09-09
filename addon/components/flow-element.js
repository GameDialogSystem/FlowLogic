import Ember from 'ember';
import layout from '../templates/components/flow-element';
import MovableMixin from '../mixins/movable';

//import ResizeAware from 'ember-resize/mixins/resize-aware';


/**
 * Renders an element on the flow container that represents a logical block
 *
 * @see {@link Movable}
 *
 * @module
 * @augments Ember/Component
 */
export default Ember.Component.extend(MovableMixin, {
  layout,

  tagName: 'flow-element',

  animated: true,

  classNameBindings: ['isSelected:selected', 'customLayouted:no-transition:transition'],


  didInsertElement() {
    this._super(...arguments);

    const self = this;
    Ember.run.schedule('afterRender', function() {
      const element = Ember.$(self.element);

      // only set the width and height of the model in case the model is created
      // locally first and not loaded from the server
      if(self.get("model.currentState.stateName") === "root.loaded.created.uncommitted"){
        self.set("model.width", element.width());
        self.set("model.height", element.height());
      }



      //new ElementQueries.ResizeSensor(element, function() {
      //  self.set("model.height", element[0].clientHeight);
/*
        const neighbours = self.get('model.neighbours');

        if(neighbours){
          let maxHeight = 0;
          neighbours.forEach(neighbour => {
            let height = neighbour.get('height');

            if(height > maxHeight){
              maxHeight = height;
            }
          });

          neighbours.forEach(neighbour => {
            neighbour.set('height', maxHeight);
          })
        }
        */
      //});

    });
  },


  /**
   * set tabindex to 1 in order to receive keyevents on this component
   * to allow deletion by pressing the DELETE button
   */
   attributeBindings: ['tabindex', 'unselectable', 'onselectstart', 'onmousedown', 'style'],

   tabindex: '1',

   actions: {
     acceptRerouting(){

     },

     cancelReroute(output, point){
       this.get('cancelReroute')(output, point);
     },

     onDeleteBlock(model) {
       const onDeleteBlock = this.get('onDeleteBlock');

       if(onDeleteBlock){
         onDeleteBlock(model);
       }
     }
   },

   style: Ember.computed('model.x', 'model.y',
                         'model.width', 'model.height', 'animated', function()
   {
     let style = `left: ${this.get("model.x")}px; `+
                                  `top: ${this.get("model.y")}px; `;
                                  //`width: ${this.get("model.width")}px; ` +
                                  //`height: ${this.get("model.height")}px;`;


    if(!this.animated){
      style += `transition: none !important;`;
    }

    return Ember.String.htmlSafe(style);
   }),

   /**
    * isLoaded - Observer that listens for the model state. In case that
    * the model has the state "root.loaded.saved" the model was fully loaded
    * and the width and height can be set by the DOM element geometry.
    */
   isLoaded: Ember.observer("model.currentState.stateName", function(){
     if(this.get("model.currentState.stateName") === "root.loaded.saved"){
       const element = Ember.$(this.element);

       this.set("model.width", element.width());
       this.set("model.height", element.height());
     }
   }),


  /**
   * Overwrite the custom behaviour in order to hide the context menu in case
   * the right mouse button was pressed.
   */
  //contextMenu(){
  //  return false;
  //},

  /**
   * Respond to keypress events to allow the deletion of the element
   * by pressing the DELETE button.
   */
  keyPress(e){
    const onDeleteBlock = this.get('onDeleteBlock');

    if(e.keyCode === 127 && (onDeleteBlock !== null || onDeleteBlock !== undefined)){
      onDeleteBlock(this.get('model'));
    }
  },


  selectionChanged: Ember.observer("isSelected", function(){
    const isSelected = this.get("isSelected");

    if(isSelected){
      this.get("onElementSelect")(this, false);
    }else{
      this.get("onElementUnselect")(this);
    }
  }),

  mouseDown() {
    this._super(...arguments);

    this.set('singleSelection', true);
    this.get("onElementSelect")(this, true);
  },

  mouseUp() {
    this._super(...arguments);

    this.set('singleSelection', false);
    this.get("onElementUnselect")(this);
  },

  isSelected: Ember.computed("selection.x", "selection.y", "selection.width", "selection.height", 'singleSelection', 'zoomLevel', function() {
    if(this.get('singleSelection')){
      return true;
    }

    const zoomLevel = this.zoomLevel / 100;
    // rectangle of the user selection in absolute coordinates
    const selection = this.selection;

    const element = Ember.$(this.element);

    // position of the element in relative coordinates
    const position = element.position();

    // left top position of the flow element
    const elementLeftTopX = position.left / zoomLevel;
    const elementLeftTopY = position.top / zoomLevel;

    // right bottom position of the flow element
    const elementRightBottomX = (position.left) / zoomLevel + element.width();
    const elementRightBottomY = (position.top) / zoomLevel + element.height();

    // only calculate the overlapping percentage if there is
    // a user selection otherwise the overlapping percentage
    // is just 0
    if(selection !== undefined){

      // left top position of the user selection rectangle
      const selectionLeftTopX = selection.x;
      const selectionLeftTopY = selection.y;

      // right bottom position of the user selection rectangle
      const selectionRightBottomX = (selection.x + selection.width);
      const selectionRightBottomY = (selection.y + selection.height);


      const overlapHorizontal = Math.max(0, Math.min(elementRightBottomX, selectionRightBottomX) -
                                Math.max(elementLeftTopX, selectionLeftTopX));
      const overlapVertical = Math.max(0, Math.min(elementRightBottomY, selectionRightBottomY) -
                              Math.max(elementLeftTopY, selectionLeftTopY));


      const overlapArea = (overlapHorizontal * overlapVertical);
      const elementArea = element.width() * element.height();
      const overlapFactor = overlapArea / elementArea;


      // mark all elements as selected if at least 15% of the element is
      // selected
      return (overlapFactor >= 0.25);
    }

    // if there is no selection present just return false to indicate it
    return false;
  })
});
