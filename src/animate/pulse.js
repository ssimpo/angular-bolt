angular.module("bolt").directive("hoverPulse", [
	"boltDirective",
$directive => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated pulse")
				});
				root.addClass("animated pulse");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
