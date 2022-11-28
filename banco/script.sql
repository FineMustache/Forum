DROP DATABASE IF EXISTS offside;
CREATE DATABASE offside charset=UTF8 collate utf8_general_ci;

USE offside;

CREATE TABLE usuarios (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    foto mediumblob NOT NULL
);

CREATE TABLE posts (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    id_usuario int not null,
    titulo varchar(100) not null,
    corpo varchar(5000),
    votos int NOT NULL,
    data DATETIME not null,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE respostas (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    id_post int not null,
    id_usuario int NOT NULL,
    corpo varchar(500) NOT NULL,
    data DATETIME not null,
    FOREIGN KEY (id_post) REFERENCES posts(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE treplicas (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    id_resposta int not null,
    id_usuario int not null,
    corpo varchar(500) NOT NULL,
    data DATETIME not null,
    FOREIGN KEY (id_resposta) REFERENCES respostas(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE fotos (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    foto mediumblob not null,
    id_post int not null,
    FOREIGN KEY (id_post) REFERENCES posts(id)
);

CREATE TABLE votos (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    id_post int not null,
    id_usuario int not null,
    tipo boolean NOT NULL,
    FOREIGN KEY (id_post) REFERENCES posts(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE tags (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(20) not null,
    cor VARCHAR(7) not null
);

CREATE TABLE tags_posts (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    id_post int not null,
    id_tag int not null,
    FOREIGN KEY (id_post) REFERENCES posts(id),
    FOREIGN KEY (id_tag) REFERENCES tags(id)
);

CREATE TABLE favoritos (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    id_usuario int not null,
    id_tag int not null,
    FOREIGN KEY (id_tag) REFERENCES tags(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);


CREATE VIEW vw_posts AS
SELECT p.id, p.id_usuario, p.titulo, p.corpo, p.votos, p.data, u.nome, f.foto, t.nome as nome_tag, t.cor from usuarios u
LEFT JOIN posts p ON p.id_usuario = u.id
LEFT JOIN fotos f ON f.id_post = p.id
LEFT JOIN tags_posts tp ON tp.id_post = p.id
LEFT JOIN tags t ON t.id = tp.id_tag;

CREATE VIEW vw_resp AS
SELECT p.id, r.id as id_resp, r.corpo as resp_corpo, r.data as resp_data, u.nome as nome_resposta from vw_posts p
INNER JOIN respostas r ON r.id_post = p.id
INNER JOIN usuarios u ON u.id = r.id_usuario;