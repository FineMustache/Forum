DROP DATABASE IF EXISTS offside;
CREATE DATABASE offside charset=UTF8 collate utf8_general_ci;

USE offside;

CREATE TABLE roles (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    tipo varchar(5) not null
);

CREATE TABLE usuarios (
    id int not null PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    id_role int NOT NULL,
    foto mediumblob,
    FOREIGN KEY (id_role) REFERENCES roles(id)
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
    foto mediumblob,
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
SELECT p.id, p.id_usuario, p.titulo, p.corpo, p.votos, p.data, u.nome, f.foto from usuarios u
INNER JOIN posts p ON p.id_usuario = u.id
LEFT JOIN fotos f ON f.id_post = p.id
ORDER BY p.id DESC;

CREATE VIEW vw_trep AS
SELECT t.*, u.nome FROM treplicas t
INNER JOIN usuarios u ON t.id_usuario = u.id;

CREATE VIEW vw_resp AS
SELECT p.id, r.id as id_resp, r.corpo as resp_corpo, r.data as resp_data, u.nome as nome_resposta, t.corpo as corpo_treplica, t.nome as nome_treplica, t.data as data_treplica from posts p
INNER JOIN respostas r ON r.id_post = p.id
INNER JOIN usuarios u ON u.id = r.id_usuario
LEFT JOIN vw_trep t ON t.id_resposta = r.id;

CREATE VIEW vw_usuarios AS
SELECT u.*, t.nome as nome_tag, r.tipo from usuarios u
LEFT JOIN favoritos f on u.id = f.id_usuario
LEFT JOIN tags t on t.id = f.id_tag
INNER JOIN roles r on r.id = u.id_role;

CREATE VIEW vw_tags_posts AS
SELECT tp.*, t.nome from tags_posts tp
INNER JOIN tags t ON t.id = tp.id_tag;

INSERT INTO roles VALUES
(DEFAULT, "ADMIN"),
(DEFAULT, "USER");

INSERT INTO usuarios VALUES
(DEFAULT, "finemustache", "$2b$10$.kIl9dZA1SvgtEwIGREawuDZco9vN9IZyxS86vqzBDLYyruqaOmVC", 1, NULL),
(DEFAULT, "vinimalvadao", "$2b$10$.kIl9dZA1SvgtEwIGREawuDZco9vN9IZyxS86vqzBDLYyruqaOmVC", 2, NULL),
(DEFAULT, "sanzappa", "$2b$10$.kIl9dZA1SvgtEwIGREawuDZco9vN9IZyxS86vqzBDLYyruqaOmVC", 2, NULL),
(DEFAULT, "felipe357", "$2b$10$.kIl9dZA1SvgtEwIGREawuDZco9vN9IZyxS86vqzBDLYyruqaOmVC", 2, NULL);

#Caminho CASA C:/Users/usuario/Documents/SENAI2022/forum/docs/
#Caminho SENAI C:/Users/des/Documents/Forum/docs/

UPDATE usuarios SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/finemustache.png")) where id = 1;
UPDATE usuarios SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/vinimalvadao.png")) where id = 2;
UPDATE usuarios SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/sanzappa.png")) where id = 3;
UPDATE usuarios SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/felipe357.jpg")) where id = 4;

INSERT INTO posts VALUES
(DEFAULT, 1, "Harry Kane brabo dms", "Se liga umas foto dele", 200, CURRENT_TIME()),
(DEFAULT, 2, "E essa voadora do Haaland?", "O cara fez isso na fase de grupos da Champions e ainda por cima, contra o ex time KKKKKK", 120, CURRENT_TIME()),
(DEFAULT, 3, "E aí? Relou ou não?", "Deram o gol pro Bruno Fernandes, mas dizem que o Cristiano ainda chegou a encostar na bola", 20, CURRENT_TIME()),
(DEFAULT, 4, "Quem vai ser o artilheiro do Brasil na copa?", "Richarlison fez 2 na estréia, Casemiro fez 1 no segundo jogo. Se for avançando, ainda faltam 5 jogos pra marcar", 68, CURRENT_TIME());

INSERT INTO respostas VALUES
(DEFAULT, 1, 3, "Ele e o Son, a melhor dupla de ataque da liga inglesa!", CURRENT_TIME()),
(DEFAULT, 2, 1, "Muito melhor que o Mbappé", CURRENT_TIME()),
(DEFAULT, 2, 3, "Futuro melhor do mundo", CURRENT_TIME()),
(DEFAULT, 3, 4, "Cristiano merece o gol só pelo folclore", CURRENT_TIME()),
(DEFAULT, 3, 2, "Eu daria pro Cristiano", CURRENT_TIME());

INSERT INTO treplicas VALUES
(DEFAULT, 2, 4, "Absolutamente", CURRENT_TIME()),
(DEFAULT, 5, 3, "Ihhhh", CURRENT_TIME());

INSERT INTO fotos VALUES
(DEFAULT, NULL, 1),
(DEFAULT, NULL, 1),
(DEFAULT, NULL, 2),
(DEFAULT, NULL, 3);

UPDATE fotos SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/hk1.jpg")) where id = 1;
UPDATE fotos SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/hk2.jpg")) where id = 2;
UPDATE fotos SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/haaland.jpg")) where id = 3;
UPDATE fotos SET foto=to_base64(LOAD_FILE("C:/Users/usuario/Documents/SENAI2022/forum/docs/cr7.jpg")) where id = 4;

INSERT INTO votos VALUES
(DEFAULT, 1, 2, true),
(DEFAULT, 1, 3, true),
(DEFAULT, 2, 1, true),
(DEFAULT, 3, 1, true),
(DEFAULT, 3, 2, true),
(DEFAULT, 3, 4, true),
(DEFAULT, 4, 1, false),
(DEFAULT, 4, 2, true),
(DEFAULT, 4, 3, false);

INSERT INTO tags VALUES
(DEFAULT, "Copa do Mundo", "#56042C"),
(DEFAULT, "Champions League", "#06113a"),
(DEFAULT, "Premier League", "#38003C"),
(DEFAULT, "Discussão", "#000000"),
(DEFAULT, "Brasil", "#009739"),
(DEFAULT, "Imagens", "#960000");

INSERT INTO tags_posts VALUES
(DEFAULT, 1, 3),
(DEFAULT, 1, 6),
(DEFAULT, 2, 2),
(DEFAULT, 2, 6),
(DEFAULT, 3, 4),
(DEFAULT, 3, 1),
(DEFAULT, 3, 6),
(DEFAULT, 4, 4),
(DEFAULT, 4, 5);

INSERT INTO favoritos VALUES
(DEFAULT, 1, 1),
(DEFAULT, 1, 2),
(DEFAULT, 1, 3),
(DEFAULT, 2, 5),
(DEFAULT, 2, 6),
(DEFAULT, 3, 1),
(DEFAULT, 3, 6);

DELIMITER $

CREATE TRIGGER Tgr_Votos_Delete AFTER DELETE
ON votos
FOR EACH ROW
BEGIN
    IF (OLD.tipo = 0) THEN
        UPDATE posts SET votos = votos + 1 WHERE id = OLD.id_post;
    ELSE
        UPDATE posts SET votos = votos - 1 WHERE id = OLD.id_post;
    END IF;
END$

CREATE TRIGGER Tgr_Votos_Update AFTER UPDATE
ON votos
FOR EACH ROW
BEGIN
    IF (OLD.tipo = 0) THEN
        UPDATE posts SET votos = votos + 2 WHERE id = OLD.id_post;
    ELSE
        UPDATE posts SET votos = votos - 2 WHERE id = OLD.id_post;
    END IF;
END$

CREATE TRIGGER Tgr_Votos_Insert AFTER INSERT
ON votos
FOR EACH ROW
BEGIN
    IF (NEW.tipo = 0) THEN
        UPDATE posts SET votos = votos - 1 WHERE id = NEW.id_post;
    ELSE
        UPDATE posts SET votos = votos + 1 WHERE id = NEW.id_post;
    END IF;
END$

DELIMITER ;