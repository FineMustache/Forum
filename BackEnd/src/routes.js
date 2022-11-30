const express = require('express');
const router = express.Router();

const Post = require('./controllers/posts.controller')
const User = require('./controllers/usuarios.controller')

router.get("/offside/posts", Post.listarPosts);
router.get("/offside/post/:id", Post.listarPost);
router.post("/offside/posts", Post.cadastrarPost);
// router.delete("/receitas", Receita.excluirReceita);

router.post("/offside/usuarios/validar", User.validaUser)
router.post("/offside/usuarios", User.cadastrarUser)

module.exports = router;