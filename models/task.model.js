const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    assignor: {
        type: String,
        trim: true
    },
    assignee: {
        type: String,
        trim: true
    },
    client: {
        type: String,
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
    updatedBy: {
        type: String,
        trim: true
    },
    createdBy: {
        type: String,
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