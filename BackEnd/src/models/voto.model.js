const create = (dados) => {
    return `insert into votos values (default,${dados.id_post},${dados.id_usuario},${dados.tipo})`;
}

const readAll = () => {
    return "select * from votos";
}

const update = (dados) => {
    return `update votos set tipo = ${dados.tipo} where id_post =${dados.id_post} and id_usuario =${dados.id_usuario}`;
}

const del = (dados) => {
    return `delete from votos where tipo = ${dados.tipo} and id_post = ${dados.id_post} and id_usuario = ${dados.id_usuario}`
}