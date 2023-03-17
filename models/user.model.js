const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    userName: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true
    },
    phoneNo: {
        type: Number,
        max: 9999999999,
        trim: true,
        unique: true,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ['employee', 'client'],
        default: 'employee'
    }

},
    {
        versionKey: false,
        timestamps: true,
    }
)

const User = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = User;