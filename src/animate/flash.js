angular.module("bolt").directive("hoverFlash", [
	"boltDirective",
$directive => {
		"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated flash")
				});
				root.addClass("animated flash");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
