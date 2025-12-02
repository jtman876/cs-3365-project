import { searchMovies } from '../auth.js'

// Search Bar elements
//const searchButton = document.querySelector("#searchButton");
//const searchText = document.querySelector("#searchText");
//const searchCheckCurrent = document.querySelector("#currentMovies");
//const searchCheckUpcoming = document.querySelector("#upcomingMovies");

// Search Results elements
const searchTitle = document.querySelector("#currentSearchTitle");
const movieList = document.querySelector("#movieList");

const getSearchText = /\?.*search=([^&]*)&?/g;
const getSearchCurrent = /\?.*currentMovies=([^&]*)&?/g;
const getSearchUpcoming = /\?.*upcomingMovies=([^&]*)&?/g;

const searchText = getSearchText.exec(window.location.href);
const searchCurrent = getSearchCurrent.exec(window.location.href);
const searchUpcoming = getSearchUpcoming.exec(window.location.href);

console.log(searchText);
console.log(searchCurrent);
console.log(searchUpcoming);

let checkedRegion = "nothing";
if (searchCurrent != null && searchUpcoming != null) checkedRegion = "current and upcoming movies";
else if (searchCurrent != null) checkedRegion = "current movies";
else if (searchUpcoming != null) checkedRegion = "upcoming movies";

const movies = await searchMovies(searchText[1]);
searchTitle.innerHTML = `Searched ${checkedRegion} for "${searchText[1]}"`;
while (movieList.firstChild)
	movieList.removeChild(movieList.lastChild);
for (const movie of movies)
	if ((movie.isCurrent && searchCurrent != null) || (!movie.isCurrent && searchUpcoming != null)) movieList.appendChild(createMovieElement(movie));


function createMovieElement(movie) {
	const element = document.createElement("a");
	element.classList.add("movieOption");
	element.setAttribute("href", `./movie-details.html?id=${movie.id}`);
	element.innerHTML = `${movie.title}<p><\p>`;
	
	return element;
}