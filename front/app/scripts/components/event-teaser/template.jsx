'use strict';
var React = require('react');

module.exports = function (helpers) {
    var backgroundImageStyle = { backgroundImage: 'url(' + this.props.event.get('cover') + ')' };
    return (
        <div className={helpers.classes}>
            <div className="event-background" style={backgroundImageStyle}>
                <h1 className="event-title">{this.props.event.get('title')}</h1>
            </div>
        </div>
    );
};