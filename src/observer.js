angular.module("bolt").factory("boltObserver", [
	"$bolt",
	"$window",
function($bolt, $window) {
	"use strict";

	function reflect(options) {
		angular.forEach(options.toObserve, function(attributeName) {
			var copyOptions = $bolt.shallowCopy(options);
			options.attributeName = attributeName;
			copyAttributeValueToController(copyOptions);
		});
	}

	function copyAttributeValueToController(options) {
		var controller = options.controller || options.scope[options.scopeName];
		var attributeName = angular.isArray(options.attributeName) ? options.attributeName[0] : options.attributeName;
		var controllerName = angular.isArray(options.attributeName) ? options.attributeName[1] : options.attributeName;

		observe(options.attributes, attributeName, function (value) {
			try {
				controller[controllerName] = options.scope.$eval(value, $window);
				if ((value !== undefined) && (controller[controllerName] === undefined)) {
					controller[controllerName] = value;
				}
			} catch (error) {
				controller[controllerName] = value;
			}
		});
	}

	/**
	 * @decription
	 * Observe an attribute value and trigger a callback when the
	 * value changes.
	 *
	 * @param {Array} attributes			The directive attributes array.
	 * @param {string} attributeName 	The attribute name to observe.
	 * @param {function} callback		Callback to fire.
	 */
	function observe(attributes, attributeName, callback) {
		attributes.$observe(attributeName, function (value, oldValue){
			if(value !== oldValue){
				callback(value, oldValue);
			}
		});
	}

	return {
		"reflect": reflect,
		"observe": observe
	};
}]);