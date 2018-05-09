import Service from '@ember/service';

export default Service.extend({
  relayout: function(startingLine) {
    const self = this;
    const parent = startingLine.get('parent');
    const width = startingLine.get("width");
    const height = startingLine.get('height');
    const childrenWidth = startingLine.get("childrenWidth");

    if (parent === undefined) {
      startingLine.set('x', (childrenWidth - width) / 2.0);
      startingLine.set('y', 10);
    }

    const x = startingLine.get('x');
    const y = startingLine.get('y');
    const margin = startingLine.get('margin');
    const offsetX = x + width / 2 - childrenWidth / 2;
    const outputs = startingLine.get('outputs').filterBy('isConnected', true);



    let continuousX = 0;
    outputs.forEach(function(output) {
      // reference to the child element
      const nextLine = output.get("connection.input.belongsTo");
      const childrenCount = nextLine.get('outputs.length');
      const centerX = (nextLine.get("childrenWidth") - width) / 2;

      nextLine.set('x', offsetX + continuousX + ((childrenCount > 0) ? centerX : 0));
      nextLine.set('y', y + height + margin);


      // increament the x coordinate accordingly to the width and margin
      continuousX += nextLine.get("childrenWidth") + margin;

      self.relayout(nextLine);
    });
  }
});
