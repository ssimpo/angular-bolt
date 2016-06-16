angular.module("bolt").directive("hoverHeadShake", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated headShake")
				});
				root.addClass("animated headShake");
			});
		}
	};
});
