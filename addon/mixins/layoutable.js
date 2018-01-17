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

    if(parent === undefined){
      this.set("x", ((parentChildrenCount - 1) * w) / 2);
      this.set("y", 0);
    }

    x = this.get("x");
    y = this.get("y");

    console.log(parentChildrenCount)
    const offsetX = - ((parentChildrenCount -1) / 2) * w;

    const self = this;

    const outputs = this.get('outputs').filterBy('isConnected', true);
    outputs.forEach(function(output, index){
      const nextLine = output.get("connection.input.belongsTo");
      const childrenCount = nextLine.get("childrenCount");
      const a = childrenCount;


      if(nextLine !== undefined){
        const centerX = ((childrenCount - 1) * w) / 2;

        console.log("x:" + x +" y: "+y+ " ["+self.get("message")+"]");
        nextLine.set("x", offsetX + x + (index * w) + ((childrenCount > 0) ? centerX : 0));
        nextLine.set("y", y + 200);

        nextLine.set("relayoutTimestamp", relayoutTimestamp);
      }
    });

  })
});
