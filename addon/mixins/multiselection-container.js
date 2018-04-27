import Ember from 'ember';

/**
* Enables actions that affect more than one element. For example if the user
* selects multiple blocks and wants to delete them together in one action.
* This action is invoked by this mixin.
*
* @mixin
*/
export default Ember.Mixin.create({
  keyPress(e){
    const onDeleteBlock = this.get('onDeleteBlock');

    if(e.keyCode === 127 && (onDeleteBlock !== null || onDeleteBlock !== undefined)){
      this.get('selectedElements').forEach((element) => {
        onDeleteBlock(element.get('model'));
      });
    }
  }
});
