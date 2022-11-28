const express = require('express');
const router = express.Router();

const Post = require('./controllers/posts.controller')

router.get("/offside/posts", Post.listarPosts);
router.get("/offside/post/:id", Post.listarPost);
router.post("/offside/posts", Post.cadastrarPost);
// router.delete("/receitas", Receita.excluirReceita);

module.exports = router;