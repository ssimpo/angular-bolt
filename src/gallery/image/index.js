angular.module("big-gallery").directive("bigGalleryImage", [

	function (){
		"use strict";

		var scopeName = "galleryImage";

		function init(scope, element, attributes) {

		}

		function controller(){
			var vm = this; // jshint ignore:line
		}


		return {
			restrict: "EA",
			templateUrl: "src/menu/image/index.html",
			controllerAs: scopeName,
			scope: true,

			controller: [controller],

			link: function (scope, iElement, iAttrs) {
				init(scope, iElement, iAttrs);
			}
		};
	}
]);
