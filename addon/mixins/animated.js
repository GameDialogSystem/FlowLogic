import Ember from 'ember';

export default Ember.Mixin.create({


  didInsertElement() {
    this._super(...arguments);

    const self = this;
    this.element.addEventListener('transitionstart', function(){
      //console.log("Start");

    })

    this.element.addEventListener('transitionrun', function(){
      //console.log("Run");
    })

    this.element.addEventListener('transitionend', function(){
      //console.log("End");
    })

    this.element.addEventListener('transitioncancel', function(){
      //console.log("Cancel");
    })
  },

  mouseDown: function(e){
    this._super(...arguments);

    Ember.$(this.element).addClass("no-transition");
  },

  mouseUp: function(e){
    this._super(...arguments);

    Ember.$(this.element).removeClass("no-transition");
  }
});
