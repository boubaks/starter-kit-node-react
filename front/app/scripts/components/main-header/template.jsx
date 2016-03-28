'use strict';
var React = require('react');

module.exports = function (helpers) {
    return (
        <div className={helpers.classes}>
            <h1 className="name">evnt.co</h1>
            <button className="signin-button">Sign in</button>
            <button className="signup-button">Sign up</button>
        </div>
    );
};