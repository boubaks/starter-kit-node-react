'use strict';

module.exports = function (store) {
    var render;
    return {
        componentDidMount: function () {
            render = function () {
                return this.isMounted() && this.forceUpdate();
            }.bind(this);
            store.addChangeListener(render);
        },
        componentWillUnmount: function () {
            store.removeChangeListener(render);
        }
    };
};
