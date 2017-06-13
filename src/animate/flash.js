angular.module("bolt")
	.directive("hoverFlash", ["animateCssFactory", $factory => $factory("flash")]);
