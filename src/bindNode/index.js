angular.module("bolt").directive("bindNode", [
	"boltDirective",
	"objectPath",
($directive, objectPath) => {
	"use strict";

	/**
	 * @description
	 * Setup all the observations and watches in the new directive.
	 *
	 * @private
	 * @param {Object} scope		The directive scope.
	 * @param {Object} root			The directive root element.
	 * @param {Array} attributes	Attributes attached to the directive
	 * 								root element.
	 * @param {Object} controller	The controller instance for this directive.
	 */
	function link(scope, root, attributes, controller={}) {
		$directive.link({scope, root, controller});
		let bindTo = attributes.bindNode.split(".");
		let bindToController = scope.$eval(bindTo.shift());
		let bindToControllerPath = bindTo.join(".");
		if (bindToController && (bindToControllerPath !== "")) {
			objectPath.set(bindToController, bindToControllerPath, root);
		} else {
			throw `Failed to bind to node: ${bindTo.join(".")}`;
		}
	}

	return {
		priority: 100,
		restrict: "A",
		link
	};
}]);
