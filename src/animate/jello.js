angular.module("bolt").directive("hoverJello", [
	"boltDirective",
$directive => {
		"use strict";;

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated jello")
				});
				root.addClass("animated jello");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
