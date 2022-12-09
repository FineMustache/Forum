const express = require('express');
const router = express.Router();

const Post = require('./controllers/posts.controller')
const User = require('./controllers/usuarios.controller')
const Votos = require('./controllers/votos.controller')
const Respostas = require('./controllers/respostas.controller')
const Treplicas = require('./controllers/treplicas.controller')
const Fotos = require('./controllers/fotos.controller')
const Favoritos = require("./controllers/favoritos.controller")
const TP = require("./controllers/tags_posts.controller")
const Middleware = require("./middleware/middleware")

router.get("/offside/posts", Post.listarPosts);
router.get("/offside/post/:id", Post.listarPost);
router.post("/offside/posts", Middleware.validaAcesso, Post.cadastrarPost);

router.get("/offside/usuarios/:nome", User.readUser)
router.post("/offside/usuarios/validar", User.validaUser)
router.post("/offside/usuarios", User.cadastrarUser)
router.post("/offside/usuarios/redsenha", Middleware.validaAcesso, User.validaUser, User.redefinirSenha)

router.get("/offside/votos", Votos.readAll)
router.get("/offside/votos/:id", Votos.readFromUser)
router.post("/offside/votos", Middleware.validaAcesso, Votos.create)
router.put("/offside/votos", Middleware.validaAcesso, Votos.update)
router.delete("/offside/votos", Votos.del)

router.post("/offside/respostas", Middleware.validaAcesso, Respostas.create)
router.delete("/offside/respostas", Respostas.del)

router.post("/offside/treplicas", Middleware.validaAcesso, Treplicas.toCreate)
router.delete("/offside/treplicas", Treplicas.del)

router.get("/offside/fotos/:id", Fotos.listarFotos)
router.post("/offside/fotos", Fotos.cadastrarFoto);

router.post("/offside/favoritos", Favoritos.toCreate)
router.delete("/offside/favoritos", Favoritos.toDelete)

router.post("/offside/tags_posts", TP.toCreate)
router.delete("/offside/tags_posts", TP.toDelete)

router.get("/offside/validate/:id", Middleware.permitir)

module.exports = router;