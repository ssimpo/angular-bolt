(function() {
	"use strict";

	angular.module("bolt", []);

	angular.element(document).ready(function() {
		angular.forEach(angular.element.find("[wb-app]"), function(node) {
			angular.bootstrap(node, [angular.element(node).attr("wb-app")]);
		});
	});
})();