(function() {
	"use strict";

	angular.module("bolt", []);

	angular.element(document).ready(() =>
		angular.forEach(angular.element.find("[wb-app]"), node =>
			angular.bootstrap(node, [angular.element(node).attr("wb-app")])
		)
	);
})();