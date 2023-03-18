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
    onBoardingResource: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
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