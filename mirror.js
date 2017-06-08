function showError(err) {
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;
	app.displayAlert(err.toString());
}

function getDisplaysPane(prefApp) {
	const displays = prefApp.panes.byId('com.apple.preference.displays');
	displays.reveal();
	delay(0.3);
	return displays;
}

function getPrefWindows(prefName) {
	return new Application('System Events')
		.processes[prefName]
		.windows();
}

function mirror(displays, prefApp, prefWindows) {
	try {
		displays
			.anchors
			.byName('displaysArrangementTab')
			.reveal();
	} catch (err) {
		showError(err, 'Cannot find Arrangement');
		return;
	}

	prefWindows
		.map(w => w.tabGroups[0])
		.filter(t => t.checkboxes.length > 0)
		.forEach(t => t.checkboxes[0].click());
}

function run(argv) {
	const prefName = 'System Preferences';
	const prefApp = new Application(prefName);
	const displays = getDisplaysPane(prefApp);
	const prefWindows = getPrefWindows(prefName);

	if (prefWindows.length > 1) {
		mirror(displays, prefApp, prefWindows);
	} else {
		showError('Need more displays', '');
	}
	prefApp.quit();
}

