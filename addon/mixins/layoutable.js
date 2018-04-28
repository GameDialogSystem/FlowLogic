import Ember from 'ember';

/**
 * Adds the functionallity to layout elements automatically in a tree
 * structure. Currently only a vertical layout is available.
 *
 * @mixin Layoutable
 */
export default Ember.Mixin.create({
  /**
   * Defines the margin used between children at the same level
   */
  margin: 20,

  width: 400,


  /**
   * Computes the parent node of a block. This is needed to get the size of
   * all children and to check if a node has a parent.
   *
   * @return node as a block or polymorphic child in case the parent is defined.
   * In case the node has no parent the function returns undefined
   */
  parent: Ember.computed("inputs.firstObject.connection.output.belongsTo", function() {
    return this.get('inputs.firstObject.connection.output.belongsTo');
  }),


  connectedChildren: Ember.computed('children.length', function() {
    return this.get('children');
  }),

  /**
   * childrenWidth - Calculates the width of all the children needed for the
   * layouting algorithm.
   */
  childrenWidth: Ember.computed("width", "children.@each.childrenWidth", function() {

    // element without children will just return their own width
    if (this.get("children.length") === 0) {
      return this.get("width");
    }

    let width = 0;

    this.get("children").forEach(function(child) {
      width += child.get("childrenWidth");
    });

    // add margin between elements
    width += (this.get("children.length") - 1) * this.get("margin");

    return width;
  }),

  neighbours: Ember.computed('parent.outputs.@each', function() {
    const self = this;
    if (this.get('parent.outputs') !== undefined) {
      let a = this.get('parent.outputs').filterBy('isConnected', true).map(function(item, index, array) {
        return item.get('connection.input.belongsTo');
      });

      return a;
    }
  }),
});
