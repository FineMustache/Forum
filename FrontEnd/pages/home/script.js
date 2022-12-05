function carregar() {
  let token = window.localStorage.getItem('token')
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    }
  }
  console.log(window.localStorage.getItem("uid"))
  fetch("http://localhost:3000/offside/validate/" + window.localStorage.getItem("uid"), options)
  .then(response => response.json())
  .then(response => {
    if (response.validation) {
      fetch('http://localhost:3000/offside/usuarios/' + window.localStorage.getItem('uname'), {method: "GET"})
      .then(response => response.json())
      .then(response => {
        response.forEach(u => {
          document.querySelector("#navUn").innerHTML = u.nome
          document.querySelector("#navPfp").src = montaImg(u.foto)
        });
      })
      .catch(err => console.error(err));
    } else {
      window.localStorage.clear()
      window.location.href = "../landing"
    }
    
  })
}




function montaImg(img) {
    if (img != null) {
        return `data:image/png;base64,${img}`;
    } else
        return `./default.png`;
}