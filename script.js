'use strict'

///Global Game Title Search Variable
let titleOfGame = "";
///Global Variable for Number of Search Results
let numberOfResults = 0;

let shouldScroll = true;

///Event Listener
function formSubmit(){
    $(document).on('submit', function(event){
        event.preventDefault();
        $('input').blur();
        let gameTitle = parseTitle($('.gameInput').val());
        let resultNum = $('.numberInput').val()
        interpretTitle(gameTitle, resultNum);
        titleOfGame = gameTitle;
        numberOfResults = resultNum; 
        shouldScroll = true;
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
    //(input);
     $('.landingContent').empty();
    $('.results').empty();
    $('.landingContent').html(`<div class="landingHeader" id="top"><h1 class="smaller">What to Play Next?<i class="fas fa-gamepad" id="gamepadSmall"></i></h1></div>
            
    <form id="gameSearchSmall">
        
        <input type="text" placeholder="Previous Game Played" required class="gameInputSmall gameInput" >
        <label class="numLabel"></label>
        <input type="number" class="numberInputSmall numberInput resultNum" value="5" required max="25" min="1" >
        <button type="submit" class="searchButtonSmall"><i class="fa fa-search" id="searchIconSmall"></i></button>
    </form>`)
    for(let i = 0; i < input.results.length; i++){
        let genres = "";
    if(input.results[i].genres.length > 0){
        for(let a = 0; a < input.results[i].genres.length; a++){
            genres = genres.concat(`  ${input.results[i].genres[a].name}  |`)
    }}
    else{
        genres = "(No genres availaible)"
    }
        $('.results').append(`<div class="searchResult"><div id="${input.results.length}" ><img class="resultImg" src="${input.results[i].background_image}" alt="An image representing the game ${input.results[i].name}">
        <p class="gameName" >${input.results[i].name}</p>
         <p class="genres">${genres}</p></div>
        <button type="submit" class="moreInfo" id="${input.results[i].slug}">More Info</button>
        </div>`)
    }
        $('.results').append(`<br><button class="moreResults">More Results</button>`)
    $('#gameSearch').trigger('reset');
        $('.results').append(`<div class="space"></div><div class="space"></div>`)
    if (shouldScroll === true){
        document.getElementById("top").scrollIntoView();;
    }
}

 
 ///More Info Button Clicked
 function moreInfo(){
    $('.results').on('click', '.moreInfo', function(event){
        event.preventDefault();
        let originalSearchNum = $('.results div').attr('id');
        let gameSearch = $(this).attr('id');
        fetch(`https://api.rawg.io/api/games/${gameSearch}`)
        .then(response => response.json())
        .then(responseJson => getTrailer(responseJson, responseJson.name));

    }) 
}


///Generate Results from 'More Info'
 function generateMoreInfo(input1, input2){
   //(input1);
    $('.results').empty();
   
     
     $('.results').html(`<button class="backButton">Back</button>
     <h1 class="gameInfoName">${readInfo(input1.name)}</h1>
     <div class="gameMoreInfo">
    <img src="${readImage(input1.background_image)}" class="infoPic" alt="An image of the game ${input1.name}">
    <h2 class="descriptionHead">Description:</h2>
    <p class="description">${readDescription(input1.description_raw)}</p>
    
   <ul class="gameInfo">
    <li class="infoListItem">Rating: <span class="listAPI">${readESRB(input1.esrb_rating)}</span></li>
    ${metaScore(input1.metacritic)}
    <li class="infoListItem">Release Date: <span class="listAPI">${readInfo(input1.released)}</span></li>
   </ul>
   </div>
   <div class="storeLinks">
   <h2 class="storeList">Purchase:</h2>
   <ul>${generateStoreLinks(input1)}
   </ul>
   </div>
   
<iframe class="gameVid" 
src=${input2}>
</iframe>
<br>
<form class="moreLikeGames">
<label class="likeGameLabel">Get More Games like this One:</label>
<br>
<input class="moreGameNum" type="number" value="5" max="25" id="numberInput" required min="1" >
<button class="moreGameButton" id="${input1.slug}">More Games</button>

</form>`);
$('.results').append(`<div class="space"></div><div class="space"></div>`)
document.getElementById("top").scrollIntoView();;

 }



 ///Genrates Metacritc score result
 function metaScore(input){
    let score = input;
    let finalHtml = ''
    if (score === null) {
        finalHtml = '<li  class="infoListItem">Meta Score: <span class="listAPI">N/A</span></li>'}
    else if (score <= 49){
        finalHtml = `<li class="infoListItem">Meta Score: <span class="meta"  style="background-color: rgb(255,0,0); color: rgb(255,255,255);">${score}</span></li>`
    }
    else if (score >= 50 && score <= 74){
        finalHtml = `<li class="infoListItem">Meta Score: <span class="meta" style="background-color: rgb(255,204,51); color: rgb(255,255,255);">${score}</span></li>`
    }
    else if(score > 75){
        finalHtml = `<li class="infoListItem">Meta Score: <span class="meta" style="background-color: rgb(102,204,51); color: rgb(255,255,255);">${score}</span></li>`
    }
    else {
       //(score);
    }
    return finalHtml;
 }


///API Description
function readDescription(input){
    if(input === ''){
        return '***Sorry, but there is no description currently available for this game.***'
    }
    else{
        return input
    }
}

 ///Reads API response for rating
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
    let gog = '';
    for(let i = 0; i < input.stores.length; i++){
        if (input.stores[i].store.slug === 'steam'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-steam' style='color: rgb(39,64,85);'></i></a></li>`);
        }
        else if (input.stores[i].store.slug === 'xbox360'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-xbox' style='color: rgb(132,132,132); background-color: rgb(161,205,65);'></i></a></li>`);
        }
        else if (input.stores[i].store.slug === 'google-play'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class="storeIcon" class='fab fa-google-play' style='color: rgb(34,175,194);'></i></a></li>`);
        }
        else if (input.stores[i].store.slug === 'playstation-store'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-playstation' style='color:rgb(255,255,255); background-color: rgb(1,62,151);'></i></a></li>`);
         }
        else if (input.stores[i].store.slug === 'nintendo'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank" ><div class="nintendo1"><span class="nintendo2">Nintendo</span></div></a></li>`);
        }
        else if (input.stores[i].store.slug === 'apple-appstore'){
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-apple' style='color: rgb(68,68,68);'></i></a></li>`);
        }

        else if(input.stores[i].store.slug === 'gog'){
            gog = "Gog is not a trustworth site.";
        }

        else {
            storeLinks.push(`<li class="link"><a href=${input.stores[i].url} target="_blank"><i class='fab fa-xbox' style='color: rgb(255,255,255); background-color: rgb(16,121,16)'></i></a></li>`);
        }
        

    }
    if (storeLinks.length === 0){
        return`<li class="listAPI">***No links available. Try buying it on disc.***</li>`;
    }

    else{
        return storeLinks.join(' ');
    }}

 
 ///Back Button Event Listener
 function backButton(){
    $('.results').on('click', '.backButton',function(event){
        event.preventDefault();
        shouldScroll = true;
        interpretTitle(titleOfGame, numberOfResults);

    })
 }

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
   
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${input2.split(' ').join('%20')}%20original%20game%20trailer&topicId=%2Fm%2F0bzvm2&type=video&key=AIzaSyBOy_1MABfgfN5f4fcpj88B8ktpq1TY3e4`)
     .then(response => response.json())
     .then(responseJson => generateTrailerLink(responseJson, input1));
 }

 ///Generates Trailer Link
 function generateTrailerLink(input1, input2){ 
   
    let link = `https://www.youtube.com/embed/${input1.items[0].id.videoId}` 

    generateMoreInfo(input2, link);
 }

 ///More Games Button event listener
 function moreLikeGames(){
     $('.results').on('click', `.moreGameButton`, function(event){
        event.preventDefault();
        shouldScroll = true;
        titleOfGame = $('.moreGameButton').attr('id');
        numberOfResults = document.getElementById('numberInput').value;
        interpretTitle(titleOfGame, numberOfResults);
     })
 }

 ///More Results Button event listener
  function moreResults(){
      $('.results').on('click', '.moreResults', function(event){
          event.preventDefault();
          shouldScroll = false;
          numberOfResults = parseInt(numberOfResults) + 5;
          interpretTitle(titleOfGame, numberOfResults);
      })
  }

function runApp(){
    formSubmit();
    moreInfo();
    moreLikeGames();
    backButton();
    moreResults();
}

$(runApp);

