angular.module("bolt").directive("hoverHeadShake", [
	"boltDirective",
$directive => {
		"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated headShake")
				});
				root.addClass("animated headShake");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
