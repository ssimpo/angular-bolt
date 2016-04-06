(function() {
	"use strict";

	angular.module("bolt", []);

	if (typeof Object.assign != 'function') {
		(function () {
			Object.assign = function (target) {
				'use strict';
				if (target === undefined || target === null) {
					throw new TypeError("Cannot convert undefined or null to object");
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

	angular.element(document).ready(function() {
		angular.forEach(angular.element.find("[wb-app]"), function(node) {
			angular.bootstrap(node, [angular.element(node).attr("wb-app")]);
		});
	});
})();