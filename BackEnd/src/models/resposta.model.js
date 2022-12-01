const create = (dados) => {
    return `insert into respostas values (default,${dados.id_post},${dados.id_usuario},${dados.tipo})`;
}

const del = (model) => {
    return `DELETE FROM respostas WHERE id = ${model.id}`;
}