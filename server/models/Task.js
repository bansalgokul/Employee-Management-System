const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    description: {
        type: String,
        required: true,
    },

    taskID: {
        type: String,
        required: true,
    },

    project: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },

    startedAt: {
        type: Schema.Types.Date,
        required: true,
        default: Date.now(),
    },

    endedAt: {
        type: Schema.Types.Date,
        required: true,
        default: Date.now(),
    }
})

const Task = model('Task', taskSchema);

module.exports = Task;