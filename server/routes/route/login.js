const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const user = require('../../models/user');


app.post('/login', function(req, res) {

    console.log('intenta login');

    let body = req.body;
    console.log(body);

    user.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            console.log('debug01');
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!userDB) {
            console.log('debug04');
            return res.status(400).json({
                ok: true,
                msj: 'incorrect (User) or password '
            })
        };
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            console.log('debug03');
            return res.status(400).json({
                ok: false,
                msj: 'incorrect user or (password)'
            })
        }

        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        console.log('debug04');
        return res.json({
            usuario: userDB,
            token
        })
    })
})



module.exports = app;