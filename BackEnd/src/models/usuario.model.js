const create = (dados) => {
    return `insert into usuarios values (default, '${dados.nome}','${dados.foto}','${dados.senha}')`;
}

const toCreate = (dados,file) =>{
    dados.foto = file.buffer.toString('base64');
    return `insert into receitas values (default,'${dados.nome}','${dados.senha}','${dados.foto}')`;
}

const toRead = (dados) =>{
    return `select * from usuarios where nome = '${dados.nome}'`
}

const toAscii = (dados)=>{
    dados.forEach(d => {
        if(d.foto != null) d.foto = d.foto.toString('ascii');
    });
    return dados;
}

module.exports = {
    create,
    toCreate,
    toAscii,
    toRead
}