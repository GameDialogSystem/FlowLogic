import Ember from 'ember';
import DS from 'ember-data';
import Rectangle from './rectangle';

// Used for validate the number of inputs/maxOutputConnectionsAllowed
import { buildValidations, validator } from 'ember-cp-validations'

import LayoutableMixin from '../mixins/layoutable';

import { A } from '@ember/array';

const Validations = buildValidations({
  inputs: [
    validator('has-many'),
    validator('length', {
      min: 1
    })
  ]
})

/**
 * A block represents a logical element that can be connected to other blocks
 * via connections. Each block can have multiple inputs and outputs. Normally
 * you want to create in your app a polymorphic model that inherites this block
 * model. In this way you get the ability to connect blocks and have a clean
 * seperation of the desired logic of your application and the functionallity
 * offered by FlowLogic. For example imagine you want to create a model driven
 * code generator: In this scenario blocks represents single functional behaviour
 * like an if clase, a variable definition or a for loop. For each functionallity
 * you want to have an own model representation. Therefore you would define a
 * polymorphic model likely called code-function that inherites this block model.
 * From your code-function model you create a polymorphic representation for each
 * desired function as a single model.
 * @todo move parts of the description to an own tutorial
 */
export default Rectangle.extend(LayoutableMixin, {
  Validations,

  // allow object oriented programming by setting it to polymorphic
  inputs: DS.hasMany('input', { polymorphic: true, inverse: "belongsTo" }),
  outputs: DS.hasMany('output', { polymorphic: true, inverse: "belongsTo" }),

  /**
   * can be used to allow/disallow the changing of the value.
   * Unfortunately EmberJS does not have the ability to mark an attribute as
   * readonly. So be aware to make usage of this parameter as a workaround
   */
  editableValue: DS.attr('boolean', { defaultValue: true} ),

  /**
   * the value of the block contains. It can be of arbitrary form and based on
   * editableValue editable or not
  */
  value: DS.attr(),

  /**
   * children - computes a list of all children that are connected to this block.
   * This is used to calculate the correct position by the layouting algorithm
   * but can be used for multiple purposes for example to validate that a block
   * is always connected to another one
   */
  children: Ember.computed("outputs.@each.isConnected", function(){
    const outputs = this.get('outputs').filterBy('isConnected', true);


    let children = new Array();
    outputs.forEach(function(output){
      const child = output.get("connection.input.belongsTo");

      if(child !== undefined){
        children.push(child);
      }
    });

    return A(children);
  })
});
