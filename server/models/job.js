var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidatos = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var jobSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: [true, 'name is necesary']
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department'
    },
    status: {
        type: Boolean,
        default: true
    }
});
jobSchema.plugin(uniqueValidatos, { message: '{PATH} debe de ser unico' });
jobSchema.plugin(autoIncrement.plugin, {
    model: 'job',
    field: 'id',
    startAt: 5000,
    incrementBy: 1
});
module.exports = mongoose.model('job', jobSchema);