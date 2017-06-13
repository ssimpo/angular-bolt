angular.module("bolt")
	.directive("hoverBounce", ["animateCssFactory", $factory => $factory("bounce")]);
