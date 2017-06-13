angular.module("bolt").factory("animateCssFactory", ["boltDirective", $directive => {
	"use strict";

	return function(type) {
		return {
			restrict: "A",
			link: (scope, root, attributes, controller={}) => {
				$directive.link({scope, root, controller});
				root.hover(() => {
					root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
						root.removeClass("animated " + type)
					});
					root.addClass("animated " + type);
				});
				controller.destructor(() => root.off("hover"));
			}
		};
	};
}]);
