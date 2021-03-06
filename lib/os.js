var Promise = require('bluebird');

/**
 * OS instance constructor
 * @prototype
 * @class OS
 */
function OS(instance) {
  this.vultr = instance || {};
  this.service = 'os';
}

/**
 * Retrieve list of OS's available
 * @return {Promise}            Object with data
 */
OS.prototype.list = function list() {
  return this.vultr.communicate(this.service, 'list');
};  

module.exports = OS;
