angular.module("bolt").directive("hoverWobble", [
	"boltDirective",
$directive => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated wobble")
				});
				root.addClass("animated wobble");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
