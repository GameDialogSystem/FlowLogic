import Ember from 'ember';
import { computed, observer } from '@ember/object';

export default Ember.Mixin.create({
  childrenCount: 0,


  relayoutTimestamp: null,

  width: 0,

  parent: computed("inputs.[]", function(){
    const input = this.get("inputs.firstObject");

    if(input === undefined){
      return undefined;
    }

    const parent = input.get("connection.output.belongsTo");

    return parent;
  }),


  autoLayout: observer("relayoutTimestamp", function(){
    const w = 200;

    const relayoutTimestamp = this.get("relayoutTimestamp");

    const parent = this.get("parent");



    let x = 0;
    let y = 0;
    let parentHeight = 180;

    const parentChildrenCount = this.get("childrenCount");
    const parentWidth = parentChildrenCount * w;

    if(parent !== undefined){
      x = this.get("x"); //parent.get("x");
      y = this.get("y");
    }else{
      this.set("x", 0 + parentWidth / 2 - w / 2);
      this.set("y", 0);

      x = 0;
      y = 0;
    }




    const outputs = this.get('outputs').filterBy('isConnected', true);
    outputs.forEach(function(output, index){
      const nextLine = output.get("connection.input.belongsTo");
      const childrenCount = nextLine.get("childrenCount");
      const a = childrenCount;


      if(nextLine !== undefined){
        nextLine.set("x", x + (index * w) + ((childrenCount > 0) ? w : 0));
        nextLine.set("y", y + parentHeight);

        nextLine.set("relayoutTimestamp", relayoutTimestamp);
      }
    });

  })
});
