angular.module("bolt").directive("hoverSwing", [
	"boltDirective",
$directive => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated swing")
				});
				root.addClass("animated swing");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
