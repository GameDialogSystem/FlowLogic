import Ember from 'ember';
import layout from '../templates/components/flow-element';
import MovableMixin from '../mixins/movable';

export default Ember.Component.extend(MovableMixin, {
  layout,

  tagName: 'flow-element',

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
                         'model.width', 'model.height', function()
   {
     return Ember.String.htmlSafe(`left: ${this.get("model.x")}px; `+
                                  `top: ${this.get("model.y")}px; `+
                                  `width: ${this.get("model.width")}px; ` +
                                  `min-height: ${this.get("model.height")}px`);
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

  isSelected: Ember.computed("selection.x", "selection.y", "selection.width", "selection.height", 'singleSelection', function() {
    if(this.get('singleSelection')){
      return true;
    }

    // rectangle of the user selection in absolute coordinates
    const selection = this.get("selection");

    const element = Ember.$(this.element);

    // position of the element in relative coordinates
    const position = element.position();

    // left top position of the flow element
    const elementLeftTopX = position.left;
    const elementLeftTopY = position.top;

    // right bottom position of the flow element
    const elementRightBottomX = elementLeftTopX + element.width();
    const elementRightBottomY = elementLeftTopY + element.height();

    // only calculate the overlapping percentage if there is
    // a user selection otherwise the overlapping percentage
    // is just 0
    if(selection !== undefined){
      // left top position of the user selection rectangle
      const selectionLeftTopX = selection.x;
      const selectionLeftTopY = selection.y;

      // right bottom position of the user selection rectangle
      const selectionRightBottomX = selection.x + selection.width;
      const selectionRightBottomY = selection.y + selection.height;


      const overlapHorizontal = Math.max(0, Math.min(elementRightBottomX, selectionRightBottomX) -
                                Math.max(elementLeftTopX, selectionLeftTopX));
      const overlapVertical = Math.max(0, Math.min(elementRightBottomY, selectionRightBottomY) -
                              Math.max(elementLeftTopY, selectionLeftTopY));
      const overlapArea = (overlapHorizontal * overlapVertical);
      const elementArea = element.width() * element.height();
      const overlapFactor = overlapArea / elementArea;

      // mark all elements as selected if at least 15% of the element is
      // selected
      return (overlapFactor > 0.15);
    }

    // if there is no selection present just return false to indicate it
    return false;
  })
});
