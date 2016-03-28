'use strict';
var jq = require('jquery');

var loadScript = function (callback) {
    // async callback called by script
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '', // to complete
            xfbml: true,
            version: 'v2.4'
        });
        callback(window.FB);
    };
    // load script
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};

var manager = {
    loaded: false,
    load: function () {
        var deferred = new jq.Deferred();
        // alredy loaded
        if (this.loaded) {
            return deferred.resolve(window.FB);
        }
        // async load
        loadScript(function (FB) {
            manager.loaded = true;
            deferred.resolve(FB);
        });
        return deferred;
    }
};

// preload FB api
manager.load();

module.exports = manager;
