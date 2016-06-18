var $ = require('jquery');
var Helpers = require('./helpers.js');
var Api = require('./api.js');
var Event = require('common/arale-events/events.js');
var Promise = require('common/bluebird/bluebird.js'); 
var hop = Object.prototype.hasOwnProperty;

var storage = {};

function Data() {
	Event.call(this);
}

//public method
var api = Helpers.extendPrototpe(Data, Event);

api.get = function(path, ignoreCache) {
	var _this = this;
	var promise = $.Deferred();
	
	path = path.replace(/^\/+/, '');
	return new Promise(function(resolve, reject) {
        if (!ignoreCache && hop.call(storage, path)) {
            resolve(storage[path]);
        } else {
            var $dataArea = $('script[data-id="'+ path +'"]');
            var data = $dataArea.length ? $dataArea.text() || $dataArea[0].text : null; 
            
            if (data) {
                data = $.parseJSON(data);
                resolve(data);
                _this.set(path, data);
            } else {
                Api
                    .get('/api/data/' + path)
                    .then(function(res) {
                        var data = res && res.data || res
                        resolve(data);
                        _this.set(path, data);
                    }, function(error) {
                        reject(error);
                    });
            }
        }
        
    });
};

api.set = function(path, data, upload) {
	var promise = $.Deferred();
	
	path = path.replace(/^\/+/, '');
	
	storage[path] = data;
	this.emit('set', path, data);
	
	if (upload) {
		Api
			.post('/api/data/' + path, data)
			.then(function() {
				promise.resolve();
			}, function(error) {
				promise.reject(error);
			});
	} else {
		promise.resolve();
	}
	
	return promise;
};

module.exports = new Data();
