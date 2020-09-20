const express = require('express');
const _ = require('underscore');
const { checkToken, checkAdmin_Role } = require('../../middlewares/authentication');



let app = express();

let job = require('../../models/job');





//===============================
//Mostrar job todos
//===============================
app.get('/jobs', checkToken, (req, res) => {


    let desde = req.query.desde || 0;
    let limit = req.query.limit;

    desde = Number(desde);
    limit = Number(limit);
    console.log(desde);
    console.log(limit);

    job.find({ status: true })
        .sort('name')
        .skip(desde)
        .limit(limit)
        .populate('department', '_id name')
        .exec((err, jobDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            job.countDocuments({ disponible: true }, (err, count) => {
                res.json({ ok: true, total: count, jobs: jobDB });
            })
        })
});

//===============================
//Mostrar job por id 
//===============================
app.get('/jobs/:id', (req, res) => {

    let id = req.params.id;
    console.log(id);
    job.findById(id, 'name')
        .populate('department', '_id name')
        .exec((err, jobDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            res.json({ ok: true, job: jobDB });
        })
});

//===============================
//buscar productos 
//===============================
app.get('/jobs/search/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // se le manda la i para  que sea insencible a mayusculas y minusculas
    job.find({ name: regex })
        .populate('department', '_id name')
        .exec((err, jobDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    msj: err
                })
            }
            res.json({ ok: true, job: jobDB });
        })
});

//===============================
//crear un producto
//===============================
app.post('/jobs', (req, res) => {

    let body = req.body;
    console.log(body);
    let jobObject = new job({
        name: body.name,
        department: body.department

    });
    console.log('trata de salvar');
    jobObject.save((err, jobDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        return res.status(201).json({
            ok: true,
            job: jobDB
        })
    })
});

//===============================
//Actualizar un producto
//===============================
app.put('/jobs/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name']);
    console.log(body);
    job.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, jobDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            job: jobDB
        })
    })
});

//===============================
//borrar un producto
//===============================
app.delete('/jobs/:id', (req, res) => {
    //desactiva el producto en lugar de borrarlo
    let id = req.params.id;

    job.findByIdAndUpdate(id, { status: false }, { new: true }, (err, jobDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msj: err
            })
        }
        res.json({
            ok: true,
            job: jobDB
        })
    })
});


module.exports = app;