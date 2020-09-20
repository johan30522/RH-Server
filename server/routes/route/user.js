const express = require('express');
const app = express();
const user = require('../../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { checkToken, checkAdmin_Role } = require('../../middlewares/authentication');

app.get('/user', checkToken, (req, res) => {


    user.find({ estado: true })
        .exec((err, usersDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }

            res.json({ ok: true, users: usersDB });
        })
})

app.get('/user/Paginate', checkToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limit = req.query.limit;

    desde = Number(desde);
    limit = Number(limit);


    user.find({ status: true }, 'name email role status')
        .skip(desde)
        .limit(limit)
        .exec((err, usersDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            user.countDocuments({ status: true }, (err, count) => {

                res.json({ ok: true, total: count, users: usersDB });

            })

        })
})
app.put('/user/:id', [checkToken, checkAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'role', 'status']);



    user.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            user: userDB
        })
    })

    console.log(id);

})
app.post('/user', (req, res) => {
    let body = req.body;
    let usernew = new user({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usernew.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        return res.json({
            ok: true,
            user: userDB
        })
    })
})
app.delete('/user/:id', [checkToken, checkAdmin_Role], (req, res) => {
    let id = req.params.id;
    console.log(id);
    user.findOneAndRemove(id, (err, userBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        if (!userBorrado) {
            return res.status(400).json({
                ok: false,
                msj: 'Error user no encontrado'
            })
        }
        res.json({
            ok: true,
            user: userBorrado
        })
    })

})
app.delete('/user/desactivate/:id', checkToken, (req, res) => {
    let id = req.params.id;

    user.findByIdAndUpdate(id, { status: false }, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            user: userDB
        })
    })

    console.log(id);

})


module.exports = app;