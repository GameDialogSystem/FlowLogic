import Ember from 'ember';

export default Ember.Mixin.create({

    didInsertElement() {
      this._super(...arguments);

      this.bindScrolling();
    },

    bindScrolling: function(){
        const self = this;

        const scrollListener = function(){
            return self.scrolled();
        }

        Ember.$(document).bind('touchmove', scrollListener);
        Ember.$(window).bind('scroll', scrollListener);
    },

    unbindScrolling: function(){
        Ember.$(document).unbind('scroll');
        Ember.$(document).unbind('touchmove');
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
