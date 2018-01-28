import Ember from 'ember';
import layout from '../templates/components/flow-output';
import ConnectorMixin from '../mixins/connector';

/**
* Connector that will be used to display an output pin on a block element.
*/
export default Ember.Component.extend(ConnectorMixin, {
  layout,

  tagName: 'flow-output',

  rerouting: false,

  classNameBindings: ['connected'],


  /**
   * connected - Determines if the output is connected to a block or not
   *
   * @return {boolean}                    true if the output is connected, false
   * otherwise   
   */
  connected: Ember.computed('model.connection', function(){
    if(this.get('model') === undefined)
      return false;

    const content = this.get('model.connection').content;
    if (content !== undefined && content !== null){
      return (content.content !== null);
    }

    return (content !== null);
  }),



  mouseMove: function(e){
    let point = this.getCenteredPosition();

    if(this.get('moveStart')){
      this.get('reroute')(point, this.getCorrectMousePosition(e));
    }
  },

  /**
   * Overrides the default behaviour to prevent the context menu to be
   * opened with the right mouse button
   */
  contextMenu() {
    return false;
  },

  /**
   * Respond to the mouse up event to handle drag and drop of a connection
   * to an input pin or to the container in order to create a new block.
   */
  mouseUp : function(e){
    e.preventDefault();
    if(this.get('moveStart')){
      this._super(e);

      this.get('connectToNewBlock')(this.get('model'), this.getCorrectMousePosition(e));
    }
  },
});
