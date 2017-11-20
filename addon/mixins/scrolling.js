import Ember from 'ember';

export default Ember.Mixin.create({
  bindScrolling: function(opts) {
    let self = this;

    let onScroll = function(){
        return self.scrolled();
    };

    $(document).bind('touchmove', onScroll);
    $(window).bind('scroll', onScroll);

    console.log('abc')
  },

  unbindScrolling: function() {
    $(window).unbind('scroll');
    $(document).unbind('touchmove');
  }
});
