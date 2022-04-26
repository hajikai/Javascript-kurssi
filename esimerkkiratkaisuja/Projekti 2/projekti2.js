// Aluksi määrittelen kaikki globaalit muuttujat, joita tulen käyttämään, kuten kaikki eri hakujen JSON-objektit. En ole ihan varma, miksi tein useamman - kai jossain vaiheessa debukaakseni. 
// Ei valitettavasti nyt ole aikaa lähteä muuttamaan koodia, sillä aloitin aika viime tipassa.
// Määrittelen JSON-objektien lisäksi 'spot' ja 'table' -muuttujat, hakusanan ('search'), API-avaimen ('searchKey'), hakumuodon ('artist.search' alustavasti) sekä valittuArtisti ja valittuAlbumi,
// joita tulen käyttämään myöhemmin.

var jsonOnj0;
var jsonObj1;
var jsonObj2;
var jsonObj3;
var spot = document.getElementById("extradata");
var table = document.getElementById("searchdata");
var search = "";
var searchKey = "84badb99da40db8ee7a92e641cc77c73";
var methodName = "artist.search";
var methodSearch = "artist";
var valittuAlbumi = "";
var valittuArtisti = "";

// Ensimmäinen funktio määrittelee API-haun URL:ssa käytettävän kevyen sekä tarkemman hakumuodon.

function chooseMethod(method) {
  if (method == "artist") {
    methodName = "artist.search";
    methodSearch = "artist";
    console.log(methodSearch);
  }
  if (method == "album") {
    methodName = "album.search";
    methodSearch = "album";
    console.log(methodSearch);
  }
}

// Seuraava funktio tekee itse API-kutsun, kun haet artisteja tai albumeita sivun ylälaidasta.
// Se syöttää oikeat tiedot URL:iin REST requestia varten ja parsee vastaustekstin JSON-muotoon. Samalla myös piilottaa 'spot'-elementin, sillä en halua sen näkyvän enää uuden haun jälkeen.

function lataaJSONDoc(search) {
  var newSearch = search;
  if (methodName == "artist.search") {
    console.log("Ladataan tiedot palvelimelta..." + newSearch);
    methodName = 'artist.search';
    methodSearch = 'artist';
    var xhttp = new XMLHttpRequest();
    var urli =
      "https://ws.audioscrobbler.com/2.0/?method=" +
      methodName +
      "&" +
      methodSearch +
      "=" +
      newSearch +
      "&api_key=" +
      searchKey +
      "&format=json";
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Haku onnistui...");
        jsonObj1 = JSON.parse(xhttp.responseText);
        console.log(jsonObj1);
        spot.style.display = "none";

// Jos haku onnistui ongelmitta, niin sitten siirrytään printArtistTable()-funktioon, joka tulostaa ko. artistihaun tuottaman taulun.

        printArtistTable(jsonObj1);
      } else if (this.readyState == 4 && this.status == 404) {

// Jos haku ei mene läpi, niin käyttäjä saa Error-viestin.
    
        alert(
          "Artist not found. Error: " + this.status + " & " + this.readyState + "."
        );
        return;
      }
    };
    xhttp.open("GET", urli, true);
    xhttp.send();
  }

// Sama tapahtuma, mutta albumihaulla.

  if (methodName == "album.search") {
    console.log("Ladataan tiedot palvelimelta..." + newSearch);
    methodName = 'album.search';
    methodSearch = 'album';
    var xhttp = new XMLHttpRequest();
    var urli =
      "https://ws.audioscrobbler.com/2.0/?method=" +
      methodName +
      "&" +
      methodSearch +
      "=" +
      newSearch +
      "&api_key=" +
      searchKey +
      "&format=json";
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Haku onnistui...");
        jsonObj0 = JSON.parse(xhttp.responseText);
        console.log(jsonObj0);
        spot.style.display = "none";
        printAlbumTable(jsonObj0);
      } else if (this.readyState == 4 && this.status == 404) {
        alert(
          "Album not found. Error: " + this.status + " & " + this.readyState
        );
        return;
      }
    };
    xhttp.open("GET", urli, true);
    xhttp.send();
  }
}

// Sitten päästään itse tulostaulun tulostamiseen - tässä tapauksessa albumihaun tuloksien tulostamiseen.
// En jaksa tällä kertaa lähteä selittämään jokaista koodinpätkää, mutta selkeäkielisti funktio aloittaa tarkistamaan (ja syöttämään jos kaikki on kunnossa) JSON-objektissa olevaa Last.fm-tietoa.
// Eri vaiheissa funktiota tarkistan esim. onko ko. albumin sisällä tietoa nimestä - korjaan tilanteen, jottei satu hassuja bugeja.

function printAlbumTable(jsonObj0) {
  var data = jsonObj0;
  var määrä = data.results["opensearch:totalResults"];
  var out =
    "<table><tbody id='table'><tr><th>Albumi</th><th>Albumin nimi</th><th>Artisti</th><th>Linkki</th></tr>";
  if (data.hasOwnProperty("results") == true) {
    if (data.results.hasOwnProperty("albummatches") == true) {
      if (data.results.albummatches.hasOwnProperty("album") == true) {

// Tarkistan onko tuloksien määrä alle 50, jos on niin menen tuloksien määrällä. En halua 50 enempää, ettei sivu mene ihan tukkoon.

        if (määrä < 50) {
          for (let i = 0; i < määrä; i++) {
            var artisti = data.results.albummatches.album[i].artist;
            var nimi = data.results.albummatches.album[i].name;
            var URL = data.results.albummatches.album[i].url;
            var imageURL = data.results.albummatches.album[i].image[2]["#text"];
            out += "<tr class='notchosen'>";
            if (
              data.results.albummatches.album[i].hasOwnProperty("image") == true
            ) {
              if (imageURL !== "") {
                out += "<td><img src='" + imageURL + "'></td>";
              } else {
                out += "<td class='pic'>No image found</td>";
              }
            } else {
              out += "<td class='pic'>No image found</td>";
            }
            if (
              data.results.albummatches.album[i].hasOwnProperty("name") == true
            ) {
              if (nimi !== "(null)" || nimi !== "null" || nimi !== "") {
                out += "<td>" + nimi + "</td>";
              } else {
                out += "<td>No name found.</td>";
              }
            } else {
              out += "<td>No name found.</td>";
            }
            if (
              data.results.albummatches.album[i].hasOwnProperty("artist") ==
              true
            ) {
              if (
                artisti !== "undefined" ||
                artisti !== "" ||
                artisti !== "null" ||
                artisti !== "(null)"
              ) {
                out += "<td>" + artisti + "</td>";
              } else {
                out += "<td>No name found.</td>";
              }
            } else {
              out += "<td>No name found.</td>";
            }
            if (
              data.results.albummatches.album[i].hasOwnProperty("url") == true
            ) {
              out +=
                "<td>" +
                "<a href='" +
                URL +
                "'target='_blank'>Link</a>" +
                "</td>";
            } else {
              out += "<td>No link found.</td>";
            }
            out += "</tr>";
          }
        } else {

// Sama kuin edellinen, mutta jos tuloksia on yli 30 kappaletta.

          for (let i = 0; i < 50; i++) {
            var artisti = data.results.albummatches.album[i].artist;
            var nimi = data.results.albummatches.album[i].name;
            var URL = data.results.albummatches.album[i].url;
            var imageURL = data.results.albummatches.album[i].image[2]["#text"];
            out += "<tr class='notchosen'>";
            if (
              data.results.albummatches.album[i].hasOwnProperty("image") == true
            ) {
              if (imageURL !== "") {
                out += "<td><img src='" + imageURL + "'></td>";
              } else {
                out += "<td class='pic'>No image found</td>";
              }
            } else {
              out += "<td class='pic'>No image found</td>";
            }
            if (
              data.results.albummatches.album[i].hasOwnProperty("name") == true
            ) {
              if (nimi !== "(null)" || nimi !== "null" || nimi !== "") {
                out += "<td>" + nimi + "</td>";
              } else {
                out += "<td>No name found.</td>";
              }
            } else {
              out += "<td>No name found.</td>";
            }
            if (
              data.results.albummatches.album[i].hasOwnProperty("artist") ==
              true
            ) {
              if (
                artisti !== "undefined" ||
                artisti !== "" ||
                artisti !== "(null)" ||
                artisti !== "null"
              ) {
                out += "<td>" + artisti + "</td>";
              } else {
                out += "<td>No name found.</td>";
              }
            } else {
              out += "<td>No name found.</td>";
            }
            if (
              data.results.albummatches.album[i].hasOwnProperty("url") == true
            ) {
              out +=
                "<td>" +
                "<a href='" +
                URL +
                "'target='_blank'>Link</a>" +
                "</td>";
            } else {
              out += "<td>No link found.</td>";
            }
            out += "</tr>";
          }
        }
        out += "</table>";

// Lopuksi syötetään out-elementissä oleva taulu 'searchdata'-elementtiin ja hälytetään jos haun tulokset ovat jotenkin outoja - silloin on yleensä mennyt jotain pahasti vikaan.

        document.getElementById("searchdata").innerHTML = out;
      } else {
        window.alert("No data found.");
      }
    } else {
      window.alert("No data found.");
    }
  } else {
    window.alert("No data found.");
  }

// Lopuksi ajan Valitse()-funktion, joka määrittelee EventListener-funktiot taulun albumeille / artisteille, jotta niitä voi painaa.

  valitse();
}

// Sitten sama kuin albumeille, mutta artisteille.

function printArtistTable(jsonObj) {
  var data = jsonObj;
  var määrä = data.results["opensearch:totalResults"];
  var out =
    "<table><tbody id='table'><tr><th>Artistin kuva</th><th>Artistin nimi</th><th>Kuuntelijoiden määrä</th><th>Linkki</th></tr>";
  if (data.hasOwnProperty("results") == true) {
    if (data.results.hasOwnProperty("artistmatches") == true) {
      if (data.results.artistmatches.hasOwnProperty("artist") == true) {
        if (määrä < 30) {
          for (let i = 0; i < määrä; i++) {
            var artisti = data.results.artistmatches.artist[i].name;
            var listeners = data.results.artistmatches.artist[i].listeners;
            var URL = data.results.artistmatches.artist[i].url;
            var imageURL =
              data.results.artistmatches.artist[i].image[3]["#text"];

            out += "<tr class='notchosen'>";
            if (
              data.results.artistmatches.artist[i].hasOwnProperty("image") ==
              true
            ) {
              if (imageURL !== "") {
                out += "<td class='pic'><img src='" + imageURL + "'></td>";
              } else {
                out += "<td class='pic'>Ei kuvaa.</td>";
              }
            } else {
              out += "<td class='pic'>Ei kuvaa.</td>";
            }
            if (
              data.results.artistmatches.artist[i].hasOwnProperty("name") ==
              true
            ) {
              out += "<td>" + artisti + "</td>";
            } else {
              out += "<td>Name not found.</td>";
            }
            if (
              data.results.artistmatches.artist[i].hasOwnProperty(
                "listeners"
              ) == true
            ) {
              out += "<td>" + listeners + "</td>";
            } else {
              out += "<td>Data not found.</td>";
            }
            if (
              data.results.artistmatches.artist[i].hasOwnProperty("url") == true
            ) {
              out +=
                "<td>" +
                "<a href='" +
                URL +
                "'target='_blank'>Linkki</a>" +
                "</td>";
            } else {
              out += "<td>No URL found.</td>";
            }
            out += "</tr>";
          }
        } else {
          for (let i = 0; i < 30; i++) {
            var artisti = data.results.artistmatches.artist[i].name;
            var listeners = data.results.artistmatches.artist[i].listeners;
            var URL = data.results.artistmatches.artist[i].url;
            var imageURL =
              data.results.artistmatches.artist[i].image[3]["#text"];

            out += "<tr class='notchosen'>";
            if (
              data.results.artistmatches.artist[i].hasOwnProperty("image") ==
              true
            ) {
              if (imageURL !== "") {
                out += "<td class='pic'><img src='" + imageURL + "'></td>";
              } else {
                out += "<td class='pic'>Ei kuvaa.</td>";
              }
            } else {
              out += "<td class='pic'>Ei kuvaa.</td>";
            }
            if (
              data.results.artistmatches.artist[i].hasOwnProperty("name") ==
              true
            ) {
              out += "<td>" + artisti + "</td>";
            } else {
              out += "<td>Name not found.</td>";
            }
            if (
              data.results.artistmatches.artist[i].hasOwnProperty(
                "listeners"
              ) == true
            ) {
              out += "<td>" + listeners + "</td>";
            } else {
              out += "<td>Data not found.</td>";
            }
            if (
              data.results.artistmatches.artist[i].hasOwnProperty("url") == true
            ) {
              out +=
                "<td>" +
                "<a href='" +
                URL +
                "'target='_blank'>Linkki</a>" +
                "</td>";
            } else {
              out += "<td>No URL found.</td>";
            }
            out += "</tr>";
          }
        }
      } else {
        window.alert("No data found.");
      }
    } else {
      window.alert("No data found.");
    }
  } else {
    window.alert("No data found.");
  }

  out += "</table>";
  document.getElementById("searchdata").innerHTML = out;
  valitse();
}

// Tässä aiemmin mainittu Valitse()-funktio, joka antaa EventListener-funktiot jokaiselle taulun kohdalle. Eli jos painan jotain albumia / artistia, niin saan auki ylimääräisen 
// fixed position DIV:n esille, jossa on lisätietoa artistista / albumista. Tämä funktio ajaa ensimmäisen osan toiminnasta.
// Käytän ValittuAlbumi ja valittuArtisti -muuttujia muistamaan mitä olen painanut.
// Sitten käytän funktiota tulosta() tekemään visuaaliset muutokset, koska tässä funktiossa niiden tekeminen oli välillä ongelmallista - haku tapahtui liian hitaasti eikä funkio löytänyt
// tarvitsemiaan asioita.

function valitse() {
  var table = document.getElementById("searchdata");
  for (let i = 1; i < 50; i++) {
    table.firstChild.firstChild.children[i].addEventListener(
      "click",
      function (e) {
        if (methodSearch == "album") {
          if (
            table.firstChild.firstChild.children[i].children[1].innerHTML ==
              valittuAlbumi &&
            table.firstChild.firstChild.children[i].children[2].innerHTML ==
              valittuArtisti
          ) {
            valittuAlbumi = "";
            valittuArtisti = "";
            spot.style.display = "none";
            console.log(valittuArtisti + ", " + valittuAlbumi);
            tulosta();
          } else {
            valittuAlbumi =
              table.firstChild.firstChild.children[i].children[1].innerHTML;
            valittuArtisti =
              table.firstChild.firstChild.children[i].children[2].innerHTML;
            spot.style.display = "inline-block";
            console.log(valittuArtisti + ", " + valittuAlbumi);
            tulosta();
          }
        }
        if (methodSearch == "artist") {
          if (
            table.firstChild.firstChild.children[i].children[1].innerHTML ==
            valittuArtisti
          ) {
            valittuArtisti = "";
            spot.style.display = "none";
            console.log(valittuArtisti);
            tulosta();
          } else {
            valittuArtisti =
              table.firstChild.firstChild.children[i].children[1].innerHTML;
            spot.style.display = "inline-block";
            console.log(valittuArtisti);
            tulosta();
          }
        }
      }
    );
  }
}

// tulosta()-funktiossa siis teen itse visuaaliset muutokset muuttamalla ko. tr-elementin class-arvoa mikäli sen sisällä oleva artistin (tai albumin ja artistin) nimi / nimet vastaavat 
// valittuArtisti ja valittuAlbumi -muuttujien arvoja. Sen jälkeen ajan getAlbumData() tai getArtistData() -funktiot riippuen hakumuodosta. 

function tulosta() {
  var table = document.getElementById("searchdata");
  for (let i = 1; i < 50; i++) {
    if (methodSearch == "album") {
      if (
        table.firstChild.firstChild.children[i].children[1].innerHTML ==
          valittuAlbumi &&
        table.firstChild.firstChild.children[i].children[2].innerHTML ==
          valittuArtisti
      ) {
        var attribute4 = document.createAttribute("class");
        attribute4.value = "chosen";
        table.firstChild.firstChild.children[i].setAttributeNode(attribute4);
        getAlbumData();
      } else {
        var attribute5 = document.createAttribute("class");
        attribute5.value = "notchosen";
        table.firstChild.firstChild.children[i].setAttributeNode(attribute5);
      }
    }
    if (methodSearch == "artist") {
      if (
        table.firstChild.firstChild.children[i].children[1].innerHTML ==
        valittuArtisti
      ) {
        var attribute4 = document.createAttribute("class");
        attribute4.value = "chosen";
        table.firstChild.firstChild.children[i].setAttributeNode(attribute4);
        getArtistData();
      } else {
        var attribute5 = document.createAttribute("class");
        attribute5.value = "notchosen";
        table.firstChild.firstChild.children[i].setAttributeNode(attribute5);
      }
    }
  }
}

// Tässä määrittelen joitain globaaleja muuttujia, joita käytin ratkomaan joitain REST request URL:n kanssa olleita ongelmia kuten ampersand (;amp&)

var uusiValittuArtisti;
var theUrli;
var finalUrli;
var uusiUrli;
var urli;

// Sitten getArtistData()-funktion pariin, jossa ensin muutan REST Request -urlia niin, että se toimii '&' -merkin ja muiden ongelmatapuksien kanssa. Ei täysin ongelmaton, mutta toimii ainakin
// niissä tapauksissa, joita olen itse ehtinyt testata. Jos ei toimi, niin heittää erroria.
// Tämä funktio hoitaa artistipuolen.

function getArtistData() {
  urli =
    "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
    uusiValittuArtisti +
    "&api_key=" +
    searchKey +
    "&format=json";
  if (urli.includes("&amp;") == true) {
    uusiUrli = urli.replace("&amp;", "");
    console.log(uusiUrli + " korjattu");
    urli = uusiUrli;
    if (urli.includes("  ") == true) {
      finalUrli = uusiUrli.replace("  ", " ");
      urli = finalUrli;
    }
  } else {
    urli =
      "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
      uusiValittuArtisti +
      "&api_key=" +
      searchKey +
      "&format=json";
  }
  var xhttp = new XMLHttpRequest();
  console.log(urli);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Haku onnistui...");
      jsonObj3 = JSON.parse(xhttp.responseText);
      console.log(jsonObj3);
      if (jsonObj3.hasOwnProperty("error") == true) {
        window.alert("Something went wrong.");
        return;
      } else {
        printArtistData(jsonObj3);
      }
    } else if (this.readyState == 4 && this.status == 404) {
      window.alert("Artist not found.");
      return;
    }
  };
  xhttp.open("GET", urli, true);
  xhttp.send();
}

// printArtistData() tulostaa getArtistData()-funktion JSON-muotoon laittamaa dataa. Osittain hyvin samanlainen funktio kuin esim. printArtistTable eli tsekkaan datan laatua
// ja koitan parhaani välttää esim. 'null'-arvoja ilmestymästä ruudulle, jos data on puuttellista. Sen sijaan laitan esim. 'Information not found' tms.

function printArtistData(jsonObj3) {
  var spot = document.getElementById("extradata");
  var attribute4 = document.createAttribute("class");
  attribute4.value = "visibleExtraData";
  spot.setAttributeNode(attribute4);
  var data = jsonObj3;
  var bio = data.artist.bio.content;
  var julkaistu = data.artist.bio.published;
  var ontour = data.artist.ontour;
  if (data.hasOwnProperty("artist") == true) {
    var out = "<div class='otsikko'><h2 id='albumname'>" + valittuArtisti + "</h2></div>";
    out += "<button type='button' class='collapsible'>Biography</button><div class='content'>";
      if (data.artist.bio.hasOwnProperty("content") == true) {
        if (data.artist.bio.content !== "") {
          out += "<p>" + bio + "</p>";
        } else {
          out += "<p>Information not found.</p>";
        }
      } else {
        out += "<p>Information not found.</p>";
      }
      out += "</div>";
      out += "<button type='button' class='collapsible'>Tags</button><div class='content'>";
    if (data.artist.hasOwnProperty("tags") == true) {
      if (data.artist.tags.hasOwnProperty("tag") == true) {
        if (data.artist.tags.tag.length !== 0) {
          for (let i = 0; i < data.artist.tags.tag.length; i++) {
            var tagi = data.artist.tags.tag[i].name;
            out += "<p class='info'>" + tagi + "</p>";
          }
        } else {
          out += "<p>Information not found.</p>";
        }
      } else {
        out += "<p>Information not found.</p>";
      }
    } else {
      out += "<p>Information not found.</p>";
    }
    out += "</div>";
    out +=
      "<button type='button' class='collapsible'>Similar</button><div class='content'>";
    if (data.artist.hasOwnProperty("similar") == true) {
      if (data.artist.similar.hasOwnProperty("artist") == true) {
        if (data.artist.similar.artist.length !== 0) {
          for (let i = 0; i < data.artist.similar.artist.length; i++) {
            var similar = data.artist.similar.artist[i].name;
            out += "<p class='info'>" + similar + "</p>";
          }
        } else {
          out += "<p>Information not found.</p>";
        }
      } else {
        out += "<p>Information not found.</p>";
      }
    } else {
      out += "<p>Information not found.</p>";
    }
    out += "</div>";

    out +=
      "<button type='button' class='collapsible'>Miscellaneous</button><div class='content'>";
    if (data.artist.bio.hasOwnProperty("published") == true) {
      out += "<p>Published in: " + julkaistu + "</p>";
    } else {
      out += "<p>Publishing date not found.</p>";
    }
    if (data.artist.hasOwnProperty("ontour") == true) {
      if (ontour == "0") {
        ontour = "No";
        console.log(ontour);
      }
      if (ontour == "1") {
        ontour = "Yes";
        console.log(ontour);
      }
      out += "<p>On tour: " + ontour + "</p>";
    } else {
      out += "<p>Touring information not found.</p>";
    }
    document.getElementById("extradata").innerHTML = out;
  } else {
    window.alert("Data not found.");
  }

// Tässä hieman toimitoa collapsible -elementeille, kuten printAlbumData() ja printArtistData():n tulostamat. Eli luon EventListener:n, joka avaa ja sulkee ne.

  var coll = document.getElementsByClassName("collapsible");

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }
}

var uusiValittuAlbumi;

// Tässä sama koodi kuin getArtistData()-funktiossa, mutta albumidatan kanssa.

function getAlbumData(jsonObj2) {
  urli =
    "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" +
    searchKey +
    "&artist=" +
    valittuArtisti +
    "&album=" +
    valittuAlbumi +
    "&format=json";
  console.log(urli);
  if (urli.includes("&amp;") == true) {
    uusiUrli = urli.replace("&amp;", "");
    console.log(uusiUrli + " korjattu");
    urli = uusiUrli;
    if (urli.includes("  ") == true) {
      finalUrli = uusiUrli.replace("  ", " ");
      urli = finalUrli;
    }
  } else {
    urli =
      "https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" +
      searchKey +
      "&artist=" +
      valittuArtisti +
      "&album=" +
      valittuAlbumi +
      "&format=json";
  }

  var xhttp = new XMLHttpRequest();
  console.log(urli);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Haku onnistui...");
      jsonObj2 = JSON.parse(xhttp.responseText);
      console.log(jsonObj2);
      printAlbumData(jsonObj2);
    } else if (this.readyState == 4 && this.status == 404) {
      alert("Album not found. " + this.status + "   " + this.readyState);
      return;
    }
  };
  xhttp.open("GET", urli, true);
  xhttp.send();
}


// Tässä pitkälti sama toiminto kuin printAristData()-funktion kanssa, mutta albumidatan kanssa. Eli tsekkaan arvojava, tulostan jos ovat oikeita, tulostan jotain muuta jos eivät ole.
// Sisältää hieman eri tietoja, mutta muuten samanlainen.

function printAlbumData(jsonObj2) {
  var spot = document.getElementById("extradata");
  var attribute4 = document.createAttribute("class");
  attribute4.value = "visibleExtraData";
  spot.setAttributeNode(attribute4);
  var data = jsonObj2;
  var kuuntelijat = data.album.listeners;
  var kuuntelukerrat = data.album.playcount;
  
  if (data.hasOwnProperty("album") == true) {
    var out =
      "<h2 id='albumname'>" + valittuArtisti + " - " + valittuAlbumi + "</h2>";
    out +=
      "<button type='button' class='collapsible'>Tags</button><div class='content'>";
    if (data.album.hasOwnProperty("tags") == true) {
      if (data.album.tags !== "") {
        for (let i = 0; i < data.album.tags.tag.length; i++) {
          var tagi = data.album.tags.tag[i].name;
          out += "<p class='info'>" + tagi + "</p>";
        }
      } else {
        out += "<p>No information found.</p>";
      }
    } else {
      out += "<p>No information found.</p>";
    }
    out += "</div>";

    out +=
      "<button type='button' class='collapsible'>Tracks</button><div class='content'>";
    if (data.album.hasOwnProperty("tracks") == true) {
      if (data.album.tracks.track.hasOwnProperty("@attr") == true) {
        if (
          data.album.tracks.track.name !== "" ||
          data.album.tracks.track.name !== "(null)" ||
          data.album.tracks.track.name !== "null"
        ) {
          var yksibiisi = data.album.tracks.track.name;
          out += "<p class='info'>" + yksibiisi + "</p>";
        } else {
          out += "<p class='info'No information found.</p>";
        }
      } else {
        if (biisi !== "" || biisi !== "(null)" || biisi !== "null") {
        for (let i = 0; i < data.album.tracks.track.length; i++) {
            var biisi = data.album.tracks.track[i].name;
            out += "<p class='info'>" + biisi + "</p>";
          } 
          } else {
            out += "<p class='info>No information found.</p>";
        }
      }
    } else {
      console.log("I'm in the last else");
      out += "<p class='info'>No information found.</p>";
    }

    out += "</div>";

    out +=
      "<button type='button' class='collapsible'>Miscellaneous</button><div class='content'>";

    if (data.album.hasOwnProperty("listeners") == true) {
      if (
        kuuntelijat !== "" ||
        kuuntelijat !== "null" ||
        (kuuntelijat !== "(null)") == true
      ) {
        out += "<p class='info'>Listeners: " + kuuntelijat + "</p>";
      } else {
        out += "<p class='info'>Listeners: No information found.</p>";
      }
    } else {
      out += "<p class='info'>Listeners: No information found.</p>";
    }
    if (data.album.hasOwnProperty("playcount") == true) {
      if (
        kuuntelijat !== "" ||
        kuuntelijat !== "null" ||
        (kuuntelijat !== "(null)") == true
      ) {
        out += "<p class='info'>Playcount: " + kuuntelukerrat + "</p>";
      } else {
        out += "<p class='info'>Playcount: No information found.</p>";
      }
    } else {
      out += "<p class='info'>Playcount: No information found.</p>";
    }
    out += "</div>";

    document.getElementById("extradata").innerHTML = out;
  } else {
    window.alert("Something went wrong.");
  }
}

var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}