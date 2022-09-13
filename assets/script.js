// Variables 
var searchButton = $(".searchButton");

var apiKey = "8f666f021b1d04b08dedbff32497671c";

// For loop to persist data
for (var i = 0; i < localStorage.length; i++) {

	var city = localStorage.getItem(i);

	// console.log(localStorage.getItem("City"));
	var cityName = $(".list-group").addClass("list-group-item");

	cityName.append("<li>" + city + "</li>");
}

// Key count for local storage 
var keyCount = 0;

// Search button click event
searchButton.click(function () {

	var searchInput = $(".searchInput").val();

	// Variable for current weather
	var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

	// Variable for 5 day forecast
	var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

	if (searchInput == "") {
			console.log(searchInput);
	} else {
		$.ajax({
				url: urlCurrent,
				method: "GET"
		}).then(function (response) {

				var cityName = $(".list-group").addClass("list-group-item");
				cityName.append("<li>" + response.name + "</li>");

				// Local storage
				var local = localStorage.setItem(keyCount, response.name);
				keyCount = keyCount + 1;

				// Current Weather append 
				var currentCard = $(".currentCard").append("<div>").addClass("card-body");
				currentCard.empty();
				var currentName = currentCard.append("<p>");

				currentCard.append(currentName);

				// Adjust Date 
				var timeUTC = new Date(response.dt * 1000);
				currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
				currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);

				// Add Temp 
				var currentTemp = currentName.append("<p>");

				currentName.append(currentTemp);
				currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");

				// Add Humidity
				currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");

				// Add Wind Speed
				currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

				// UV Index URL
				var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=7358b8dc4b5bc6345d5c98bc8cab0e00&lat=${response.coord.lat}&lon=${response.coord.lon}`;

				// UV Index
				$.ajax({
						url: urlUV,
						method: "GET"
				}).then(function (response) {
						var currentUV = currentTemp.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
						currentUV.addClass("UV");
						currentTemp.append(currentUV);
				});
		});

		// 5-day forecast 
		$.ajax({
				url: urlFiveDay,
				method: "GET"
		}).then(function (response) {

				// Array for 5-days 
				var day = [0, 8, 16, 24, 32];
				var fiveDayCard = $(".fiveDayCard").addClass("card-body");
				var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
				fiveDayDiv.empty();
				
				// For each for 5 days
				day.forEach(function (i) {
						var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
						FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

						fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
				})
		});
	}
});

