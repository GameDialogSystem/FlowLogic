import Ember from 'ember';

export default Ember.Mixin.create({

    didInsertElement() {
      this._super(...arguments);

      this.bindScrolling();
    },

    bindScrolling: function(options){
        const self = this;

        const scrollListener = function(){
            return self.scrolled();
        }

        $(document).bind('touchmove', scrollListener);
        $(window).bind('scroll', scrollListener);
    },

    unbindScrolling: function(){
        $(document).unbind('scroll');
        $(document).unbind('touchmove');
    },

    scrolled: function(){
        this.set("scrollOffset", this.getScrollOffset());
    },

    getScrollOffset: function(){
        const doc = document.documentElement;
        const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

        return {
            "left": left,
            "top": top
        };
    }
});
