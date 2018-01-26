import DS from 'ember-data';
import Rectangle from './rectangle';

import LayoutableMixin from '../mixins/layoutable';

export default Rectangle.extend(LayoutableMixin, {
  // allow object oriented programming by setting it to polymorphic
  inputs: DS.hasMany('input', { polymorphic: true }),
  outputs: DS.hasMany('output', { polymorphic: true }),


  /**
   * children - description
   *
   * @param  {type} "outputs" description
   * @param  {type} function( description
   * @return {type}           description
   */
  children: Ember.computed("outputs", function(){
    const outputs = this.get('outputs').filterBy('isConnected', true);

    let children = new Array();
    outputs.forEach(function(output, index){
      children.push(output.get("connection.input.belongsTo"));
    });

    return Ember.A(children);
  })
});
