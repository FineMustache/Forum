const create = (dados) => {
    return `insert into posts values (default, ${dados.id_usuario}, '${dados.titulo}', '${dados.corpo}', ${dados.votos}, CURRENT_TIME())`
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

// const toAscii = (dados)=>{
//     dados.forEach(d => {
//         d.forEach(foto => {
//             if(foto != null) foto = foto.toString('ascii');
//         })
        
//     });
//     return dados;
// }

const toAscii = (dados)=>{
    dados.forEach(d => {
        if(d.foto != null && d.foto != undefined){
            d.foto = d.foto.toString('ascii')
        } else if (d.fotos != null && d.fotos != undefined) {
            let fotos = d.fotos
            d.fotos = []
            fotos.forEach(f => {
                if (f !== undefined && f !== null) {
                    d.fotos.push(f.toString('ascii'))
                }
                
            })
        }
    });
    return dados;
}

module.exports = {
    create,
    readAll,
    read,   
    del,
    toAscii
}