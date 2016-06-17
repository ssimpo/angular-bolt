angular.module("bolt")
	.directive("hoverRubberBand", ["animateCssFactory", $factory => $factory("rubberBand")]);
