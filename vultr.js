'use strict';

var Promise = require('bluebird'),
    request = require('request-promise');

var config = require('./config');

var account = require(__dirname + '/lib/account'),
    dns = require(__dirname + '/lib/dns'),
    iso = require(__dirname + '/lib/iso'),
    os = require(__dirname + '/lib/os'),
    plans = require(__dirname + '/lib/plans'),
    regions = require(__dirname + '/lib/regions');

/**
 * Vultr instance constructor
 * @prototype
 * @class  Vultr
 */
function Vultr(apiKey) {
  this.version = 'v1';
  this.endpoint = 'https://api.vultr.com/' + this.version + '/';
  this.apiKey = (apiKey ? apiKey : config.vultr.apiKey);

  this.account = new account(this);
  this.dns = new dns(this);
  this.os = new os(this);
  this.iso = new iso(this);
  this.plans = new plans(this);
  this.regions = new regions(this);
}

/**
 * Handle communicating with the Vultr REST in one call
 * @param  {String} service       
 * @param  {String} method        
 * @param  {Array} data          
 * @param  {Mixed} formattedData Can be a hash or array
 * @return {Promise}               
 */
Vultr.prototype.communicate = function communicate(service, method, data, type) {
  data = data || {};

  var options = {
    'url': this.endpoint + service + '/' + method,
    'qs': {
      'api_key': this.apiKey
    },
    'method': 'GET',
    'json': true
  };

  /** Use POST when we have DATA */
  if(Object.keys(data).length > 0) {
    options.method = 'POST';
    options.form = data;
  }

  /** Sometimes we have to do a GET, but still with data */
  if(type !== void 0 && type !== '') {
    if(options.method === 'POST' && type.toUpperCase() === 'GET') {
      options.form.api_key = this.apiKey;
      options.qs = options.form;
      options.form = {};
    }
    options.method = type.toUpperCase();
  }

  console.log('options', options);

  /** We have to deal with a rate limit of 1 req/sec */
  return Promise.delay(1000).then(function() {
    return request(options);
  });
};

module.exports = Vultr;
