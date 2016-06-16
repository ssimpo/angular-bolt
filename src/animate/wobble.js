angular.module("bolt").directive("hoverWobble", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated wobble")
				});
				root.addClass("animated wobble");
			});
		}
	};
});
