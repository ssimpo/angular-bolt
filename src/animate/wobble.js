angular.module("bolt")
	.directive("hoverWobble", ["animateCssFactory", $factory => $factory("wobble")]);
