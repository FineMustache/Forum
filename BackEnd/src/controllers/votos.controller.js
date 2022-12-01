const Votos = require('../models/voto.model.js');
const con = require('../models/usuariosDAO.js');

const create = async (req, res) => {
    let string = Votos.create(req.body);
    con.query(string, (err, result) => {
        if (err == null) {
            res.status(201).json(result).end();
        } else {
            res.status(400).json(err).end();
        }
    });
}

const readAll = (req, res) => {
    let string = Votos.readAll();
    con.query(string, (err, result) => {
        if (err == null) {
            //res.json(result).end();
            res.json(result).end();
        }
    });
}

const readFromUser = (req, res) => {
    let string = Votos.readFromUser(req.params)
    con.query(string, (err, result) => {
        if (err == null) {
            res.status(201).json(result).end()
        }
    })
}

const update = (req, res) => {
    let string = Votos.update(req.body);
    con.query(string, (err, result) => {
        if (err == null)
            if (result.affectedRows > 0)
                res.status(200).json(result).end();
            else
                res.status(404).end();
        else
            res.status(400).json(err).end();
    });
}

const del = (req, res) => {
    let string = Votos.del(req.body);
    con.query(string, (err, result) => {
        if (err == null)
            if (result.affectedRows > 0)
                res.status(200).json(result).end();
            else
                res.status(404).end();
        else
            res.status(400).json(err).end();
    });
}

module.exports = {
    create,
    readAll,
    update,
    del,
    readFromUser
}