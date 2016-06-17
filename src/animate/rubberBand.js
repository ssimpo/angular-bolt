angular.module("bolt").directive("hoverRubberBand", [
	"boltDirective",
$directive => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated rubberBand")
				});
				root.addClass("animated rubberBand");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
