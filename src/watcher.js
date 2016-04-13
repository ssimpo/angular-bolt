angular.module("bolt").factory("boltWatcher", [

function() {
	"use strict";

	function report(options) {
		var controller = options.controller || options.scope[options.scopeName];
		var toWatch = options.toWatch || options.toObserve;

		var currentWatcher = function(){
			return getWatcherObject(toWatch, controller);
		};

		var trigger = function(watchers) {
			watchers = watchers || currentWatcher();
			options.callback(watchers, options);
		};

		var unwatch = options.scope.$watch(currentWatcher, trigger, true);

		unwatch.trigger = trigger;

		return unwatch;
	}

	function getWatcherObject(toWatch, controller) {
		var watchers = {};

		angular.forEach(toWatch, function(attributeName) {
			watchers[attributeName] = controller[attributeName];
		});

		return watchers;
	}

	return {
		"report": report
	};
}]);