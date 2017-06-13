angular.module("bolt")
	.directive("hoverPulse", ["animateCssFactory", $factory => $factory("pulse")]);
