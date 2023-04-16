const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    assignor: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        trim: true
    },
    assignee: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        trim: true
    },
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        trim: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    supportingLink: {
        type: String,
        trim: true
    },
    supportingRemarks: {
        type: String,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    deadline: {
        type: Date,
        trim: true
    },
    project: {
        type: String,
        trim: true
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        trim: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "inProgress", "completed"],
        default: "pending"
    }
},
    {
        versionKey: false,
        timestamps: true
    }
)

const Task = mongoose.models.task || mongoose.model('task', taskSchema);

module.exports = Task;