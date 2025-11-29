import {Theater, addMovie, updateMovie, removeMovie, getStatus} from '../auth.js'

const status = await getStatus();
console.log(status);

const documentShowList = document.querySelector("#showList");

addMovieForm(null, documentShowList);
for (const movie of status["movieList"]) addMovieForm(movie, documentShowList);

function addMovieForm(movie, htmlElement) {
	const movieContent = document.createElement("form");
	movieContent.classList.add("manageShow");
	movieContent.setAttribute("method", "get");
	movieContent.setAttribute("disabled", "disabled");
	if (movie != null && movie.hasOwnProperty("id")) movieContent.setAttribute("name", `id-${movie["id"]}`);
	else movieContent.setAttribute("name", "new-movie");
	movieContent.addEventListener("submit", function(e) {
		e.preventDefault();
		
		if (e.target.getAttribute("name") == "new-movie") {
			// Add a new movie in
			const form = new FormData(movieContent);
			let movieForm = {
				isCurrent: form.get("movie-isCurrent") == "true",
				title: form.get("movie-title"),
				synopsis: form.get("movie-synopsis"),
				cast: parseCastInformation(form.get("movie-castInfo")),
				ticketPrice: parseTicketPrice(form.get("movie-price")),
				runtime: form.get("movie-runtime"),
				showtimes: parseShowtimes(form.get("movie-showtimes"))
			}
			console.log(movieForm);
			addMovie(movieForm);
			addMovieForm(movieForm, htmlElement);
		}
		else {
			if (e.target.getAttribute("disabled") != null) {
				// Allow existing movie to be edited
				e.target.removeAttribute("disabled");
				for (const child of e.target.children) {
					if (child.getAttribute("type") == "submit") child.setAttribute("value", "Save");
					else if (child.getAttribute("name") == "remove-movie") child.removeAttribute("hidden", "hidden");
					else if (child.getAttribute("name") == "movie-current") {
						for (const grandchild of child.children) if (grandchild.getAttribute("class") == "showRadio") for (const greatgrandchild of grandchild.children) if (greatgrandchild.getAttribute("name") == "movie-isCurrent") {
							greatgrandchild.removeAttribute("hidden", "hidden");
						}
					}
					else child.removeAttribute("disabled", "disabled");
				}
			}
			else {
				// Save the changes to the existing movie, and return it to a disabled state
				// Remove the movie if the remove checkbox was selected
				e.target.setAttribute("disabled", "disabled");
				let remove_movie = false;
				for (const child of e.target.children) {
					if (child.getAttribute("type") == "submit") child.setAttribute("value", "Edit");
					else if (child.getAttribute("name") == "remove-movie") {
						child.setAttribute("hidden", "hidden");
						if (child.children[1].checked) remove_movie = true;
					}
					else if (child.getAttribute("name") == "movie-current") {
						for (const grandchild of child.children) if (grandchild.getAttribute("class") == "showRadio") for (const greatgrandchild of grandchild.children) if (greatgrandchild.getAttribute("name") == "movie-isCurrent") {
							greatgrandchild.setAttribute("hidden", "hidden");
						}
					}
					else child.setAttribute("disabled", "disabled");
				}
				console.log(remove_movie);
				
				if (remove_movie) {
					console.log("Removing film!");
					removeMovie(parseMovieId(e.target));
					e.target.remove();
				} else {
					const form = new FormData(movieContent);
					let movieForm = {
						id: parseMovieId(e.target),
						isCurrent: form.get("movie-isCurrent") == "true",
						title: form.get("movie-title"),
						synopsis: form.get("movie-synopsis"),
						cast: parseCastInformation(form.get("movie-castInfo")),
						ticketPrice: parseTicketPrice(form.get("movie-price")),
						runtime: form.get("movie-runtime"),
						showtimes: parseShowtimes(form.get("movie-showtimes"))
					}
					updateMovie(movieForm);
				}	
			}
		}
	});
	htmlElement.appendChild(movieContent);

	let movieComponent;
	// Save/Edit Button
	{
		movieComponent = document.createElement("input");
		movieComponent.setAttribute("class", "manageShowComponent editButton");
		movieComponent.setAttribute("type", "submit");
		if (movie != null) movieComponent.setAttribute("value", "Edit");
		else movieComponent.setAttribute("value", "New");
		movieContent.appendChild(movieComponent);
	}
	
	// Remove Button
	if (movie != null) {
		movieComponent = document.createElement("input");
		movieComponent.setAttribute("type", "checkbox");
		const specialBox = document.createElement("fieldset");
		specialBox.setAttribute("class", "manageShowComponent removeButton");
		specialBox.setAttribute("name", "remove-movie");
		specialBox.setAttribute("hidden", "hidden");
		const legendForBox = document.createElement("legend");
		legendForBox.innerHTML = "Remove";
		specialBox.appendChild(legendForBox);
		specialBox.appendChild(movieComponent);
		movieContent.appendChild(specialBox);
	}
	
	// Current or Upcoming
	{
		const specialBox = document.createElement("fieldset");
		specialBox.setAttribute("class", "manageShowComponent showCurrent");
		specialBox.setAttribute("name", "movie-current");
		const legendForBox = document.createElement("legend");
		legendForBox.innerHTML = "In Theaters?";
		specialBox.appendChild(legendForBox);
		
		let divComponent = document.createElement("div");
		divComponent.setAttribute("class", "showRadio");
		let inputComponent = document.createElement("input");
		inputComponent.setAttribute("type", "radio");
		inputComponent.setAttribute("id", "CurrentRadio");
		inputComponent.setAttribute("name", "movie-isCurrent");
		inputComponent.setAttribute("value", "true");
		if (movie != null) {
			if (movie.hasOwnProperty("isCurrent") && movie["isCurrent"]) inputComponent.setAttribute("checked", "checked");
			inputComponent.setAttribute("disabled", "disabled");
		}
		let labelComponent = document.createElement("label");
		labelComponent.setAttribute("for", "CurrentRadio");
		labelComponent.innerHTML = "Current";
		divComponent.appendChild(inputComponent);
		divComponent.appendChild(labelComponent);
		specialBox.appendChild(divComponent);
		
		divComponent = document.createElement("div");
		divComponent.setAttribute("class", "showRadio");
		inputComponent = document.createElement("input");
		inputComponent.setAttribute("type", "radio");
		inputComponent.setAttribute("id", "UpcomingRadio");
		inputComponent.setAttribute("name", "movie-isCurrent");
		inputComponent.setAttribute("value", "false");
		if (movie != null) {
			if (movie.hasOwnProperty("isCurrent") && !movie["isCurrent"]) inputComponent.setAttribute("checked", "checked");
			inputComponent.setAttribute("disabled", "disabled");
		}
		labelComponent = document.createElement("label");
		labelComponent.setAttribute("for", "UpcomingRadio");
		labelComponent.innerHTML = "Upcoming";
		divComponent.appendChild(inputComponent);
		divComponent.appendChild(labelComponent);
		specialBox.appendChild(divComponent);
		
		movieContent.appendChild(specialBox);
	}
	
	// Title
	{
		movieComponent = document.createElement("input");
		movieComponent.setAttribute("class", "manageShowComponent showTitle");
		movieComponent.setAttribute("type", "text");
		movieComponent.setAttribute("name", "movie-title");
		movieComponent.setAttribute("placeholder", "Title");
		if (movie != null && movie.hasOwnProperty("title")) {
			movieComponent.setAttribute("value", movie["title"]);
			movieComponent.setAttribute("disabled", "disabled");
		}
		movieContent.appendChild(movieComponent);
	}
	
	// Synopsis
	{
		movieComponent = document.createElement("textarea");
		movieComponent.setAttribute("class", "manageShowComponent showSynopsis");
		movieComponent.setAttribute("name", "movie-synopsis");
		movieComponent.setAttribute("placeholder", "Synopsis...");
		if (movie != null && movie.hasOwnProperty("synopsis")) {
			movieComponent.innerHTML = movie["synopsis"];
			movieComponent.setAttribute("disabled", "disabled");
		}
		movieContent.appendChild(movieComponent);
	}

	// Cast Information
	{
		movieComponent = document.createElement("textarea");
		movieComponent.setAttribute("class", "manageShowComponent showCast");
		movieComponent.setAttribute("name", "movie-castInfo");
		movieComponent.setAttribute("placeholder", "Cast Information...");
		if (movie != null && movie.hasOwnProperty("cast")) {
			movieComponent.innerHTML = printCastInformation(movie["cast"]);
			movieComponent.setAttribute("disabled", "disabled");
		}
		movieContent.appendChild(movieComponent);
	}
	
	// Runtime
	{
		movieComponent = document.createElement("input");
		movieComponent.setAttribute("class", "manageShowComponent showRuntime");
		movieComponent.setAttribute("type", "text");
		movieComponent.setAttribute("name", "movie-runtime");
		movieComponent.setAttribute("placeholder", "Runtime");
		if (movie != null && movie.hasOwnProperty("runtime")) {
			movieComponent.setAttribute("value", movie["runtime"]);
			movieComponent.setAttribute("disabled", "disabled");
		}
		movieContent.appendChild(movieComponent);
	}
	
	// Showtimes
	{
		movieComponent = document.createElement("textarea");
		movieComponent.setAttribute("class", "manageShowComponent showTimes");
		movieComponent.setAttribute("name", "movie-showtimes");
		movieComponent.setAttribute("placeholder", "Showtimes");
		if (movie != null && movie.hasOwnProperty("showtimes")) {
			movieComponent.innerHTML = printShowtimes(movie["showtimes"]);
			movieComponent.setAttribute("disabled", "disabled");
		}
		movieContent.appendChild(movieComponent);
	}
	
	// Ticket Price
	{
		movieComponent = document.createElement("input");
		movieComponent.setAttribute("class", "manageShowComponent showPrice");
		movieComponent.setAttribute("type", "text");
		movieComponent.setAttribute("name", "movie-price");
		movieComponent.setAttribute("placeholder", "$$$");
		if (movie != null && movie.hasOwnProperty("ticketPrice")) {
			movieComponent.setAttribute("value",`$${movie["ticketPrice"]}`);
			movieComponent.setAttribute("disabled", "disabled");
		}
		movieContent.appendChild(movieComponent);
	}
}

function printCastInformation(cast_information) {
	let string = "";
	for (const castLine of cast_information) {
		string += `${castLine[0]} -- ${castLine[1]}\n`;
	}
	return string;
}
function printShowtimes(showtimes) {
	let string = "";
	const format = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
	for (const time of showtimes) {
		string += `${format.format(time)}\n`;
	}
	return string;
}
function parseMovieId(form) {
	const regex = /\d+/g;
	return parseInt(regex.exec(form.getAttribute("name"))[0]);
}
function parseCastInformation(cast_information) {
	const regex = /(.+) -- (.+)/g;
	let array;
	let castInfo = [];
	while ((array = regex.exec(cast_information)) !== null)
		castInfo.push([array[1], array[2]]);
	return castInfo;
}
function parseShowtimes(showtimes) {
	const regex = /.+/g;
	let array;
	let times = [];
	while ((array = regex.exec(showtimes)) !== null)
		times.push(new Date((new Date()).getFullYear() + array[0]));
	return times;
}
function parseTicketPrice(price) {
	const regex = /\$?([\d,\.]+)/g;
	let vari = regex.exec(price);
	console.log(vari);
	return parseFloat(vari[1]);
}