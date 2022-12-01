class User {
  constructor(id, nome, senha, foto){
    this.id = id
    this.nome = nome
    this.senha = senha
    this.foto = foto
  }

  favoritos = []

  addFavorito = (fav) => {
    this.favoritos.push(fav)
  }
}


const UserModel = require("../models/usuario.model");
const con = require("../models/usuariosDAO");
const dotenv = require('dotenv')
dotenv.config()
const multer = require('multer');
const upload = multer().single('foto')
const bcrypt = require('bcrypt')
bcrypt.genSalt(10, function(err, salt) {
bcrypt.hash("SenhaTop12", salt, function(errCrypto, hash) {
  console.log(hash)
})
})

const readUser = async (req, res) => {
  con.query(UserModel.toRead(req.params), (err, result) => {
    if (err == null) {
      if (result.length > 0) {
        let user = new User(result[0].id, result[0].nome, result[0].senha, result[0].foto)
        result.forEach(r => {
          user.addFavorito(r.nome_tag)
        })
        res.status(201).json(UserModel.toAscii([user])).end()
      } else {
        res.status(201).json({"message": "Usuário não encontrado"})
      }
      
    } else {
      res.status(500).json(err)
    }
  })
}

const cadastrarUser = async (req, res) => {
  upload(req, res, (errMulter) => {
    if (errMulter == null) {
      bcrypt.genSalt(10, function(err, salt) {
        if (err == null) {
          bcrypt.hash(req.body.senha, salt, function(errCrypto, hash) {
            console.log(errCrypto)
            if(errCrypto == null){
              req.body.senha = hash
              let string = UserModel.toCreate(req.body, req.file);
              
              con.query(string, (err2, result) => {
                if (err2 == null) {
                  res.status(201).json(result).end();
                } else {
                  res.status(500).json(err2).end();
                }
              });
            } else {
              res.status(500).json(errCrypto).end()
            }
          });
        } else {
          res.status(500).json(err).end()
        }
      })
    } else {
      res.status(500).json(errMulter).end()
    }
    
      
    })
  }


const validaUser = async (req, res) => {
  let string = UserModel.toRead(req.body)
  con.query(string, (err, result) => {
    if (err == null) {
      if (result.length > 0) {
        bcrypt.compare(req.body.senha, result[0].senha).then((value) => {
          if (value) {
            res.status(201).json({"validation": true, "username": result[0].nome, "uid": result[0].id}).end()
          } else {
            res.status(201).json({"validation": false}).end()
          }
        })
      } else {
        res.json({"validation": false})
      }
      
      
    } else {
      res.status(500).json(err).end();
    }
  })
}

module.exports = {
  cadastrarUser,
  validaUser,
  readUser
}