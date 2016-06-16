angular.module("bolt").directive("hoverPulse", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated pulse")
				});
				root.addClass("animated pulse");
			});
		}
	};
});
