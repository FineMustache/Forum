const UserModel = require("../models/usuario.model");
const con = require("../models/usuariosDAO");

const cadastrarUser = async (req, res) => {
    let string = UserModel.toCreate(req.body, req.file);
    con.query(string, (err, result) => {
      if (err == null) {
        res.status(201).json(result).end();
      } else {
        res.status(500).json(err).end();
      }
    });
  };