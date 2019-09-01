'use strict'
///fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=fallout 4&key=AIzaSyBOy_1MABfgfN5f4fcpj88B8ktpq1TY3e4`)
///youtube  url https://www.youtube.com/watch?v=


///Event Listener
function formSubmit(){
    $('form').on('submit', function(event){
        event.preventDefault();
        let gameTitle = parseTitle($('.gameInput').val());
        let resultNum = $('.numberInput').val()
        interpretTitle(gameTitle, resultNum);
        
    })
}

///Takes input and reconfigures it for API
function parseTitle(title){
    return title
                .toLowerCase()
                .replace(/[^a-zA-Z, 0-9,]/g, "")
                .split(' ')
                .join('-'); 
}


//Ensure Title works
function interpretTitle(input1, input2){
    fetch(`https://api.rawg.io/api/games/${input1}`)
    .then(response => {
        if(response.ok){
            return response
        }
        
        else {
            alert(`Sorry, but we didn't find any results for "${input1.replace(/-/g, ' ')}."`)
        }
        
    })
    .then(response => response.json())
    .then(responseJson => getInfo(responseJson.slug, input2));
}


///API GET
function getInfo(input1, input2){
    fetch(` https://api.rawg.io/api/games/${input1}/suggested?page_size=${input2}`)
     .then(response => response.json())
     .then(responseJson => generateResults(responseJson));
 }

///Adds the results from the search to the DOM
 function generateResults(input){
     console.log(input);
    $('.results').empty();
    for(let i = 0; i < input.results.length; i++){
        let genres = "";
    for(let a = 0; a < input.results[i].genres.length; a++){
        genres = genres.concat(`  ${input.results[i].genres[a].name}  |`)
    }
        $('.results').append(`<div><img src="${input.results[i].background_image}">
        <p class="gameName" >${input.results[i].name}</p>
        <hr> <p>${genres}</p></div>
        <button type="submit" class="moreInfo" id="${input.results[i].slug}">More Info</button>`)
    }
    $('#gameSearch').trigger('reset');
 }

 ///More Info Button Clicked
 function moreInfo(){
    $('.results').on('click', '.moreInfo', function(event){
        event.preventDefault();
        let gameSearch = $(this).attr('id');
        fetch(`https://api.rawg.io/api/games/${gameSearch}`)
        .then(response => response.json())
        .then(responseJson => getTrailer(responseJson, responseJson.name));

    }) 

 }


///Generate Results from 'More Info'
 function generateMoreInfo(input1, input2 ){
    console.log(input1);
    $('.results').empty();
     
     $('.results').html(`<h1>${readInfo(input1.name)}</h1>
     <div class="gameMoreInfo">
    <img src="${readImage(input1.background_image)}" class="infoPic">
    <p class="description">${readInfo(input1.description_raw)}</p>
    <hr>
   <ul class="gameInfo">
    <li>Rating: ${readESRB(input1.esrb_rating)}</li>
    <li>Meta Score: ${readInfo(input1.metacritic)}</li>
    <li>Release Date: ${readInfo(input1.released)}</li>
   </ul>
   </div>
   <div class="storeLinks">
   <ul><span class="storeList">Where to buy: </span>${generateStoreLinks(input1).join(' ')}
   </div>
   </ul>
<iframe class="gameVid" width="420" height="315"
src=${input2}>
</iframe>
<br>
<form class="moreLikeGames">
<label>Want to Find More Games like this One?</label>
<input type="number" value="1" max="25" id="numberInput">
<button class="moreGameButton" id="${input1.slug}">More Games</button>

</form>`);

 }

 ///Reads API response
 function readESRB(input){
     if(input === null){
         return `N/A`
     }
     else{
         return input.name;
     }
 }

 ///Reads API response
 function readInfo(input){
    if(input === null){
        return 'N/A';
    }
    else{
        return input;
    } 
 }

 ///Store Links
 function generateStoreLinks(input){
    let storeLinks = [];
    for(let i = 0; i < input.stores.length; i++){
        if (input.stores[i].store.slug === 'steam'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-steam' style='font-size:36px; color: rgb(39,64,85);'></i></a></li>`);
        }
        else if (input.stores[i].store.slug === 'xbox360'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-xbox' style='font-size:36px; color: rgb(132,132,132); background-color: rgb(161,205,65);'></i></a></li>`);
        }
        else if (input.stores[i].store.slug === 'google-play'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-google-play' style='font-size:36px; color: rgb(34,175,194);'></i></a></li>`);
        }
        else if (input.stores[i].store.slug === 'playstation-store'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-playstation' style='font-size:36px; color:rgb(255,255,255); background-color: rgb(1,62,151);'></i></a></li>`);
         }
        else if (input.stores[i].store.slug === 'nintendo'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank" ><div style="background-color: red; height:40px; width:80px; display:inline-block; padding-top: 10px;"><span style="font-size: 16px; color: white; font-family: sans-serif; width: 80px; border: 2px solid white; border-radius: 60px; padding:5px;">nintendo</span></div></a></li>`);
        }
        else if (input.stores[i].store.slug === 'apple-appstore'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-apple' style='font-size:38px; color: rgb(68,68,68);'></i></a></li>`);
        }
        else if (input.stores[i].store.slug === 'xbox-store'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-xbox' style='font-size:36px; color: rgb(255,255,255); background-color: rgb(16,121,16)'></i></a></li>`);
        }
        else{
            console.log('no store');
        }

        
 }
 return storeLinks;}

 ///Reads API response
 function readImage(input){
    if(input.background_image === null){
        return 'https://icon-library.net/images/no-image-available-icon/no-image-available-icon-6.jpg';
    }
    else{
        return input;
    }
 }

 ///Youtube GET request
 function getTrailer(input1, input2){
    console.log(input2); 
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${input2}%20trailer&topicId=%2Fm%2F0bzvm2&type=video&key=AIzaSyBOy_1MABfgfN5f4fcpj88B8ktpq1TY3e4`)
     .then(response => response.json())
     .then(responseJson => generateTrailerLink(responseJson, input1));
 }

 ///Generates Trailer Link
 function generateTrailerLink(input1, input2){ 
    console.log(input1);
    let link = `https://www.youtube.com/embed/${input1.items[0].id.videoId}`

    generateMoreInfo(input2, link);
 }

 ///More Games Button
 function moreLikeGames(){
     $('.results').on('click', `.moreGameButton`, function(event){
        event.preventDefault();
        let gameSearch = $('.moreGameButton').attr('id');
        let number = document.getElementById('numberInput').value;
        getInfo(gameSearch, number);
     })
 }

function runApp(){
    formSubmit();
    moreInfo();
    moreLikeGames();
}

$(runApp);