class User {
  constructor(id, nome, senha, foto, tipo){
    this.id = id
    this.nome = nome
    this.senha = senha
    this.foto = foto
    this.tipo = tipo
  }

  favoritos = []

  addFavorito = (fav) => {
    this.favoritos.push(fav)
  }
}


const UserModel = require("../models/usuario.model");
const jwt = require("jsonwebtoken")
const con = require("../models/usuariosDAO");
const dotenv = require('dotenv')
dotenv.config()
const multer = require('multer');
const upload = multer().single('foto')
const bcrypt = require('bcrypt')
// bcrypt.genSalt(10, function(err, salt) {
// bcrypt.hash("SenhaTop12", salt, function(errCrypto, hash) {
//   console.log(hash)
// })
// })

const readUser = async (req, res) => {
  con.query(UserModel.toRead(req.params), (err, result) => {
    if (err == null) {
      if (result.length > 0) {
        let user = new User(result[0].id, result[0].nome, result[0].senha, result[0].foto, result[0].tipo)
        result.forEach(r => {
          user.addFavorito(r.nome_tag)
        })
        res.status(201).json(UserModel.toAscii([user])).end()
      } else {
        res.status(201).json({"message": "Usuário não encontrado"})
      }
      
    } else {
      console.log(err)
      res.status(500).json(err).end()
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
              req.body["id_role"] = 2
              let string = UserModel.toCreate(req.body, req.file);
              
              con.query(string, (err2, result) => {
                if (err2 == null) {
                  if (req.body.mobile !== undefined) {
                    res.json(result)
                  } else {
                    res.redirect("http://localhost:5500/frontend/pages/cadastroSucesso")
                  }
                  
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

const redefinirSenha = async (req, res) => {
  bcrypt.genSalt(10, function(err, salt) {
    if (err == null) {
      bcrypt.hash(req.body.novaSenha, salt, function(errCrypto, hash) {
        console.log(errCrypto)
        if(errCrypto == null){
          req.body.novaSenha = hash
          let string = UserModel.toUpdatePassword(req.body)
  
          con.query(string, (err, result) => {
            if (err == null) {
              if (result.affectedRows > 0) {
                res.status(200).json({'success':true}).end()
              } else {
                res.status(404).json({'success':false}).end()
              }
            } else {
              res.status(500).json(err).end()
            }
          })
        } else {
          res.status(500).json(errCrypto).end()
        }
      });
    } else {
      res.status(500).json(err).end()
    }
  })
  let string = UserModel.toUpdatePassword(req.body)
  
  con.query(string, (err, result) => {
    if (err == null) {
      if (result.affectedRows > 0) {
        
      }
    }
  })
}

const validaUser = async (req, res, next) => {
  let string = UserModel.toRead(req.body)
  con.query(string, (err, result) => {
    if (err == null) {
      if (result.length > 0) {
        bcrypt.compare(req.body.senha, result[0].senha).then((value) => {
          if (value) {
            let data = {"uid": result[0].id, "role": result[0].tipo}
            jwt.sign(data, process.env.KEY, {expiresIn: '20m'}, function(err2, token) {
              if(err2 == null){
                if (req.body.update === true) {
                  next()
                }else{
                  res.status(200).json({"token": token, "uid": result[0].id, "uname": result[0].nome, "validation": true}).end()
                }
              } else {
                  res.status(404).json(err2).end()
              }
              
            })  
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
  readUser,
  redefinirSenha
}