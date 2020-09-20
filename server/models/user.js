const mongoose = require('mongoose');
const uniqueValidatos = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'SUPER_ROLE'],
    message: '{VALUE} no es un rol valido.'
};

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contrasena es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, 'rol requerido'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    google: {
        type: Boolean,
        required: true,
        default: false
    },
});
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
userSchema.plugin(uniqueValidatos, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model('user', userSchema);