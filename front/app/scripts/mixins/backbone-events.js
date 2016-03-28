'use strict';
var _ = require('underscore');

/**
 * React Mixin to ease the bindings between backbone models/collections
 * and the component update.
 * You have to define backboneEvents property as a plain object that may contain
 * 2 object properties : props and/or state.
 * Inside props and state properties, object keys are the instance property name
 * (this.props.name / this.state.name) and associated values are the event string
 * to be binded ('add change:attr').
 * e.g.:
 * backboneEvents: {
 *     props: {
 *         'player': 'change:size'
 *     },
 *     state: {
 *         'tweets': 'add remove reset sort'
 *     }
 * }
 */
module.exports = {
    /**
     * Calls forceUpdate method to render the view
     * @private
     */
    _refreshHandler: function () {
        return this.isMounted() && this.forceUpdate();
    },
    /**
     * Helper method to get a value nested in an object using a dotted attribute notation
     * e.g. 'attr1.attr2' will retrieve object.attr1.attr2
     * @param  {Object} object             owner object
     * @param  {String} dottedAttribute
     * @return {*}                         retrieved value or undefined
     */
    _dig: function (object, dottedAttribute) {
        return _.reduce(dottedAttribute.split('.'), function (nestedObject, attrName) {
            if (_.isUndefined(nestedObject)) { return; }
            return nestedObject[attrName];
        }, object);
    },
    /**
     * Binds _refreshHandler to a property events
     * @private
     * @param  {Object} model           model to be subscribed
     * @param  {String} eventsString    space separated event names (e.g. 'add remove reset sort')
     */
    _subscribe: function (model, eventsString) {
        if (!(model && _.isFunction(model.on) && _.isString(eventsString))) {
            return model;
        }
        return model.on(eventsString, this._refreshHandler);
    },
    /**
     * Unbinds _refreshHandler
     * @private
     * @param  {Object} model
     * @param  {String} eventsString
     */
    _unsubscribe: function (model, eventsString) {
        if (!(model && _.isFunction(model.off) && _.isString(eventsString))) {
            return model;
        }
        return model.off(eventsString, this._refreshHandler);
    },
    /**
     * Makes the bindings just after the component is mounted
     */
    componentWillMount: function () {
        _.forEach(this._dig(this, 'backboneEvents.props'), function (eventsString, property) {
            this._subscribe(this._dig(this.props, property), eventsString);
        }, this);
        _.forEach(this._dig(this, 'backboneEvents.state'), function (eventsString, property) {
            this._subscribe(this._dig(this.state, property), eventsString);
        }, this);
    },
    /**
     * Update the bindings if props properties have changed
     */
    componentWillReceiveProps: function(nextProps) {
        _.forEach(this._dig(this, 'backboneEvents.props'), function (eventsString, property) {
            var prop = this._dig(this.props, property),
                nextProp = this._dig(nextProps, property);
            if (prop !== nextProp) {
                this._unsubscribe(prop, eventsString);
                this._subscribe(nextProp, eventsString);
            }
        }, this);
    },
    /**
     * Update the bindings if state properties have changed
     */
    componentWillUpdate: function (nextProps, nextStates) {
        _.forEach(this._dig(this, 'backboneEvents.state'), function (eventsString, property) {
            var state = this._dig(this.state, property),
                nextState = this._dig(nextStates, property);
            if (state !== nextState) {
                this._unsubscribe(state, eventsString);
                this._subscribe(nextState, eventsString);
            }
        }, this);
    },
    /**
     * Remove the bindings before the component is unmounted
     */
    componentWillUnmount: function () {
        _.forEach(this._dig(this, 'backboneEvents.props'), function (eventsString, property) {
            this._unsubscribe(this._dig(this.props, property), eventsString);
        }, this);
        _.forEach(this._dig(this, 'backboneEvents.state'), function (eventsString, property) {
            this._unsubscribe(this._dig(this.state, property), eventsString);
        }, this);
    }
};
