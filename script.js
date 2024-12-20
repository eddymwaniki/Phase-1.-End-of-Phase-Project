//Assigning variables to IDs
const characterName = document.getElementById("inputField");
const searchButton = document.getElementById("searchButton");
const characterDetails = document.getElementById("characterDetails");
const favouritesList = document.getElementById("favouritesList");
//Initialize the favourites array
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
//Add event listener to search button
searchButton.addEventListener("click", searchCharacter);favouritesList
//Function to update and display the list of favourites
function updateFavouritesList() {
    favouritesList.innerHTML = "";
    if(favourites.length === 0) {
        favouritesList.innerHTML = "<p>No favourites yet!</p>";
        return;
    }
    favourites.forEach(fav => { const favDiv = document.createElement("div");
     favDiv.classList.add("favouriteItem");
     const favName = document.createElement("span");
     favName.textContent = fav.name;
     const favImage = document.createElement("img");
     favImage.src = fav.image;
     favImage.alt = `${fav.name}'s image`;
     favImage.style.width = "50px";
     favImage.style.height = "50px";
     favImage.style.marginRight = "10px";
     const removeButton = document.createElement("button");
     removeButton.textContent = `Remove ${fav.name} from your Favourites`;
     removeButton.classList.add("remover")
     removeButton.addEventListener("click", () => removeFromFavourites(fav.id));
     //Event Listener to highlight a favourite character in green when mouse hovers over character
     favDiv.addEventListener("mouseover", () => {
        favDiv.style.backgroundColor = "lightgreen"
     })
     //Event Listener to remove highlighter when mouse is no longer hovered over favourite character
     favDiv.addEventListener("mouseout", () => {
        favDiv.style.backgroundColor = ""
     })
     favDiv.appendChild(favImage);
     favDiv.appendChild(favName);
     favDiv.appendChild(removeButton);
     favouritesList.appendChild(favDiv);
    });
}
//Search and Display characters
async function searchCharacter() {
    const name = characterName.value.trim();
    if(!name) {
        alert("Please enter a character name!");
        return;
    }
    const url = `http://localhost:3000/results?name=${name}`;
    const response = await fetch (url);
    if(!response.ok) {
        alert("Character not found");
        return;
    }
    const data = await response.json();
    if (data.length === 0) {
        alert("Character not found!");
        return;
    }
    displayCharacterDetails(data[0]);
}
// Function to display character details
function displayCharacterDetails(character) {
    if(!character) {
        characterDetails.innerHTML = "<p>Character not found!</p>";
        return;
    }
const characterInfo = `
<h2>${character.name}</h2>
<img src="${character.image}" alt="${character.name}'s image">
<p><strong>Status:</strong> ${character.status}</p>
<p><strong>Species:</strong> ${character.species}</p>
<P><strong>Gender:</strong> ${character.gender}</P>
<p><strong>Origin:</strong> ${character.origin.name}</p>
<p><strong>Location:</strong> ${character.location.name}</p>
<button class="favouritesButton" id="favouritesButton">Add ${character.name} to your Favourites</button>
`;
characterDetails.innerHTML = characterInfo;
document.getElementById("favouritesButton").addEventListener("click", () => addToFavourites(character))
}
//Function to add a character to the favourites list
function addToFavourites(character) {
    if(!favourites.some(fav => fav.id === character.id)){
        favourites.push(character);
        localStorage.setItem("favourites", JSON.stringify(favourites));
        updateFavouritesList()
    } else {
        alert("This character is already in your favourites!")
    }
}
//Function to remove character from favourites list
function removeFromFavourites(characterId) {
    favourites = favourites.filter(fav => fav.id !== characterId);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    updateFavouritesList();
}

updateFavouritesList();

