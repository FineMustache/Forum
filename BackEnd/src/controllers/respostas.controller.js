const Respostas = require('../models/resposta.model.js');
const con = require('../models/usuariosDAO');

const create = async (req, res) => {
    let string = Respostas.create(req.body);
    con.query(string, (err, result) => {
        if (err == null) {
            res.status(201).end();
        } else {
            res.status(400).json(err).end();
        }
    });
}

const del = (req, res) => {
    let string = Respostas.del(req.body);
    con.query(string, (err, result) => {
        if (err == null)
            if (result.affectedRows > 0)
                res.status(200).end();
            else
                res.status(404).end();
        else
            res.status(400).json(err).end();
    });
}

module.exports = {
    create,
    del
}