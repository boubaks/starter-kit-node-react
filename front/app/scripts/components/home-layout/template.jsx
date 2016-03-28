'use strict';
var React = require('react'),
    MainHeader = require('../main-header'),
    EventList = require('../event-list'),
    eventsStore = require('../../stores/events'),
    authenticationStore = require('../../stores/authentication');

module.exports = function (helpers) {
    var authentication = authenticationStore.getData();
    var events = eventsStore.getData();
    var backgroundImageStyle = { backgroundImage: 'url(https://unsplash.it/1200/?random&blur)' };
    return (
        <div className={helpers.classes}>
            <div ref="content" className="content">
                <MainHeader ref="mainHeader" authentication={authentication}>&nbsp;</MainHeader>
                <div className="cover" >
                    <div className="background" style={backgroundImageStyle}>
                        <div className="header-info">
                            <h1 className="header-message">Complex web apps made easy</h1>
                            <h2 className="header-description">starter-kit-node-react helps you build fast, robust, and modular web apps.</h2>
                        </div>
                    </div>
                </div>
                <div className="content-list">
                    <EventList events={events} authentication={authenticationStore.getData()} loadMore={this.loadMore}/>
                </div>
            </div>
        </div>
    );
};