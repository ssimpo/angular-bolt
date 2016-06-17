angular.module("bolt")
	.directive("hoverShake", ["animateCssFactory", $factory => $factory("shake")]);
