var assert = require("assert");
var url = require("url");
var Zombie = require('zombie');
var requestify = require('requestify');
var baseUrl = "http://localhost:1337";

var request = require('superagent');
var user = request.agent();

function show(log) {
    console.log('\n');
    console.log(log);
    console.log('\n');
}

function publicGet(url, done) {
    requestify.get(url).then(function(response) {
        try {
            var json = response.getBody();
            show(json);
            if (json && json.length > 0) {
                done();
            }
        } catch (e) {
            show(e, "ERR");
        }
    });   
}

function get(url, done) {
    show(url);
    user
      .get(url)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
        console.log('error:', res.error);
        console.log('result:', res.text);
        done();
      });
}

function validPost(url, body, done) {
    show(url);
    user
      .post(url)
      .send(body)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
        console.log('error:', res.error);
        console.log('result:', res.text);
        if (res.body && res.body._id) {
            body._id = res.body._id;
        }
        setTimeout(function() { 
            if (res.error == false) {
                done();
            }
        }, 1000);
      });
}

function post(url, body, done) {
    show(url);
    user
      .post(url)
      .send(body)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
        console.log('error:', res.error);
        console.log('result:', res.text);
        if (res.body && res.body._id) {
            body._id = res.body._id;
        }
        setTimeout(function() { 
            if (res.error != false) {
                done();
            }
        }, 1000);
      });
}

function put(url, body, done) {
    show(url);
    user
      .put(url)
      .send(body)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
        console.log('error:', res.error);
        console.log('result:', res.text);
        setTimeout(function() { 
            if (res.error != false) {
                done();
            }
        }, 1000);
      });
}

function validDel(url, body, done) {
    show(url);
    user
      .del(url)
      .send(body)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
        console.log('error:', res.error);
        console.log('result:', res.text);
        setTimeout(function() { 
            if (res.error == false) {
                done();
            }
        }, 1000);
      });
}

function del(url, body, done) {
    show(url);
    user
      .del(url)
      .send(body)
      .set('content-type', 'application/x-www-form-urlencoded')
      .end(function(err, res) {
        console.log('error:', res.error);
        console.log('result:', res.text);
        setTimeout(function() { 
            if (res.error != false) {
                done();
            }
        }, 1000);
      });
}

describe('API test', function() {
});
