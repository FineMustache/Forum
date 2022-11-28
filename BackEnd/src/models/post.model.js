const create = (dados, foto) => {
    return `insert into posts values (default, ${dados.id_usuario}, '${dados.titulo}', '${dados.corpo}', ${dados.votos}, ${dados.data})`
}

const readAll = () => {
    return  `select * from vw_posts`
}

const read = (dados) => {
    return `select * from vw_posts where id=${dados.id}`
}

const del = (dados) => {
    return `DELETE from posts where id=${dados.id}`
}

module.exports = {
    create,
    readAll,
    read,   
    del
}