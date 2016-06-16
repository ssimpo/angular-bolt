angular.module("bolt").directive("hoverFlash", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated flash")
				});
				root.addClass("animated flash");
			});
		}
	};
});
