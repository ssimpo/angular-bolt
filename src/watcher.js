angular.module("bolt").factory("boltWatcher", [

function() {
	"use strict";

	const controllers = new WeakMap();

	function getPreviousWatchers(controller) {
		if (!controllers.has(controller)) controllers.set(controller, new Map());
		return controllers.get(controller);
	}

	function getWatcherChangeMap(watchers, previous) {
		let changed = new Map();
		angular.forEach(watchers, (value, key) => {
			if (!previous.has(key)) {
				changed.set(key, true);
			} else {
				if (previous[key] != value) changed.set(key, true);
			}
		});
		return changed;
	}

	function report(options) {
		const controller = options.controller || options.scope[options.scopeName];
		const toWatch = options.toWatch || options.toObserve;

		let previous = getPreviousWatchers(controller);
		let currentWatcher = () => getWatcherObject(toWatch, controller);
		let trigger = (watchers = currentWatcher()) => options.callback(watchers, options);

		return Object.assign(
			options.scope.$watch(currentWatcher, watchers => {
				let changed = getWatcherChangeMap(watchers, previous);
				watchers.hasChanged = (key) => changed.has(key);
				controllers.set(controller, watchers);
				trigger(watchers);
			}, true),
			{trigger}
		);
	}

	function getWatcherObject(toWatch, controller) {
		const watchers = {};

		angular.forEach(toWatch, attributeName =>
			watchers[attributeName] = controller[attributeName]
		);

		return watchers;
	}

	return {
		report
	};
}]);