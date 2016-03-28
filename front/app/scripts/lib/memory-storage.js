'use strict';
/**
 * Fakes localStorage API in a simple object in memory
 */
var Storage = function () {},
    proto = Storage.prototype;

// private properties/methods
var has = function (instance, key) {
    return instance.hasOwnProperty(key);
};
var write = function (instance, key, value) {
    instance[key] = String(value);
};
var erase = function (instance, key) {
    delete instance[key];
};
var keys = function (instance) {
    var keys = [],
        prop;
    for (prop in instance) {
        if (has(instance, prop)) {
            keys.push(prop);
        }
    }
    return keys;
};

// instance properties/methods
proto.length = 0; // initial length

proto.setItem = function (key, value) {
    if (has(this, key)) {
        if (proto.getItem(key) !== value) {
            write(this, key, value);
        }
    } else {
        write(this, key, value);
        proto.length += 1;
    }
};

proto.getItem = function (key) {
    return has(this, key) ? this[key] : null;
};

proto.removeItem = function (key) {
    if (has(this, key)) {
        erase(this, key);
        proto.length -= 1;
    }
};

proto.clear = function () {
    var prop;
    if (proto.length) {
        for (prop in this) {
            if (has(this, prop)) {
                erase(this, prop);
            }
        }
        proto.length = 0;
    }
};

proto.key = function (index) {
    return keys(this)[index];
};

module.exports = new Storage();
