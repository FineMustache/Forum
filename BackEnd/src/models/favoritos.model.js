const toCreate = (dados) => {
    return `INSERT INTO favoritos VALUES(DEFAULT, ${dados.id_usuario}, ${dados.id_tag})`
}

const toDelete = (dados) => {
    return `DELETE FROM favoritos WHERE id_usuario = ${dados.id_usuario} AND id_tag = ${dados.id_tag}`
}

module.exports = {
    toCreate,
    toDelete
}