import Ember from 'ember';


/**
 * Mixin to save a list of selected elements
 */
export default Ember.Mixin.create({
  selectedElements : new Map(),

  actions: {
    elementMoved: function(offset, element){
      let selectedElements = this.get("selectedElements");

      if(!selectedElements.has(element.get("elementId"))){
        selectedElements.set(element.get("elementId"), element);
      }

      selectedElements.forEach((value) => {
        if(offset.x != 0 || offset.y != 0){
          value.set("model.x", offset.x);
          value.set("model.y", offset.y);
        }
      });
    },


    /**
     * elementSelected - adds an element to the list of selected elements in
     * case the element is not already contained within the list
     *
     * @param  {object} element the object that is about to be added to the list
     * of selected elements
     */
    elementSelected: function(element){
      if(element === undefined){
        throw TypeError("you cannot pass an undefined element to the list of selected elements");
      }

      const selectedElements = this.get("selectedElements");
      selectedElements.set(element.get("elementId"), element);
    },


    /**
     * elementUnselected - removes an element from the list of selected elements
     *
     * @param  {object} element the element you want to remove from the list
     */
    elementUnselected: function(element){
      if(element === undefined){
        throw TypeError("you cannot remove an undefined element from the list of selected elements");
      }

      const selectedElements = this.get("selectedElements");
      selectedElements.delete(element.get("elementId"));
    }
  }
});
