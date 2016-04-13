angular.module("bolt").factory("boltWatcher", [

function() {
	"use strict";

	function report(options) {
		var controller = options.controller || options.scope[options.scopeName];
		var toWatch = options.toWatch || options.toObserve;

		var unwatch = options.scope.$watch(function(){
			return getWatcherObject(toWatch, controller);
		}, function(watchers) {
			options.callback(watchers, options);
		}, true);

		unwatch.trigger = function() {
			options.callback(getWatcherObject(toWatch, controller), options);
		};

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