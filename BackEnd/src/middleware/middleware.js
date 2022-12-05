const jwt = require("jsonwebtoken")
require("dotenv").config()

const validaAcesso = (req, res, next) => {
    const token = req.headers.authorization

    jwt.verify(token, process.env.KEY, (err, data) => {
        if (err != null) res.status(404).json(err).end()
        if(data["uid"] != null){
            next()
        }
        else{
            res.status(401).end()
        }
    })
}

const permitir = (req, res) => {
    const token = req.headers.authorization

    jwt.verify(token, process.env.KEY, (err, data) => {
        if (err != null) res.status(401).json({"validation": false}).end()
        else{
            if(data["uid"] == req.params.id){
                res.status(200).json({"validation": true}).end()
            }
            else{
                res.status(401).json({"validation": false}).end()
            }
        }
        
    })
}

module.exports = {
    validaAcesso,
    permitir
}