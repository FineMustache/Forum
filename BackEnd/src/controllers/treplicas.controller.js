const con = require('../models/usuariosDAO')
const Treplica = require('../models/treplicas.model')

const toCreate = (req, res) => {
    con.query(Treplica.toCreate(req.body), (err, result) => {
        if (err == null) {
            res.status(201).json(result).end()
        } else {
            res.status(500).json(err).end()
        }
    })
}

const del = (req, res) => {
    let string = Treplica.toDelete(req.body);
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
    toCreate,
    del
}