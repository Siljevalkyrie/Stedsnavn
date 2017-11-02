$("document").ready(function () {

	//html objekter
	var $stedsnavnFelt
	var $sokBtn;
	var $resultSection;
	var $googleMapSection;

	//div variabler
	var xmlNavn;
	var xmlFylke;
	var xmlNr;
	var kommunedata;
	var latitude;
	var longitude;
	var stedsNavn

	//Googlemap object
	var googleMapObject;

	//Stedsnavn API Url
	//var snUrl = "Stedsnavn_Norge_WGS84_geoJSON/stedsnavn.geojson";
	var snUrl = "Stedsnavn_Norge_WGS84_geoJSON/StedsnavnMini1.geojson";

	var komUrl = "xml/kommuneliste.xml";

	//init
	var init = function () {

		//setHTMLObjects
		var setHTMLObjects = function () {
			$sokStedTxt = $("#sokStedTxt");
			$sokBtn = $("#sokBtn");
			$resultSection = $("#resultSection");
			$googleMapSection = $("#googleMapSection").get(0);
		}(); //end set HTMLObjecter

		//setEvents
		var setEvents = function () {
			$sokBtn.on("click", function () {
				sokStedsnavn();
			});
		}(); //end setEvents

		//Google config
		/* 
		//Google 1 av 3
		var initGoogleMap = function () {
			var googleMapConfig = {
				zoom: 5,
				center: new google.maps.LatLng(64, 15)
			};
			googleMapObject = new
			google.maps.Map($googleMapSection, googleMapConfig);

		}(); //end initGoogleMap  */
	}(); //end init

	//Applogikk
	//Henter stedsnavnobjektet med Ajaxkall -Kaller finnStedfunksjonen
	function sokStedsnavn() {
		$.getJSON(snUrl)
			.done(function (result) {
				stedsNavnObjekt = result;
				finnSted(stedsNavnObjekt);
			})
			.fail(function () {
				alert("Fail!")
			});
	}; //end hentStedsnavn

	//Henter kommuneobjektet med et ajaxkall. Tar med kommunenummeret som et parameter. Kaller Sett Kommunedatafunksjonen. 
	function sokKommune(nr) {
		$.ajax({
			method: "GET",
			url: komUrl,
			dataType: "xml",
			async: "false",

			success: function (xmlResultat) {
				kommunedata = xmlResultat;
				settKommunedata(nr);
			},
			complete: function () {}
		})
	}; //end søkKommune

	//Tømmer først resultatområdet for gammel data. Leter så igjennom kommunedataobjektet for en forekomst med riktig kommunenummer 
	function settKommunedata(kommuneNr) {
		$resultSection.empty();
		$(kommunedata)
			.find("Kommune")
			.each(function () {
				xmlNr = $("Kommunenr", this).text();
				//Sammenligner så kommunenummeret fra søket med forekomstene i kommunelista. Og lagrer resultatet i variabler.
				//Skriver ut resultatet på visningssiden. 
				if (kommuneNr == xmlNr) {
					xmlNavn = $("Kommunenavn", this).text();
					xmlFylke = $("Fylke", this).text();
					$resultSection.append("Kommune: " + xmlNavn + ". Fylke: " + xmlFylke + ". Lengdegrad = " + latitude + ", breddegrad = " + longitude);
				}
			});
	}; //end settKommunedata

	//stedsnavnet i Søket sjekkes mot alle stedsnavnene i stedsnavnobjektet. Finner det et treff kalles funksjonen for å hente kommuneinfo, som sender med kommunenummeret fra stedet.
	function finnSted(stedsNavnObjekt) {
		var searchTerm = $sokStedTxt.val();
		$.each(stedsNavnObjekt.features, function (i, properties) {
			stedsNavn = this.properties.enh_snavn;
			var nr = this.properties.enh_komm;
			var longLat = this.geometry.coordinates;
			var fantMatch = stedsNavn.toLowerCase().indexOf(searchTerm.toLowerCase());
			//Lengde og breddegraden lagres også for senere breuk
			if (fantMatch !== -1) {
				latitude = longLat[0];
				longitude = longLat[1];
				sokKommune(nr);
			}
			//end if check match
		})
	};
	
	//Funksjon for å lage markør på googlekartet
	/*   
	//Google 2 av 3 
	function makeMarker() {
		var nyttSted = new google.maps.Marker({
			tittel: stedsNavn,
			position: new google.maps.LatLng(latitude, longitude),
			map: googleMapObject,
			information: information
		});
	}; //*/
});
