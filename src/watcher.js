angular.module("bolt").factory("boltWatcher", [

function() {
	"use strict";

	function report(options) {
		var controller = options.controller || options.scope[options.scopeName];
		var toWatch = options.toWatch || options.toObserve;

		options.scope.$watch(function(){
			return getWatcherObject(toWatch, controller);
		}, function(watchers) {
			options.callback(watchers, options);
		}, true);
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