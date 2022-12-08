dayjs.extend(window.dayjs_plugin_relativeTime)
dayjs.locale("pt-br")

var user

var favs = []

var postTags = []

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
            }else{
              favs = []
              toggleModal()
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

function montaImg(img) {
    if (img != null) {
        return `data:image/png;base64,${img}`;
    } else
        return `./default.png`;
}

function carregarPosts(){

  let modeloPrimeiro = document.querySelector('.modelo').cloneNode(true)
  let newPost = document.querySelector('.newPost').cloneNode(true)

  document.querySelector(".main").innerHTML = ""

  document.querySelector(".main").appendChild(newPost)
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
        if (post.tags.length < 1) {
          console.log(post)
          posts.push(post)
        }
      })
      posts.forEach(post => {
        let modelo = document.querySelector('.modelo').cloneNode(true)
        modelo.id = "p" + post.id
        modelo.querySelector('.pun').innerHTML = post.nome_usuario
        modelo.querySelector('.ptitle').innerHTML = post.titulo
        modelo.querySelector('.pbody').innerHTML = post.corpo
        modelo.querySelector('.pdata').innerHTML = dayjs(post.data).fromNow()
        modelo.querySelector('.voteCount').innerHTML = post.votos
        post.tags.forEach(t => {
          let ptag = document.createElement('div')
          let ptagSpan = document.createElement('span')
          ptagSpan.innerHTML = t
          ptag.appendChild(ptagSpan)
          ptag.classList.add(getTagClass(t))
          ptag.classList.add('ptag')
          modelo.querySelector('.ptags').appendChild(ptag)
        })
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
              modelo.querySelector('.respDisplay').addEventListener('click', () => {
                if (modelo.querySelector('.resp-container').classList.contains("modelo")) {
                  modelo.querySelector('.resp-container').classList.remove('modelo')
                  modelo.querySelector('.respDisplay').innerHTML = "Ocultar Respostas"
                } else {
                  modelo.querySelector('.resp-container').classList.add('modelo')
                  modelo.querySelector('.respDisplay').innerHTML = "Ver Respostas"
                }
                
              })
              response3[0].respostas.forEach(r => {
                let resp = modelo.querySelector('.resp').cloneNode(true)
                resp.querySelector('.run').innerHTML = r.nome_resposta
                resp.querySelector('.rdata').innerHTML = dayjs(r.resp_data).fromNow()
                resp.querySelector('.rbody').innerHTML = r.resp_corpo

                if (r.corpo_treplica !== null) {
                  resp.querySelector('.tun').innerHTML = r.nome_treplica
                  resp.querySelector('.tbody').innerHTML = r.corpo_treplica
                  resp.querySelector('.tdata').innerHTML = dayjs(r.data_treplica).fromNow()
                  resp.querySelector('.trep-container').classList.remove('modelo')
                }

                resp.classList.remove('modelo')
                modelo.querySelector('.resp-container').appendChild(resp)
              })
            }
          })
          .catch(err => console.error(err));
                modelo.classList.remove("modelo")
                document.querySelector('.main').appendChild(modelo)
              })
      })
      .catch(err => console.error(err));
}


function upvoteClick(upv, post) {
  if (upv.classList.contains('voted')) {
    const options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
      body: `{"id_post":${post.id.slice(1, post.id.length)},"id_usuario":${window.localStorage.getItem('uid')}}`
    };

    console.log(options)
    
    fetch('http://localhost:3000/offside/votos', options)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        if (response.affectedRows > 0) {
          upv.classList.remove('voted')
          post.querySelector('.voteCount').innerHTML = parseInt(post.querySelector('.voteCount').innerHTML) - 1
        }
      })
      .catch(err => console.error(err));
  } else {
    if (post.querySelector('.downvote').classList.contains('voted')) {
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
        body: `{"id_post":${post.id.slice(1, post.id.length)},"id_usuario":${window.localStorage.getItem('uid')},"tipo":true}`
      };
      
      fetch('http://localhost:3000/offside/votos', options)
        .then(response => response.json())
        .then(response => {
          if (response.affectedRows > 0) {
            upv.classList.add('voted')
            post.querySelector('.downvote').classList.remove('voted')
            post.querySelector('.voteCount').innerHTML = parseInt(post.querySelector('.voteCount').innerHTML) + 2
          }
        })
        .catch(err => console.error(err));
    } else {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
        body: `{"id_post":${post.id.slice(1, post.id.length)},"id_usuario":${window.localStorage.getItem('uid')},"tipo":true}`
      };
      
      fetch('http://localhost:3000/offside/votos', options)
        .then(response => response.json())
        .then(response => {
          if (response.affectedRows > 0) {
            upv.classList.add('voted')
            post.querySelector('.voteCount').innerHTML = parseInt(post.querySelector('.voteCount').innerHTML) + 1
          }
        })
        .catch(err => console.error(err));
    }
  }
}

function downvoteClick(dv, post) {
  if (dv.classList.contains('voted')) {
    const options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
      body: `{"id_post":${post.id.slice(1, post.id.length)},"id_usuario":${window.localStorage.getItem('uid')}}`
    };

    console.log(options)
    
    fetch('http://localhost:3000/offside/votos', options)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        if (response.affectedRows > 0) {
          dv.classList.remove('voted')
          post.querySelector('.voteCount').innerHTML = parseInt(post.querySelector('.voteCount').innerHTML) + 1
        }
      })
      .catch(err => console.error(err));
  } else {
    if (post.querySelector('.upvote').classList.contains('voted')) {
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
        body: `{"id_post":${post.id.slice(1, post.id.length)},"id_usuario":${window.localStorage.getItem('uid')},"tipo":false}`
      };
      
      fetch('http://localhost:3000/offside/votos', options)
        .then(response => response.json())
        .then(response => {
          if (response.affectedRows > 0) {
            dv.classList.add('voted')
            post.querySelector('.upvote').classList.remove('voted')
            post.querySelector('.voteCount').innerHTML = parseInt(post.querySelector('.voteCount').innerHTML) - 2
          }
        })
        .catch(err => console.error(err));
    } else {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
        body: `{"id_post":${post.id.slice(1, post.id.length)},"id_usuario":${window.localStorage.getItem('uid')},"tipo":false}`
      };
      
      fetch('http://localhost:3000/offside/votos', options)
        .then(response => response.json())
        .then(response => {
          if (response.affectedRows > 0) {
            dv.classList.add('voted')
            post.querySelector('.voteCount').innerHTML = parseInt(post.querySelector('.voteCount').innerHTML) - 1
          }
        })
        .catch(err => console.error(err));
    }
  }
}

function modtagClick(el) {
  if (el.classList.contains('mod-t-item-unselected')) {
    favs.push(el.querySelector('span').innerHTML)
  } else {
    favs.splice(favs.indexOf(el.querySelector('span').innerHTML), 1)
  }
  el.classList.toggle('mod-t-item-unselected')
}

function posttagClick(el) {
  if (el.classList.contains('mod-t-item-unselected')) {
    postTags.push(getTag(el.querySelector('span').innerHTML))
  } else {
    postTags.splice(favs.indexOf(getTag(el.querySelector('span').innerHTML)), 1)
  }
  el.classList.toggle('mod-t-item-unselected')
}

function favsSend() {
  favs.forEach(f => {
    var options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
      body: `{"id_usuario":${window.localStorage.getItem('uid')},"id_tag":${getTag(f)}}`
    };
    
    fetch('http://localhost:3000/offside/favoritos', options)
      .then(response => response.json())
      .then(response => window.location.reload())
      .catch(err => console.error(err));
  })
}

function toggleModal() {
  document.querySelector('.modal-container').classList.toggle('modelo')
}

function toggleFileModal() {
  document.querySelector('.modal-file-container').classList.toggle('modelo')
}

function toggleTagModal() {
  document.querySelector('.modal-tag-container').classList.toggle('modelo')
}


function menuToggle(el) {
  if (el.querySelector('.menu').style.height == 0 || el.querySelector('.menu').style.height == "0px") {
    el.querySelector(".menu").style.height = "10vh"
    setTimeout(() => {
      el.querySelectorAll("a").forEach(a => {
        a.style.opacity = 1
      })
    }, 200)
  } else {
    el.querySelectorAll("a").forEach(a => {
      a.style.opacity = 0
    })
    setTimeout(() => {
      el.querySelector(".menu").style.height = 0
    }, 200)
  }
  
}

const padrao = document
  .querySelector("#dz")
  .querySelector("span")
  .cloneNode(true);

function dropHandler(ev) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  const dataTransfer = new DataTransfer();

  let filenames = []

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        document.querySelector("#dz").querySelector("span").style.display = 'none';
          filenames.push(file.name)
          dataTransfer.items.add(file);
        }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);

      document.querySelector("#dz").querySelector("span").style.display = 'none';
      let span = document.createElement('span')
      span.innerHTML = file.name
      document.querySelector("#dz").appendChild(span)
      dataTransfer.items.add(file);
    });
  }
  let span = document.querySelector('#dz').querySelector('span').cloneNode(true)
  document.querySelector('#dz').innerHTML = ""
  document.querySelector("#dz").appendChild(span)
  filenames.forEach(fn => {
    let span2 = document.createElement('span')
    span2.innerHTML = fn
    document.querySelector("#dz").appendChild(span2)
  })
  document.querySelector("#inpFiles").files = dataTransfer.files;
  document.querySelector("#dz").classList.toggle("drop-zone-over");
  document.querySelector("#dz").classList.add("drop-zone-full");
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

function mainScroll() {
  if (checkVisible()) {
    document.querySelector('.go-up').style.opacity = 0
    document.querySelector('.go-up').style.pointerEvents = 'none'
  } else {
    document.querySelector('.go-up').style.opacity = 1
    document.querySelector('.go-up').style.pointerEvents = 'all'
  }
  
}

function checkVisible() {
  var rect = document.querySelector('#newPost').getBoundingClientRect();
  console.log(rect.bottom, rect.top)
  var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function sair(ev) {
  ev.preventDefault()
  window.localStorage.clear()
  window.location.href = "../landing"
}

function dragEnterHandler(ev) {
  console.log("File(s) in drop zone");
  document.querySelector("#dz").classList.toggle("drop-zone-over");
}

function dragLeaveHandler(ev) {
  document.querySelector("#dz").classList.toggle("drop-zone-over");
}

function dragOverHandler(ev) {
  ev.preventDefault();
}

function inpChange(e) {
  document.querySelector("#dz").querySelector("span").style.display = 'none';
  let span = document.querySelector('#dz').querySelector('span').cloneNode(true)
  document.querySelector('#dz').innerHTML = ""
  document.querySelector("#dz").appendChild(span)
  for (let i = 0; i < e.files.length; i++){
    let span2 = document.createElement('span')
    span2.innerHTML = e.files[i].name
    document.querySelector("#dz").appendChild(span2)
  }
  document.querySelector("#dz").classList.add("drop-zone-full");
}

function cancelFile() {
  toggleFileModal()
  document.querySelector('#inpFiles').value = null
  let span = document.querySelector('#dz').querySelector('span').cloneNode(true)
  span.style.display = "inline"
  document.querySelector('#dz').innerHTML = ""
  document.querySelector("#dz").appendChild(span)
  document.querySelector("#dz").classList.remove('drop-zone-full')
  document.querySelector("#fileCount").style.visibility = "hidden"
}

function confirmFile() {
  toggleFileModal()
  console.log(document.querySelector('#inpFiles').files)
  document.querySelector("#fileCount").innerHTML = "(" + document.querySelector('#inpFiles').files.length + ")"
  document.querySelector("#fileCount").style.visibility = "visible"
}

function sendPost() {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: window.localStorage.getItem('token')},
    body: `{"id_usuario":${window.localStorage.getItem("uid")},"titulo":"${document.querySelector("#inpTitulo").value}","corpo":"${document.querySelector("#taCorpo").value}","votos":0}`
  };
  
  fetch('http://localhost:3000/offside/posts', options)
    .then(response => response.json())
    .then(response => {
      if (response.affectedRows > 0) {
        postTags.forEach(pt => {
          var options2 = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: `{"id_post":${response.insertId},"id_tag":${pt}}`
          };
          
          fetch('http://localhost:3000/offside/tags_posts', options2)
            .then(response => response.json())
            .then(response => {})
            .catch(err => console.error(err));
        })
        if (document.querySelector("#inpFiles").files.length < 1) {
          window.location.reload()
        }else{
          document.querySelector("#inpIdPost").value = response.insertId
          console.log(Object.fromEntries(new FormData(document.querySelector("#formFile"))));
          document.querySelector("#formFile").submit()
        }
        
      }
    })
    .catch(err => console.error(err));
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