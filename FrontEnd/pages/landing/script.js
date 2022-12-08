var requisitos = false
var req1, req2, req3, req4

function signup(ev) {
    ev.preventDefault()
    console.log(requisitos)
    if (requisitos && document.querySelector('#inpImg').files.length > 0) {
        document.querySelector("form").submit()
    }
}

function login() {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: `{"nome":"${document.querySelector("#username").value}","senha":"${document.querySelector("#senha").value}"}`
      };
      
      fetch('http://localhost:3000/offside/usuarios/validar', options)
        .then(response => response.json())
        .then(response => {
            if (response.validation) {
                window.localStorage.setItem('token', response.token)
                window.localStorage.setItem('uid', response.uid)
                window.localStorage.setItem('uname', response.uname)
                window.location.href = "../home"
            } else {
                errLogin()
            }
            
        })
        .catch(err => console.error(err));
}

function loginUp() {
    document.querySelector(".middle").classList.add('middle-up')
    document.querySelector(".watermark").classList.add('balls-left')
    document.querySelector(".login").classList.add('login-up')
    setTimeout(() => {
        document.querySelector(".login").classList.add('login-on')
        document.querySelector(".login").classList.remove('login-up')
    }, 1700)
}

function errLogin() {
    document.querySelector(".err").classList.add("errOn")
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
    repSenhaChange(document.getElementById('repSenha').value)

    if(req1, req2, req3, req4){
        requisitos = true
    }
}

function repSenhaChange(valor) {
    if (valor == document.querySelector("#senhaCad").value) {
        document.getElementById('repSenha').style.borderColor = 'white'
        req4 = true
    } else {
        document.getElementById('repSenha').style.borderColor = 'red'
        req4 = false
    }

    if(req1, req2, req3, req4){
        requisitos = true
    }
}

setInterval(() => {
    let token = window.localStorage.getItem('token')
    if (token != null) {
        const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token
            }
          }
          fetch("http://localhost:3000/offside/validate/" + window.localStorage.getItem("uid"), options)
          .then(response => response.json())
          .then(response => {
            if(!response.validation){
              window.localStorage.clear()
              window.location.href = "../home"
            }
          })
          .catch(err => console.log(err))   
    }
  }, 60000)

  function validate() {
    let token = window.localStorage.getItem('token')
    if (token != null) {
        const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token
            }
          }
          fetch("http://localhost:3000/offside/validate/" + window.localStorage.getItem("uid"), options)
          .then(response => response.json())
          .then(response => {
            if(!response.validation){
              window.localStorage.clear()
            } else {
                window.location.href = "../home"
            }
          })
          .catch(err => console.log(err))   
    }
  }