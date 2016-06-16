angular.module("bolt").directive("hoverJello", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated jello")
				});
				root.addClass("animated jello");
			});
		}
	};
});
