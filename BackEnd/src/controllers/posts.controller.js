  const PostModel = require("../models/post.model");
  const con = require("../models/usuariosDAO");
  const multer = require("multer");
  const upload = multer().single("foto");

  class Post {

    constructor(id, id_usuario, nome_usuario, titulo, corpo, votos, data) {
          this.id = id
      this.id_usuario = id_usuario
          this.nome_usuario = nome_usuario
          this.titulo = titulo
          this.corpo = corpo,
          this.votos = votos,
          this.data = data
    }

    respostas = [];

    addComponent(com) {
      this.respostas.push(com);
      
    }
  }

  class Resposta {

    constructor(id, nome_usuario, corpo, data) {
      this.id = id
          this.nome_usuario = nome_usuario
          this.corpo = corpo
          this.data = data
    }

    treplica = {}

      addComponent(com) {
      this.treplica = com;
    }
  }

  const cadastrarPost = async (req, res) => {
    let string = PostModel.create(req.body, req.file);
    con.query(string, (err, result) => {
      if (err == null) {
        res.status(201).json(result).end();
      } else {
        res.status(500).json(err).end();
      }
    });
  };

  const listarPosts = (req, res) => {
    let string = PostModel.readAll();
    con.query(string, (err, result) => {
      if (err == null) {
        //res.json(result).end();
        res.json(result).end();
      }
    });
  };

  const listarPost = (req, res) => {
      let string = PostModel.read(req.params);
      con.query(string, (err, result) => {
          if (err == null) {
          let post = new Post(result[0].id, result[0].id_usuario, result[0].nome, result[0].titulo, result[0].corpo, result[0].votos, result[0].data)
          con.query(`SELECT * from vw_resp where id=${result[0].id}`, (err2, result2) => {
              if(err !== null){
                  res.json(err2).end()
              } else {
                  console.log(result2)
                  result2.forEach((r, index) => {
                      let resp = new Resposta(r.id, r.nome_resposta, r.resp_corpo, r.resp_data)
                      console.log(resp)
                      con.query(`SELECT * from treplicas where id_resposta = ${r.id}`, (err3, result3) => {
                        if (err !== null) {
                          res.json(err3).end()
                        } else {
                          resp.addComponent(result3[0])
                          post.addComponent(resp)
                          if (index == result2.length - 1) {
                            res.json(post).end();
                          }
                          
                        }
                      })
                      
                  });
              }
          })
          } else {
            res.json(err).end()
          }
      });
  };

  module.exports = {
    cadastrarPost,
    listarPosts,
    listarPost,
  };
