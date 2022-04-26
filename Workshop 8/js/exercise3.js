// If the CORS-issue is preventing the data to be loaded, we can just use local variable


// If CORS-issue is fine (IE seems to work), we can fetch the data using AJAX
// Define a variable which can be used globally
var jsonObj;


function lataaJSONDoc(city) {
    var citi = city;
    console.log("Ladataan tiedot palvelimelta..." + citi);
    var xhttp = new XMLHttpRequest();
    var urli = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + citi + "%0B&units=metric&mode=JSON&appid=f23430b78457c598033a85cb3741012d";
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Haku onnistui...");
            jsonObj = JSON.parse(xhttp.responseText);
            console.log(jsonObj);
            printJSONTable(jsonObj);
        } else if (this.readyState == 4 && this.status == 404) {
            alert("Antanmaasi kaupunkia ei löydy!  " + this.status + "   " + this.readyState);
            return;
        }
    };
    xhttp.open("GET", urli, true);
    xhttp.send();

}

function printJSONTable(jsonObj) {

    // JSON data is stored in data variable
    var data = jsonObj;
    var out = "<table><tr><th>Kaupunki</th><th>Pilvet</th><th>Lämpötila</th><th>Lämpötila tuntuu</th><th>Tuuli</th></tr>";
    var nimi = data.name;
    var pilvi = data.clouds.all;
    var temp = data.main.temp;
    var feelslike = data.main.feels_like;
    var tuuli = data.wind.speed;
    out += '<tr><td>' + nimi + '</td><td>' + pilvi + '%</td><td>' + temp + '°C</td><td>' + feelslike + '°C</td><td>' + tuuli + 'm/s</td></tr>';
    out += "</table>";
    if (nimi == "Espoo") {
        document.getElementById("espoodata").innerHTML = out;
    } else {
        document.getElementById("weatherdata").innerHTML = out;
    }


}