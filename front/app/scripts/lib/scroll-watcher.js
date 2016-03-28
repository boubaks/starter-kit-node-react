'use strict';
var jq = require('jquery'),
    _ = require('underscore'),
    ScrollWatcher;

/**
 * Watches a container scroll.
 * Triggers events when container reaches the boundaries.
 * @method ScrollWatcher
 * @param  {Object}      container DOM Element container
 * @param  {Object}      options   overrides default options (see ScrollWatcher.options)
 */
ScrollWatcher = function (container, options) {
    this.options = _.extend({}, ScrollWatcher.options, options);
    this.$container = jq(container).eq(0);
    this.events = jq(this);
    this.state = {
        horizontal: null,
        vertical: null
    };
    return this;
};

// static properties/methods
_.extend(ScrollWatcher, {
    // default options
    options: {
        vertical: true,
        horizontal: false
    }
});

// instance properties/methods
_.extend(ScrollWatcher.prototype, {
    _setHorizontal: function (state) {
        if (this.state.horizontal === state) {
            return this;
        }
        this.state.horizontal = state;
        if (state === 'contains') {
            this.events.trigger('contains:horizontal');
        }
        else if (state) {
            this.events.trigger('reach:' + state);
        }
        return this;
    },
    _setVertical: function (state) {
        if (this.state.vertical === state) {
            return this;
        }
        this.state.vertical = state;
        if (state === 'contains') {
            this.events.trigger('contains:vertical');
        }
        else if (state) {
            this.events.trigger('reach:' + state);
        }
        return this;
    },
    _containsHorizontal: function () {
        return this.scrollWidth === this.width;
    },
    _containsVertical: function () {
        return this.scrollHeight === this.height;
    },
    _reachesLeft: function () {
        return this.scrollX === 0;
    },
    _reachesRight: function () {
        // 1px security - sometimes scroll is blocked 1px from right
        return this.scrollX + this.width + 1 >= this.scrollWidth;
    },
    _reachesTop: function () {
        return this.scrollY === 0;
    },
    _reachesBottom: function () {
        // 1px security - sometimes scroll is blocked 1px from bottom
        return this.scrollY + this.height + 1 >= this.scrollHeight;
    },
    _unwatch: function () {
        if (this.scrollCallback && this.$container) {
            this.$container.off('scroll', this.scrollCallback);
            this.scrollCallback = null;
        }
        return this;
    },
    _watch: function () {
        this._unwatch();
        this.scrollCallback = _.throttle(this.updateScroll.bind(this, false), 1000);
        this.$container.on('scroll', this.scrollCallback);
        return this;
    },
    updateDim: function () {
        if (this.options.horizontal) {
            this.width = this.$container.innerWidth();
            this.scrollWidth = this.$container.get(0).scrollWidth;
            if (this._containsHorizontal()) {
                this._setHorizontal('contains');
            }
        }
        if (this.options.vertical) {
            this.height = this.$container.innerHeight();
            this.scrollHeight = this.$container.get(0).scrollHeight;
            if (this._containsVertical()) {
                this._setVertical('contains');
            }
        }
        this.updateScroll();
        return this;
    },
    updateScroll: function () {
        // update scroll values
        if (this.options.horizontal) {
            this.scrollX = this.$container.scrollLeft();
        }
        if (this.options.vertical) {
            this.scrollY = this.$container.scrollTop();
        }
        // checks
        if (this.options.horizontal && !this._containsHorizontal()) {
            if (this._reachesLeft()) {
                this._setHorizontal('left');
            }
            else if (this._reachesRight()) {
                this._setHorizontal('right');
            }
            else {
                this._setHorizontal(null);
            }
        }
        if (this.options.vertical && !this._containsVertical()) {
            if (this._reachesTop()) {
                this._setVertical('top');
            }
            else if (this._reachesBottom()) {
                this._setVertical('bottom');
            }
            else {
                this._setVertical(null);
            }
        }
        return this;
    },
    start: function () {
        this.updateDim();
        this._watch();
        return this;
    },
    stop: function () {
        this._unwatch();
        // reset states
        this._setHorizontal(null);
        this._setVertical(null);
        return this;
    }
});

module.exports = function (container, options) {
    return new ScrollWatcher(container, options);
};
