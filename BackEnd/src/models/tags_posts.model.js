const toCreate = (dados) => {
    return `INSERT INTO tags_posts VALUES (DEFAULT, ${dados.id_post}, ${dados.id_tag})`
}

const toDelete = (dados) => {
    return `DELETE FROM tags_posts WHERE id_post = ${dados.id_post} AND id_tag = ${dados.id_tag}`
}

module.exports = {
    toCreate,
    toDelete
}