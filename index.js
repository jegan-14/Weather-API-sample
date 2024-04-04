const exp = require("express");
const https = require("https");
const bodyparser = require("body-parser");
const { CLIENT_RENEG_WINDOW } = require("tls");
const app = exp();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(exp.static("public")); 
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=4d5e0ebdb1b523e18afcd05fa6d32b79&units=metric";

    https.get(url, function (response) {
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const iconUrl = 'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png ';

            let htmlResponse = `
                <div class="weather-info">
                    <h1>Weather Report</h1>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p><strong>Location:</strong> ${query}</p>
                    <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
                    <p><strong>Feels Like:</strong> ${weatherData.main.feels_like}°C</p>
                    <p><strong>Min Temperature:</strong> ${weatherData.main.temp_min}°C</p>
                    <p><strong>Max Temperature:</strong> ${weatherData.main.temp_max}°C</p>
                    <p><strong>Pressure:</strong> ${weatherData.main.pressure}hPa</p>
                    <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
                    <p><strong>Wind Speed:</strong> ${weatherData.wind.speed}m/s</p>
                    <p><strong>Cloudiness:</strong> ${weatherData.clouds.all}%</p>
                </div>
            `;

            res.send(htmlResponse);
        });
    });
});

app.listen(3000, function () {
    console.log("Server started at http://localhost:3000");
});
