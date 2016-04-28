var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var db = require(__dirname + '/../db');

var mapping = {
    'GET': get,
    'POST': post,
    'PUT': put,
    'DELETE': del,
};

var mappingCollection = null;

exports.crud = function(req, res) {
    var method = req.method;
    var collection = req.params.collection;
    if (mapping[method] != undefined && (!mappingCollection || mappingCollection[collection] === true)) {
    	mapping[method](collection, {body: req.body, query: req.query, params: req.params}, function(err, results) {
    	    if (err) {
    		    res.status(500).send(err);
            } else {
               res.send(results);
            }
    	});
    } else {
	   res.status(500).send({'err': 'collection ‘' + collection + '‘ does not exist.'});
    }
}

function put(collection, query, callback) {
    var id = null;
    var Model = db.database.collection(collection);

    try {
        id = new ObjectID(query.params.id);            
    } catch (e) {
        id = query.params.id;
    }
	Model.updateOne({_id: id}, { $set: query.body }, function(err, updated) {
	    if (!err) {
	  	    console.log(collection + ' updated - ' + id);
        }
	    callback(err, updated);
	});
};

function del(collection, query, callback) {
    var id = null;
    var Model = db.database.collection(collection);

    try {
        id = new ObjectID(query.params.id);            
    } catch (e) {
        id = query.params.id;
    }
    Model.deleteOne({_id: id}, function (err, removed) {
        if (!err) {
            console.log(collection + ' removed - ' + id);
        }
        callback(err, removed);
    });
};

function post(collection, query, callback) {
    var data = query.body;
    var Model = db.database.collection(collection);

    Model.insertOne(data, function(err, document) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, document);
        }
    });
};

function get(collection, query, callback) {
    var errors = [];
    var results = [];

    var Model = db.database.collection(collection);

    var id = query.params.id ? query.params.id : null;
    var pageSize = query.query['$limit'] ? parseInt(query.query['$limit']) : 20;
    var pageNumber = query.query['$page'] ? parseInt(query.query['$page']) : 1;
    var sortQuery = query.query['$sort'] ?  JSON.parse(query.query['$sort']) : {};
    var skip = query.query['$skip'] ? query.query['$skip'] : pageSize * (pageNumber - 1);

    if (skip) {
        delete (query.query['$skip']);
    } if (pageSize) {
	   delete (query.query['$limit']);
    } if (pageNumber) {
    	delete (query.query['$page']);
    } if (sortQuery) {
    	delete (query.query['$sort']);
    } if (id) {
        try {
            query.query._id = new ObjectID(id);            
        } catch (e) {
            query.query._id = id;
        }
    }

    var stream = Model.find(query.query).sort(sortQuery).skip(skip).limit(pageSize).stream();

    stream.on('data', function(data) {
        results.push(data);
    }).on('end', function() {
        if (errors.length <= 0) { errors = null; }
        callback(errors, results);
    }).on('error', function(err) {
        errors.push(err);
    });
};