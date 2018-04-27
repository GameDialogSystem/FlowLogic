import Ember from 'ember';

/**
 * Adds the functionallity to layout elements automatically in a tree
 * structure. Currently only a vertical layout is available.
 *
 * @mixin Layoutable
 */
export default Ember.Mixin.create({
  /**
   * Property that is used to trigger the layout process. Setting this to a
   * new value will trigger the layouting function
   *
   * @see {@link autoLayout}
   */
  relayoutTimestamp: null,


  /**
   * Defines the margin used between children at the same level
   */
  margin: 20,




  /**
   * Computes the parent node of a block. This is needed to get the size of
   * all children and to check if a node has a parent.
   *
   * @return node as a block or polymorphic child in case the parent is defined.
   * In case the node has no parent the function returns undefined
   */
  parent: Ember.computed("inputs.[]", function(){
    const input = this.get("inputs.firstObject");

    if(input === undefined){
      return undefined;
    }

    const parent = input.get("connection.output.belongsTo");

    return parent;
  }),


  /**
   * childrenWidth - Calculates the width of all the children needed for the
   * layouting algorithm.
   */
  childrenWidth : Ember.computed("relayoutTimestamp",
                           "width",
                           "children.@each.width",
                           "parent.children.@each.childrenWidth", function(){

    // element without children will just return their own width
    if(this.get("children.length") === 0){
      return this.get("width");
    }

    let width = 0;

    this.get("children").forEach(function(child){
      width += child.get("childrenWidth");
    });

    // add margin between elements
    width += (this.get("children.length") - 1) * this.get("margin");

    return width;
  }),


  /**
   * autoLayout - Observes the change of the relayout timestamp in order
   * to relayout all children to their perfect position
   */
  autoLayout: Ember.observer("relayoutTimestamp", function(){
    const childrenWidth = this.get("childrenWidth");
    const offsetX = -(childrenWidth / 2) + this.get("width") / 2;

    // set the position of the root node
    if(this.get("parent") === undefined){
      this.set("x", (childrenWidth - this.get("width")) / 2);
      this.set("y", 0);
    }

    const x = this.get("x");
    const y = this.get("y");

    const self = this;

    let continuousX = 0;
    const outputs = this.get('outputs').filterBy('isConnected', true);
    outputs.forEach(function(output){
      // reference to the child element
      const nextLine = output.get("connection.input.belongsTo");

      if(nextLine !== undefined && nextLine.get('outputs')){
        const nextLineOutputs = nextLine.get('outputs').filterBy('isConnected', true);
        const childrenCount = nextLineOutputs.length;

        const centerX = (nextLine.get("childrenWidth") - self.get("width")) / 2;

        // sets the x coordinate of each child to the new value
        nextLine.set("x", offsetX + x + continuousX + ((childrenCount > 0) ? centerX : 0));
        nextLine.set("y", y + 200);

        // call the relocate hook for each child
        nextLine.set("relayoutTimestamp", self.get("relayoutTimestamp"));

        // increament the x coordinate accordingly to the width and margin
        continuousX += nextLine.get("childrenWidth") + self.get("margin");
      }
    });
  })
});
