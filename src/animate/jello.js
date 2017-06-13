angular.module("bolt")
	.directive("hoverJello", ["animateCssFactory", $factory => $factory("jello")]);
