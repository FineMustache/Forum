dayjs.extend(window.dayjs_plugin_relativeTime)
dayjs.locale("pt-br")

var user

var favs = []

function carregar() {
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
    if (response.validation) {
      fetch('http://localhost:3000/offside/usuarios/' + window.localStorage.getItem('uname'), {method: "GET"})
      .then(response => response.json())
      .then(response => {
        response.forEach(u => {
          user = u
          favs = u.favoritos
          document.querySelector("#navUn").innerHTML = u.nome
          document.querySelector("#navPfp").src = montaImg(u.foto)
          u.favoritos.forEach(fav => {
            if (fav !== null) {
              document.querySelector(`#tag${getTag(fav)}`).classList.add('selected')
            }
          })

          fetch('http://localhost:3000/offside/votos/' + user.id, {method: 'GET'})
            .then(response => response.json())
            .then(response => {
              user["votes"] = response
            })
            .catch(err => console.error(err));
          carregarPosts()
        });
      })
      .catch(err => console.error(err));
    } else {
      window.localStorage.clear()
      window.location.href = "../landing"
    }
    
  })

  document.querySelectorAll(".t-item").forEach(t => {
    t.addEventListener("click", () => {
      t.classList.toggle("selected")
      if (!favs.includes(t.querySelector("span").innerHTML)) {
        favs.push(t.querySelector("span").innerHTML)
      } else {
        favs.splice(favs.indexOf(t.querySelector("span").innerHTML), 1)
      }
      carregarPosts()
    })
  })

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

function montaImg(img) {
    if (img != null) {
        return `data:image/png;base64,${img}`;
    } else
        return `./default.png`;
}

function carregarPosts(){

  let modeloPrimeiro = document.querySelector('.modelo').cloneNode(true)

  document.querySelector(".main").innerHTML = ""

  document.querySelector(".main").appendChild(modeloPrimeiro)

  const options = {method: 'GET'};

  fetch('http://localhost:3000/offside/posts', options)
    .then(response => response.json())
    .then(response => {
      let posts = []
      response.forEach(post => {
        post.tags.forEach(t => {
          if(favs.includes(t) && !posts.includes(post)){
            posts.push(post)
          }
        })
      })
      posts.forEach(post => {
        let modelo = document.querySelector('.modelo').cloneNode(true)
        modelo.id = "p" + post.id
        modelo.querySelector('.pun').innerHTML = post.nome_usuario
        modelo.querySelector('.ptitle').innerHTML = post.titulo
        modelo.querySelector('.pbody').innerHTML = post.corpo
        modelo.querySelector('.pdata').innerHTML = dayjs(post.data).fromNow()
        modelo.querySelector('.voteCount').innerHTML = post.votos
        user.votes.forEach(v => {
          if (v.id_post == post.id) {
            if (v.tipo == 1) {
              modelo.querySelector('.upvote').classList.add("voted")
            } else {
              modelo.querySelector('.downvote').classList.add("voted")
            }
          }
        })
        post.fotos.forEach(f => {
          if (f!==null) {
            let img = document.createElement('img')
            img.classList.add("pfoto")
            img.src = montaImg(f)
            modelo.querySelector('.img-container').appendChild(img)
          }
        })

        fetch('http://localhost:3000/offside/post/' + post.id, {method: 'GET'})
          .then(response2 => response2.json())
          .then(response3 => {
            if (response3[0].respostas.length > 0) {
              modelo.querySelector('.respDisplay').classList.remove('modelo')
            }
          })
          .catch(err => console.error(err));
                modelo.classList.remove("modelo")
                document.querySelector('.main').appendChild(modelo)
              })
      })
      .catch(err => console.error(err));
}

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