/**
 * Created by Nicu Pavel on 11/28/16.
 */

window.ui = window.ui || {};

(function(_firebase) {

	function init() {
		_firebase.firebase = {};
		_firebase.firebase.isLogged = false;
		_firebase.firebase.loaded = false;

		try {
			var config = {
				apiKey: "AIzaSyDLzlRQUuOBV5p9xqsMN4HJu5dKRfJeylo",
				authDomain: "rainmachine-aa702.firebaseapp.com",
				databaseURL: "https://rainmachine-aa702.firebaseio.com",
				storageBucket: "rainmachine-aa702.appspot.com",
				messagingSenderId: "906819096221",
			};
			firebase.initializeApp(config);

			_firebase.firebase.enter = firebase["\x61\x75\x74\x68"]();
			_firebase.firebase.storageRef = firebase.storage().ref();
			_firebase.firebase.loaded = true;
		} catch (e) {
			console.error("Firebase cannot be loaded. Zone images unavailable")
		}
	}

	function enter() {
		if (window.ui.firebase.firebase.loaded) {
			_firebase.firebase.enter.onAuthStateChanged(function(user) {
				if (user) {
					_firebase.firebase.isLogged = true;
					getZonesImages();
				} else {
					_firebase.firebase.enter["\x73\x69\x67\x6E\x49\x6E\x57\x69\x74\x68\x45\x6D\x61\x69\x6C\x41\x6E\x64\x50\x61\x73\x73\x77\x6F\x72\x64"]
					($('#mode').dataset.f + $('#domain').dataset.f, "\x72\x21\x65\x40\x23\x24\x79\x64\x73\x23\x70\x71\x6C").catch(function(error) {
						console.log(error);
					});
				}
			});
		}
	}

	function getZonesImages() {
		if (window.ui.firebase.firebase.isLogged) {
			if (Data.provision.wifi === null || Data.provision.system === null) {
				setTimeout(window.ui.firebase.firebaseGetZonesImages, 2000);
				return;
			}
			try {
				var mac = Data.provision.wifi.macAddress;
				var lat = Data.provision.location.latitude;
				var lon = Data.provision.location.longitude;

				if (mac === null || mac.split(":").length != 6) {
					console.error("Invalid device MAC address");
					return;
				}

				if (lat === null || lon === null)
				{
                    console.error("Invalid latitude or longitude");
                    return;
				}

				lat = Math.trunc(lat * 1000)/1000;
                lon = Math.trunc(lon * 1000)/1000;
				var strLat = lat.toFixed(3);
                var strLon = lon.toFixed(3);

				var valves = +Data.provision.system.localValveCount;
				var storagePath = "devices/" + mac + "/images/";
				Data.zonesImages = {};

				for (var i = 1; i <= valves; i++) {
					var name = "zone" + i + "_" + strLat + "_" + strLon + ".jpg";
					var currentImage = storagePath + name;
					var imageRef = window.ui.firebase.firebase.storageRef.child(currentImage);

					var nameLegacy = "zone" + i + ".jpg";
                    var currentImageLegacy = storagePath + nameLegacy;
                    var imageRefLegacy = window.ui.firebase.firebase.storageRef.child(currentImageLegacy);

					imageRef.getDownloadURL().then(
						function(id, url) {
							Data.zonesImages[id] = url;
							window.ui.zones.updateZoneImage(id); //Force a zone image refresh
						}.bind(null, i)
					).catch( //Error for mac/zone1_lat_lon.jpg name format
						function(id, ref){
                            console.log("Cannot download zone %d image", id);
                            ref.getDownloadURL().then( // Try to fallback to legacy image
                                function(idlegacy, url) {
                                    Data.zonesImages[idlegacy] = url;
                                    window.ui.zones.updateZoneImage(idlegacy); //Force a zone image refresh
                                }.bind(null, id)
							).catch( //Error for mac/zone1.jpg name format
                                function (idlegacy, ref) {
                                    console.log("Cannot download legacy zone %d image", id);
                                }
							)
						}.bind(null, i, imageRefLegacy)
					);

                }
			} catch (e) {
				console.error(e);
			}
		} else {
			console.log("No auth to retrieve zone images");
		}
	}

	_firebase.init= init;
	_firebase.enter = enter;

} (window.ui.firebase = window.ui.firebase || {}));