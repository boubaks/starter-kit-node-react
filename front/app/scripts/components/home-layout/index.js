'use strict';
var React = require('react'),
    ReactDom = require('react-dom'),
    classNames = require('classnames'),
    template = require('./template.jsx'),
    eventsStore = require('../../stores/events'),
    authenticationStore = require('../../stores/authentication'),
    scrollWatcherMixin = require('../../mixins/scroll-watcher'),
    scrollLimitMixin = require('../../mixins/scroll-limit'),
    storeChangeMixin = require('../../mixins/store-change'),
    dispatcher = require('../../dispatcher');

module.exports = React.createClass({
    mixins: [
        scrollWatcherMixin('content', {
            horizontal: false,
            vertical: true,
            events: { 'reach:bottom contains:vertical': 'loadMore' },
            autoUpdate: 3000
        }),
        scrollLimitMixin({
            limit: function () {
                return this.refs.homeHeader ? ReactDom.findDOMNode(this.refs.homeHeader).offsetHeight : 0;
            },
            container: function () {
                return ReactDom.findDOMNode(this.refs.content);
            },
            above: function () {
                this.stickMainHeader();
            },
            under: function () {
                this.unstickMainHeader();
            }
        }),
        storeChangeMixin(eventsStore),
        storeChangeMixin(authenticationStore)
    ],
    getInitialState: function () {
        return {
            stickedMainHeader: false
        };
    },
    loadMore: function () {
        dispatcher.dispatch({
            type: 'LOAD_MORE_EVENTS'
        });
    },
    stickMainHeader: function () {
        this.setState({ stickedMainHeader: true });
    },
    unstickMainHeader: function () {
        this.setState({ stickedMainHeader: false });
    },
    render: function () {
        var helpers = {};
        helpers.classes = classNames({
            'home-layout': true,
            'sticked-main-header': this.state.stickedMainHeader
        });
        return template.call(this, helpers);
    }
});
