angular.module("bolt", []).factory("$bolt", [
	"$timeout",
function($timeout) {
	if (typeof Object.assign != 'function') {
		(function () {
			Object.assign = function (target) {
				'use strict';
				if (target === undefined || target === null) {
					throw new TypeError('Cannot convert undefined or null to object');
				}

				var output = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var source = arguments[index];
					if (source !== undefined && source !== null) {
						for (var nextKey in source) {
							if (source.hasOwnProperty(nextKey)) {
								output[nextKey] = source[nextKey];
							}
						}
					}
				}
				return output;
			};
		})();
	}

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
	}
}]);