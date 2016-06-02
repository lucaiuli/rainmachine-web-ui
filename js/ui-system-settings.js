/*
 *	Copyright (c) 2015 RainMachine, Green Electronics LLC
 *	All rights reserved.
 */

window.ui = window.ui || {};

(function(_system) {

	var systemSettingsView = null;
	var deviceDateTime = null;
	var deviceDateTimeTimer = null;

	function loadView() {
		systemSettingsView = {
			CloudEnable: $("#systemSettingsCloudEnable"),
			Email: $("#systemSettingsEmail"),
			PendingEmail: $("#systemSettingsPendingEmail"),
			CloudSet: $("#systemSettingsCloudSet"),

			MasterValveBefore: $("#systemSettingsMasterValveBefore"),
			MasterValveBeforeSec: $("#systemSettingsMasterValveBeforeSec"),
			MasterValveAfter: $("#systemSettingsMasterValveAfter"),
			MasterValveAfterSec: $("#systemSettingsMasterValveAfterSec"),
			MasterValveSet: $("#systemSettingsMasterValveSet"),
			enableMasterValveInput: $("#systemSettingsEnableMasterValve"),

			DeviceName: $("#systemSettingsDeviceName"),
			DeviceNameSet: $("#systemSettingsDeviceNameSet"),

			LocationFull: $("#systemSettingsLocationFull"),
			LocationLat: $("#systemSettingsLocationLat"),
			LocationLon: $("#systemSettingsLocationLon"),
			LocationElev: $("#systemSettingsLocationElev"),
			LocationSet: $("#systemSettingsLocationSet"),

			Date: $("#systemSettingsDate"),
			Hour: $("#systemSettingsHour"),
			Minute: $("#systemSettingsMinute"),
			Seconds: $("#systemSettingsSeconds"),
			DateTimeSet: $("#systemSettingsDateTimeSet"),
			TimeZoneSelect: $("#systemSettingsTimeZoneSelect"),
			TimeZoneSet: $("#systemSettingsTimeZoneSet"),

			UnitsUS: $("#systemSettingsUnitsUS"),
			UnitsMetric: $("#systemSettingsUnitsMetric"),
			UnitsSet: $("#systemSettingsUnitsSet"),

			PasswordOld: $("#systemSettingsPasswordOld"),
			Password: $("#systemSettingsPassword"),
			PasswordSet: $("#systemSettingsPasswordSet"),

			ResetDefaultSet: $("#systemSettingsResetDefaultSet"),
			RebootSet: $("#systemSettingsRebootSet"),
			PINOutput: $("#systemSettingsPin"),
			PINGenerate: $('#systemSettingsGeneratePin'),

			//Advanced Settings
			AlexaSet: $("#systemSettingsAlexaSet"),
			Alexa: $("#systemSettingsAlexa"),

			BetaUpdatesSet: $("#systemSettingsBetaUpdatesSet"),
			BetaUpdates: $("#systemSettingsBetaUpdates"),

			SSHSet: $("#systemSettingsSSHSet"),
			SSH: $("#systemSettingsSSH"),
			LogSet: $("#systemSettingsLogSet"),
			Log: $("#systemSettingsLog"),
			//TODO Developer mode commented out atm
			/*
			MixerHistorySet: $("#systemSettingsMixerHistorySet"),
			MixerHistory: $("#systemSettingsMixerHistory"),
			SimulatorHistorySet: $("#systemSettingsSimulatorHistorySet"),
			SimulatorHistory: $("#systemSettingsSimulatorHistory"),
			WaterHistorySet: $("#systemSettingsWaterHistorySet"),
			WaterHistory: $("#systemSettingsWaterHistory"),
			ParserHistorySet: $("#systemSettingsParserHistorySet"),
			ParserHistory: $("#systemSettingsParserHistory"),
			ParserDaysSet: $("#systemSettingsParserDaysSet"),
			ParserDays: $("#systemSettingsParserDays"),
			SoftwareRainSensorSet: $("#systemSettingsSoftwareRainSensorSet"),
			SoftwareRainSensorEnable: $("#systemSettingsSoftwareRainSensor"),
			SoftwareRainSensorQPF: $("#systemSettingsSoftwareRainsensorQPF"),
			*/

			//Advanced Settings Mini-8 SPK2
			//TODO Developer mode commented out atm
			/*
			TouchSet: $("#systemSettingsTouchSet"),
			Touch: $("#systemSettingsTouch"),
			LedsSet: $("#systemSettingsLedsSet"),
			Leds: $("#systemSettingsLeds"),
			TouchAuthSet: $("#systemSettingsTouchAuthSet"),
			TouchAuth: $("#systemSettingsTouchAuth"),
			*/
			MaxLedSet: $("#systemSettingsMaxLedSet"),
			MaxLed: $("#systemSettingsMaxLed"),
			MinLedSet: $("#systemSettingsMixLedSet"),
			MinLed: $("#systemSettingsMinLed"),

			TouchTimeoutSet: $("#systemSettingsTouchTimeoutSet"),
			TouchTimeout: $("#systemSettingsTouchTimeout"),
			TouchAdvSet: $("#systemSettingsTouchAdvSet"),
			TouchAdv: $("#systemSettingsTouchAdv"),
			TouchPressTimeoutSet: $("#systemSettingsTouchPressTimeoutSet"),
			TouchPressTimeout: $("#systemSettingsTouchPressTimeout"),
			TouchProgSet: $("#systemSettingsTouchProgSet"),
			TouchProg: $("#systemSettingsTouchProg"),
			ShortDetectionSet: $("#systemSettingsShortDetectionSet"),
			ShortDetection: $("#systemSettingsShortDetectionEnable"),
			ShortDetectionStatus: $("#systemSettingsShortDetectionStatus"),
			ShortDetectionLoad: $("#systemSettingsShortDetectionLoad")
			};
    	}

	function showSettings()
	{
		if (! systemSettingsView)
			loadView();

		if (Data.provision.api.hwVer == 2 || Data.provision.api.hwVer === "simulator") {
			makeVisibleBlock("#systemSettingsMini8");
			showSettingsMini8();
		} else if (Data.provision.api.hwVer == 3) {
		    console.log("No specific settings for RainMachine HD-* family");
		}  else {
			console.log("Unknown device with hwVer %s", Data.provision.api.hwVer);
		}

		getBetaUpdatesStatus();

		systemSettingsView.CloudEnable.checked = Data.provision.cloud.enabled;

		//Show the pending email if no email is yet confirmed
		var currentEmail = Data.provision.cloud.email;
		var currentPendingEmail = Data.provision.cloud.pendingEmail;
		var pendingEmailText = "";

		if (currentPendingEmail && currentPendingEmail !== "") {
			 pendingEmailText = "Unconfirmed email " + currentPendingEmail;
		}

		if (pendingEmailText !== "" && currentEmail == "") {
			currentEmail = currentPendingEmail;
		}

		systemSettingsView.PendingEmail.textContent = pendingEmailText;
		systemSettingsView.Email.value = currentEmail;

		var beforeTimer = Util.secondsToHuman(Data.provision.system.masterValveBefore);
		var afterTimer = Util.secondsToHuman(Data.provision.system.masterValveAfter);

		systemSettingsView.MasterValveBefore.value = beforeTimer.minutes;
		systemSettingsView.MasterValveBeforeSec.value = beforeTimer.seconds;

		systemSettingsView.MasterValveAfter.value = afterTimer.minutes;
		systemSettingsView.MasterValveAfterSec.value = afterTimer.seconds;
		systemSettingsView.enableMasterValveInput.checked = Data.provision.system.useMasterValve;


		systemSettingsView.DeviceName.value = Data.provision.system.netName;

		systemSettingsView.LocationFull.textContent = Data.provision.location.name + " (" +
													Data.provision.location.latitude + ", " +
													Data.provision.location.longitude + ")";

		systemSettingsView.LocationLat.value = Data.provision.location.latitude;
		systemSettingsView.LocationLon.value = Data.provision.location.longitude;
		systemSettingsView.LocationElev.value = Data.provision.location.elevation;


		Data.timeDate = API.getDateTime();
		deviceDateTime = new Date(Data.timeDate.appDate.replace(/-/g, "/"));
		clearInterval(deviceDateTimeTimer);
		deviceDateTimeTimer = setInterval(showDeviceDateTime, 1000);

		buildTimeZoneSelect(systemSettingsView.TimeZoneSelect);

		systemSettingsView.UnitsUS.checked = !Data.localSettings.units;
		systemSettingsView.UnitsMetric.checked = Data.localSettings.units;

		systemSettingsView.MasterValveSet.onclick = function() {systemSettingsChangeMasterValve(); };
		systemSettingsView.DeviceNameSet.onclick = function() {
			changeSingleSystemProvisionValue("netName", systemSettingsView.DeviceName.value);
			getProvision(); //refresh
		};
		systemSettingsView.LocationSet.onclick = function() { systemSettingsChangeLocation(); };
		systemSettingsView.DateTimeSet.onclick = function() { systemSettingsChangeDateTime(); };
		systemSettingsView.TimeZoneSet.onclick = function() { systemSettingsChangeTimeZone(); };
		systemSettingsView.UnitsSet.onclick = function() { systemSettingsChangeUnits(); };
		systemSettingsView.PasswordSet.onclick = function() { systemSettingsChangePassword(); };
		systemSettingsView.ResetDefaultSet.onclick = function() { systemSettingsReset(); };
		systemSettingsView.RebootSet.onclick = function() { systemSettingsReboot(); };
		systemSettingsView.PINGenerate.onclick = function() { getLoginPIN(); };

		//Advanced Settings
		systemSettingsView.Alexa.checked = Data.provision.system.allowAlexaDiscovery;


		//TODO Developer mode commented out atm
		/*
		systemSettingsView.SoftwareRainSensorEnable.checked = Data.provision.system.useSoftwareRainSensor;
		systemSettingsView.SoftwareRainSensorQPF.value = Data.provision.system.softwareRainSensorMinQPF;
		systemSettingsView.MixerHistory.value = Data.provision.system.mixerHistorySize;
		systemSettingsView.SimulatorHistory.value = Data.provision.system.simulatorHistorySize;
		systemSettingsView.WaterHistory.value = Data.provision.system.waterLogHistorySize;
		systemSettingsView.ParserHistory.value = Data.provision.system.parserHistorySize;
		systemSettingsView.ParserDays.value = Data.provision.system.parserDataSizeInDays;
		*/

		systemSettingsView.SSHSet.onclick = function() { systemSettingsChangeSSH(); };
		systemSettingsView.LogSet.onclick = function() { systemSettingsChangeLog(); };
		systemSettingsView.CloudSet.onclick = function() { systemSettingsChangeCloud(); };

		systemSettingsView.AlexaSet.onclick = function() {
			changeSingleSystemProvisionValue("allowAlexaDiscovery", systemSettingsView.Alexa.checked);
		};


		systemSettingsView.BetaUpdatesSet.onclick = function() { systemSettingsSetBetaUpdates() };

		//TODO Developer mode commented out atm
		/*
		systemSettingsView.MixerHistorySet.onclick = function()	{
			changeSingleSystemProvisionValue("mixerHistorySize", systemSettingsView.MixerHistory.value);
		};
		systemSettingsView.SimulatorHistorySet.onclick = function() {
			changeSingleSystemProvisionValue("simulatorHistorySize", systemSettingsView.SimulatorHistory.value);
		};
		systemSettingsView.WaterHistorySet.onclick = function() {
			changeSingleSystemProvisionValue("waterLogHistorySize", systemSettingsView.WaterHistory.value);
		};
		systemSettingsView.ParserHistorySet.onclick = function() {
			changeSingleSystemProvisionValue("parserHistorySize", systemSettingsView.ParserHistory.value);
		};
		systemSettingsView.ParserDaysSet.onclick = function() {
			changeSingleSystemProvisionValue("parserDataSizeInDays", systemSettingsView.ParserDays.value);
		};

		systemSettingsView.SoftwareRainSensorSet.onclick = function() { systemSettingsSetSoftwareRainSensor() };
		*/
	}


	function showSettingsMini8() {
		getShortDetectionStatus();

		systemSettingsView.MaxLed.value = Data.provision.system.maxLEDBrightness;
		systemSettingsView.MinLed.value = Data.provision.system.minLEDBrightness;
		systemSettingsView.TouchTimeout.value = Data.provision.system.touchSleepTimeout;
		systemSettingsView.TouchAdv.checked = Data.provision.system.touchAdvanced;
		systemSettingsView.TouchPressTimeout.value = Data.provision.system.touchLongPressTimeout;
		systemSettingsView.TouchProg.checked = Data.provision.system.touchCyclePrograms;

		systemSettingsView.MaxLedSet.onclick = function() {
			changeSingleSystemProvisionValue("maxLEDBrightness", systemSettingsView.MaxLed.value);
		};
		systemSettingsView.MinLedSet.onclick = function() {
			changeSingleSystemProvisionValue("minLEDBrightness", systemSettingsView.MinLed.value);
		};
		systemSettingsView.TouchTimeoutSet.onclick = function() {
			changeSingleSystemProvisionValue("touchSleepTimeout", systemSettingsView.TouchTimeout.value);
		};
		systemSettingsView.TouchAdvSet.onclick = function() {
			changeSingleSystemProvisionValue("touchAdvanced", systemSettingsView.TouchAdv.checked);
		};
		systemSettingsView.TouchPressTimeoutSet.onclick = function() {
			changeSingleSystemProvisionValue("touchLongPressTimeout", systemSettingsView.TouchPressTimeout.value);
		};
		systemSettingsView.TouchProgSet.onclick = function() {
			changeSingleSystemProvisionValue("touchCyclePrograms", systemSettingsView.TouchProg.checked);
		};
		systemSettingsView.ShortDetectionSet.onclick = function() {
			API.setShortDetection(systemSettingsView.ShortDetection.checked);
		};

	}

	function changeSingleSystemProvisionValue(provisionKey, value)
	{
		console.log("Setting: %s to %o", provisionKey, value);
		var data = {};
		data[provisionKey] = value;

		var r = API.setProvision(data, null);

		if (r === undefined || !r || r.statusCode != 0)
		{
			console.log("Can't set %s", provisionKey);
			return;
		}

		Data.provision.system[provisionKey] = value;

	}

	function systemSettingsSetBetaUpdates() {
		var enable =  systemSettingsView.BetaUpdates.checked;
		var r = API.setBeta(enable);

		if (r === undefined || !r || r.statusCode != 0)
		{
			console.log("Can't set beta updates");
		}
		getBetaUpdatesStatus();
	}

	//TODO: Developer Mode
	/*
	function systemSettingsSetSoftwareRainSensor()
	{
		var enable =  systemSettingsView.SoftwareRainSensorEnable.checked;
		var threshold = systemSettingsView.SoftwareRainSensorQPF.value;
		var data = {
			useSoftwareRainSensor: enable,
			softwareRainSensorMinQPF: threshold
		};

		var r = API.setProvision(data, null);

		if (r === undefined || !r || r.statusCode != 0)
		{
			console.log("Can't set software rainsensor values %o", data);
			return;
		}

		Data.provision.system.useSoftwareRainSensor = enable;
		Data.provision.system.softwareRainSensorMinQPF = threshold;
	}
	*/

	function systemSettingsChangeMasterValve()
	{
		var enabled = systemSettingsView.enableMasterValveInput.checked;
		var beforeTimer = { minutes: 0, seconds: 0};
		var afterTimer = { minutes: 0, seconds:0};

		beforeTimer.minutes = parseInt(systemSettingsView.MasterValveBefore.value) || 0;
		beforeTimer.seconds = parseInt(systemSettingsView.MasterValveBeforeSec.value) || 0;

		afterTimer.minutes = parseInt(systemSettingsView.MasterValveAfter.value) || 0;
		afterTimer.seconds = parseInt(systemSettingsView.MasterValveAfterSec.value) || 0;

		var b =  beforeTimer.minutes * 60 + beforeTimer.seconds;
		var a = afterTimer.minutes * 60 + afterTimer.seconds;

		return Util.saveMasterValve(enabled, b, a);
	}

	function systemSettingsChangeUnits()
	{
		Data.localSettings.units = systemSettingsView.UnitsMetric.checked;
		Storage.saveItem("localSettings", Data.localSettings);
	}

	function systemSettingsChangePassword()
	{
		var o = systemSettingsView.PasswordOld.value;
		var n = systemSettingsView.Password.value;

		var r = API.authChange(o, n);

		console.log(r);
		if (r === undefined || !r || r.statusCode != 0)
		{
			console.log("Can't change password");
			return;
		}
	}

	function systemSettingsReset()
	{
		API.setProvisionReset(true);
		getProvision();
	}

	function systemSettingsReboot()
	{
		API.reboot();
	}

	function systemSettingsChangeSSH()
	{
		var isEnabled = systemSettingsView.SSH.checked;
		API.setSSH(isEnabled);
	}

	function systemSettingsChangeCloud()
	{
		var isEnabled = systemSettingsView.CloudEnable.checked;
		var email = systemSettingsView.Email.value;
		var currentEmail = Data.provision.cloud.email;
		var data = null;

		if (email && Util.validateEmail(email) && email != currentEmail) {
			data = {};
			data.email = "";
			data.pendingEmail = email;
			data.enable = isEnabled;
		}

		if (data) {
			API.setProvisionCloud(data);
			getProvisionCloud();
		} else {
			console.error("Invalid or unchanged email for remote access");
		}
	}

	function systemSettingsChangeLocation()
	{
		var lat = systemSettingsView.LocationLat.value;
		var lon = systemSettingsView.LocationLon.value;
		var elev = systemSettingsView.LocationElev.value;

		try {
			lat = parseFloat(lat);
			lon = parseFloat(lon);
			elev = parseFloat(elev);
		} catch(e) {
			console.error("Invalid location settings %s", e);
			return;
		}

		var data = {
			latitude: lat,
			longitude: lon,
			elevation: elev
		};

		var r = API.setProvision(null, data);

		if (r === undefined || !r || r.statusCode != 0)
		{
			console.log("Can't change location settings.");
			return;
		}

		getProvision();
	}

	function systemSettingsChangeDateTime()
	{
		var date = systemSettingsView.Date.value;
		var h = systemSettingsView.Hour.value;
		var m = systemSettingsView.Minute.value;

		var dateStr = date + " " + h + ":" + m;
		console.log("Date: %s DateStr: %s", date, dateStr);

		var r = API.setDateTime(dateStr);

		if (r === undefined || !r || r.statusCode != 0)
		{
			window.ui.main.showError("Can't change date/time settings: " + r.message);
			return;
		}

		getProvision();
	}

	function systemSettingsChangeTimeZone()
	{
		var timezone =  systemSettingsView.TimeZoneSelect.value;

		var data = {
			timezone: timezone
		};

		var r = API.setProvision(null, data);

		if (r === undefined || !r || r.statusCode != 0)
		{
			console.log("Can't change timezone.");
			return;
		}

		getProvision();
	}

	function systemSettingsChangeLog()
	{
		var level = systemSettingsView.Log.options[systemSettingsView.Log.selectedIndex].value;
		API.setLogLevel(level);
	}

	function showDeviceDateTime()
	{
		//Month/Day should have a leading 0
		var dateString = deviceDateTime.getFullYear() + "-" +
		 				('0' + (deviceDateTime.getMonth() + 1)).slice(-2) + '-' +
						('0' + deviceDateTime.getDate()).slice(-2);

		//Don't update if focused by user
		if (document.activeElement !== systemSettingsView.Seconds &&
			document.activeElement !== systemSettingsView.Minute &&
			document.activeElement !== systemSettingsView.Hour &&
			document.activeElement !== systemSettingsView.Date) {

			systemSettingsView.Hour.value = deviceDateTime.getHours();
			systemSettingsView.Minute.value = deviceDateTime.getMinutes();
			systemSettingsView.Seconds.value = deviceDateTime.getSeconds();
			systemSettingsView.Date.value = dateString;
		}

		deviceDateTime.setSeconds(deviceDateTime.getSeconds() + 1);
	}

	function getLoginPIN()
	{
		APIAsync.totp().then(function(o) {
			systemSettingsView.PINOutput.value = o.totp;
		});
	}

	function buildTimeZoneSelect(container)
	{
		var sortedData = [];

		for (var z in Data.timeZoneDB)
			sortedData.push(z);

		sortedData.sort();

		for (var i = 0; i < sortedData.length; i++)
		{
			var o = addTag(container, 'option');
			o.value = o.textContent = sortedData[i];
			if (sortedData[i] == Data.provision.location.timezone)
				o.selected = true;
		}
	}

	function getBetaUpdatesStatus() {
		return APIAsync.getBeta().then(
			function(o) {
				systemSettingsView.BetaUpdates.checked = o.enabled;
			}
		);
	}


	function getProvisionCloud() {
		return APIAsync.getProvisionCloud().then(
			function(o) {
				Data.provision.cloud = o;
				showSettings();
			});
	}

	function getProvision() {
		return APIAsync.getProvision().then(
			function(o) {
				Data.provision.system = o.system;
				Data.provision.location = o.location;
				showSettings();
				window.ui.about.showDeviceInfo();
			});
	}

	function getShortDetectionStatus() {
		return APIAsync.getShortDetection().then(
			function(o) {
				console.log(o);
				if (o.settings.watchforshort)
					systemSettingsView.ShortDetection.checked = true;
				else
					systemSettingsView.ShortDetection.checked = false;

				if (o.short >= 1000)
					systemSettingsView.ShortDetectionStatus.textContent = "Short detected type:" + o.short;
				else
					systemSettingsView.ShortDetectionStatus.textContent = "No short detected";

				if (o.load > 0)
					systemSettingsView.ShortDetectionLoad.textContent = "Load of " + o.load + " detected";
				else
					systemSettingsView.ShortDetectionLoad.textContent = "No overload detected";
			}
		);
	}

	//--------------------------------------------------------------------------------------------
	//
	//
	_system.showSettings = showSettings;
	_system.changeSingleSystemProvisionValue = changeSingleSystemProvisionValue;

} (window.ui.system = window.ui.system || {}));