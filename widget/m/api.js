var $ = require('jquery');
var M = require('m');
var Promise = require('common/bluebird/bluebird.js');
if (window.RAP) {
    var RAP_MODE = RAP.getMode();
    RAP.wrapJQuery($);
    console.log('RAP 已安装');
    console.log('RAP 工作模式: ' + (['不拦截任何请求', '拦截全部请求', '除黑名单之外的都拦截', '仅拦截白名单内的'][RAP_MODE]));
    console.log('RAP 白名单', RAP.getWhiteList());
    console.log('RAP 嘿名单', RAP.getBlackList());
}


var ERROR_CODE = {
	
};

function ResponseError (code, message) {
    this.code = code;
    Error.call(this, message);
    this.message = message;
}

ResponseError.prototype = M.Helpers.create(Error.prototype, ResponseError);

function request(method, url, data, successCallback) {
	if (!data) {
        data = {};
    }
    
    method = method.toUpperCase();
    data['_token'] = window['__PHP_CSRF_TOKEN__'];
    data['_method'] = method;
    
    if (window.RAP) {
        var rapURL = url;
        var rapMethod = method.toLowerCase();
        
        if (/_method=[^&#]+/i.test(rapURL)) {
            rapURL = rapURL.replace(/_method=[^&#]+/i, '_method=' + rapMethod);
        } else {
            rapURL = rapURL + (rapURL.indexOf('?') > -1 ? '&' : '?') + '_method=' + rapMethod; 
        }
        console.log(rapURL);
        
        if (window.RAP.router(rapURL)) {
            url = rapURL;
            method = 'get';
            delete data['_method']
        }
    }
    
    return new Promise(function(resolve, reject) {
        $.ajax({
            type     : method,
            url      : url,
            data     : data,
            dataType : 'json',
            complete : function() {
            },
            success  : function (res) {
                
                if (!res.meta || (res.meta.code == 0 || res.meta.code == undefined)) {
                    if (res.meta && res.meta.redirect) {
                        window.location.href = res.meta.redirect;
                    }
                    successCallback && successCallback(res);
                    console.info && console.info('api-data:', res);
                    resolve(res);
                } else {				
                    console.error(
                        'code:' + res.meta.code + '\n' +
                        'reason:' + res.meta.msg.toString()
                    );
                    
                    res.msg = ERROR_CODE[res.meta.code] || res.meta.msg.toString();
                    
                    reject(new ResponseError(res.meta.code, res.msg));
                }
            }
        })
        .fail(function(xhr) {
            console.error(url + ' ' + xhr.status + ' (' + xhr.statusText + ')');
            var res = null;
            try {
                res = $.parseJSON(xhr.responseText);
            } catch (e) {}
            
            reject(new ResponseError(xhr.status, res && res.meta && res.meta.msg || xhr.statusText));
        });
    });
}

exports.get = function (url, data, successCallback) {
	return request('get', url, data, successCallback);
};

exports.post = function (url, data, successCallback) {
	return request('post', url, data, successCallback);
};

exports.patch = function (url, data, successCallback) {
	return request('patch', url, data, successCallback);
};

exports.put = function (url, data, successCallback) {
	return request('put', url, data, successCallback);
};

exports['delete'] = exports.del = function (url, data, successCallback) {
	return request('delete', url, data, successCallback);
};