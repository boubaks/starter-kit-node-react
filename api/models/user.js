var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    facebookId: {
        type: String
    },
    updatedAt: {
        type: Date
    },
    createdAt: {
        type: Date
    }
});

UserSchema.pre('save', function(next) {
    var user = this;

    var currentDate = new Date();
    user.updatedAt = currentDate;
    if (!user.createdAt) {
        user.createdAt = currentDate;
    }
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(5, function(err, salt) {
        if (err) { 
        	 return next(err); 
       	}
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);