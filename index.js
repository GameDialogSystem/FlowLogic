/* eslint-env node */
'use strict';

module.exports = {
  name: 'flow-logic',

  isDevelopingAddon() {
    return true;
  },

  included(/* app */) {
    this._super.included.apply(this, arguments);
  }
};
