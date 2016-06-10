angular.module("bolt").factory("boltObserver", [
	"$bolt",
	"$window",
($bolt, $window) => {
	"use strict";

	function reflect(options) {
		angular.forEach(options.toObserve, attributeName =>
			copyAttributeValueToController($bolt.shallowCopy(options, {attributeName}))
		);
	}

	function copyAttributeValueToController(options) {
		const controller = options.controller || options.scope[options.scopeName];
		const attributeName = angular.isArray(options.attributeName) ? options.attributeName[0] : options.attributeName;
		const controllerName = angular.isArray(options.attributeName) ? options.attributeName[1] : options.attributeName;

		observe(options.attributes, attributeName, value => {
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
	 * @param {Array} attributes		The directive attributes array.
	 * @param {string} attributeName 	The attribute name to observe.
	 * @param {function} callback		Callback to fire.
	 */
	function observe(attributes, attributeName, callback) {
		attributes.$observe(attributeName, (value, oldValue) => {
			if(value !== oldValue) {
				callback(value, oldValue);
			}
		});
	}

	return {
		reflect, observe
	};
}]);