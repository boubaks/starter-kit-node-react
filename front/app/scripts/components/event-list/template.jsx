'use strict';
var React = require('react'),
	EventTeaser = require('../event-teaser');

module.exports = function (helpers) {
    return (
        <div className={helpers.classes}>
            {
                !!this.props.events.length && this.props.events.map(function (event) {
                	console.log('event', event);
                    return <EventTeaser key={'event' + event.id} event={event} />;
                }, this)
            }
            {!this.props.events.isFull && <button className="load-more-button" onClick={this.props.loadMore}>See More</button>}
        </div>
    );
};