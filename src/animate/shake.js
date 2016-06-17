angular.module("bolt").directive("hoverShake", [
	"boltDirective",
$directive => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated shake")
				});
				root.addClass("animated shake");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
