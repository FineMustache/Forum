const toCreate = (dados,file) =>{
    dados.foto = file.buffer.toString('base64');
    return `insert into fotos values (default,'${dados.foto}', ${dados.id_post})`;
}

const toRead = (dados) => {
    return `select * from fotos where id_post = ${dados.id}`
}

module.exports = {
    toCreate,
    toRead
}