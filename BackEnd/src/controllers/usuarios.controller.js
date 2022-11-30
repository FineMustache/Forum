const UserModel = require("../models/usuario.model");
const con = require("../models/usuariosDAO");
const dotenv = require('dotenv')
dotenv.config()
const bcrypt = require('bcrypt')
// bcrypt.genSalt(10, function(err, salt) {
// bcrypt.hash("SenhaTop12", salt, function(errCrypto, hash) {
//   console.log(hash)
// })
// })

const cadastrarUser = async (req, res) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.senha, salt, function(errCrypto, hash) {
      if(errCrypto == null){
        req.body.senha = hash
        let string = UserModel.toCreate(req.body, req.file);
        con.query(string, (err, result) => {
          if (err == null) {
            res.status(201).json(result).end();
          } else {
            res.status(500).json(err).end();
          }
        });
      } else {
        res.status(500).json(errCrypto).end()
      }
    });
  })
    
  };

const validaUser = async (req, res) => {
  let string = UserModel.toRead(req.body)
  con.query(string, (err, result) => {
    if (err == null) {
      bcrypt.compare(req.body.senha, result[0].senha).then((value) => {
        if (value) {
          res.status(201).json({"validation": true, "username": result[0].nome, "uid": result[0].id}).end()
        } else {
          res.status(201).json({"validation": false}).end()
        }
      })
      
    } else {
      res.status(500).json(err).end();
    }
  })
}

module.exports = {
  cadastrarUser,
  validaUser
}