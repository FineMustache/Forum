const Foto = require('../models/fotos.model')
const con = require("../models/usuariosDAO");
const dotenv = require('dotenv')
dotenv.config()
const multer = require('multer');
const upload = multer().array('fotos')

const cadastrarFoto = (req, res) => {
    upload(req, res, (errMulter) => {
        if (errMulter == null) {
            req.files.forEach((f, index) => {
                con.query(Foto.toCreate(req.body, f), (err, result) => {
                    if (err == null) {
                        if (index == req.files.length - 1) {
                            res.redirect('http://localhost:5500/frontend/pages/home')   
                        }
                    } else {
                        res.status(500).json(err).end()
                        return
                    }
                })
            })
            
        } else {
            console.log(errMulter)
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