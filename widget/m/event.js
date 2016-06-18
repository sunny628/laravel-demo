
var 
    SLICE = Array.prototype.slice,
    own   = Object.prototype.hasOwnProperty
;
var E = module.exports = function Event()
{
    this._events  = {};
}

var api = E.prototype;
api.on = function(type, handler)
{
    if (!type || !handler) return;
    var handlers = this._events[type];
    if (!handlers) {
        handlers = this._events[type] = [];
    }
    handlers.push(handler);
};
api.un = function(type, handler)
{
    if (!type || !this._events.hasOwnProperty(type)) return;
    if (!handler) {
        this._events[type].length = 0;
        return;
    }
    var 
        handlers = this._events[type],
        n        = 0
    ;
    for (var i = 0, l = handlers.length; i < l; i++ ) {
        if (handlers[i] !== handler) {
            handlers[n++] = handlers[i];
        }
    }
    handlers.length = n;
};

api.once = function(type, handler)
{
    if (!type || !handler) return;
    var _this = this;
    this.on(type, function()
    {
        handler.apply(this, arguments);
        _this.un(type, arguments.callee);
    });
};

api.fireEvent = function(type, args, thisp)
{
    if (!type || !this._events.hasOwnProperty(type)) return;
    args  = args || [];
    thisp = thisp || this;
    var handlers    = this._events[type].slice();
    var returnValue = null;
    for(var i = 0, l = handlers.length; i < l; i++ ) {
        if (!handlers[i])  continue;
        var r = handlers[i].apply(thisp, args);
        if (r !== undefined) {
            returnValue = r;
        }
    }
    return returnValue;
};

api.getHandlers = function(type){
    return this._events[type];
};

api.isEmptyHandler = function(type) {
    var handlers = this._events[type];
    return handlers && handlers.length;
}

api.emit = api.fireEvent;