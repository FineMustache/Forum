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
    fotos = [];
    tags = [];

    addComponent(com) {
      this.respostas.push(com);
      
    }

    addFotos(com){
      this.fotos.push(com)
    }

    addTags(com){
      this.tags.push(com)
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
        result = PostModel.toAscii(result)
        let posts = []
        result.forEach((r, index) => {
          let post = new Post(r.id, r.id_usuario, r.nome, r.titulo, r.corpo, r.votos, r.data)
          posts.push(post)
        })
        posts = Array.from(new Set(posts.map(a => a.id)))
            .map(id => {
              return posts.find(a => a.id === id)
            })

        posts.forEach((p, index) => {
          result.forEach(r => {
            if (p.id == r.id) {
              p.addFotos(r.foto)
            }
          })

          // con.query(`SELECT * from tags_posts WHERE id_post = ${p.id}`, (err2, result2) => {
          //   if (err2 == null) {
          //     result2.forEach((r, index2) => {
          //       con.query(`SELECT * from tags WHERE id = ${r.id_tag}`, (err3, result3) => {
          //         if (err == null) {
          //           p.addTags(result3[0])
          //         console.log(index, index2)
          //         if (index2 == result2.length + 1 && index == posts.length + 1) {
                    
          //         }
          //         res.json(posts).end();
          //         } else {
          //           res.json(err).end()
          //         }
                  
          //       })
          //     });
          //   } else {
          //     res.json(err).end()
          //   }
          // })
        })

        res.json(posts).end();

        

        
      } else {
        res.json(err).end()
      }
    });
  };

  const listarPost = (req, res) => {
      let string = PostModel.read(req.params);
      con.query(string, (err, result) => {
          if (err == null) {
          let post = new Post(result[0].id, result[0].id_usuario, result[0].nome, result[0].titulo, result[0].corpo, result[0].votos, result[0].data)
          con.query(`SELECT * from vw_resp where id=${result[0].id}`, (err2, result2) => {
              if(err2 !== null){
                  res.json(err2).end()
              } else {
                  console.log(result2)
                  result2.forEach((r, index) => {
                      let resp = new Resposta(r.id, r.nome_resposta, r.resp_corpo, r.resp_data)
                      console.log(resp)
                      con.query(`SELECT * from treplicas where id_resposta = ${r.id}`, (err3, result3) => {
                        if (err3 !== null) {
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
