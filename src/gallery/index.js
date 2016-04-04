angular.module("big-gallery").directive("bigGallery", [

	function (){
		"use strict";

		var scopeName = "gallery";

		function init(scope, element, attributes) {

		}

		function controller(){
			var vm = this; // jshint ignore:line
		}


		return {
			restrict: "EA",
			templateUrl: "src/menu/index.html",
			controllerAs: scopeName,
			scope: true,

			controller: [controller],

			link: function (scope, iElement, iAttrs) {
				init(scope, iElement, iAttrs);
			}
		};
	}
]);
