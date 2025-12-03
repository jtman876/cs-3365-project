import {addMovie, updateMovie, removeMovie, getStatus, getUser, Role} from '../auth.js'

const user = await getUser();
if (user == null || user.role != Role.ADMIN) {
	window.location.replace("./index.html");
}

const status = await getStatus();
console.log(status);

// get HTML components
const documentTicketSales = document.querySelector("#ticketsSoldData");
const documentTotalRevenue = document.querySelector("#totalRevenueData");
const documentShowList = document.querySelector("#showList");


// Ticket Sales
let dataTitles = document.createElement("div");
let dataValues = document.createElement("div");
documentTicketSales.appendChild(dataTitles);
documentTicketSales.appendChild(dataValues);
dataValues.classList.add("numberList");
documentTicketSales.classList.add("adminBoxRow");

if (status.movieTicketSales.length == 0) dataTitles.innerHTML = "No ticket sales in database."
else {
	dataTitles.innerHTML = "Total Ticket Sales:";
	dataValues.innerHTML = `${status.ticketCount}`;
	for (const movie of status.movieTicketSales) {
		dataTitles.innerHTML += `<p></p>${movie.title}:`;
		dataValues.innerHTML += `<p></p>${movie.count}`;
	}
}


// Total Revenue
dataTitles = document.createElement("div");
dataValues = document.createElement("div");
documentTotalRevenue.appendChild(dataTitles);
documentTotalRevenue.appendChild(dataValues);
dataValues.classList.add("numberList");
documentTotalRevenue.classList.add("adminBoxRow");

if (status.movieTicketSales.length == 0) dataTitles.innerHTML = "No recorded revenue in database."
else {
	dataTitles.innerHTML = "Total Revenue:";
	dataValues.innerHTML = `\$${status.totalRevenue}`;
	for (const movie of status.movieTicketSales) {
		dataTitles.innerHTML += `<p></p>${movie.title}:`;
		dataValues.innerHTML += `<p></p>\$${movie.revenue}`;
	}
}

// Manage Shows
addMovieForm(null, documentShowList);
for (const movie of status["movieList"]) addMovieForm(movie, documentShowList);


// Helper functions
function addMovieForm(movie, htmlElement) {
	const movieContent = document.createElement("form");
	movieContent.classList.add("manageShow");
	if (movie == null) movieContent.classList.add("newShowBox");
	movieContent.setAttribute("method", "get");
	movieContent.setAttribute("disabled", "disabled");
	if (movie != null && movie.hasOwnProperty("id")) movieContent.setAttribute("name", `id-${movie["id"]}`);
	else movieContent.setAttribute("name", "new-movie");
	movieContent.addEventListener("submit", function(e) {
		e.preventDefault();
		
		if (e.target.getAttribute("name") == "new-movie") {
			// Add a new movie in
			const form = getFormData(e.target, true, "movie-isCurrent", "movie-title", "movie-synopsis", "movie-castInfo", "movie-price", "movie-runtime", "movie-showtimes");
			let movieForm = {
				isCurrent: form["movie-isCurrent"] == "true",
				title: form["movie-title"],
				synopsis: form["movie-synopsis"],
				cast: parseCastInformation(form["movie-castInfo"]),
				ticketPrice: parseTicketPrice(form["movie-price"]),
				runtime: form["movie-runtime"],
				showtimes: parseShowtimes(form["movie-showtimes"])
			}
			addMovie(movieForm);
			//addMovieForm(movieForm, htmlElement); // NEEDS TO KNOW THE ID OF THE NEW MOVIE BEFORE IT CAN WORK PROPERLY
		}
		else {
			if (e.target.getAttribute("disabled") != null) {
				// Allow existing movie to be edited
				applyFunctionToAllChildren(e.target, function(node) {
					if (node.getAttribute("type") == "submit") node.setAttribute("value", "Save");
					else if (node.getAttribute("hide")) node.removeAttribute("hidden");
					else node.removeAttribute("disabled");
				});
			}
			else {
				// Save the changes to the existing movie, and return it to a disabled state
				// Remove the movie if the remove checkbox was selected
				
				let remove_movie = false;
				applyFunctionToAllChildren(e.target, function(node) {
					if (node.getAttribute("type") == "submit") node.setAttribute("value", "Edit");
					else if (node.getAttribute("hide")) node.setAttribute("hidden", "hidden");
					else node.setAttribute("disabled", "disabled");
					
					if (node.getAttribute("type") == "checkbox" && node.checked) {
						if (window.confirm("Are you sure that you want to remove this show? This action cannot be undone.")) remove_movie = true;
						else node.checked = false;
					}
				});
				
				if (remove_movie) {
					// Remove the movie
					console.log("Removing film!");
					removeMovie(parseMovieId(e.target));
					e.target.remove();
				} else {
					// Update the movie
					const form = getFormData(e.target, false, "movie-isCurrent", "movie-title", "movie-synopsis", "movie-castInfo", "movie-price", "movie-runtime", "movie-showtimes");
					let movieForm = {
						id: parseMovieId(e.target),
						isCurrent: form["movie-isCurrent"] == "true",
						title: form["movie-title"],
						synopsis: form["movie-synopsis"],
						cast: parseCastInformation(form["movie-castInfo"]),
						ticketPrice: parseTicketPrice(form["movie-price"]),
						runtime: form["movie-runtime"],
						showtimes: parseShowtimes(form["movie-showtimes"])
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
		specialBox.setAttribute("hide", "hide");
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
function applyFunctionToAllChildren(node, func) {
	func(node);
	for (const child of node.children) applyFunctionToAllChildren(child, func);
}

function getFormData(node, clear, ...keys) {
	const object = {};
	applyFunctionToAllChildren(node, function(node) {
		for (const key of keys) if (node.getAttribute("name") == key) {
			if (node.nodeName == "INPUT") {
				if (node.getAttribute("type") == "text") {
					object[key] = node.value;
					if (clear) node.value = "";
				}
				else if (node.getAttribute("type") == "radio" && node.checked) {
					object[key] = node.value;
					if (clear) node.checked = false;
				}
			}
			else if (node.nodeName == "TEXTAREA") {
				object[key] = node.value;
				if (clear) node.value = "";
			}
		}
	});
	return object;
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
	return parseFloat(vari[1]);
}