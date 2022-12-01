const Foto = require('../models/fotos.model')
const con = require("../models/usuariosDAO");
const dotenv = require('dotenv')
dotenv.config()
const multer = require('multer');
const upload = multer().single('foto')

const cadastrarFoto = (req, res) => {
    upload(req, res, (errMulter) => {
        if (errMulter == null) {
            con.query(Foto.toCreate(req.body, req.file), (err, result) => {
                if (err == null) {
                    res.status(201).json(result).end()
                } else {
                    res.status(500).json(err).end()
                }
            })
        } else {
            res.status(500).json(errMulter).end()
        }
    })
}

const listarFotos = (req, res) => {
    con.query(Foto.toRead(req.params), (err, result) => {
        if (err == null) {
            res.status(201).json(result).end()
        } else {
            res.status(500).json(err).end()
        }
    })
}

module.exports = {
    cadastrarFoto,
    listarFotos
}