angular.module("bolt").factory("$bolt", [
	"$timeout",
function($timeout) {
	"use strict";

	function shallowCopy(obj) {
		var args = Array.prototype.slice.call(arguments);
		args.unshift({});
		var copy = Object.assign.apply(Object, args);

		angular.forEach(copy, function(value, key) {
			if (value === undefined) {
				delete copy[key];
			}
		});

		return copy;
	}

	function apply(options){
		var controller = options.controller || options.scope[options.scopeName];
		$timeout(function(){
			options.scope.$apply(function(){
				controller[options.attributeName] = options.value;
			});
		});
	}

	return {
		"apply": apply,
		"shallowCopy": shallowCopy
	};
}]);