angular.module("bolt").directive("hoverShake", () => {
	"use strict";

	return {
		restrict: "A",
		link: (scope, root) => {
			root.hover(() => {
				root.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", ()=> {
					root.removeClass("animated shake")
				});
				root.addClass("animated shake");
			});
		}
	};
});
