const con = require("../models/usuariosDAO")
const TP = require("../models/tags_posts.model")

const toCreate = (req, res) => {
    con.query(TP.toCreate(req.body), (err, result) => {
        if (err == null) {
            res.status(201).json(result).end()
        } else {
            res.status(500).json(err).end()
        }
    })
}

const toDelete = (req, res) => {
    let string = TP.toDelete(req.body);
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
    toDelete
}