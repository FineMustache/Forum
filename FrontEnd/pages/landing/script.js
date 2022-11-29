var requisitos = false

function loginUp() {
    document.querySelector(".middle").classList.add('middle-up')
    document.querySelector(".watermark").classList.add('balls-left')
    document.querySelector(".login").classList.add('login-up')
    setTimeout(() => {
        document.querySelector(".login").classList.add('login-on')
        document.querySelector(".login").classList.remove('login-up')
    }, 1700)
}

function login() {
    document.querySelector(".err").classList.toggle("errOn")
}

function signupUp() {
    document.querySelector('.login').classList.add("login-up-up")
    document.querySelector('.signup-card').classList.add("signup-up")
    setTimeout(() => {
        document.querySelector('.signup-card').classList.add("signup-on")
        document.querySelector('.signup-card').classList.remove("signup-up")
        document.querySelector('.login').classList.remove("login-on")
    }, 1700)
}

function loadImg(img) {
    document.querySelector('.actual-img').src = URL.createObjectURL(img)
    document.querySelector('.actual-img').classList.remove('escondido')
    document.querySelector('.placeholder').classList.add('escondido')
}

function suToLogin() {
    document.querySelector('.login').classList.add("login-down")
    document.querySelector('.signup-card').classList.add("signup-down")
    document.querySelector('.login').classList.remove("login-up-up")
    setTimeout(() => {
        document.querySelector('.login').classList.add("login-on")
        document.querySelector('.login').classList.remove("login-down")
        document.querySelector('.signup-card').classList.remove("signup-on")
        document.querySelector('.signup-card').classList.remove("signup-down")
    }, 1700)
}


function senhaFocus() {
    document.querySelector('.tooltip').classList.toggle('escondido')
}

function senhaChange(valor) {
    let req1, req2, req3, req4
    if (valor.length >= 8) {
        document.querySelector("#pwLength").style.opacity = .5
        req1 = true
    }else{
        document.querySelector("#pwLength").style.opacity = 1
        req1 = false
    }
    if (valor.match(/[A-Z]/g)) {
        document.querySelector("#pwUC").style.opacity = .5
        req2 = true
    } else {
        document.querySelector("#pwUC").style.opacity = 1
        req2 = false
    }
    if (valor.match(/[0-9]/g)) {
        document.querySelector("#pwNum").style.opacity = .5
        req3 = true
    } else {
        document.querySelector("#pwNum").style.opacity = 1
        req3 = false
    }
    req4 = repSenhaChange(document.getElementById('repSenha').value)

    if(req1, req2, req3, req4){
        requisitos = true
    }
}

function repSenhaChange(valor) {
    if (valor == document.querySelector("#senhaCad").value) {
        document.getElementById('repSenha').style.borderColor = 'white'
        return true
    } else {
        document.getElementById('repSenha').style.borderColor = 'red'
        return false
    }
}