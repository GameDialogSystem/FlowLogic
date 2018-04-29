import Ember from 'ember';


/**
 * Mixin to save a list of selected elements
 *
 * @mixin MovableContainer
 */
export default Ember.Mixin.create({
  selectedElements: new Map(),
  focusedElement: null,

  mouseUp(e) {
    this.selectedElements.forEach((value) => {
      value.set('animated', true);
    });
  },

  actions: {


    elementMoved(offset, element) {
      let selectedElements = this.get("selectedElements");

      if (!selectedElements.has(element.get("elementId"))) {
        selectedElements.set(element.get("elementId"), element);
      }

      const x = this.get('focusedElement.model.x');
      const y = this.get('focusedElement.model.y');

      selectedElements.forEach((value) => {
        value.set('animated', false);
        if (offset.x != 0 || offset.y != 0) {
          //value.set("model.width", value.get("model.x") - x + offset.x)
          value.set("model.x", value.get("model.x") - x + offset.x);
          value.set("model.y", value.get("model.y") - y + offset.y);
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
    elementSelected(element, focused) {
      if (element === undefined) {
        throw TypeError("you cannot pass an undefined element to the list of selected elements");
      }

      if (focused) {
        this.set('focusedElement', element);
      }

      const selectedElements = this.get("selectedElements");
      selectedElements.set(element.get("elementId"), element);
    },


    /**
     * elementUnselected - removes an element from the list of selected elements
     *
     * @param  {object} element the element you want to remove from the list
     */
    elementUnselected(element) {
      if (element === undefined) {
        throw TypeError("you cannot remove an undefined element from the list of selected elements");
      }

      const selectedElements = this.get("selectedElements");
      selectedElements.delete(element.get("elementId"));
    }
  }
});
