var requisitos = false
var req1, req2, req3, req4

var user

var favs = []

function carregar() {
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
              window.location.href = "../landing"
            } else {
                fetch('http://localhost:3000/offside/usuarios/' + window.localStorage.getItem('uname'), {method: "GET"})
                .then(response => response.json())
                .then(response => {
                    response.forEach(u => {
                    user = u
                    favs = u.favoritos
                    console.log(u.favoritos)
                    document.querySelector("#un").innerHTML = u.nome
                    document.querySelector("#pfp").src = montaImg(u.foto)
                    let favCB = document.querySelectorAll('.mod-t-item')
                    u.favoritos.forEach(fav => {
                        if (fav !== null) {
                            let ptag = document.createElement('div')
                            let ptagSpan = document.createElement('span')
                            ptagSpan.innerHTML = fav
                            ptag.appendChild(ptagSpan)
                            ptag.classList.add(getTagClass(fav))
                            ptag.classList.add('ptag')
                            document.querySelector('.fav-profile').appendChild(ptag)
                            favCB.forEach(tag => {
                                if (tag.querySelector('span').innerHTML == fav) {
                                    tag.classList.remove('mod-t-item-unselected')
                                }
                            })
                        }else{
                        favs = []
                        }
                    })
                    
                    });
                })
                .catch(err => console.error(err));
            }
          })
          .catch(err => console.log(err))   
    } else {
      window.localStorage.clear()
      window.location.href = "../landing"
    }
}

function montaImg(img) {
    if (img != null) {
        return `data:image/png;base64,${img}`;
    } else
        return `./default.png`;
}

function getTag(tagname) {
    switch (tagname) {
      case "Copa do Mundo":
        return 1
      
      case "Champions League":
        return 2
  
      case "Premier League":
        return 3
  
      case "Discussão":
        return 4
  
      case "Brasil":
        return 5
  
      case "Imagens":
        return 6
  
      default:
        break;
    }
  }
  
  function getTagClass(tagname) {
    switch (tagname) {
      case "Copa do Mundo":
        return 'wc'
      
      case "Champions League":
        return 'cl'
  
      case "Premier League":
        return 'pl'
  
      case "Discussão":
        return 'disc'
  
      case "Brasil":
        return 'br'
  
      case "Imagens":
        return 'im'
  
      default:
        break;
    }
  }

  function modtagClick(el) {
    if (el.classList.contains('mod-t-item-unselected')) {
      favs.push(el.querySelector('span').innerHTML)
      console.log(favs)
      console.log(user.favoritos)
    } else {
      favs.splice(favs.indexOf(el.querySelector('span').innerHTML), 1)
    }
    el.classList.toggle('mod-t-item-unselected')
  }

  function saveFav() {
    const options = {method: 'GET'};

    fetch('http://localhost:3000/offside/usuarios/' + window.localStorage.getItem('uname'), options)
    .then(response => response.json())
    .then(response => {
        console.log(response[0].favoritos)
        favs.forEach(f => {
            if (!response[0].favoritos.includes(f)) {
                const options2 = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
                    body: `{"id_usuario":${window.localStorage.getItem('uid')},"id_tag":${getTag(f)}}`
                  };
                  
                  fetch('http://localhost:3000/offside/favoritos', options2)
                    .then(response => response.json())
                    .then(response => console.log(response))
                    .catch(err => console.error(err));
            }
        })
        response[0].favoritos.forEach((f, index) => {
            if (!favs.includes(f)) {
                const options2 = {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
                    body: `{"id_usuario":${window.localStorage.getItem('uid')},"id_tag":${getTag(f)}}`
                  };
                  
                  fetch('http://localhost:3000/offside/favoritos', options2)
                    .then(response2 => response2.json())
                    .then(response2 => {
                        if (index == response[0].favoritos.length) {
                            window.location.reload()
                        }
                    })
                    .catch(err => console.error(err));
            }
        })
        window.location.reload()
    })
    .catch(err => console.error(err));
    
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
    if (valor == document.querySelector("#senha").value) {
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

function redSenha() {
  if (requisitos) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: window.localStorage.getItem('token')
      },
      body: `{"id":${window.localStorage.getItem('uid')},"nome":"${window.localStorage.getItem('uname')}","senha":"${document.querySelector('#cursenha').value}","novaSenha":"${document.querySelector('#senha').value}","update":true}`
    };
    console.table(options.body)
    
    fetch('http://localhost:3000/offside/usuarios/redsenha', options)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        if (response.success) {
          document.querySelector('.success').classList.add('successOn')
          document.querySelector(".err").classList.remove("errOn")
        } else {
          errLogin()
        }
      })
      .catch(err => console.error(err));
  }
}

function errLogin() {
  document.querySelector(".err").classList.add("errOn")
}

function sair() {
  window.localStorage.clear()
  window.location.href = "../landing"
}

//checar token
setInterval(() => {
  let token = window.localStorage.getItem('token')
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
      window.location.href = "../landing"
    }
  })
  .catch(err => console.log(err))
}, 60000)