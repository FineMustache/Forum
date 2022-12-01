const toCreate = (dados) => {
    return `INSERT INTO treplicas VALUES (default, ${dados.id_resposta}, ${dados.id_usuario}, '${dados.corpo}', CURRENT_TIME())`
}

const toDelete = (dados) => {
    return `DELETE FROM treplicas WHERE id = ${dados.id}`
}

module.exports = {
    toCreate,
    toDelete
}