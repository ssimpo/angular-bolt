angular.module("bolt").directive("hoverBounce", [
	"boltDirective",
$directive => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated bounce")
				});
				root.addClass("animated bounce");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
