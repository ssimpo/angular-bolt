angular.module("bolt").directive("hoverTada", [
	"boltDirective",
$directive => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root, attributes, controller={}) => {
			$directive.link({scope, root, controller});
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated tada")
				});
				root.addClass("animated tada");
			});
			controller.destructor(() => root.off("hover"));
		}
	};
}]);
