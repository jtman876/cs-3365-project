import { searchMovies } from '../auth.js'

// Search Bar elements
const searchButton = document.querySelector("#searchButton");
const searchText = document.querySelector("#searchText");
const searchCheckCurrent = document.querySelector("#currentMovies");
const searchCheckUpcoming = document.querySelector("#upcomingMovies");

// Search Results elements
const searchTitle = document.querySelector("#currentSearchTitle");
const movieList = document.querySelector("#movieList");



searchButton.onclick = async function () {
	const movies = await searchMovies(searchText.value);
	
	let checkedRegion = "nothing";
	if (searchCheckCurrent.checked && searchCheckUpcoming.checked) checkedRegion = "current and upcoming movies";
	else if (searchCheckCurrent.checked) checkedRegion = "current movies";
	else if (searchCheckUpcoming.checked) checkedRegion = "upcoming movies";
	
	searchTitle.innerHTML = `Searched ${checkedRegion} for "${searchText.value}"`;
	while (movieList.firstChild)
		movieList.removeChild(movieList.lastChild);
	for (const movie of movies)
		if ((movie.isCurrent && searchCheckCurrent.checked) || (!movie.isCurrent && searchCheckUpcoming.checked)) movieList.appendChild(createMovieElement(movie));
}

function createMovieElement(movie) {
	const element = document.createElement("a");
	element.classList.add("movieOption");
	element.setAttribute("href", `./movie-details.html?id-${movie.id}`);
	element.innerHTML = `${movie.title}`;
	
	return element;
}