import Ember from 'ember';

export default Ember.Mixin.create({
  didInsertElement(){
    let self = this;

    Ember.run.later(function(){
      let point = self.getCenteredPosition();
      let x = point.x;
      let y = point.y;

      self.get('model').set('x', x);
      self.get('model').set('y', y);
    }, 5);
  },

  getMarginOfElement: function(){
    let element = Ember.$(this.element);
    let parent = element.parent();

    let offset = element.offset();
    let parentOffset = parent.offset();


    return {
      left: offset.left - parentOffset.left,
      top: offset.top - parentOffset.top,
      right: (offset.left + element.width()) - (parentOffset.left + parent.width()),
      bottom: (parentOffset.top + parent.height()) - (offset.top + element.height())
    };
  },

  getCenteredPosition : function(){
    let parentOffset = Ember.$(this.element).parent().parent().parent().offset();
    let rect = this.element.getBoundingClientRect();
    let margin = this.getMarginOfElement();
    let width = Ember.$(this.element).width();
    let height = Ember.$(this.element).height();


    let parent = Ember.$(this.element).parent();

    // the correct margin is determined by the flex options of the parent element
    let correctHorizontalMargin = 0;
    let correctVerticalMargin = 0;
    let justifyContent = parent.css('justify-content');
    if(parent.css('flex-direction') === "row"){
      if(justifyContent === "flex-start"){
        correctHorizontalMargin = margin.left;
      }else if(justifyContent === "flex-end"){
        correctHorizontalMargin = margin.right;
      }
    }else if(parent.css('flex-direction') === "column"){
      if(justifyContent === "flex-start"){
        correctVerticalMargin = margin.top;
      }else if(justifyContent === "flex-end"){
        correctVerticalMargin = margin.bottom;
      }
    }

    return {
      x: (rect.left + width)  - parentOffset.left + 3, //+ correctHorizontalMargin,
      y: (rect.top + height / 2) - parentOffset.top// + correctVerticalMargin
    };
  },

  updatePosition : function(){
    let point = this.getCenteredPosition();
    let self = this;

    console.log(point);

    Ember.run(function() {
      self.get('model').set('x', point.x);
      self.get('model').set('y', point.y);
    });
  },

  mouseDown: function(e){
    if(e.button == 0){
      e.stopPropagation();
      e.preventDefault();

      this.set('moveStart', true);

      var self = this;
      this.set('mouseMoveListener', function(e){
        self.mouseMove(e);
      });

      this.set('mouseUpListener', function(e){
        self.mouseUp(e);
      });

      document.addEventListener('mousemove', this.get('mouseMoveListener'));
      document.addEventListener('mouseup', this.get('mouseUpListener'));
    }
  },

  mouseUp: function(){
    document.removeEventListener('mousemove', this.get('mouseMoveListener'));
    document.removeEventListener('mouseup', this.get('mouseUpListener'));
  },

  elementMoved : Ember.observer('parent.x', 'parent.y', function(){
    this.updatePosition();
  }),
});
