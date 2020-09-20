var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidatos = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var departmentSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: [true, 'name is necesary']
    }
});
departmentSchema.plugin(uniqueValidatos, { message: '{PATH} debe de ser unico' });
departmentSchema.plugin(autoIncrement.plugin, {
    model: 'Department',
    field: 'id',
    startAt: 5000,
    incrementBy: 1
});
module.exports = mongoose.model('department', departmentSchema);