angular.module("bolt")
	.directive("hoverHeadShake", ["animateCssFactory", $factory => $factory("headShake")]);
