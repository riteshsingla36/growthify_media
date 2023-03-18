const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    userId: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    phoneNo: {
        type: Number,
        max: 9999999999,
        trim: true,
        unique: true,
        required: true,
    },
    userType: {
        type: String,
        trim: true,
        enum: ['Employee', 'Client']
    },
    status: {
        type: String,
        trim: true,
        enum: ['ACTIVE', 'INACTIVE']
    }

},
    {
        versionKey: false,
        timestamps: true,
    }
)

const User = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = User;