import Ember from 'ember';

export default Ember.Mixin.create({
  selectedElements : new Map(),

  actions: {
    elementMoved: function(offset, element){
      let selectedElements = this.get("selectedElements");

      if(!selectedElements.has(element.get("elementId"))){
        selectedElements.set(element.get("elementId"), element);
      }


      selectedElements.forEach((value, key, map) => {
        const position = value.get("model.position");

        value.set("model.x", position.x + offset.x);
        value.set("model.y", position.y + offset.y);
      });
    },


    elementSelected: function(element){
      if(element === undefined){
        throw TypeError("you cannot pass an undefined element to the list of selected ones");
      }

      const selectedElements = this.get("selectedElements");
      selectedElements.set(element.get("elementId"), element);
    },

    elementUnselected: function(element){
      if(element === undefined){
        throw TypeError("you cannot pass an undefined element to the list of selected ones");
      }

      const selectedElements = this.get("selectedElements");
      selectedElements.delete(element.get("elementId"));
    }
  }
});
