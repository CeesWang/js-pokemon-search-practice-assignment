document.addEventListener('DOMContentLoaded', () => {

  function createPokemonList(){
    // POKEMON.forEach(json => createPokemonCard(json))
    fetch("http://localhost:3000/pokemon")
      .then (response => response.json())
      .then (data => {
        data.forEach(json => createPokemonCard(json));
      })
  }

  function filterPokemon(searchTerm) {
    fetch("http://localhost:3000/pokemon")
    .then (response => response.json())
    .then (data => {
      let arr = data.filter(elem => elem.name.includes(searchTerm))         
      
      console.log(arr);
      if (arr.length === 0 || arr === undefined)
        document.getElementById("pokemon-container").innerHTML = `<p><center>There are no Pokémon here</center></p>`
      else 
          arr.forEach(pokemon => createPokemonCard(pokemon))
    })
  }

  function createPokemonCard(pokemon){
    let pokemonContainer = document.getElementById("pokemon-container");
    let pokemonCard = document.createElement("div");
    let pokemonFrame = document.createElement("div");
    let pokemonH1 = document.createElement("h1");
    let pokemonH1Text = document.createTextNode(pokemon.name);
    let pokemonImgDiv = document.createElement("div");
    let pokemonImg = document.createElement("img");
    let pokemonButton = document.createElement("button");

    pokemonButton.setAttribute("data-id", pokemon.id);
    pokemonButton.id = "edit-button";
    pokemonButton.textContent = "SUBMIT EDDID"
    pokemonH1.classList.add('center-text');
    pokemonH1.setAttribute("contenteditable",true);
    pokemonImg.src = pokemon.sprites["front"];
    pokemonCard.classList.add("pokemon-card");
    pokemonFrame.classList.add("pokemon-frame");
    pokemonImgDiv.classList.add("pokemon-image");
    pokemonImg.classList.add("toggle-sprite");
    pokemonImg.setAttribute("data-id", pokemon.id);
    pokemonImg.setAttribute("data-action", "flip");
    pokemonImg.setAttribute("data-orientation", "front");
    pokemonFrame.appendChild(pokemonH1);  
    pokemonFrame.appendChild(pokemonButton);
    pokemonImgDiv.appendChild(pokemonImg);
    pokemonFrame.appendChild(pokemonImgDiv);
    pokemonH1.appendChild(pokemonH1Text);
    pokemonCard.appendChild(pokemonFrame);
    pokemonContainer.appendChild(pokemonCard);

  }
  function destroyPokemonList(){
    document.getElementById('pokemon-container').innerHTML = "";

  }
  function flipTheButt(id, event){ 
    fetch(`http://localhost:3000/pokemon/${id}`)
      .then(response => response.json())
      .then(json => {
        console.log(json); 
        let sprites = json.sprites;
        if (event.getAttribute('data-orientation') === "front") {
          event.src = sprites['back'];
          event.setAttribute("data-orientation", "back");
        }
        else {
          event.src = sprites['front'];
          event.setAttribute("data-orientation", "front");
        }        
      })
  }

  function editPokemon(id, name){

    fetch(`http://localhost:3000/pokemon${id}`, {
        method:"PATCH",
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify ({
          name: name
        })
      }).then(() => {
        destroyPokemonList()
        createPokemonList()
      })
    }

  document.getElementById('pokemon-container').addEventListener("click",(event) =>{
    console.log(event.target);
    if (event.target.classList.contains('toggle-sprite')) {
      flipTheButt(event.target.getAttribute('data-id'),event.target);
    }
    if (event.target.id === "edit-button"){
      let name = event.target.parentNode.querySelector(".center-text").value;
      editPokemon(event.target.getAttribute("data-id"),name);
    }
  })

  document.getElementById('pokemon-search-form').addEventListener("input", (event) => {
    destroyPokemonList();
    filterPokemon(event.target.value);    
  })
  document.getElementById('pokemon-add-form').addEventListener('submit',event => {
    event.preventDefault();
    console.log("HEY&!");
    let name = document.getElementById('pokemon-add-name').value;
    fetch(`http://localhost:3000/pokemon`, {
      method:"POST",
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify ({
        name: name,
        sprites: {front: "", back: ""}
      })
    }).then(response => response.json())
      .then(json => {
      createPokemonCard(json);
    })
  })



  createPokemonList();

})
