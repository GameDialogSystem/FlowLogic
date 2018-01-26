import Ember from 'ember';
import { computed, observer } from '@ember/object';

export default Ember.Mixin.create({
  childrenCount: 0,


  relayoutTimestamp: null,

  margin: 20,

  parent: computed("inputs.[]", function(){
    const input = this.get("inputs.firstObject");

    if(input === undefined){
      return undefined;
    }

    const parent = input.get("connection.output.belongsTo");

    return parent;
  }),

  childrenWidth : Ember.computed('children.@each.childrenWidth', function() {
    if(this.get("children.length") === 0){
      return this.get("width");
    }

    let width = 0;


    this.get("children").forEach(function(child, index){
      width += child.get("childrenWidth");
    });

    width += (this.get("children.length") - 1) * this.get("margin");

    return width;
  }),


  /**
   * autoLayout - Observes the change of the relayout timestamp in order
   * to relayout all children to their perfect position
   *
   * @param  {type} "relayoutTimestamp" description
   * @param  {type} function(           description
   * @return {type}                     description
   */
  autoLayout: observer("relayoutTimestamp", function(){
    let x = 0;
    let y = 0;
    let parentHeight = 180;

    const childrenWidth = this.get("childrenWidth");
    const outputs = this.get('outputs').filterBy('isConnected', true);

    const parentChildrenCount = outputs.length;

    const offsetX = -(childrenWidth / 2) + this.get("width") / 2;

    if(this.get("parent") === undefined){
      this.set("x", (childrenWidth - this.get("width")) / 2);
      this.set("y", 0);
    }

    x = this.get("x");
    y = this.get("y");



    const self = this;



    let continuousX = 0;
    outputs.forEach(function(output, index){
      // reference to the child element
      const nextLine = output.get("connection.input.belongsTo");
      const nextLineOutputs = nextLine.get('outputs').filterBy('isConnected', true);
      const childrenCount = nextLineOutputs.length;

      if(nextLine !== undefined){
        const centerX = (nextLine.get("childrenWidth") - self.get("width")) / 2;

        // sets the x coordinate of each child to the new value
        nextLine.set("x", offsetX + x + continuousX + ((childrenCount > 0) ? centerX : 0));
        nextLine.set("y", y + 200);

        // call the relocate hook for each child
        nextLine.set("relayoutTimestamp", self.get("relayoutTimestamp"));

        // increament the x coordinate accordingly to the width and margin
        continuousX += nextLine.get("width") + self.get("margin");
      }
    });
  })
});
