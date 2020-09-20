const express = require('express');
const _ = require('underscore');

let app = express();

let department = require('../../models/department');





//===============================
//Mostrar productos todos
//===============================
app.get('/departments', (req, res) => {

    let desde = req.query.desde || 0;
    let limit = req.query.limit;

    desde = Number(desde);
    limit = Number(limit);

    department.find({ disponible: true })
        .sort('name')
        .skip(desde)
        .limit(limit)
        .exec((err, departmentDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            department.countDocuments({ enable: true }, (err, count) => {
                res.json({ ok: true, total: count, jobs: departmentDB });
            })
        })
});

//===============================
//Mostrar productos por id 
//===============================
app.get('/departments/:id', (req, res) => {

    let id = req.params.id;
    department.findById(id, 'name')
        .exec((err, departmentDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            res.json({ ok: true, department: departmentDB });
        })
});

//===============================
//buscar productos 
//===============================
app.get('/departments/search/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // se le manda la i para  que sea insencible a mayusculas y minusculas
    department.find({ name: regex })

    .exec((err, departmentDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({ ok: true, department: departmentDB });
    })
});

//===============================
//crear un producto
//===============================
app.post('/departments', (req, res) => {

    let body = req.body;
    console.log(body);
    let departmentNew = new department({
        name: body.name
    });
    departmentNew.save((err, departmentDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        return res.status(201).json({
            ok: true,
            department: departmentDB
        })
    })
});

//===============================
//Actualizar un producto
//===============================
app.put('/departments/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name']);
    console.log(body);
    department.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, departmentDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            department: departmentDB
        })
    })
});

//===============================
//borrar un producto
//===============================
app.delete('/departments/:id', (req, res) => {

    let id = req.params.id;

    department.findByIdAndUpdate(id, { enable: false }, { new: true }, (err, departmentDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            department: departmentDB
        })
    })
});


module.exports = app;