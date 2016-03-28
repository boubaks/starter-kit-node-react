'use strict';
var Backbone = require('backbone'),
    _ = require('underscore');

// default model
module.exports = Backbone.Model.extend({
    /**
     * Helper method to get a value nested in this.attributes using a dotted attribute notation
     * or undefined if not found.
     * @method dig
     * @param  {String} dottedAttribute
     * @return {*}      retrieved value or undefined
     * @example
     *     this.dig('attr1.attr2') // will try to retrieve this.attributes.attr1.attr2
     */
    dig: function (dottedAttribute) {
        var unfound;
        return dottedAttribute.split('.').reduce(function (nestedObject, attrName) {
            return _.isObject(nestedObject) ? nestedObject[attrName] : unfound;
        }, this.attributes);
    },
    normalizeTimestamp: function (input) {
        input = Number(input) || 0;
        // seconds to milliseconds
        if (input < 9999999999) {
            input *= 1000;
        }
        return input;
    },
    /**
     * Update a collection to reflect an array attribute
     * @this                          model instance
     * @param  {Object} collection    collection instance to fill with array attribute
     * @param  {String} attributeName array attribute's name in the model
     * @return {Object}               collection
     */
    reflectCollection: function (collection, attributeName) {
        // attribute change
        this.on('change:' + attributeName, function (model, value) {
            collection.reset(collection.parse(value));
        });
        // initial value
        collection.reset(collection.parse(this.get(attributeName) || []));
        return collection;
    },
    /**
     * Update a model to reflect an object attribute
     * @this                          model instance
     * @param  {Object} model         model instance to fill with object attribute
     * @param  {String} attributeName array attribute's name in the model
     * @return {Object}               model
     */
    reflectModel: function (model, attributeName) {
        // attribute change
        this.on('change:' + attributeName, function (sourceModel, value) {
            model.clear();
            model.set(model.parse(value));
        });
        // initial value
        model.clear();
        model.set(model.parse(this.get(attributeName) || {}));
        return model;
    }
});
