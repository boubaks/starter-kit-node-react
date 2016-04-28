var User = require('../models/user');

exports.delete = function(req, res) {
    User.remove({_id: req.user._id}, function (err) {
        if (err) {
              res.status(500).send(err);
        } else {
            res.send({remove: 'user removed'});
        }
    });
};

exports.put = function(req, res) {
    User.findById(req.user._id, function (err, user) {
        if (err) {
            res.status(500).send(err);
        } else {
            user.email = req.body.email ? req.body.email : user.email;
            user.password = req.body.password ? req.body.password : user.password;
            user.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send({update: user});
                }
              });
        }
    });
};

exports.post = function(req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send({insert: user});
        }
    });
};

var getOptions = function(query) {
    var limit = query.$limit ? query.$limit : 20;
    var skip = query.$page ? query.$page * limit : 0;
    var options = {
        limit: limit,
        skip: skip
    };
    delete (query.$limit);
    delete (query.$page);
    return (options);
};

exports.get = function(req, res) {
    var options = getOptions(req.query);

    User.find({}, {}, options, function(err, users) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(users);
        }
    });
};
