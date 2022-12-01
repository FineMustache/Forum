const express = require('express');
const router = express.Router();

const Post = require('./controllers/posts.controller')
const User = require('./controllers/usuarios.controller')
const Votos = require('./controllers/votos.controller')
const Respostas = require('./controllers/respostas.controller')
const Fotos = require('./controllers/fotos.controller')

router.get("/offside/posts", Post.listarPosts);
router.get("/offside/post/:id", Post.listarPost);
router.post("/offside/posts", Post.cadastrarPost);
// router.delete("/receitas", Receita.excluirReceita);

router.get("/offside/usuarios/:nome", User.readUser)
router.post("/offside/usuarios/validar", User.validaUser)
router.post("/offside/usuarios", User.cadastrarUser)

router.get("/offside/votos", Votos.create)
router.post("/offside/votos", Votos.readAll)
router.put("/offside/votos/:id_usuario/:id_post", Votos.update)
router.delete("/offside/votos/:id_usuario/:id_post", Votos.del)

router.get("/offside/respostas", Respostas.create)
router.delete("/offside/respostas/:id", Respostas.del)

router.get("/offside/fotos/:id", Fotos.listarFotos)
router.post("/offside/fotos", Fotos.cadastrarFoto);

module.exports = router;