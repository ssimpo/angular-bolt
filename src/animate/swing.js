angular.module("bolt")
	.directive("hoverSwing", ["animateCssFactory", $factory => $factory("swing")]);
