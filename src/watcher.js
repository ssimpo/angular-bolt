angular.module("bolt").factory("boltWatcher", [

function() {
	"use strict";

	function report(options) {
		const controller = options.controller || options.scope[options.scopeName];
		const toWatch = options.toWatch || options.toObserve;

		let currentWatcher = () => getWatcherObject(toWatch, controller);
		let trigger = (watchers = currentWatcher()) => options.callback(watchers, options);

		return Object.assign(
			options.scope.$watch(currentWatcher, trigger, true),
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