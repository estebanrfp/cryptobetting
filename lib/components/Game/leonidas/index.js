

function renderPockemon(image) {
    document.querySelector('#pokemon').setAttribute('src', image)
}
fetch('pockemon.json', {
    // method: 'GET',
    // headers: {
    //     'Content-Type': 'aplication/json',
    // },
    // body: JSON.stringify({
    //     name: 'Leonidas',
    //     age: '28',
    // })
})
.then(response => response.json())
.then(data => renderPockemon(data.image))

// get from pokeapi.co
fetch('https://pokeapi.co/api/v2/pokemon/25/')
    .then(response => response.json())
    .then(data => renderPockemon(data.sprites.front_default))