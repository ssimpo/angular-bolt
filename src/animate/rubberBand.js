angular.module("bolt").directive("hoverRubberBand", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated rubberBand")
				});
				root.addClass("animated rubberBand");
			});
		}
	};
});
