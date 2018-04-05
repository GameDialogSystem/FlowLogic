import Ember from 'ember';

/**
* Enables actions that affect more than one element. For example if the user
* selects multiple blocks and wants to delete them together in one action.
* This action is invoked by this mixin.
*
* @mixin
*/
export default Ember.Mixin.create({
  keyPress(){
    let deleteBlock = this.get('deleteBlock');

    this.get('selectedElements').forEach((element) => {
      deleteBlock(element.get('model'));
    });
  }
});
