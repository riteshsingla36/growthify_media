const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    assignor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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