import Ember from 'ember';

export default Ember.Mixin.create({
  selectedElements : new Map(),

  actions: {
    elementMoved: function(offset){
      const selectedElements = this.get("selectedElements");

      selectedElements.forEach((value, key, map) => {
        const positionX = value.get("positionX");
        const positionY = value.get("positionY");

        console.log(offset.x + "  "+ offset.y);

        value.set("positionX", positionX + offset.x);
        value.set("positionY", positionY + offset.y);
      })


    },


    elementSelected: function(element){
      if(element === undefined){
        throw TypeError("you cannot pass an undefined element to the list of selected ones");
      }

      const selectedElements = this.get("selectedElements");
      selectedElements.set(element.elementId, element);
    },

    elementUnselected: function(element){
      const selectedElements = this.get("selectedElements");
      selectedElements.delete(element.get("id"));
    }
  }
});
